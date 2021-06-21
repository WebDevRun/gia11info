import usersService from './users.service.js'

class usersController {
  async addRole (req, res) {
    try {
      const { role } = req.body
      const createdRole = await usersService.addRole(role)
      if (createdRole instanceof Error) {
        res.status(createdRole.status).json({ message: createdRole.message })
      } else {
        res.json({ role: createdRole })
      }
    } catch (error) {
      res.status(400).json(error)
    }
  }

  async registration (req, res) {
    try {
      const user = await usersService.registration(req.body)
      if (user instanceof Error) {
        res.status(user.status).json({ message: user.message })
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
       res.status(tokens.status).json({ message: tokens.message })
      } else {
        res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true, sameSite: 'Lax' })
        res.json(tokens.accessToken)
      }
    } catch (error) {
      res.status(400).json(error)
    }
  }

  async getNewTokens (req, res) {
    try {
      const { refreshToken } = req.cookies
      const tokens = await usersService.getNewTokens(refreshToken)
      if (tokens instanceof Error) {
        res.status(tokens.status).json({ message: tokens.message })
      } else {
        res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true, sameSite: 'Lax' })
        res.json(tokens.accessToken)
      }
    } catch (error) {
      res.status(400).json(error)
    }
  }

  async logout (req, res) {
    try {
      const { refreshToken } = req.cookies
      const data = await usersService.logout(refreshToken)
      if (data instanceof Error) {
        res.status(data.status).json({ message: data.message })
      } else {
        res.clearCookie('refreshToken')
        res.json(data)
      }
    } catch (error) {
      res.status(400).json(error)
    }
  }

  async getUsers (req, res) {
    try {
      const users = await usersService.getUsers()
      if (users instanceof Error) {
        res.status(users.status).json({ message: users.message })
      } else {
        res.json(users)
      }
    } catch (error) {
      res.status(400).json(error)
    }
  }
}

export default new usersController()