# AgentFlow Pro - Secure Distribution Hub

A premium Next.js 13 application for managing agents and distributing contact lists equally among top 5 agents with enterprise-grade UI/UX.

## ✨ Features

- **🔐 Secure Authentication**: JWT-based login with role-based access control
- **👥 Agent Management**: Add and manage agents with comprehensive validation
- **📊 Smart Distribution**: Upload CSV/Excel files and automatically distribute among top 5 agents
- **🎨 Premium UI/UX**: Modern glassmorphism design with dark/light mode
- **📱 Responsive Design**: Mobile-first approach with touch-friendly interactions
- **♿ Accessibility**: WCAG AA compliant with full keyboard navigation
- **🎭 Smooth Animations**: Framer Motion powered transitions and micro-interactions
- **🔍 Advanced Features**: Search, sort, pagination, and export functionality

## 🚀 Tech Stack

- **Frontend**: Next.js 13 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui, Framer Motion
- **Backend**: Next.js API Routes, MongoDB, Mongoose
- **Authentication**: JWT with secure token handling
- **Validation**: Zod schemas with react-hook-form
- **File Processing**: PapaParse (CSV), XLSX (Excel)
- **Phone Validation**: libphonenumber-js
- **UI Components**: Radix UI primitives
- **Notifications**: react-hot-toast with custom styling

## 📋 Prerequisites

- Node.js 18+ 
- MongoDB Atlas account (or local MongoDB)
- npm or yarn package manager

## 🛠️ Setup Instructions

### 1. Clone and Install

```bash
git clone <repository-url>
cd agentflow-pro
npm install
```

### 2. Environment Configuration

```bash
cp .env.example .env.local
```

Update `.env.local` with your values:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/agentflow-pro
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long
NODE_ENV=development
```

### 3. Database Setup

```bash
# Seed admin user
npm run seed
```

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔑 Demo Credentials

- **Email**: admin@example.com
- **Password**: admin123

## 📁 Project Structure

```
agentflow-pro/
├── app/                    # Next.js 13 App Router
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   ├── login/            # Authentication pages
│   └── globals.css       # Global styles
├── src/
│   ├── components/       # Reusable components
│   │   └── ui/          # shadcn/ui components
│   ├── lib/             # Utilities and configurations
│   └── types/           # TypeScript definitions
├── models/              # MongoDB models
├── scripts/             # Database scripts
└── __tests__/          # Test files
```

## 🎯 Key Features Explained

### Distribution Algorithm

The system distributes items equally among the top 5 most recently created agents:

```typescript
// Example: 27 items among 5 agents
totalItems = 27
agentCount = 5
baseCount = 27 / 5 = 5 (floor)
remainder = 27 % 5 = 2

// Result: [6, 6, 5, 5, 5] items per agent
// First 2 agents get +1 item from remainder
```

### File Format Support

- **CSV**: Standard comma-separated values
- **XLSX**: Excel 2007+ format  
- **XLS**: Excel 97-2003 format

Required columns: `FirstName`, `Phone`, `Notes`

### Responsive Design

- **Desktop**: Full sidebar navigation with 3-column grid
- **Tablet**: Collapsible sidebar with 2-column grid
- **Mobile**: Hidden sidebar with hamburger menu, single column

### Accessibility Features

- **Keyboard Navigation**: Full Tab/Enter/Escape support
- **Screen Readers**: Semantic HTML with ARIA labels
- **High Contrast**: WCAG AA compliant color ratios
- **Focus Management**: Visible focus indicators
- **Error Handling**: Clear error messages with retry options

## 🧪 Testing

### Manual Testing Guide

#### 1. Authentication Flow
```bash
# Start the application
npm run dev

# Navigate to http://localhost:3000
# Should redirect to /login

# Test login with demo credentials:
Email: admin@example.com
Password: admin123

# Should redirect to /dashboard on success
# Test invalid credentials for error handling
```

#### 2. Agent Management
```bash
# On dashboard, click "Add Agent" button
# Fill form with test data:

Name: John Doe
Email: john@example.com  
Mobile: +1234567890
Password: password123

# Test validation:
# - Duplicate email (should show error)
# - Invalid phone format (should show error)
# - Short password (should show error)

# Add 5+ agents for distribution testing
```

#### 3. File Upload & Distribution
```bash
# Create test CSV file (sample-data.csv):
FirstName,Phone,Notes
John Smith,+1234567890,Important client
Jane Doe,+0987654321,Follow up needed
Bob Johnson,+1122334455,New prospect
Alice Brown,+2233445566,Existing customer
Charlie Wilson,+3344556677,Hot lead
# ... add 20+ more rows for testing

# Click "Upload List" button
# Drag and drop or select the CSV file
# Should show success message and distribute among agents
# Check distribution table for equal distribution
```

#### 4. Edge Cases Testing
```bash
# Test with different file sizes:
# - 25 items (should distribute 5 per agent)
# - 27 items (should distribute 6,6,5,5,5)
# - 0 items (should show error)
# - Large file >5MB (should reject)

# Test with invalid files:
# - Wrong format (.txt, .pdf)
# - Missing required columns
# - Empty rows
# - Special characters in data
```

### Automated Tests

```bash
# Run test suite
npm test

# Run tests in watch mode
npm run test:watch
```

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard:
# - MONGODB_URI
# - JWT_SECRET
```

### Other Platforms

The app can be deployed to any platform supporting Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🔧 Configuration

### Theme Customization

Edit `tailwind.config.ts` to customize colors and styling:

```typescript
theme: {
  extend: {
    colors: {
      primary: "hsl(var(--primary))",
      // Add custom colors
    }
  }
}
```

### Database Indexes

For production, ensure these MongoDB indexes exist:

```javascript
// Users collection
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ role: 1, createdAt: -1 })

// DistributedLists collection  
db.distributedlists.createIndex({ createdAt: -1 })
db.distributedlists.createIndex({ "distributions.agentId": 1 })
```

## 🐛 Troubleshooting

### Common Issues

**MongoDB Connection Error**
```bash
# Check your MONGODB_URI in .env.local
# Ensure IP whitelist includes your IP in MongoDB Atlas
# Verify database user permissions
```

**Build Errors**
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

**Authentication Issues**
```bash
# Verify JWT_SECRET is set and at least 32 characters
# Check token expiration (24h default)
# Clear localStorage and try again
```

### Performance Optimization

- Enable MongoDB connection pooling
- Implement Redis caching for frequent queries
- Use Next.js Image optimization for avatars
- Enable gzip compression
- Implement proper error boundaries

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review the manual testing guide

---

Built with ❤️ using Next.js 13, TypeScript, and modern web technologies.