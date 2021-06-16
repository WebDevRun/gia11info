import express from 'express'
import mongoose from 'mongoose'
import router from './router.js'
import fileUpload from 'express-fileupload'
import history from 'connect-history-api-fallback'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config({ path: '.env' })

const PORT = process.env.PORT || 5000
const DB_URL = process.env.DB_URL

const app = express()

app.use(cookieParser())
app.use(cors({
  credentials: true,
  origin: true
}))
app.use(express.static(path.resolve('dist')))
app.use(express.json())
app.use(fileUpload({}))
app.use(history({
  rewrites: [
    {
      from: /^\/api\/.*$/,
      to: function(context) {
          return context.parsedUrl.path
      }
    }
  ]
}))
app.use('/api', router)

async function startApp() {
  try {
    await mongoose.connect(DB_URL, { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false })
    app.listen(PORT, () => console.log('server started on port ' + PORT))
  } catch (e) {
    console.log(e);
  }
}

startApp()