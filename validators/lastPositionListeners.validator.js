const { body } = require("express-validator");

const audioBookProgressValidator = [
  body("userId").notEmpty().withMessage("User ID is required"),
  body("userId").isMongoId().withMessage("Invalid User ID format"),
  body("audiobookId").notEmpty().withMessage("Audiobook ID is required"),
  body("audiobookId").isMongoId().withMessage("Invalid Audiobook ID format"),
  body("duration")
    .optional()
    .isNumeric()
    .withMessage("Duration should be a number"),
];

const updateAudioBookProgressValidator = [
  body("duration")
    .optional()
    .isNumeric()
    .withMessage("Duration should be a number"),
];

module.exports = {
  audioBookProgressValidator,
  updateAudioBookProgressValidator,
};
