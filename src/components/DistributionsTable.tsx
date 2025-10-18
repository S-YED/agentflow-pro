"use client"

import { useState } from 'react'
import { ChevronDown, ChevronRight, Download, Eye } from 'lucide-react'
import { Button } from './ui/button'
import Papa from 'papaparse'

interface DistributionsTableProps {
  distributions: any[]
}

export default function DistributionsTable({ distributions }: DistributionsTableProps) {
  const [expandedRows, setExpandedRows] = useState<{ [key: string]: boolean }>({})

  const toggleRow = (id: string) => {
    setExpandedRows(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  const exportToCsv = (distribution: any) => {
    const csvData = distribution.distributions.flatMap((dist: any) => 
      dist.items.map((item: any) => ({
        Agent: dist.agentName,
        FirstName: item.firstName,
        Phone: item.phone,
        Notes: item.notes
      }))
    )

    const csv = Papa.unparse(csvData)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `${distribution.fileName}_distributed.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (distributions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">📋</div>
        <p className="text-gray-500 dark:text-gray-400">No distributed lists found. Upload a file to get started.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {distributions.map((distribution) => (
        <div key={distribution._id} className="luxury-card p-0 overflow-hidden">
          {/* Header Row */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleRow(distribution._id)}
                className="p-1"
              >
                {expandedRows[distribution._id] ? 
                  <ChevronDown className="w-4 h-4" /> : 
                  <ChevronRight className="w-4 h-4" />
                }
              </Button>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {distribution.fileName}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {distribution.totalItems} items • {new Date(distribution.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleRow(distribution._id)}
              >
                <Eye className="w-4 h-4 mr-2" />
                {expandedRows[distribution._id] ? 'Hide' : 'View'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => exportToCsv(distribution)}
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Expanded Content */}
          {expandedRows[distribution._id] && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <h4 className="font-medium mb-4 text-gray-900 dark:text-white">
                Distribution Details:
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {distribution.distributions.map((dist: any, index: number) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-medium text-gray-900 dark:text-white">
                        {dist.agentName}
                      </h5>
                      <span className="text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                        {dist.items.length} items
                      </span>
                    </div>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {dist.items.map((item: any, itemIndex: number) => (
                        <div key={itemIndex} className="bg-white dark:bg-gray-700 p-2 rounded text-sm">
                          <div className="font-medium text-gray-900 dark:text-white">
                            {item.firstName}
                          </div>
                          <div className="text-gray-600 dark:text-gray-300">
                            {item.phone}
                          </div>
                          {item.notes && (
                            <div className="text-gray-500 dark:text-gray-400 text-xs">
                              {item.notes}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}