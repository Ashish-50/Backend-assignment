const express = require("express");
const route = express.Router();
const audiobookController = require("../controllers/audioBook.controller");
const {
  createAudiobookValidator,
  updateAudiobookValidator,
} = require("../validators/audioBook.validator");
const {
  authMiddleware,
  isAdminMiddleware,
} = require("../middleware/auth.middleware");

route.post(
  "/",
  createAudiobookValidator,
  authMiddleware,
  isAdminMiddleware,
  audiobookController.createAudiobook
);
route.get("/", authMiddleware, audiobookController.getAllAudiobooks);
route.get("/browseBooks/:categoryId", audiobookController.browseAudiobooks); //without login we can access these routes
route.get("/search", audiobookController.searchAudiobooks); //without login we can access these routes
route.get("/filter", audiobookController.filterAudiobooks); //without login we can access these routes
route.get(
  "/:audioBookId",
  authMiddleware,
  audiobookController.getAudiobookById
);
route.patch(
  "/:audioBookId",
  updateAudiobookValidator,
  authMiddleware,
  isAdminMiddleware,
  audiobookController.updateAudiobookById
);
route.delete(
  "/:audioBookId",
  authMiddleware,
  isAdminMiddleware,
  audiobookController.deleteAudiobookById
);

module.exports = route;
