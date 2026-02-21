import { Router } from 'express'
import { getVaultByResumeController } from './admin-vault.controller'

const router = Router()

// Accessible by any authenticated user — lets users see their own approved career path
router.get('/resume/:resumeId', getVaultByResumeController)

export default router
