/**
 * API Configuration for Core Banking System
 * All API endpoints are configured here for easy backend integration
 * API Gateway: Nginx (proxy_pass to respective microservices)
 */

// Base URL - Update this with your Nginx API Gateway URL
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// API Endpoints Configuration
export const API_ENDPOINTS = {
  // ==================== Authentication ====================
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh',
    VERIFY_OTP: '/auth/verify-otp',
    CHANGE_PASSWORD: '/auth/change-password',
    RESET_PASSWORD: '/auth/reset-password',
    SESSION_INFO: '/auth/session',
  },

  // ==================== User Management ====================
  USERS: {
    LIST: '/users',
    CREATE: '/users',
    GET: (id: string) => `/users/${id}`,
    UPDATE: (id: string) => `/users/${id}`,
    DELETE: (id: string) => `/users/${id}`,
    CHANGE_ROLE: (id: string) => `/users/${id}/role`,
    RESET_PASSWORD: (id: string) => `/users/${id}/reset-password`,
    ACTIVATE: (id: string) => `/users/${id}/activate`,
    DEACTIVATE: (id: string) => `/users/${id}/deactivate`,
  },

  // ==================== Customer (CIF) Management ====================
  CUSTOMERS: {
    LIST: '/customers',
    CREATE: '/customers',
    GET: (id: string) => `/customers/${id}`,
    UPDATE: (id: string) => `/customers/${id}`,
    DELETE: (id: string) => `/customers/${id}`,
    SEARCH: '/customers/search',
    KYC_UPLOAD: (id: string) => `/customers/${id}/kyc`,
    KYC_VERIFY: (id: string) => `/customers/${id}/kyc/verify`,
    RISK_ASSESSMENT: (id: string) => `/customers/${id}/risk-assessment`,
    DOCUMENTS: (id: string) => `/customers/${id}/documents`,
    ACCOUNTS: (id: string) => `/customers/${id}/accounts`,
  },

  // ==================== Account Management ====================
  ACCOUNTS: {
    LIST: '/accounts',
    CREATE: '/accounts',
    GET: (id: string) => `/accounts/${id}`,
    UPDATE: (id: string) => `/accounts/${id}`,
    CLOSE: (id: string) => `/accounts/${id}/close`,
    FREEZE: (id: string) => `/accounts/${id}/freeze`,
    UNFREEZE: (id: string) => `/accounts/${id}/unfreeze`,
    BALANCE: (id: string) => `/accounts/${id}/balance`,
    STATEMENT: (id: string) => `/accounts/${id}/statement`,
    MINI_STATEMENT: (id: string) => `/accounts/${id}/mini-statement`,
    PASSBOOK: (id: string) => `/accounts/${id}/passbook`,
    INTEREST_CALCULATION: (id: string) => `/accounts/${id}/interest`,
    
    // Account Types
    SAVINGS: '/accounts/savings',
    CURRENT: '/accounts/current',
    FD: '/accounts/fixed-deposit',
    RD: '/accounts/recurring-deposit',
    LOAN: '/accounts/loan',
  },

  // ==================== Transaction Processing ====================
  TRANSACTIONS: {
    LIST: '/transactions',
    CREATE: '/transactions',
    GET: (id: string) => `/transactions/${id}`,
    REVERSE: (id: string) => `/transactions/${id}/reverse`,
    STATUS: (id: string) => `/transactions/${id}/status`,
    
    // Transaction Types
    DEBIT: '/transactions/debit',
    CREDIT: '/transactions/credit',
    TRANSFER: '/transactions/transfer',
    CASH_DEPOSIT: '/transactions/cash-deposit',
    CASH_WITHDRAWAL: '/transactions/cash-withdrawal',
    CHEQUE_DEPOSIT: '/transactions/cheque-deposit',
    CHEQUE_CLEARING: '/transactions/cheque-clearing',
  },

  // ==================== Money Transfer ====================
  TRANSFERS: {
    // Internal Transfer
    INTERNAL: '/transfers/internal',
    
    // NEFT (National Electronic Funds Transfer)
    NEFT: {
      INITIATE: '/transfers/neft',
      STATUS: (id: string) => `/transfers/neft/${id}/status`,
      VALIDATE_BENEFICIARY: '/transfers/neft/validate-beneficiary',
    },
    
    // RTGS (Real Time Gross Settlement)
    RTGS: {
      INITIATE: '/transfers/rtgs',
      STATUS: (id: string) => `/transfers/rtgs/${id}/status`,
      VALIDATE_BENEFICIARY: '/transfers/rtgs/validate-beneficiary',
    },
    
    // IMPS (Immediate Payment Service)
    IMPS: {
      INITIATE: '/transfers/imps',
      STATUS: (id: string) => `/transfers/imps/${id}/status`,
      VALIDATE_BENEFICIARY: '/transfers/imps/validate-beneficiary',
    },
    
    // UPI (Unified Payments Interface)
    UPI: {
      INITIATE: '/transfers/upi',
      STATUS: (id: string) => `/transfers/upi/${id}/status`,
      VALIDATE_VPA: '/transfers/upi/validate-vpa',
    },
  },

  // ==================== Loan Management ====================
  LOANS: {
    LIST: '/loans',
    CREATE: '/loans',
    GET: (id: string) => `/loans/${id}`,
    UPDATE: (id: string) => `/loans/${id}`,
    APPROVE: (id: string) => `/loans/${id}/approve`,
    REJECT: (id: string) => `/loans/${id}/reject`,
    DISBURSE: (id: string) => `/loans/${id}/disburse`,
    CLOSE: (id: string) => `/loans/${id}/close`,
    
    // Loan Types
    PERSONAL: '/loans/personal',
    HOME: '/loans/home',
    AUTO: '/loans/auto',
    EDUCATION: '/loans/education',
    BUSINESS: '/loans/business',
    GOLD: '/loans/gold',
    AGRICULTURE: '/loans/agriculture',
    
    // Loan Operations
    EMI_SCHEDULE: (id: string) => `/loans/${id}/emi-schedule`,
    REPAYMENT: (id: string) => `/loans/${id}/repayment`,
    PREPAYMENT: (id: string) => `/loans/${id}/prepayment`,
    OVERDUE: '/loans/overdue',
    INTEREST_CALCULATION: (id: string) => `/loans/${id}/interest`,
  },

  // ==================== Fixed Deposit (FD) ====================
  FIXED_DEPOSITS: {
    LIST: '/fixed-deposits',
    CREATE: '/fixed-deposits',
    GET: (id: string) => `/fixed-deposits/${id}`,
    RENEW: (id: string) => `/fixed-deposits/${id}/renew`,
    PREMATURE_CLOSURE: (id: string) => `/fixed-deposits/${id}/premature-close`,
    INTEREST_CALCULATION: (id: string) => `/fixed-deposits/${id}/interest`,
    MATURITY_INSTRUCTION: (id: string) => `/fixed-deposits/${id}/maturity-instruction`,
  },

  // ==================== Recurring Deposit (RD) ====================
  RECURRING_DEPOSITS: {
    LIST: '/recurring-deposits',
    CREATE: '/recurring-deposits',
    GET: (id: string) => `/recurring-deposits/${id}`,
    INSTALLMENT_PAYMENT: (id: string) => `/recurring-deposits/${id}/installment`,
    MISS_INSTALLMENT: (id: string) => `/recurring-deposits/${id}/miss-installment`,
    MATURITY: (id: string) => `/recurring-deposits/${id}/maturity`,
  },

  // ==================== SIP (Systematic Investment Plan) ====================
  SIP: {
    LIST: '/sip',
    CREATE: '/sip',
    GET: (id: string) => `/sip/${id}`,
    UPDATE: (id: string) => `/sip/${id}`,
    PAUSE: (id: string) => `/sip/${id}/pause`,
    RESUME: (id: string) => `/sip/${id}/resume`,
    CANCEL: (id: string) => `/sip/${id}/cancel`,
    INSTALLMENT_HISTORY: (id: string) => `/sip/${id}/installments`,
    RETURNS: (id: string) => `/sip/${id}/returns`,
  },

  // ==================== Forex Operations ====================
  FOREX: {
    LIST: '/forex',
    CREATE: '/forex',
    GET: (id: string) => `/forex/${id}`,
    RATES: '/forex/rates',
    CURRENCY_PAIRS: '/forex/currency-pairs',
    BUY: '/forex/buy',
    SELL: '/forex/sell',
    EXCHANGE: '/forex/exchange',
    HISTORY: '/forex/history',
  },

  // ==================== NFT Transactions ====================
  NFT: {
    LIST: '/nft',
    CREATE: '/nft',
    GET: (id: string) => `/nft/${id}`,
    MINT: '/nft/mint',
    TRANSFER: '/nft/transfer',
    BURN: '/nft/burn',
    METADATA: (id: string) => `/nft/${id}/metadata`,
    OWNERSHIP: (id: string) => `/nft/${id}/ownership`,
    HISTORY: (id: string) => `/nft/${id}/history`,
  },

  // ==================== Teller Operations ====================
  TELLER: {
    OPEN_COUNTER: '/teller/open',
    CLOSE_COUNTER: '/teller/close',
    CASH_POSITION: '/teller/cash-position',
    CASH_RECEIVE: '/teller/cash-receive',
    CASH_TRANSFER: '/teller/cash-transfer',
    VAULT_BALANCE: '/teller/vault-balance',
    EOD_REPORT: '/teller/eod-report',
    DENOMINATION: '/teller/denomination',
  },

  // ==================== Approvals (Maker-Checker) ====================
  APPROVALS: {
    LIST: '/approvals',
    PENDING: '/approvals/pending',
    GET: (id: string) => `/approvals/${id}`,
    APPROVE: (id: string) => `/approvals/${id}/approve`,
    REJECT: (id: string) => `/approvals/${id}/reject`,
    HISTORY: '/approvals/history',
    MY_REQUESTS: '/approvals/my-requests',
  },

  // ==================== Reports & MIS ====================
  REPORTS: {
    DAILY_TRANSACTIONS: '/reports/daily-transactions',
    BRANCH_PERFORMANCE: '/reports/branch-performance',
    CUSTOMER_REPORT: '/reports/customer',
    ACCOUNT_REPORT: '/reports/account',
    LOAN_REPORT: '/reports/loan',
    TRIAL_BALANCE: '/reports/trial-balance',
    PROFIT_LOSS: '/reports/profit-loss',
    BALANCE_SHEET: '/reports/balance-sheet',
    CASH_FLOW: '/reports/cash-flow',
    REGULATORY: '/reports/regulatory',
    AUDIT_TRAIL: '/reports/audit-trail',
    EXPORT: '/reports/export',
  },

  // ==================== Branches ====================
  BRANCHES: {
    LIST: '/branches',
    CREATE: '/branches',
    GET: (id: string) => `/branches/${id}`,
    UPDATE: (id: string) => `/branches/${id}`,
    DELETE: (id: string) => `/branches/${id}`,
    ACTIVATE: (id: string) => `/branches/${id}/activate`,
    DEACTIVATE: (id: string) => `/branches/${id}/deactivate`,
  },

  // ==================== Audit & Logs ====================
  AUDIT: {
    LIST: '/audit',
    GET: (id: string) => `/audit/${id}`,
    SEARCH: '/audit/search',
    EXPORT: '/audit/export',
  },

  // ==================== System Settings ====================
  SETTINGS: {
    GET: '/settings',
    UPDATE: '/settings',
    INTEREST_RATES: '/settings/interest-rates',
    CHARGES: '/settings/charges',
    LIMITS: '/settings/limits',
    HOLIDAYS: '/settings/holidays',
    BRANCH_PARAMETERS: '/settings/branch-parameters',
  },
};

// API Request Headers
export const getAuthHeaders = () => {
  const token = localStorage.getItem('cbs_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

// API Error Messages
export const API_ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'Unauthorized. Please login again.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'Resource not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Validation error. Please check your input.',
  TIMEOUT: 'Request timeout. Please try again.',
};
