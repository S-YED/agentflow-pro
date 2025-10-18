export interface User {
  _id: string
  name: string
  email: string
  mobile: string
  role: 'admin' | 'agent'
  createdAt: Date
  updatedAt: Date
}

export interface Agent extends User {
  role: 'agent'
}

export interface ListItem {
  firstName: string
  phone: string
  notes: string
}

export interface Distribution {
  agentId: string
  agentName: string
  items: ListItem[]
}

export interface DistributedList {
  _id: string
  fileName: string
  totalItems: number
  distributions: Distribution[]
  createdAt: Date
  updatedAt: Date
}

export interface AuthResponse {
  token: string
  user: User
}

export interface ApiResponse<T = any> {
  success: boolean
  message?: string
  data?: T
  error?: string
}