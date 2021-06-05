import mongoose from 'mongoose'

const authSession = new mongoose.Schema({
  userId: { type: String, required: true },
  refreshToken: { type: String, required: true },
  roles: { type: Array, required: true },
})

export default mongoose.model("authSession", authSession)