import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import connectDB from '@/src/lib/mongodb'
import DistributedList from '@/models/DistributedList'

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

    // Get pagination parameters
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    // Get distributed lists with pagination
    const lists = await DistributedList.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('distributions.agentId', 'name email')

    const total = await DistributedList.countDocuments()

    return NextResponse.json({
      success: true,
      lists,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Get distributed lists error:', error)
    
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}