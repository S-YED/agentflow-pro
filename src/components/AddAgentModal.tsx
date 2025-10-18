"use client"

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X, UserPlus } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import toast from 'react-hot-toast'

const agentSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  mobile: z.string().min(10, 'Mobile number is required'),
  password: z.string().min(6, 'Password must be at least 6 characters')
})

type AgentForm = z.infer<typeof agentSchema>

interface AddAgentModalProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function AddAgentModal({ open, onClose, onSuccess }: AddAgentModalProps) {
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<AgentForm>({
    resolver: zodResolver(agentSchema)
  })

  const onSubmit = async (data: AgentForm) => {
    setIsLoading(true)
    try {
      console.log('Submitting agent data:', data)
      const token = localStorage.getItem('token')
      console.log('Token:', token ? 'Present' : 'Missing')
      
      const response = await fetch('/api/agents/add', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data),
      })

      console.log('Response status:', response.status)
      const result = await response.json()
      console.log('Response data:', result)

      if (response.ok) {
        toast.success('Agent added successfully! 🎉')
        reset()
        onSuccess()
        onClose()
      } else {
        toast.error(result.message || 'Failed to add agent')
      }
    } catch (error) {
      console.error('Add agent error:', error)
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
            <UserPlus className="w-5 h-5" />
            <span>Add New Agent</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <Input
              {...register('name')}
              placeholder="Enter agent name"
              error={!!errors.name}
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input
              {...register('email')}
              type="email"
              placeholder="Enter email address"
              error={!!errors.email}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Mobile Number</label>
            <Input
              {...register('mobile')}
              placeholder="e.g. +1234567890 (include country code)"
              error={!!errors.mobile}
            />
            {errors.mobile && (
              <p className="text-red-500 text-sm">{errors.mobile.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <Input
              {...register('password')}
              type="password"
              placeholder="Enter password"
              error={!!errors.password}
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          <div className="flex space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? 'Adding...' : 'Add Agent'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}