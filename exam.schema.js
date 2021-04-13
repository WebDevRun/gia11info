import mongoose from 'mongoose'

const Exam = new mongoose.Schema({
  examCode: { type: Number, required: true },
  examName: { type: String, required: true },
  participants: [{
    examDate: {type: Date, required: true},
    MSY: { type: Number, required: true },
    schoolCode: { type: Number, required: true},
    class: { type: String, required: true },
    PPACode: { type: Number, required: true },
    classroom: { type: Number, required: true },
    subname: { type: String, required: true },
    name: { type: String, required: true },
    lastname: { type: String, required: true },
    shortTask: { type: Array, required: true },
    detailedTask: { type: Array, required: true },
    baseScore: { type: Number, required: true },
    score: { type: Number, required: true },
  }]
})

export default mongoose.model("Exam", Exam)