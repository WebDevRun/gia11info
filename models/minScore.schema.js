import mongoose from 'mongoose'

const minScore = {
  year: {
    name: { type: String, required: true },
    value: { type: Number, required: true },
    type: Object,
    required: true
  },
  subjects: {
    russian: {
      name: { type: String, required: true },
      value: { type: Number, required: true },
      type: Object,
      required: true
    },
    mathematics: {
      name: { type: String, required: true },
      value: { type: Number, required: true },
      type: Object,
      required: true
    },
    physics: {
      name: { type: String, required: true },
      value: { type: Number, required: true },
      type: Object,
      required: true
    },
    socialStudies: {
      name: { type: String, required: true },
      value: { type: Number, required: true },
      type: Object,
      required: true
    },
    history: {
      name: { type: String, required: true },
      value: { type: Number, required: true },
      type: Object,
      required: true
    },
    informatics: {
      name: { type: String, required: true },
      value: { type: Number, required: true },
      type: Object,
      required: true
    },
    foreignLanguage: {
      name: { type: String, required: true },
      value: { type: Number, required: true },
      type: Object,
      required: true
    },
    literature: {
      name: { type: String, required: true },
      value: { type: Number, required: true },
      type: Object,
      required: true
    },
    biology: {
      name: { type: String, required: true },
      value: { type: Number, required: true },
      type: Object,
      required: true
    },
    geograghy: {
      name: { type: String, required: true },
      value: { type: Number, required: true },
      type: Object,
      required: true
    },
    chemistry: {
      name: { type: String, required: true },
      value: { type: Number, required: true },
      type: Object,
      required: true
    }
  }
}

export default mongoose.model('minScore', minScore)