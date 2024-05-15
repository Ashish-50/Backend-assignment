const mongoose = require("mongoose");

const audioBookProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    audiobookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Audiobook",
      required: true,
    },
    duration: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const AudioBookProgress = mongoose.model(
  "AudioBookProgress",
  audioBookProgressSchema
);

module.exports = AudioBookProgress;
