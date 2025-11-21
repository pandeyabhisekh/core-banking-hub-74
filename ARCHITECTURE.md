# CoreBank CBS - Architecture Documentation

## 📋 Project Overview

CoreBank CBS is a Core Banking System built with React, TypeScript, and modern web technologies. The frontend is designed to support comprehensive banking operations with role-based access control, maker-checker workflows, and multiple banking modules.

## 🏗️ Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite (fast, modern bundler)
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: shadcn/ui (Radix UI primitives)
- **State Management**: React Context API
- **Routing**: React Router v6
- **Data Fetching**: TanStack React Query
- **Form Handling**: React Hook Form + Zod
- **Notifications**: Sonner (toast notifications)

## 📁 Project Structure

```
corebank-cbs/
├── public/                      # Static assets served directly
│   ├── robots.txt              # SEO: Search engine crawling rules
│   ├── favicon.ico             # Browser tab icon
│   └── placeholder.svg         # Default placeholder image
│
├── src/                        # Source code directory
│   ├── components/             # Reusable UI components
│   │   ├── ui/                # shadcn/ui component library
│   │   ├── AppSidebar.tsx     # Main navigation sidebar
│   │   ├── DashboardLayout.tsx # Layout wrapper with sidebar
│   │   ├── NavLink.tsx        # Navigation link component
│   │   ├── ProtectedRoute.tsx # Route authentication guard
│   │   └── StatusBadge.tsx    # Status indicator component
│   │
│   ├── contexts/              # React Context providers
│   │   └── AuthContext.tsx    # Authentication state management
│   │
│   ├── hooks/                 # Custom React hooks
│   │   ├── use-mobile.tsx     # Mobile detection hook
│   │   └── use-toast.ts       # Toast notification hook
│   │
│   ├── lib/                   # Utility libraries
│   │   └── utils.ts           # Helper functions (cn, etc.)
│   │
│   ├── pages/                 # Route page components
│   │   ├── Dashboard.tsx      # Main dashboard page
│   │   ├── Login.tsx          # Authentication page
│   │   ├── Index.tsx          # Landing page (unused)
│   │   └── NotFound.tsx       # 404 error page
│   │
│   ├── types/                 # TypeScript type definitions
│   │   └── auth.ts            # Authentication types
│   │
│   ├── App.tsx                # Root application component
│   ├── App.css                # Global application styles
│   ├── main.tsx               # Application entry point
│   ├── index.css              # Design system & Tailwind directives
│   └── vite-env.d.ts          # Vite TypeScript definitions
│
├── Configuration Files
├── eslint.config.js           # ESLint configuration
├── vite.config.ts             # Vite build configuration
├── tailwind.config.ts         # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
├── tsconfig.app.json          # TypeScript app-specific config
├── tsconfig.node.json         # TypeScript Node.js config
├── postcss.config.js          # PostCSS configuration
├── components.json            # shadcn/ui configuration
├── package.json               # NPM dependencies & scripts
├── package-lock.json          # NPM dependency lock file
│
├── Documentation
├── README.md                  # Project documentation
└── ARCHITECTURE.md            # This file
```

## 📄 File-by-File Documentation

### Root Configuration Files

#### `vite.config.ts`
- **Purpose**: Configures Vite build tool
- **Key Features**:
  - React SWC plugin for fast refresh
  - Development server on port 8080
  - Path alias `@/` maps to `src/`
  - Component tagger for development mode

#### `tailwind.config.ts`
- **Purpose**: Tailwind CSS configuration
- **Key Features**:
  - Custom color palette from CSS variables
  - Extended theme with banking colors
  - shadcn/ui integration
  - Animation utilities
  - Responsive breakpoints

#### `tsconfig.json`
- **Purpose**: TypeScript compiler configuration
- **Key Features**:
  - Strict type checking enabled
  - ES2020 target
  - JSX React support
  - Path aliases configuration

#### `eslint.config.js`
- **Purpose**: Code linting rules
- **Key Features**:
  - TypeScript support
  - React hooks rules
  - Import sorting
  - Code quality standards

#### `components.json`
- **Purpose**: shadcn/ui CLI configuration
- **Defines**: Component installation paths, style preferences, aliases

### Source Files

#### `src/main.tsx`
- **Purpose**: Application entry point
- **Functionality**:
  - Renders root App component
  - Mounts React to DOM
  - Initializes React 18 concurrent features

#### `src/App.tsx`
- **Purpose**: Root application component
- **Functionality**:
  - Sets up React Query client
  - Configures BrowserRouter
  - Wraps app with providers (Auth, Tooltip, Toast)
  - Defines all application routes
  - Implements route-level access control

#### `src/index.css`
- **Purpose**: Global styles and design system
- **Contains**:
  - Tailwind directives (@tailwind base, components, utilities)
  - CSS custom properties (color tokens)
  - Light/dark theme variables
  - Banking color palette (primary, secondary, accent)
  - Status colors (success, warning, error)
  - Semantic tokens (background, foreground, border)
  - Gradient definitions
  - Shadow utilities
  - Animation keyframes

### Components

#### `src/components/AppSidebar.tsx`
- **Purpose**: Main navigation sidebar
- **Features**:
  - Role-based menu items
  - Collapsible navigation
  - Active route highlighting
  - User profile section
  - Logout functionality
  - Icons for each module
- **Integration**: Uses shadcn/ui Sidebar components

#### `src/components/DashboardLayout.tsx`
- **Purpose**: Layout wrapper for authenticated pages
- **Features**:
  - Responsive layout with sidebar
  - Main content area
  - Sidebar toggle for mobile
  - Header with breadcrumbs
  - Consistent spacing and styling

#### `src/components/NavLink.tsx`
- **Purpose**: Navigation link with active state
- **Features**:
  - React Router integration
  - Active state styling
  - Icon support
  - Accessible navigation

#### `src/components/ProtectedRoute.tsx`
- **Purpose**: Route authentication guard
- **Features**:
  - Checks user authentication
  - Role-based access control
  - Redirects unauthenticated users to login
  - Redirects unauthorized users to dashboard
- **Usage**: Wraps protected routes in App.tsx

#### `src/components/StatusBadge.tsx`
- **Purpose**: Status indicator component
- **Features**:
  - Color-coded status badges (pending, approved, rejected, active, inactive)
  - Consistent styling
  - Reusable across modules

#### `src/components/ui/` (shadcn/ui Components)
All components in this directory are from shadcn/ui library:
- **accordion.tsx**: Expandable content sections
- **alert-dialog.tsx**: Modal confirmation dialogs
- **alert.tsx**: Notification alerts
- **avatar.tsx**: User profile pictures
- **badge.tsx**: Status/label indicators
- **button.tsx**: Primary action buttons
- **calendar.tsx**: Date picker
- **card.tsx**: Content containers
- **carousel.tsx**: Image/content slider
- **chart.tsx**: Data visualizations (Recharts)
- **checkbox.tsx**: Form checkboxes
- **dialog.tsx**: Modal dialogs
- **dropdown-menu.tsx**: Context menus
- **form.tsx**: Form wrapper with React Hook Form
- **input.tsx**: Text input fields
- **label.tsx**: Form labels
- **select.tsx**: Dropdown selects
- **separator.tsx**: Visual dividers
- **sheet.tsx**: Slide-out panels
- **sidebar.tsx**: Sidebar components
- **table.tsx**: Data tables
- **tabs.tsx**: Tabbed interfaces
- **textarea.tsx**: Multi-line text input
- **toast.tsx**: Toast notifications
- **tooltip.tsx**: Hover tooltips
- **And more...** (31 total UI components)

### Contexts

#### `src/contexts/AuthContext.tsx`
- **Purpose**: Global authentication state management
- **State**:
  - `user`: Current logged-in user object
  - `isAuthenticated`: Boolean authentication status
- **Methods**:
  - `login(username, password)`: Authenticates user with demo credentials
  - `logout()`: Clears session and redirects to login
- **Features**:
  - Demo credential validation
  - Role-based permission assignment
  - Local storage session persistence
  - Toast notifications
  - Navigation integration
- **Helper Functions**:
  - `getRolePermissions(role)`: Returns permissions array for role

### Pages

#### `src/pages/Login.tsx`
- **Purpose**: User authentication page
- **Features**:
  - Username/password form
  - Demo credentials display
  - Form validation
  - Error handling
  - Auto-redirect if authenticated
  - Responsive design
  - Banking-themed UI

#### `src/pages/Dashboard.tsx`
- **Purpose**: Main dashboard after login
- **Features**:
  - Role-specific welcome message
  - Quick stats cards (4 metrics)
  - Recent activity table
  - Pending approvals section (for authorized roles)
  - Role-based content visibility
- **Data**: Mock data for demonstration

#### `src/pages/NotFound.tsx`
- **Purpose**: 404 error page
- **Features**:
  - User-friendly error message
  - Navigation back to dashboard
  - Consistent styling

#### `src/pages/Index.tsx`
- **Purpose**: Landing page (currently unused)
- **Note**: Project redirects to /login by default

### Types

#### `src/types/auth.ts`
- **Purpose**: TypeScript definitions for authentication
- **Types**:
  - `UserRole`: Union type of all roles
  - `User`: User object interface
  - `Permission`: Module permission interface
  - `DemoCredential`: Demo user credential interface
- **Constants**:
  - `DEMO_CREDENTIALS`: Array of 5 demo users with credentials

### Hooks

#### `src/hooks/use-mobile.tsx`
- **Purpose**: Detects mobile viewport
- **Returns**: Boolean indicating mobile screen size
- **Breakpoint**: < 768px

#### `src/hooks/use-toast.ts`
- **Purpose**: Toast notification hook
- **Methods**: toast(), dismiss()
- **Integration**: Works with Toaster components

### Utilities

#### `src/lib/utils.ts`
- **Purpose**: Helper utility functions
- **Functions**:
  - `cn()`: Class name merger using clsx + tailwind-merge
  - Ensures no conflicting Tailwind classes

## 🎨 Design System

### Color Palette
Defined in `src/index.css`:

**Light Mode**:
- Primary: `hsl(217, 91%, 60%)` - Banking blue
- Secondary: `hsl(210, 40%, 96%)` - Light gray
- Accent: `hsl(217, 91%, 60%)` - Blue accent
- Success: `hsl(142, 71%, 45%)` - Green
- Warning: `hsl(38, 92%, 50%)` - Orange
- Error: `hsl(0, 84%, 60%)` - Red

**Dark Mode**:
- Automatically adjusted using HSL color space
- Higher contrast ratios
- Accessible color combinations

### Typography
- System font stack with fallbacks
- Heading hierarchy (h1-h6)
- Body text sizes
- Consistent line heights

### Spacing
- Tailwind default spacing scale
- Consistent padding/margin
- Grid system for layouts

### Components
- Banking-grade professional design
- Consistent border radius
- Shadow system for depth
- Smooth transitions and animations

## 🔐 Authentication Flow

1. **Initial Load**:
   - `AuthContext` checks localStorage for session
   - If found, restores user state
   - If not found, user remains unauthenticated

2. **Login Process**:
   - User enters credentials in `Login.tsx`
   - `AuthContext.login()` validates against `DEMO_CREDENTIALS`
   - If valid, creates User object with role permissions
   - Stores user in state and localStorage
   - Redirects to `/dashboard`

3. **Route Protection**:
   - `ProtectedRoute` checks authentication status
   - Validates user role against `allowedRoles` prop
   - Redirects to `/login` if not authenticated
   - Redirects to `/dashboard` if role not allowed

4. **Logout**:
   - `AuthContext.logout()` clears user state
   - Removes localStorage session
   - Redirects to `/login`

## 🚦 Routing Structure

```
/ (root)
├── /login                    [Public] Login page
├── /dashboard               [Protected] Main dashboard
├── /users                   [Protected: super_admin, admin, head_department]
├── /customers               [Protected: All roles]
├── /accounts                [Protected: All roles]
├── /transactions            [Protected: All roles]
├── /approvals               [Protected: head_department, branch_manager]
├── /reports                 [Protected: All roles]
├── /teller                  [Protected: staff, branch_manager]
├── /settings                [Protected: super_admin]
├── /audit                   [Protected: super_admin]
├── /branches                [Protected: super_admin, admin]
└── /*                       [Public] 404 Not Found
```

## 👥 User Roles & Permissions

### Super Admin
- **Permissions**: Full system access
- **Modules**: users, branches, system, audit, dashboard, reports
- **Actions**: create, read, update, delete all entities
- **Cannot**: Authorize financial transactions (separation of duties)

### Admin
- **Permissions**: User and branch management, MIS reports
- **Modules**: users, branches, customers, accounts, transactions, reports
- **Actions**: create/read/update users, read all data
- **Cannot**: Delete system entities, access audit logs

### Head Department
- **Permissions**: Authorization, staff management
- **Modules**: users, customers, accounts, transactions, approvals, reports
- **Actions**: create/read/update entities, authorize high-value transactions
- **Special**: Maker-checker authorization role

### Branch Manager
- **Permissions**: Branch-level operations
- **Modules**: customers, accounts, transactions, approvals, teller, reports
- **Actions**: create/read/update branch data, authorize transactions
- **Special**: Teller oversight, transaction approvals

### Staff
- **Permissions**: Transaction initiation
- **Modules**: customers, accounts, transactions, teller, reports
- **Actions**: create/read only (maker role)
- **Cannot**: Authorize or approve (requires checker)

## 🔄 Maker-Checker Workflow

**Concept**: Dual authorization for critical operations

1. **Maker** (Staff): Initiates transaction/action
2. **Checker** (Manager/Head): Reviews and authorizes
3. **Transaction States**: pending → approved/rejected
4. **Implementation**: Future module will track approval status

## 🌐 API Integration (Future)

### Planned Backend Integration
- **Backend**: Django REST Framework
- **Database**: PostgreSQL
- **Auth**: JWT tokens
- **Gateway**: Nginx reverse proxy

### Current State
- Demo credentials (no backend)
- Local state management
- Ready for API integration

## 📦 Build & Deployment

### Development
```bash
npm run dev          # Start dev server (port 8080)
```

### Production
```bash
npm run build        # Build for production
npm run preview      # Preview production build
```

### Output
- Optimized bundle with code splitting
- Minified CSS and JS
- Tree-shaking for smaller bundle size
- Source maps for debugging

## 🧪 Code Quality

### TypeScript
- Strict mode enabled
- Type safety across all components
- Interface-driven development
- No implicit any

### ESLint
- React hooks rules
- Import ordering
- Unused variable detection
- Code consistency

### Best Practices
- Component composition
- Custom hooks for logic reuse
- Context for global state
- Separation of concerns
- Clean code principles

## 🔧 Key Dependencies

### Core
- `react` + `react-dom`: UI library
- `typescript`: Type safety
- `vite`: Build tool

### Routing & Data
- `react-router-dom`: Client-side routing
- `@tanstack/react-query`: Server state management

### UI & Styling
- `tailwindcss`: Utility-first CSS
- `@radix-ui/*`: Accessible UI primitives
- `lucide-react`: Icon library
- `sonner`: Toast notifications

### Forms & Validation
- `react-hook-form`: Form handling
- `zod`: Schema validation
- `@hookform/resolvers`: Form validation bridge

## 🚀 Next Development Steps

1. **Backend Integration**
   - Connect to Django API
   - Replace demo credentials with real auth
   - Implement JWT token management

2. **Module Implementation**
   - Customer (CIF) management pages
   - Account opening workflows
   - Transaction processing UI
   - Approval workflows
   - Reporting dashboards

3. **Advanced Features**
   - Real-time notifications
   - Audit trail logging
   - Advanced search and filters
   - Batch operations
   - Export functionality

4. **Security Enhancements**
   - OTP for sensitive operations
   - Session management
   - Device tracking
   - IP whitelisting

## 📚 Learning Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [React Router Guide](https://reactrouter.com)
- [Vite Guide](https://vitejs.dev/guide)

---

**Document Version**: 1.0  
**Last Updated**: 2025  
**Maintained By**: CoreBank Development Team
