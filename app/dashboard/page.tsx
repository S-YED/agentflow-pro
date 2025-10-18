"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Users, 
  FileText, 
  TrendingUp, 
  Plus, 
  Upload, 
  LogOut, 
  Moon, 
  Sun,
  Menu,
  X
} from 'lucide-react'
import { Button } from '@/src/components/ui/button'
import { useTheme } from 'next-themes'
import toast from 'react-hot-toast'
import AddAgentModal from '@/src/components/AddAgentModal'
import UploadModal from '@/src/components/UploadModal'
import DistributionsTable from '@/src/components/DistributionsTable'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [agents, setAgents] = useState<any[]>([])
  const [distributions, setDistributions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showAddAgent, setShowAddAgent] = useState(false)
  const [showUpload, setShowUpload] = useState(false)
  const router = useRouter()
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (!token || !userData) {
      router.push('/login')
      return
    }

    setUser(JSON.parse(userData))
    fetchData()
  }, [router])

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token')
      
      // Fetch agents
      const agentsResponse = await fetch('/api/agents', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (agentsResponse.ok) {
        const agentsData = await agentsResponse.json()
        setAgents(agentsData.agents || [])
      }
      
      // Fetch distributions
      const distributionsResponse = await fetch('/api/lists/distributed', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (distributionsResponse.ok) {
        const distributionsData = await distributionsResponse.json()
        setDistributions(distributionsData.lists || [])
      }
    } catch (error) {
      toast.error('Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-50 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:z-auto`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-white dark:text-gray-900" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">AgentFlow Pro</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Enterprise Platform</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* User Profile */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 rounded-full flex items-center justify-center">
                <span className="text-white dark:text-gray-900 font-semibold text-lg">
                  {user?.name?.charAt(0) || 'A'}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{user?.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{user?.role}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            <Button variant="ghost" className="w-full justify-start text-left">
              <Users className="w-5 h-5 mr-3" />
              Dashboard
            </Button>
            <Button variant="ghost" className="w-full justify-start text-left">
              <FileText className="w-5 h-5 mr-3" />
              Distributions
            </Button>
            <Button variant="ghost" className="w-full justify-start text-left">
              <TrendingUp className="w-5 h-5 mr-3" />
              Analytics
            </Button>
          </nav>

          {/* Theme Toggle */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="ghost"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="w-full justify-start"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 mr-3" /> : <Moon className="w-5 h-5 mr-3" />}
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </Button>
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden"
                >
                  <Menu className="w-5 h-5" />
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Welcome back, {user?.name} 👋
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    Manage your agents and distribute lists efficiently
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6 space-y-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-blue-200 dark:border-blue-700 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Agents</p>
                  <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">{agents.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-green-200 dark:border-green-700 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">Distributed Lists</p>
                  <p className="text-3xl font-bold text-green-900 dark:text-green-100">{distributions.length}</p>
                </div>
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-purple-200 dark:border-purple-700 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Total Items</p>
                  <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">
                    {distributions.reduce((sum, dist) => sum + (dist.totalItems || 0), 0)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={() => setShowAddAgent(true)}
                variant="success"
                className="flex-1 h-12 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Agent
              </Button>
              <Button 
                onClick={() => setShowUpload(true)}
                className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
              >
                <Upload className="w-5 h-5 mr-2" />
                Upload List
              </Button>
            </div>
          </motion.div>

          {/* Agents Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Recent Agents</h2>
            {agents.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No agents found. Add some agents to get started.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {agents.map((agent, index) => (
                  <motion.div
                    key={agent._id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * index }}
                    className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-white dark:text-gray-900 font-semibold">
                          {agent.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{agent.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{agent.role}</p>
                      </div>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                      <p>{agent.email}</p>
                      <p>{agent.mobile}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Distributed Lists Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Distributed Lists</h2>
            <DistributionsTable distributions={distributions} />
          </motion.div>
        </main>
      </div>

      {/* Modals */}
      <AddAgentModal
        open={showAddAgent}
        onClose={() => setShowAddAgent(false)}
        onSuccess={fetchData}
      />
      
      <UploadModal
        open={showUpload}
        onClose={() => setShowUpload(false)}
        onSuccess={fetchData}
      />
    </div>
  )
}