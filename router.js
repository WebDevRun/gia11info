import Router from 'express'
import gia11Controller from './gia11.controller.js'
import usersController from './users.controller.js'
import authMiddleware from './middleware/authMiddleware.js'

const router = new Router()

router.post('/addrole', usersController.addRole)
router.post('/registration', usersController.registration)
router.post('/login', usersController.login)
router.post('/getNewTokens', usersController.getNewTokens)
router.post('/logout', authMiddleware(['user', 'admin']), usersController.logout)
router.get('/getusers', authMiddleware(['admin']), usersController.getUsers)

router.post('/exams', authMiddleware(['admin']), gia11Controller.create)
router.get('/exams', authMiddleware(['user', 'admin']), gia11Controller.getAll)
router.get('/years', authMiddleware(['user', 'admin']), gia11Controller.getAllYears)
router.get('/schools', authMiddleware(['user', 'admin']), gia11Controller.getAllSchools)
router.post('/addminscore', authMiddleware(['user', 'admin']), gia11Controller.addMinScore)

export default router