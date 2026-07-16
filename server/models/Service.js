import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    desc: { type: String, required: true },
    iconType: { type: String, default: 'design' },
  },
  { timestamps: true }
);

const Service = mongoose.model('Service', serviceSchema);

export default Service;
