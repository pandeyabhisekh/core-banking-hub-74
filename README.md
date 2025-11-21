# CoreBank CBS - Core Banking System

A comprehensive Core Banking System built with React, TypeScript, and modern web technologies.

## 🏦 Features

### Role-Based Access Control
- **Super Admin**: System-wide management, user creation, audit logs
- **Admin**: User management, branch oversight, MIS reports
- **Head Department**: Transaction authorization, staff management, high-value approvals
- **Branch Manager**: Branch-level operations, transaction approvals, teller oversight
- **Staff**: Customer service, transaction initiation, account operations

### Core Modules
- **Customer Information (CIF)**: Complete customer lifecycle management
- **Account Management**: Savings, Current, FD, RD, Loan accounts
- **Transaction Processing**: Cash, Cheque, NEFT/RTGS/IMPS, Forex
- **Maker-Checker Workflow**: Dual authorization for critical operations
- **User Management**: Role-based permissions and access control
- **Reporting & MIS**: Comprehensive banking reports
- **Audit Trails**: Complete transaction and system logs

## 🚀 Demo Credentials

Use these credentials to explore different role capabilities:

| Role | Username | Password |
|------|----------|----------|
| Super Admin | `superadmin` | `super@123` |
| Admin | `admin` | `admin@123` |
| Head Department | `headdept` | `head@123` |
| Branch Manager | `manager` | `manager@123` |
| Staff | `staff` | `staff@123` |

## 🛠 Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: React Context + React Query
- **Routing**: React Router v6
- **Build Tool**: Vite
- **UI Components**: Radix UI primitives

## 📦 Installation

```bash
# Clone the repository
git clone <repository-url>

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🏗 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── AppSidebar.tsx  # Navigation sidebar
│   ├── DashboardLayout.tsx
│   └── ProtectedRoute.tsx
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication state
├── pages/             # Route pages
│   ├── Login.tsx
│   ├── Dashboard.tsx
│   └── NotFound.tsx
├── types/            # TypeScript definitions
│   └── auth.ts
└── App.tsx          # Main app component
```

## 🔐 Security Features

- JWT-based authentication (ready for backend integration)
- Role-based route protection
- Session management
- Maker-checker approvals
- Audit logging

## 🎯 Next Steps

This is the frontend foundation. To build the complete CBS:

1. **Backend Integration**: Connect to Django backend or use Lovable Cloud
2. **Database**: PostgreSQL schema for all banking entities
3. **Additional Modules**: 
   - Customer pages (CIF management)
   - Account opening workflows
   - Transaction processing UI
   - Approval workflows
   - Reporting dashboards
4. **Real Authentication**: Integrate with backend auth system
5. **Business Logic**: Implement banking rules and validations

## 📝 License

All rights reserved.
