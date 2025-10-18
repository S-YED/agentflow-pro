"use client"

import { useState } from 'react'
import { Upload, X, FileText } from 'lucide-react'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import toast from 'react-hot-toast'

interface UploadModalProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function UploadModal({ open, onClose, onSuccess }: UploadModalProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file')
      return
    }

    const allowedTypes = ['.csv', '.xlsx', '.xls']
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'))
    
    if (!allowedTypes.includes(fileExtension)) {
      toast.error('Invalid file type. Please upload CSV, XLSX, or XLS files only.')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB')
      return
    }

    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/lists/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData,
      })

      const result = await response.json()

      if (response.ok) {
        toast.success('List uploaded and distributed successfully! 🎉')
        setFile(null)
        onSuccess()
        onClose()
      } else {
        toast.error(result.message || 'Failed to upload file')
      }
    } catch (error) {
      toast.error('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Upload className="w-5 h-5" />
            <span>Upload List</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive 
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                : 'border-gray-300 dark:border-gray-600'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {file ? file.name : 'Drag and drop your file here, or click to select'}
            </p>
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => document.getElementById('file-upload')?.click()}
              className="cursor-pointer"
            >
              Choose File
            </Button>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h4 className="font-medium mb-2">File Requirements:</h4>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>• Supported formats: CSV, XLSX, XLS</li>
              <li>• Maximum file size: 5MB</li>
              <li>• Required columns: FirstName, Phone, Notes</li>
              <li>• At least 5 agents required for distribution</li>
            </ul>
          </div>

          <div className="flex space-x-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleUpload} 
              disabled={isLoading || !file}
              className="flex-1"
            >
              {isLoading ? 'Uploading...' : 'Upload & Distribute'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}