import Router from 'express'
import FileController from './file.controller.js'

const router = new Router()

router.post('/exams', FileController.create)
router.get('/exams', FileController.getAll)
router.get('/years', FileController.getAllYears)
// router.put('/exams', FileController.update)
// router.delete('/exams/:id', FileController.delete)

export default router