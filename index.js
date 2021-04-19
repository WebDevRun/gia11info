import express from 'express'
import mongoose from 'mongoose'
import router from './router.js'
import fileUpload from 'express-fileupload'
import history from 'connect-history-api-fallback'
import path from 'path'

const PORT = 5000
const DB_URL = "mongodb://localhost:27017/"

const app = express()

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
  next()
})
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
app.use(express.static(path.resolve('dist')))
app.use(express.json())
app.use(fileUpload({}))
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