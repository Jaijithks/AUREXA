import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    tag: { type: String, default: '' },
    type: { type: String, default: '' },
    image: { type: String, default: '' },
    liveUrl: { type: String, default: '' },
  },
  { timestamps: true }
);

const Project = mongoose.model('Project', projectSchema);

export default Project;
