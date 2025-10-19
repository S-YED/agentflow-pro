import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import connectDB from '@/src/lib/mongodb'
import User from '@/models/User'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'No token provided' },
        { status: 401 }
      )
    }

    jwt.verify(token, process.env.JWT_SECRET!)

    await connectDB()
    
    // Get all agents sorted by creation date (newest first)
    const agents = await User.find({ role: 'agent' })
      .select('-password')
      .sort({ createdAt: -1 })

    return NextResponse.json({
      success: true,
      agents
    })

  } catch (error) {
    console.error('Get agents error:', error)
    
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}