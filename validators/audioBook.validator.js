const { body, param } = require("express-validator");

const createAudiobookValidator = [
  body("title").notEmpty().withMessage("Title is required"),
  body("language").notEmpty().withMessage("Language is required"),
  body("author").notEmpty().withMessage("Author is required"),
  body("duration")
    .notEmpty()
    .withMessage("Duration is required")
    .isNumeric()
    .withMessage("Duration should be a number"),
  body("audioUrl")
    .notEmpty()
    .withMessage("Audio URL is required")
    .isURL()
    .withMessage("Invalid audio URL format"),
  body("price").optional().isNumeric().withMessage("Price should be a number"),
  body("categoriesId")
    .optional()
    .isArray()
    .withMessage("Categories should be an array"),
];

const updateAudiobookValidator = [
  param("audioBookId").custom((value, { req }) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      throw new Error("Invalid audiobookId");
    }
    return true;
  }),
  body("title").optional().notEmpty().withMessage("Title is required"),
  body("language").optional().notEmpty().withMessage("Language is required"),
  body("author").optional().notEmpty().withMessage("Author is required"),
  body("duration")
    .optional()
    .notEmpty()
    .withMessage("Duration is required")
    .isNumeric()
    .withMessage("Duration should be a number"),
  body("audioUrl")
    .optional()
    .notEmpty()
    .withMessage("Audio URL is required")
    .isURL()
    .withMessage("Invalid audio URL format"),
  body("price").optional().isNumeric().withMessage("Price should be a number"),
  body("categoriesId")
    .optional()
    .isArray()
    .withMessage("Categories should be an array"),
];

module.exports = {
  createAudiobookValidator,
  updateAudiobookValidator,
};
