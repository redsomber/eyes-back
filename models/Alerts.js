import mongoose from "mongoose";

const AlertSchema = new mongoose.Schema(
  {
    tickers: {
      type: Array,
      required: true,
    },
    alert: {
      type: String,
      required: true,
    },
    increase: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Alert", AlertSchema);
