import mongoose from 'mongoose';

const TickersSchema = new mongoose.Schema(
  {
    tickers: {
      type: Array,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('Tickers', TickersSchema);
