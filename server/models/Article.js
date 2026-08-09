import mongoose from "mongoose";

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    analysis: {

    sentiment: {

        label: String,

        score: Number

    },

    subjectivity: {

        subjectivity: Number

    },

    clickbait: {

        probability: Number,

        is_clickbait: Boolean

    },

    bias: {

        label: String,

        confidence: Number

    }

},

    content: {
      type: String,
      default: "",
    },

    author: {
      type: String,
      default: "Unknown",
    },

    publisher: {
      type: String,
      default: "Unknown",
    },

    url: {
      type: String,
      unique: true,
      required: true,
    },

    image: {
      type: String,
      default: "",
    },

    publishedAt: Date,

    topic: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Article", articleSchema);