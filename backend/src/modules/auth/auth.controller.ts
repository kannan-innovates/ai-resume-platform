
import { Request, Response } from 'express'
import { registerUser, loginUser } from './auth.service'

export async function register(req: Request, res: Response) {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password) {
      res.status(400).json({ success: false, message: 'All fields are required' })
      return
    }
    if (password.length < 6) {
      res.status(400).json({ success: false, message: 'Password must be at least 6 characters' })
      return
    }
    const result = await registerUser({ name, email, password })
    res.status(201).json({ success: true, data: result })
  } catch (error: any) {
    const isDuplicate = error.message?.includes('already registered')
    res.status(isDuplicate ? 409 : 500).json({ success: false, message: error.message })
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Email and password are required' })
      return
    }
    const result = await loginUser({ email, password })
    res.status(200).json({ success: true, data: result })
  } catch (error: any) {
    res.status(401).json({ success: false, message: error.message })
  }
}