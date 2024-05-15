const audioBookService = require("../service/audioBookService.service");
const { validationResult } = require("express-validator");
const HttpException = require("../utils/httpException");

const createAudiobook = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors
        .array()
        .map((error) => error.msg)
        .join(", ");
      throw new HttpException(422, errorMessages);
    }
    const audioBookData = req.body;
    const audioBook = await audioBookService.createAudioBook(audioBookData);
    res.status(201).json({
      success: true,
      message: "Audion book added sucessfully",
      book: audioBook,
    });
  } catch (error) {
    next(error);
  }
};

const getAllAudiobooks = async (req, res, next) => {
  try {
    let { page, limit, sortBy } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    sortBy = sortBy || "title";
    const { totalDocuments, audioBooks, hasNextPage } =
      await audioBookService.getAllAudioBooks(page, limit, sortBy);
    res.status(200).json({
      success: true,
      message: "Successfully fetched all the books",
      book: audioBooks,
      totalDocuments: totalDocuments,
      hasNextPage: hasNextPage,
    });
  } catch (error) {
    next(error);
  }
};

const getAudiobookById = async (req, res, next) => {
  try {
    const audioBookId = req.params.audioBookId;
    const audioBook = await audioBookService.getAudioBookById(audioBookId);
    res.status(200).json({
      success: true,
      message: `Successfully fetched book for this Id ${audioBookId}`,
      book: audioBook,
    });
  } catch (error) {
    next(error);
  }
};
const updateAudiobookById = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors
        .array()
        .map((error) => error.msg)
        .join(", ");
      throw new HttpException(422, errorMessages);
    }
    const audioBookId = req.params.audioBookId;
    const audioBookData = req.body;
    const audioBook = await audioBookService.updateAudioBookById(
      audioBookId,
      audioBookData
    );
    res.status(200).json({
      success: true,
      message: `Book data updated successfully`,
      book: audioBook,
    });
  } catch (error) {
    next(error);
  }
};

const deleteAudiobookById = async (req, res, next) => {
  try {
    const audioBookId = req.params.audioBookId;
    await audioBookService.deleteAudioBookById(audioBookId);
    res.status(200).json({
      success: true,
      message: `Book with Id ${audioBookId} Deleted from Records`,
    });
  } catch (error) {
    next(error);
  }
};

const browseAudiobooks = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const categoryId = req.params.categoryId;
    const { audioBooks, totalDocuments, hasNextPage } =
      await audioBookService.browseAudioBooks(page, limit, categoryId);
    res.status(200).json({
      success: true,
      totalBooks: totalDocuments,
      book: audioBooks,
      hasNextPage: hasNextPage,
    });
  } catch (error) {
    next(error);
  }
};

const searchAudiobooks = async (req, res, next) => {
  try {
    const keyword = req.query.keyword;
    const searchedData = await audioBookService.searchAudioBooks(keyword);
    res.status(200).json({
      success: true,
      searchedData: searchedData,
    });
  } catch (error) {
    next(error);
  }
};

const filterAudiobooks = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      language,
      duration,
      free,
      daysOld,
      sortBy,
      sortOrder,
    } = req.query;
    const filterQueries = { page: parseInt(page), limit: parseInt(limit) };

    if (language) filterQueries.language = language; // filter on the basis of language
    if (duration) filterQueries.duration = duration; // filter on the basis of duration format shoud be like 1-3 or 3-4
    if (free) filterQueries.free = free; // free audio books
    if (daysOld) filterQueries.daysOld = daysOld; // this is days for new release like 30 days or 60 days
    if (sortBy) filterQueries.sortBy = sortBy;
    if (sortOrder) filterQueries.sortOrder = sortOrder;
    const { totalDocuments, audiobooks, hasNextPage } =
      await audioBookService.filterAudiobooks(filterQueries);
    res.status(200).json({
      success: true,
      totalDocuments: totalDocuments,
      audioBooks: audiobooks,
      hasNextPage: hasNextPage,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAudiobook,
  getAllAudiobooks,
  getAudiobookById,
  updateAudiobookById,
  deleteAudiobookById,
  browseAudiobooks,
  searchAudiobooks,
  filterAudiobooks,
};
