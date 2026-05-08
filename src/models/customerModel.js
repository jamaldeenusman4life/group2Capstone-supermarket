import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, 'Customer ID is required'],
    },

    customerID: {
      type: String,
      trim: true,
    },

    address: {
      type: String,
      trim: true,
      required: [true, 'Address is required'],
    },
  },
  {
    timestamps: true,
  }
);

const Customer = mongoose.model('Customer', customerSchema);

export default Customer;