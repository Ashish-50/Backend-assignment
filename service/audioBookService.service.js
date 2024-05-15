const Audiobook = require("../models/audioBook.model");
const HttpException = require("../utils/httpException");

const createAudioBook = async (audioBookData) => {
  const { title, author, duration, audioUrl, categoriesId, language } =
    audioBookData;

  const existedBook = await Audiobook.findOne({ title });
  if (existedBook) {
    throw new HttpException(409, "Book with this title already exists");
  }
  const audioBook = await Audiobook.create({
    title,
    author,
    duration,
    audioUrl,
    language,
    categoriesId,
  });

  const createdBook = await Audiobook.findById(audioBook._id);
  if (!createdBook) {
    throw new HttpException(500, "Something went wrong while adding the book");
  }

  return createdBook;
};

const getAllAudioBooks = async (page, limit, sortBy) => {
  const skip = (page - 1) * limit;
  let sortOptions = {};

  if (!sortBy || !["title", "createdAt"].includes(sortBy)) {
    sortBy = "createdAt"; // Default to sort by createdAt
    sortOptions = { createdAt: -1 }; // Sort by createdAt in descending order
  } else {
    sortOptions[sortBy] = sortBy === "createdAt" ? -1 : 1;
  }

  const [audioBooks, totalDocuments] = await Promise.all([
    Audiobook.aggregate([
      {
        $lookup: {
          from: "categories",
          localField: "categoriesId",
          foreignField: "_id",
          as: "categories",
        },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          author: 1,
          duration: 1,
          categories: { $arrayElemAt: ["$categories.name", 0] },
          createdAt: 1,
        },
      },
      { $sort: sortOptions },
      { $skip: skip },
      { $limit: limit },
    ]),
    Audiobook.countDocuments(),
  ]);

  const hasNextPage = page * limit < totalDocuments;

  if (audioBooks.length <= 0) {
    throw new HttpException(404, "No Records found");
  }

  return { audioBooks, totalDocuments, hasNextPage };
};

const getAudioBookById = async (audioBookId) => {
  const audioBook = await Audiobook.findById(audioBookId);
  if (!audioBook) {
    throw new HttpException(404, `No Book found for this ${audioBookId} `);
  }
  return audioBook;
};

const updateAudioBookById = async (audioBookId, audioBookData) => {
  const audioBook = await Audiobook.findByIdAndUpdate(
    audioBookId,
    audioBookData,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!audioBook) {
    throw new HttpException(404, `No Book found for this ${audioBookId} `);
  }
  return audioBook;
};

const deleteAudioBookById = async (audioBookId) => {
  const audioBook = await Audiobook.findByIdAndDelete(audioBookId);
  if (!audioBook) {
    throw new HttpException(404, `No Book found for this ${audioBookId} `);
  }
  return audioBook;
};

const browseAudioBooks = async (page, limit, categoryId) => {
  const skip = (page - 1) * limit;

  let query = {};
  if (categoryId) {
    query = { categoriesId: { $in: [categoryId] } };
  }

  const audioBooks = await Audiobook.find(query).limit(limit).skip(skip).exec();

  const totalDocuments = await Audiobook.countDocuments(query);
  const hasNextPage = page * limit < totalDocuments;

  return {
    audioBooks,
    hasNextPage,
    totalDocuments,
  };
};

const searchAudioBooks = async (keyword) => {
  keyword = new RegExp(keyword, "i");
  const audiobooks = await Audiobook.find({
    $or: [{ title: keyword }, { author: keyword }],
  });
  if (!audiobooks) {
    throw new HttpException(404, `No Record found `);
  }
  return audiobooks;
};

const filterAudiobooks = async (filterQueries) => {
  const { page, limit, language, duration, free, daysOld, sortBy, sortOrder } =
    filterQueries;

  const skip = (page - 1) * limit;
  let filter = {};
  let sortOptions = {};

  if (language) {
    filter.language = language;
  }

  if (duration) {
    const [minDuration, maxDuration] = duration
      .split("-")
      .map((d) => parseInt(d.trim()));
    filter.duration = { $gte: minDuration, $lte: maxDuration };
  }

  if (free !== undefined) {
    filter.free = free === "true";
  }

  if (daysOld) {
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() - parseInt(daysOld));
    filter.createdAt = { $gte: thresholdDate };
  }

  if (sortBy === "title") {
    sortOptions.title = sortOrder === "desc" ? -1 : 1;
  }

  if (sortBy === "price") {
    sortOptions.price = sortOrder === "desc" ? -1 : 1;
  }

  if (sortBy === "duration") {
    sortOptions.duration = sortOrder === "desc" ? -1 : 1;
  }

  const [totalDocuments, audiobooks] = await Promise.all([
    Audiobook.countDocuments(filter),
    Audiobook.find(filter)
      .sort(sortOptions)
      .limit(limit)
      .skip(skip)
      .lean()
      .exec(),
  ]);

  const hasNextPage = page * limit < totalDocuments;

  return { totalDocuments, audiobooks, hasNextPage };
};

module.exports = {
  createAudioBook,
  getAllAudioBooks,
  getAudioBookById,
  updateAudioBookById,
  deleteAudioBookById,
  browseAudioBooks,
  searchAudioBooks,
  filterAudiobooks,
};
