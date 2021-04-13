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
      const exams = await FileService.getAll(req.query)
      return res.json(exams)
    } catch (error) {
      res.status(500).json(error)
    }
  }

  async getAllYears (req, res) {
    try {
      const years = await FileService.getAllYears()
      return res.json(years)
    } catch (error) {
      res.status(500).json(error)
    }
  }

  async getAllSchools (req, res) {
    try {
      const schools = await FileService.getAllSchools()
      return res.json(schools)
    } catch (error) {
      res.status(500).json(error)
    }
  }
}

export default new SchoolController()