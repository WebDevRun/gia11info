import mongoose from 'mongoose'

const Exam = new mongoose.Schema({
  examCode: { type: Number, required: true },
  examName: { type: String, required: true },
  participants: {type: Array, required: true}
})

export default mongoose.model("Exam", Exam)