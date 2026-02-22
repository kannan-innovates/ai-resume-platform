
import { Router } from 'express'
import {
  createVaultEntryController,
  getAllVaultEntriesController,
} from './admin-vault.controller'

const router = Router()

router.post('/', createVaultEntryController)
router.get('/', getAllVaultEntriesController)

export default router