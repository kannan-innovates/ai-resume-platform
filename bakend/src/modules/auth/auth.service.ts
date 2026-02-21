
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { User } from './user.model'
import { RegisterInput, LoginInput, JWTPayload } from './auth.types'

function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  } as jwt.SignOptions)
}

export async function registerUser(input: RegisterInput) {
  const exists = await User.findOne({ email: input.email })
  if (exists) throw new Error('Email already registered')

  const hashed = await bcrypt.hash(input.password, 12)
  const user = await User.create({ ...input, password: hashed })

  const token = signToken({
    userId: (user._id as unknown as string).toString(),
    email: user.email,
    role: user.role,
    name: user.name,
  })

  return { token, user: { id: user._id, name: user.name, email: user.email, role: user.role } }
}

export async function loginUser(input: LoginInput) {
  // Check if admin login
  if (
    input.email === process.env.ADMIN_EMAIL &&
    input.password === process.env.ADMIN_PASSWORD
  ) {
    const token = signToken({
      userId: 'admin',
      email: input.email,
      role: 'admin',
      name: 'Admin',
    })
    return { token, user: { id: 'admin', name: 'Admin', email: input.email, role: 'admin' } }
  }

  // Regular user login
  const user = await User.findOne({ email: input.email })
  if (!user) throw new Error('Invalid email or password')

  const valid = await bcrypt.compare(input.password, user.password)
  if (!valid) throw new Error('Invalid email or password')

  const token = signToken({
    userId: (user._id as unknown as string).toString(),
    email: user.email,
    role: user.role,
    name: user.name,
  })

  return { token, user: { id: user._id, name: user.name, email: user.email, role: user.role } }
}