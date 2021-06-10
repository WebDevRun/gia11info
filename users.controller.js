import usersService from './users.service.js'

class usersController {
  async registration (req, res) {
    try {
      const user = await usersService.registration(req.body)
      if (user instanceof Error) {
        res.status(user.status).json({message: `${user.message}`})
      } else {
        res.json(user)
      }
    } catch (error) {
      res.status(400).json(error)
    }
  }

  async login (req, res) {
    try {
      const tokens = await usersService.login(req.body)
      if (tokens instanceof Error) {
       res.status(tokens.status).json({message: `${tokens.message}`})
      } else {
        res.json(tokens)
      }
    } catch (error) {
      res.status(400).json(error)
    }
  }

  async getNewTokens (req, res) {
    try {
      const tokens = await usersService.getNewTokens(req.body)
      if (tokens instanceof Error) {
        res.status(tokens.status).json({message: `${tokens.message}`})
      } else {
        res.json(tokens)
      }
    } catch (error) {
      res.status(400).json(error)
    }
  }

  async logout (req, res) {
    try {
      const user = await usersService.logout(req.body)
      if (user instanceof Error) {
        res.status(user.status).json({message: `${user.message}`})
      } else {
        res.json(user)
      }
    } catch (error) {
      res.status(400).json(error)
    }
  }

  async getUsers (req, res) {
    try {
      const users = await usersService.getUsers()
      if (users instanceof Error) {
        res.status(users.status).json({message: `${users.message}`})
      } else {
        res.json(users)
      }
    } catch (error) {
      res.status(400).json(error)
    }
  }
}

export default new usersController()