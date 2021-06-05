import User from './models/user.schema.js'
import Role from './models/role.schema.js'
import AuthSession from './models/authSession.schema.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import {v4 as uuidv4} from 'uuid'
import dotenv from 'dotenv'

dotenv.config({ path: '.env' })

class UserService {
  async registration (user) {
    try {
      const { firstName, lastName, nickName, password, email } = user
      const candidate = await User.findOne({ nickName, email })
      if (candidate) {
        const error = new Error
        error.status = 403,
        error.message = 'there is such a user'
        throw error
      }
      const salt = bcrypt.genSaltSync(10);
      var hashPassword = bcrypt.hashSync(password, salt);
      const userRole = await Role.findOne({value: 'user'})
      const userCreated = await User.create({firstName, lastName, nickName, email, password: hashPassword, roles: [userRole.value]})
      return userCreated
    } catch (error) {
      return error
    }
  }

  async login (user) {
    try {
      const { nickName, password } = user
      const findUser = await User.findOne({ nickName })
      if (!findUser || bcrypt.compareSync(password, findUser.password)) {
        const error = new Error
        error.status = 403,
        error.message = 'invalid nickname or password'
        throw error
      }
      const tokens = generateTokens(findUser._id, findUser.roles)
      await AuthSession.create({ userId: findUser._id, refreshToken: tokens.refreshToken, roles: findUser.roles })
      return tokens
    } catch (error) {
      return error
    }
  }

  async getNewTokens (data) {
    try {
      const authSessionHas = await AuthSession.findOne({refreshToken: data.refreshToken})
      if (!authSessionHas) {
        const error = new Error
        error.status = 404
        error.message = 'invalid refreshToken'
        throw error
      }
      const tokens = generateTokens(authSessionHas.userId, authSessionHas.roles)
      await AuthSession.updateOne({refreshToken: authSessionHas.refreshToken}, {refreshToken: tokens.refreshToken})
      return tokens
    } catch (error) {
      return error
    }
  }

  async logout (data) {
    try {
      const authSessionHas = await AuthSession.deleteOne({refreshToken: data.refreshToken})
      if (authSessionHas.deletedCount === 0) {
        const error = new Error
        error.status = 404
        error.message = 'invalid refreshToken'
        throw error
      }
      return { success: true }
    } catch (error) {
      return error
    }
  }

  async getUsers() {
    try {
      const users = await User.find()
      return users
    } catch (error) {
      return error
    }
  }
}

const generateTokens = (id, roles) => {
  const payload = { id, roles }
  const tokens = {
    refreshToken: uuidv4(),
    accessToken: `Bearer ${jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '1h' })}`
  }
  return tokens
}

export default new UserService()