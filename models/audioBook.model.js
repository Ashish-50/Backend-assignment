const mongoose = require("mongoose");
const Category = require("./category.model");

const audiobookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
    },
    language: { type: String, required: true },
    free: { type: Boolean, required: true, default: false },
    author: { type: String, required: true },
    duration: { type: Number, required: true },
    audioUrl: { type: String, required: true },
    price: { type: Number, min: 0 },
    categoriesId: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: Category,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Audiobook", audiobookSchema);
