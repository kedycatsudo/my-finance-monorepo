# MyFinance - Personal Finance Management Platform

A full-stack monorepo application for managing personal finances with comprehensive income, outcome, and investment tracking capabilities.

> A modern, responsive web application built with Next.js and NestJS for real-time financial data management and analysis.

---

## 🎯 Overview

MyFinance is a comprehensive personal finance management system that enables users to track:

- **Income Sources** - Multiple income streams with payment history
- **Outcomes** - Expense tracking by category with detailed payment records
- **Investments** - Portfolio management with support for stocks, crypto, and forex tracking
- **User Profiles** - Personalized account settings and preferences

The application is designed with security, scalability, and user experience in mind, featuring JWT-based authentication, real-time data synchronization, and a clean, intuitive interface.

---

## 🛠️ Tech Stack

### Backend

- **Runtime**: Node.js
- **Framework**: [NestJS](https://nestjs.com/) (Enterprise-grade framework)
- **Database**: PostgreSQL with [Prisma ORM](https://www.prisma.io/)
- **Authentication**: JWT + Passport.js
- **API**: RESTful with CORS support
- **Validation**: Custom DTOs with class-validator

### Frontend

- **Framework**: [Next.js 16](https://nextjs.org/)
- **UI/Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **React Compiler**: Enabled for performance optimization
- **State Management**: React Context API
- **Type Safety**: TypeScript
- **HTTP Client**: Native Fetch API

### Infrastructure & Deployment

- **Backend Hosting**: [Render](https://render.com/) (Production)
- **Frontend Hosting**: [Vercel](https://vercel.com/) (Production)
- **Database**: Neon PostgreSQL
- **Version Control**: Git

---

## 📁 Project Structure

```
my-finance-monorepo/
├── apps/
│   ├── backend/                           # NestJS Backend API
│   │   ├── src/
│   │   │   ├── auth/                      # Authentication module (JWT, guards)
│   │   │   ├── incomes-sources/           # Income management module
│   │   │   ├── outcomes/                  # Expense management module
│   │   │   ├── investment-source/         # Investment portfolio module
│   │   │   ├── users/                     # User management module
│   │   │   ├── prisma/                    # Prisma service
│   │   │   ├── app.controller.ts          # Root controller
│   │   │   ├── app.service.ts             # Root service
│   │   │   ├── app.module.ts              # Root module
│   │   │   └── main.ts                    # Application entry point
│   │   ├── prisma/
│   │   │   ├── schema.prisma              # Database schema
│   │   │   └── migrations/                # Database version history
│   │   ├── test/                          # E2E tests
│   │   ├── nest-cli.json                  # NestJS CLI config
│   │   ├── tsconfig.json                  # TypeScript config
│   │   └── package.json
│   │
│   └── frontend/                          # Next.js Frontend Application
│       ├── src/
│       │   ├── app/                       # Next.js app directory (routing)
│       │   ├── components/                # Reusable React components
│       │   │   ├── modals/                # Modal dialogs for CRUD operations
│       │   │   └── forms/                 # Form components (FieldInput, AccordionItem)
│       │   ├── context/                   # React Context providers
│       │   │   ├── AuthContext.tsx        # Authentication state
│       │   │   ├── InvestmentContext.tsx  # Investment state
│       │   │   ├── IncomesContext.tsx     # Income state
│       │   │   └── OutcomesContext.tsx    # Expense state
│       │   ├── pages/api/                 # Next.js API routes (proxy to backend)
│       │   ├── types/                     # TypeScript type definitions
│       │   ├── constants/                 # Application constants
│       │   ├── utils/                     # Helper functions
│       │   └── lib/                       # Utility libraries
│       ├── public/                        # Static assets (images, data)
│       ├── next.config.ts                 # Next.js configuration with basePath
│       ├── tsconfig.json                  # TypeScript config
│       ├── vercel.json                    # Vercel deployment config with redirects
│       ├── tailwind.config.js             # Tailwind CSS config
│       └── package.json
│
├── .gitignore
├── README.md                              # This file
└── .vscode/                               # VS Code workspace settings
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher (or yarn/pnpm)
- **PostgreSQL**: v13 or higher (local) or cloud database (Neon, AWS RDS, etc.)
- **Git**: for version control

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/my-finance-monorepo.git
   cd my-finance-monorepo
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Setup environment variables**

   Create `.env.local` files in both `apps/backend` and `apps/frontend`:

   **Backend** (`apps/backend/.env.local`):

   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/myfinance
   JWT_SECRET=your_jwt_secret_key_here
   PORT=3001
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   ```

   **Frontend** (`apps/frontend/.env.local`):

   ```env
   NEXT_PUBLIC_BASE_PATH=/myfinance
   NEXT_PUBLIC_ASSET_PREFIX=/myfinance/
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

### 🏃 Running Locally

#### Backend Server

```bash
# Navigate to backend directory
cd apps/backend

# Setup database (Prisma migrations)
npx prisma migrate dev

# Start development server
npm run start:dev
```

Backend will be available at `http://localhost:3001`

#### Frontend Application

```bash
# Navigate to frontend directory
cd apps/frontend

# Start development server
npm run dev
```

Frontend will be available at `http://localhost:3000/myfinance`

#### Full Stack (from root)

Run both services with:

```bash
# Terminal 1: Backend
cd apps/backend && npm run start:dev

# Terminal 2: Frontend
cd apps/frontend && npm run dev
```

---

## 📋 Environment Variables

### Backend Configuration

| Variable       | Description                      | Example                               |
| -------------- | -------------------------------- | ------------------------------------- |
| `DATABASE_URL` | PostgreSQL connection string     | `postgresql://user:pass@host:5432/db` |
| `JWT_SECRET`   | Secret key for JWT token signing | `your_super_secret_key`               |
| `PORT`         | Server port                      | `3001`                                |
| `NODE_ENV`     | Environment mode                 | `development`, `production`           |
| `FRONTEND_URL` | Frontend origin for CORS         | `https://app.example.com`             |

### Frontend Configuration

| Variable                   | Description       | Example                   |
| -------------------------- | ----------------- | ------------------------- |
| `NEXT_PUBLIC_BASE_PATH`    | App base URL path | `/myfinance`              |
| `NEXT_PUBLIC_ASSET_PREFIX` | Asset CDN prefix  | `/myfinance/`             |
| `NEXT_PUBLIC_API_URL`      | Backend API URL   | `https://api.example.com` |

---

## 🗄️ Database Setup

### Initialize Database

```bash
cd apps/backend

# Create and apply migrations
npx prisma migrate dev

# Generate Prisma client
npx prisma generate

# View database UI
npx prisma studio
```

### Database Schema

The application uses Prisma ORM with PostgreSQL. Key entities:

- **Users** - Account credentials and profile info
- **InvestmentSources** - Investment portfolios (stocks, crypto, forex)
- **InvestmentItems** - Individual investments with entry/exit dates
- **FinanceSources** - Income and outcome categories
- **FinancePayments** - Transaction history for sources

See `apps/backend/prisma/schema.prisma` for complete schema.

---

## 🔐 Authentication

The application uses **JWT-based authentication**:

1. User registers/logs in via `/api/auth/register` or `/api/auth/login`
2. Server returns JWT token stored in localStorage
3. All subsequent requests include `Authorization: Bearer <token>` header
4. Backend validates token via `JwtAuthGuard`

**Protected Routes**: All financial data endpoints require valid JWT.

---

## 📡 API Overview

### Base URL

- **Development**: `http://localhost:3001/api`
- **Production**: `https://my-finance-backend-masz.onrender.com/api`

### Core Endpoints

#### Authentication

- `POST /auth/login` - User login
- `POST /auth/register` - User registration

#### Income Management

- `GET /incomes/sources` - List income sources
- `POST /incomes/sources` - Create income source
- `PATCH /incomes/sources/:id` - Update income source
- `DELETE /incomes/sources/:id` - Delete income source
- `GET /incomes/:sourceId/payments` - List payments for source
- `POST /incomes/:sourceId/payments` - Add payment

#### Outcome Management

- `GET /outcomes/sources` - List expense categories
- `POST /outcomes/sources` - Create expense category
- `PATCH /outcomes/sources/:id` - Update category
- `DELETE /outcomes/sources/:id` - Delete category
- `GET /outcomes/:sourceId/payments` - List payments
- `POST /outcomes/:sourceId/payments` - Add payment

#### Investment Management

- `GET /investment` - List all investment sources
- `POST /investment` - Create investment source
- `PATCH /investment/:id` - Update investment source
- `DELETE /investment/:id` - Delete investment source
- `GET /investment/:sourceId/items` - List items in portfolio
- `POST /investment/:sourceId/items` - Add investment item
- `PATCH /investment/:sourceId/items/:itemId` - Update item
- `DELETE /investment/:sourceId/items/:itemId` - Remove item

#### User Profile

- `GET /users/me` - Get current user profile
- `PATCH /users/me` - Update profile
- `DELETE /users/me` - Delete account

See API documentation or Swagger UI (if enabled) for detailed request/response schemas.

---

## 🚢 Deployment

### Backend (Render)

1. Connect your GitHub repository to [Render](https://render.com/)
2. Create a new Web Service pointing to `apps/backend`
3. Set environment variables in Render dashboard:
   - `DATABASE_URL` (Neon PostgreSQL)
   - `JWT_SECRET`
   - `FRONTEND_URL` (your deployed frontend URL)
   - `NODE_ENV=production`
4. Deploy!

### Frontend (Vercel)

1. Connect your GitHub repository to [Vercel](https://vercel.com/)
2. Select `apps/frontend` as root directory
3. Set environment variables:
   - `NEXT_PUBLIC_BASE_PATH=/myfinance`
   - `NEXT_PUBLIC_ASSET_PREFIX=/myfinance/`
   - `NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com`
4. Deploy!

### Database (Neon)

1. Create PostgreSQL instance on [Neon](https://neon.tech/)
2. Get connection string and set as `DATABASE_URL`
3. Apply migrations: `npx prisma migrate deploy`

---

## 🐛 Common Issues & Troubleshooting

### CORS Errors

**Problem**: `Cross-Origin Request Blocked`
**Solution**:

- Ensure `FRONTEND_URL` is set in backend environment
- Backend CORS config includes frontend origin
- Verify `NEXT_PUBLIC_API_URL` points to correct backend

### "Unexpected end of JSON input"

**Problem**: API proxy returns empty response body
**Solution**:

- Check backend logs for 401/500 errors
- Verify authentication token is valid
- Ensure JWT secret is consistent

### Database Connection Failed

**Problem**: `Can't reach database server`
**Solution**:

- Verify `DATABASE_URL` connection string
- Check PostgreSQL service is running
- Ensure firewall/security groups allow connection

### Next.js Build Errors

**Problem**: `Module not found` or TypeScript errors
**Solution**:

```bash
rm -rf .next node_modules
npm install
npm run typecheck
npm run build
```

---

## 📦 Building for Production

### Backend

```bash
cd apps/backend
npm run build
npm run start:prod
```

### Frontend

```bash
cd apps/frontend
npm run build
npm run start
```

---

## 🧪 Testing

### Backend Tests

```bash
cd apps/backend

# Unit tests
npm run test

# Unit tests (watch mode)
npm run test:watch

# E2E tests
npm run test:e2e

# Coverage report
npm run test:cov
```

### Code Quality

```bash
cd apps/backend

# Type checking
npm run typecheck

# Linting
npm run lint:check

# Format code
npm run format
```

---

## 📆 Features & Roadmap

### ✅ Implemented

- User authentication (JWT)
- Income tracking with payment history
- Expense management by category
- Investment portfolio tracking (stocks, crypto, forex)
- User profile management
- Responsive design with Tailwind CSS
- Type-safe frontend and backend

### 🚧 In Progress

- Advanced analytics and reports
- Budget goals and alerts
- Data export (CSV, PDF)
- Mobile app optimization

### 📝 Planned

- Dark mode
- Multi-currency support
- AI-powered expense categorization
- Financial insights and forecasting

---

## 👨‍💻 Development Guidelines

### Code Style

- **Language**: TypeScript (strict mode)
- **Formatter**: Prettier
- **Linter**: ESLint
- **Naming**: camelCase for variables, PascalCase for classes/interfaces

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/short-description

# Commit changes
git commit -m "feat: add feature description"

# Push and create pull request
git push origin feature/short-description
```

### Commit Message Format

```
{type}: {description}

{optional body}

{optional footer}
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

---

## 📄 License

This project is licensed under the UNLICENSED license. See LICENSE file for details.

---

## 💬 Support & Contact

For issues, questions, or suggestions:

1. Check existing [Issues](https://github.com/yourusername/my-finance-monorepo/issues)
2. Create a new Issue with detailed description
3. Include reproduction steps and environment info

---

## 📚 Additional Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [JWT Authentication Best Practices](https://tools.ietf.org/html/rfc8949)

---

**Last Updated**: March 2026  
**Version**: 0.1.0-beta
