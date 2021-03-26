import School from './school.schema.js'
import FileService from './file.service.js'

class PostServise {
  async create(file) {
    const fileName = FileService.saveFile(file)
    const createdPost = await School.create({ ...post, picture: fileName })
    return createdPost
  }

  async getAll() {
    const posts = await School.find()
    return posts
  }

  async getOne(id) {
    if (!id) {
      throw new Error('не указан id')
    }
    const post = await School.findById(id)
    return post
  }

  async update(post) {
    if (!post._id) {
      throw new Error('не указан id')
    }
    const updatedPost = await School.findByIdAndUpdate(post._id, post, { new: true })
    return updatedPost
  }

  async delete(id) {
    if (!id) {
      throw new Error('не указан id')
    }
    const post = await School.findByIdAndDelete(id)
    return post
  }
}

export default new PostServise()