import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import { parsePhoneNumber } from 'libphonenumber-js'
import connectDB from '@/src/lib/mongodb'
import User from '@/models/User'

const agentSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  mobile: z.string().min(10, 'Mobile number is required'),
  password: z.string().min(6, 'Password must be at least 6 characters')
})

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'No token provided' },
        { status: 401 }
      )
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    if (decoded.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Admin access required' },
        { status: 403 }
      )
    }

    await connectDB()
    
    const body = await request.json()
    const { name, email, mobile, password } = agentSchema.parse(body)

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
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'Email already exists' },
        { status: 400 }
      )
    }

    // Create new agent
    const agent = new User({
      name,
      email,
      mobile,
      password,
      role: 'agent'
    })

    await agent.save()

    return NextResponse.json({
      success: true,
      message: 'Agent created successfully',
      agent: agent.toJSON()
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
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}