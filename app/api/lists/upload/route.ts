import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import Papa from 'papaparse'
import * as XLSX from 'xlsx'
import connectDB from '@/src/lib/mongodb'
import User from '@/models/User'
import DistributedList from '@/models/DistributedList'

// Parse CSV file
function parseCSV(buffer: Buffer): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const csvString = buffer.toString('utf8')
    Papa.parse(csvString, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rows = results.data as any[]
        const parsed = rows
          .map((row) => ({
            firstName: (row["FirstName"] || row["firstname"] || row["FIRSTNAME"] || "").trim(),
            phone: (row["Phone"] || row["phone"] || row["PHONE"] || "").trim(),
            notes: (row["Notes"] || row["notes"] || row["NOTES"] || "").trim(),
          }))
          .filter((row) => row.firstName && row.phone)
        resolve(parsed)
      },
      error: (error) => reject(error),
    })
  })
}

// Parse Excel file (XLSX and XLS)
function parseExcel(buffer: Buffer): any[] {
  const workbook = XLSX.read(buffer, { type: "buffer" })
  const worksheet = workbook.Sheets[workbook.SheetNames[0]]
  const rows = XLSX.utils.sheet_to_json(worksheet) as any[]

  return rows
    .map((row) => ({
      firstName: (row["FirstName"] || row["firstname"] || row["FIRSTNAME"] || "").toString().trim(),
      phone: (row["Phone"] || row["phone"] || row["PHONE"] || "").toString().trim(),
      notes: (row["Notes"] || row["notes"] || row["NOTES"] || "").toString().trim(),
    }))
    .filter((row) => row.firstName && row.phone)
}

// Distribute items equally among top 5 agents
function distributeItems(items: any[], agents: any[]) {
  if (agents.length < 5) {
    throw new Error(`At least 5 agents are required for distribution. Currently have ${agents.length} agents.`)
  }

  // Use top 5 agents (most recently created)
  const topAgents = agents.slice(0, 5)
  const totalItems = items.length
  const agentCount = topAgents.length
  
  if (totalItems === 0) {
    throw new Error('No valid items found in the uploaded file')
  }

  const baseCount = Math.floor(totalItems / agentCount)
  const remainder = totalItems % agentCount

  const distributions = topAgents.map((agent, index) => {
    const itemCount = baseCount + (index < remainder ? 1 : 0)
    const startIndex = index * baseCount + Math.min(index, remainder)
    const endIndex = startIndex + itemCount

    return {
      agentId: agent._id,
      agentName: agent.name,
      items: items.slice(startIndex, endIndex)
    }
  })

  return distributions
}

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

    // Parse form data
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No file uploaded' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ['.csv', '.xlsx', '.xls']
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'))
    
    if (!allowedTypes.includes(fileExtension)) {
      return NextResponse.json(
        { success: false, message: 'Invalid file type. Only CSV, XLSX, and XLS files are allowed.' },
        { status: 400 }
      )
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, message: 'File size must be less than 5MB' },
        { status: 400 }
      )
    }

    // Parse file content
    const buffer = Buffer.from(await file.arrayBuffer())
    let items: any[]

    try {
      if (fileExtension === '.csv') {
        items = await parseCSV(buffer)
      } else {
        items = parseExcel(buffer)
      }
    } catch (error) {
      return NextResponse.json(
        { success: false, message: 'Failed to parse file. Please check the format.' },
        { status: 400 }
      )
    }

    if (items.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No valid items found in the uploaded file' },
        { status: 400 }
      )
    }

    // Get top 5 agents (most recently created)
    const agents = await User.find({ role: 'agent' })
      .sort({ createdAt: -1 })
      .limit(5)

    if (agents.length < 5) {
      return NextResponse.json(
        { success: false, message: `At least 5 agents are required for distribution. Currently have ${agents.length} agents.` },
        { status: 400 }
      )
    }

    // Distribute items among agents
    const distributions = distributeItems(items, agents)

    // Save to database
    const distributedList = new DistributedList({
      fileName: file.name,
      totalItems: items.length,
      distributions
    })

    await distributedList.save()

    return NextResponse.json({
      success: true,
      message: 'List uploaded and distributed successfully',
      distributedList: {
        id: distributedList._id,
        fileName: distributedList.fileName,
        totalItems: distributedList.totalItems,
        distributions: distributedList.distributions
      }
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Server error' },
      { status: 500 }
    )
  }
}