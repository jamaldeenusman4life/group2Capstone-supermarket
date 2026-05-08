import mongoose from 'mongoose';

const riderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, 'Rider ID is required'],
    },

   riderID: {
      type: String,
      trim: true,
    },

    address: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Rider = mongoose.model('Rider', riderSchema);

export default Rider;