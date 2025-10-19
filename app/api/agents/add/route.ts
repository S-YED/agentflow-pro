import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import { parsePhoneNumber } from 'libphonenumber-js'
import connectDB from '@/src/lib/mongodb'
import User from '@/models/User'

export const dynamic = 'force-dynamic'

const agentSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  mobile: z.string().min(10, 'Mobile number is required'),
  password: z.string().min(6, 'Password must be at least 6 characters')
})

export async function POST(request: NextRequest) {
  try {
    console.log('=== Add Agent API Called ===')
    
    // Parse request body first
    const body = await request.json()
    console.log('Request body:', body)
    
    // Validate input
    const { name, email, mobile, password } = agentSchema.parse(body)
    console.log('Validation passed')
    
    // Check authentication
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')
    
    if (!token) {
      console.log('No token provided')
      return NextResponse.json(
        { success: false, message: 'No token provided' },
        { status: 401 }
      )
    }

    const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production-min-32-chars-long-for-security'
    
    let decoded: any
    try {
      decoded = jwt.verify(token, JWT_SECRET)
      console.log('Token decoded:', decoded)
    } catch (jwtError) {
      console.log('JWT verification failed:', jwtError)
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      )
    }
    
    if (decoded.role !== 'admin') {
      console.log('User is not admin:', decoded.role)
      return NextResponse.json(
        { success: false, message: 'Admin access required' },
        { status: 403 }
      )
    }

    // Connect to database
    console.log('Connecting to database...')
    await connectDB()
    console.log('Database connected')

    // Validate phone number
    try {
      const phoneNumber = parsePhoneNumber(mobile)
      if (!phoneNumber.isValid()) {
        return NextResponse.json(
          { success: false, message: 'Invalid phone number' },
          { status: 400 }
        )
      }
    } catch {
      return NextResponse.json(
        { success: false, message: 'Invalid phone number format' },
        { status: 400 }
      )
    }

    // Check if email already exists
    console.log('Checking for existing user...')
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      console.log('Email already exists')
      return NextResponse.json(
        { success: false, message: 'Email already exists' },
        { status: 400 }
      )
    }

    // Create new agent
    console.log('Creating new agent...')
    const agent = new User({
      name,
      email,
      mobile,
      password,
      role: 'agent'
    })

    await agent.save()
    console.log('Agent saved successfully')

    return NextResponse.json({
      success: true,
      message: 'Agent created successfully',
      agent: {
        id: agent._id,
        name: agent.name,
        email: agent.email,
        mobile: agent.mobile,
        role: agent.role
      }
    })

  } catch (error) {
    console.error('Add agent error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: error.errors[0].message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, message: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    )
  }
}