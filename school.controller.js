import FileService from './file.service.js'

class SchoolController {
  async create(req, res) {
    try {
      const data = await FileService.saveFile(req.files.file)
      res.json(data)
    } catch (error) {
      res.status(500).json(error)
    }
  }

  async getAll(req, res) {
    try {
      const exams = await FileService.getAll()
      return res.json(exams)
    } catch (error) {
      res.status(500).json(error)
    }
  }
}

export default new SchoolController()