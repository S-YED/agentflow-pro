import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ 
    success: true, 
    message: 'API is working',
    env: {
      hasJWT: !!process.env.JWT_SECRET,
      hasMongo: !!process.env.MONGODB_URI,
      nodeEnv: process.env.NODE_ENV
    }
  })
}