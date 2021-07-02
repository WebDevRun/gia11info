import gia11service from './gia11.service.js'

class GIA11Controller {
  async create(req, res) {
    try {
      const data = await gia11service.saveFile(req.files.file)
      res.json(data)
    } catch (error) {
      res.status(500).json(error)
    }
  }

  async getAll(req, res) {
    try {
      const exams = await gia11service.getAll(req.query)
      return res.json(exams)
    } catch (error) {
      res.status(500).json(error)
    }
  }

  async getAllYears (req, res) {
    try {
      const years = await gia11service.getAllYears()
      return res.json(years)
    } catch (error) {
      res.status(500).json(error)
    }
  }

  async getAllSchools (req, res) {
    try {
      const schools = await gia11service.getAllSchools()
      return res.json(schools)
    } catch (error) {
      res.status(500).json(error)
    }
  }

  async addMinScore (req, res) {
    try {
      const data = await gia11service.addMinScore(req.body)
      res.json(data)
    } catch (error) {
      res.status(500).json(error)
    }
  }
}

export default new GIA11Controller()