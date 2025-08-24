# Hey Amara - AI-Powered Recruitment Management Platform

[![Next.js](https://img.shields.io/badge/Next.js-14.2.32-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.14.0-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

Hey Amara is a modern, AI-powered recruitment management platform built with Next.js 14, designed to streamline the hiring process with intelligent candidate management, resume analysis, and AI-powered insights.

## ✨ Features

### 🎯 **Core Functionality**

- **Candidate Management**: Comprehensive candidate tracking with status management
- **Resume Processing**: AI-powered resume analysis and optimization suggestions
- **Smart Chat Interface**: AI widget for resume optimization and recruitment assistance
- **User Authentication**: Secure authentication with Google OAuth and email verification
- **Real-time Updates**: Live chat and notification system

### 🤖 **AI Capabilities**

- **Resume Analysis**: Intelligent parsing and analysis of resumes
- **Smart Suggestions**: AI-powered recommendations for resume improvements
- **Multi-model Support**: Integration with various AI models (Seed, DeepSeek)
- **Natural Language Processing**: Conversational interface for recruitment tasks

### 🎨 **User Experience**

- **Modern UI/UX**: Built with Tailwind CSS and Radix UI components
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Rich Text Editor**: TipTap-based editor for content creation
- **Interactive Widgets**: Collapsible AI assistant widget
- **Dark Mode Support**: Built-in theme switching

## 🏗️ Architecture

### **Frontend**

- **Next.js 14**: App Router with server and client components
- **React 18**: Latest React features and hooks
- **TypeScript**: Full type safety and IntelliSense
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives

### **Backend & Database**

- **Prisma ORM**: Type-safe database operations
- **PostgreSQL**: Primary database with Prisma client
- **NextAuth.js**: Authentication and session management
- **API Routes**: RESTful API endpoints

### **AI & External Services**

- **AI SDK**: OpenAI and custom AI model integration
- **Resend**: Email service for notifications
- **Supabase**: Additional backend services
- **BytePlus**: Media processing capabilities

## 🚀 Getting Started

### **Prerequisites**

- Node.js 18+
- PostgreSQL database
- npm, yarn, pnpm, or bun

### **Installation**

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd hey-amara
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Environment Setup**
   Create a `.env.local` file with the following variables:

   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/hey-amara"
   DIRECT_URL="postgresql://username:password@localhost:5432/hey-amara"

   # Authentication
   AUTH_GOOGLE_ID="your-google-client-id"
   AUTH_GOOGLE_SECRET="your-google-client-secret"
   AUTH_RESEND_API_KEY="your-resend-api-key"
   AUTH_RESEND_FROM="noreply@yourdomain.com"

   # NextAuth
   AUTH_SECRET="your-auth-secret"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Database Setup**

   ```bash
   # Generate Prisma client
   npx prisma generate

   # Run database migrations
   npx prisma db push
   ```

5. **Start Development Server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
hey-amara/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (app)/             # Protected app routes
│   │   │   ├── candidates/     # Candidate management
│   │   │   ├── calendar/       # Calendar view
│   │   │   ├── clients/        # Client management
│   │   │   ├── communication/  # Communication tools
│   │   │   ├── prospects/      # Prospect tracking
│   │   │   ├── settings/       # User settings
│   │   │   └── trash/          # Deleted items
│   │   ├── (auth)/             # Authentication routes
│   │   └── api/                # API endpoints
│   ├── components/              # Reusable UI components
│   │   ├── ai-elements/        # AI chat components
│   │   ├── tiptap/             # Rich text editor
│   │   ├── ui/                 # Base UI components
│   │   └── widget/             # AI assistant widget
│   ├── lib/                     # Utility libraries
│   ├── services/                # Business logic services
│   ├── stores/                  # State management (Zustand)
│   └── types/                   # TypeScript type definitions
├── prisma/                      # Database schema and migrations
├── public/                      # Static assets
└── styles/                      # Global styles and SCSS
```

## 🔧 Available Scripts

- **`npm run dev`** - Start development server
- **`npm run build`** - Build for production
- **`npm run start`** - Start production server
- **`npm run lint`** - Run ESLint
- **`npm run shadcn`** - Add new shadcn/ui components

## 🎯 Key Features Deep Dive

### **Candidate Management System**

- Track candidates through the entire recruitment pipeline
- Status management (Submitted, Interviewing, Placed, etc.)
- Resume upload and processing
- Rating and notes system
- Location and role tracking

### **AI-Powered Resume Analysis**

- Intelligent resume parsing
- Skills extraction and analysis
- Optimization suggestions
- Keyword identification
- Scoring and ranking

### **Smart Chat Interface**

- Context-aware AI assistant
- Resume optimization suggestions
- Multi-model AI support
- Real-time streaming responses
- Conversation history

### **Rich Text Editor**

- TipTap-based editor
- Custom extensions and nodes
- Image upload support
- Markdown compatibility
- Collaborative editing ready

## 🛠️ Technology Stack

### **Frontend Framework**

- Next.js 14 with App Router
- React 18 with Server Components
- TypeScript for type safety

### **Styling & UI**

- Tailwind CSS for styling
- Radix UI for accessible components
- SCSS for custom styling
- Framer Motion for animations

### **State Management**

- Zustand for client state
- React Query for server state
- React Hook Form for forms

### **Database & ORM**

- PostgreSQL database
- Prisma ORM with migrations
- NextAuth.js for authentication

### **AI & External Services**

- AI SDK for model integration
- Resend for email services
- Supabase for additional backend
- BytePlus for media processing

## 🔐 Authentication

The platform supports multiple authentication methods:

- **Google OAuth**: Social login integration
- **Email Verification**: Secure email-based authentication
- **Session Management**: Persistent user sessions
- **Role-based Access**: User permission system

## 📱 Responsive Design

- Mobile-first approach
- Adaptive layouts for all screen sizes
- Touch-friendly interface
- Progressive Web App ready

## 🚀 Deployment

### **Vercel (Recommended)**

```bash
npm run build
vercel --prod
```

### **Self-hosted**

```bash
npm run build
npm run start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Check the documentation
- Review the code examples

## 🔮 Roadmap

- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Mobile app development
- [ ] Advanced AI model integration
- [ ] Team collaboration features
- [ ] Integration with job boards
- [ ] Advanced reporting system

---

**Built with ❤️ using Next.js, TypeScript, and modern web technologies**
