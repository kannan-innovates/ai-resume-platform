
import { Router } from 'express'
import { uploadResume, getAllResumes, getResumeById } from './resume.controller'
import { uploadMiddleware } from './resume.middleware'
import { protect } from '../../shared/middleware/auth.middleware'

const router = Router()

router.post('/', protect, uploadMiddleware.single('resume'), uploadResume)
router.get('/', protect, getAllResumes)
router.get('/:id', protect, getResumeById)

export default router