# AgentFlow Pro - Admin Agent Management System

A complete MERN stack application for managing agents and distributing CSV lists equally among all available agents.

## 🚀 Live Demo

**Live Application**: https://agentflow-pro.vercel.app

**Demo Credentials:**
- Email: `admin@example.com`
- Password: `admin123`

## ✨ Features

- ✅ **Admin Login** - JWT authentication
- ✅ **Agent Management** - Add agents with validation
- ✅ **CSV Upload** - Upload CSV/Excel files
- ✅ **Auto Distribution** - Equally distribute among all available agents
- ✅ **Professional UI** - Modern glassmorphism design
- ✅ **Mobile Responsive** - Works on all devices

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: MongoDB Atlas
- **Authentication**: JWT
- **Deployment**: Vercel

## ⚡ Quick Start (30 seconds)

### Option 1: Use Live Demo (Recommended)
Just visit: https://agentflow-pro.vercel.app

### Option 2: Run Locally

```bash
# 1. Clone repository
git clone https://github.com/S-YED/agentflow-pro.git
cd agentflow-pro

# 2. Install dependencies
npm install

# 3. Set environment variables
cp .env.example .env.local
# Edit .env.local with your MongoDB URI

# 4. Seed database (creates admin user)
npm run seed

# 5. Start development server
npm run dev
```

Open http://localhost:3000

## 📋 Usage Guide

### 1. Login
- Use demo credentials: `admin@example.com` / `admin123`

### 2. Add Agents
- Click "Add Agent" button
- Fill: Name, Email, Mobile (+country code), Password
- Add any number of agents for distribution

### 3. Upload & Distribute Lists
- Click "Upload List" button
- Upload CSV/Excel with columns: `FirstName`, `Phone`, `Notes`
- System automatically distributes equally among all available agents
- View results in distribution table

## 📁 CSV File Format

```csv
FirstName,Phone,Notes
John Doe,+1234567890,Important client
Jane Smith,+1987654321,Follow up needed
```

## 🔧 Environment Variables

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/agentflow
JWT_SECRET=your-jwt-secret-key
NODE_ENV=development
```

## 📊 Distribution Algorithm

- **Flexible Distribution**: Items divided equally among all available agents
- **Equal Distribution**: totalItems ÷ totalAgents
- **Remainder Handling**: Extra items distributed sequentially to first agents
- **Examples**: 
  - 27 items, 5 agents → [6, 6, 5, 5, 5]
  - 20 items, 3 agents → [7, 7, 6]
  - 10 items, 4 agents → [3, 3, 2, 2]

## 🚀 Deployment

### Vercel (Recommended)
1. Fork this repository
2. Connect to Vercel
3. Add environment variables
4. Deploy automatically

### Manual Deployment
```bash
npm run build
npm start
```

## 📝 API Endpoints

- `POST /api/auth/login` - User authentication
- `POST /api/agents/add` - Add new agent
- `GET /api/agents` - Get all agents
- `POST /api/lists/upload` - Upload and distribute CSV
- `GET /api/lists/distributed` - Get distribution results

## 🧪 Testing

Sample CSV file included: `sample-data.csv`

## 📞 Support

For issues or questions, please create an issue on GitHub.

## 📄 License

MIT License - feel free to use for learning and projects.

---

**Built by Syed Khaja Moinuddin using Next.js and MongoDB**
