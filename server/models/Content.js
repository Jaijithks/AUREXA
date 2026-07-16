import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema(
  {
    hero: {
      eyebrow: { type: String, default: '' },
      titleLine1: { type: String, default: '' },
      titleHighlight: { type: String, default: '' },
      titleLine2: { type: String, default: '' },
      subtitle: { type: String, default: '' },
      image: { type: String, default: '' },
      statusCard1: {
        label: { type: String, default: '' },
        value: { type: String, default: '' },
      },
      statusCard2: {
        label: { type: String, default: '' },
        value: { type: String, default: '' },
      },
    },
    about: {
      sectionLabel: { type: String, default: '' },
      titleLine1: { type: String, default: '' },
      titleHighlight: { type: String, default: '' },
      desc1: { type: String, default: '' },
      desc2: { type: String, default: '' },
      image: { type: String, default: '' },
      stats: [
        {
          id: String,
          target: Number,
          suffix: { type: String, default: '' },
          prefix: { type: String, default: '' },
          label: { type: String, default: '' },
        },
      ],
    },
    contact: {
      email: { type: String, default: '' },
      phone: { type: String, default: '' },
      location: { type: String, default: '' },
      socials: {
        instagram: { type: String, default: '#' },
        github: { type: String, default: '#' },
        twitter: { type: String, default: '#' },
        linkedin: { type: String, default: '#' },
      },
    },
  },
  { timestamps: true }
);

const Content = mongoose.model('Content', contentSchema);

export default Content;
