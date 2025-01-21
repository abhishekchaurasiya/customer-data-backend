import { Schema, model } from "mongoose";

const customerSchema = new Schema({
  s_no: {
    type: Number,
    required: true,
    unique: true,
    index: true,
  },
  name_of_customer: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  mobile_number: {
    type: String,
    required: true,
    trim: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  modified_at: {
    type: Date,
    default: Date.now,
  },
});

customerSchema.index({ email: 1, mobile_number: 1 });

const Customer = model("Customer", customerSchema);
export default Customer;
