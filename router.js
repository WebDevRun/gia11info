import Router from 'express'
import SchoolController from './school.controller.js'

const router = new Router()

router.post('/exams', SchoolController.create)
router.get('/exams', SchoolController.getAll)
router.get('/years', SchoolController.getAllYears)
// router.put('/exams', SchoolController.update)
// router.delete('/exams/:id', SchoolController.delete)

export default router