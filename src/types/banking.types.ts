/**
 * Core Banking System Type Definitions
 */

// ==================== Customer (CIF) Types ====================
export interface Customer {
  id: string;
  cifNumber: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  email: string;
  phone: string;
  pan?: string;
  aadhar?: string;
  address: Address;
  kycStatus: 'pending' | 'verified' | 'rejected';
  riskCategory: 'low' | 'medium' | 'high';
  customerType: 'individual' | 'corporate' | 'joint';
  status: 'active' | 'inactive' | 'dormant' | 'frozen';
  branchId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

// ==================== Account Types ====================
export interface Account {
  id: string;
  accountNumber: string;
  accountType: 'savings' | 'current' | 'fd' | 'rd' | 'loan';
  customerId: string;
  customerName: string;
  balance: number;
  availableBalance: number;
  currency: string;
  status: 'active' | 'inactive' | 'frozen' | 'closed';
  branchId: string;
  branchName: string;
  openingDate: string;
  closingDate?: string;
  interestRate?: number;
  minimumBalance?: number;
  overdraftLimit?: number;
  lastTransactionDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SavingsAccount extends Account {
  accountType: 'savings';
  interestRate: number;
  minimumBalance: number;
  interestCalculationMethod: 'daily' | 'monthly' | 'quarterly';
}

export interface CurrentAccount extends Account {
  accountType: 'current';
  overdraftLimit: number;
  averageMonthlyBalance: number;
}

export interface FixedDeposit extends Account {
  accountType: 'fd';
  principalAmount: number;
  interestRate: number;
  tenure: number; // in months
  maturityDate: string;
  maturityAmount: number;
  autoRenew: boolean;
  prematurePenalty: number;
}

export interface RecurringDeposit extends Account {
  accountType: 'rd';
  monthlyInstallment: number;
  interestRate: number;
  tenure: number; // in months
  maturityDate: string;
  maturityAmount: number;
  missedInstallments: number;
}

// ==================== Transaction Types ====================
export interface Transaction {
  id: string;
  transactionId: string;
  type: TransactionType;
  accountId: string;
  accountNumber: string;
  amount: number;
  currency: string;
  description: string;
  referenceNumber?: string;
  status: TransactionStatus;
  transactionDate: string;
  valueDate: string;
  balance: number;
  debit?: number;
  credit?: number;
  channel: 'branch' | 'atm' | 'online' | 'mobile' | 'api';
  initiatedBy: string;
  approvedBy?: string;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

export type TransactionType =
  | 'cash_deposit'
  | 'cash_withdrawal'
  | 'transfer'
  | 'neft'
  | 'rtgs'
  | 'imps'
  | 'upi'
  | 'cheque_deposit'
  | 'cheque_clearing'
  | 'interest_credit'
  | 'charges'
  | 'reversal';

export type TransactionStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'reversed'
  | 'rejected';

// ==================== Money Transfer Types ====================
export interface MoneyTransfer {
  id: string;
  transferType: 'internal' | 'neft' | 'rtgs' | 'imps' | 'upi';
  fromAccountId: string;
  fromAccountNumber: string;
  toAccountNumber: string;
  toBankIfsc?: string;
  toBankName?: string;
  toBeneficiaryName: string;
  amount: number;
  charges: number;
  totalAmount: number;
  purpose: string;
  referenceNumber: string;
  status: TransactionStatus;
  initiatedAt: string;
  completedAt?: string;
  failureReason?: string;
}

// ==================== Loan Types ====================
export interface Loan {
  id: string;
  loanAccountNumber: string;
  loanType: LoanType;
  customerId: string;
  customerName: string;
  principalAmount: number;
  sanctionedAmount: number;
  disbursedAmount: number;
  outstandingAmount: number;
  interestRate: number;
  tenure: number; // in months
  emiAmount: number;
  processingFee: number;
  status: LoanStatus;
  purpose: string;
  disbursementDate?: string;
  firstEmiDate?: string;
  lastEmiDate?: string;
  closureDate?: string;
  collateral?: string;
  guarantor?: string;
  branchId: string;
  createdAt: string;
  updatedAt: string;
}

export type LoanType =
  | 'personal'
  | 'home'
  | 'auto'
  | 'education'
  | 'business'
  | 'gold'
  | 'agriculture';

export type LoanStatus =
  | 'draft'
  | 'pending_approval'
  | 'approved'
  | 'rejected'
  | 'disbursed'
  | 'active'
  | 'overdue'
  | 'closed'
  | 'written_off';

export interface LoanEMI {
  emiNumber: number;
  dueDate: string;
  principal: number;
  interest: number;
  totalAmount: number;
  paidAmount: number;
  status: 'pending' | 'paid' | 'overdue' | 'partial';
  paymentDate?: string;
  penalInterest?: number;
}

// ==================== SIP Types ====================
export interface SIP {
  id: string;
  sipNumber: string;
  customerId: string;
  customerName: string;
  accountId: string;
  fundName: string;
  installmentAmount: number;
  frequency: 'monthly' | 'quarterly' | 'yearly';
  startDate: string;
  endDate?: string;
  totalInstallments: number;
  completedInstallments: number;
  totalInvested: number;
  currentValue: number;
  returns: number;
  status: 'active' | 'paused' | 'cancelled' | 'completed';
  createdAt: string;
  updatedAt: string;
}

// ==================== Forex Types ====================
export interface ForexTransaction {
  id: string;
  transactionId: string;
  type: 'buy' | 'sell' | 'exchange';
  fromCurrency: string;
  toCurrency: string;
  fromAmount: number;
  toAmount: number;
  exchangeRate: number;
  charges: number;
  customerId: string;
  accountId: string;
  purpose: string;
  status: TransactionStatus;
  transactionDate: string;
  createdAt: string;
}

export interface ForexRate {
  currencyPair: string;
  baseCurrency: string;
  quoteCurrency: string;
  buyRate: number;
  sellRate: number;
  midRate: number;
  lastUpdated: string;
}

// ==================== NFT Types ====================
export interface NFTTransaction {
  id: string;
  tokenId: string;
  type: 'mint' | 'transfer' | 'burn';
  fromAddress?: string;
  toAddress?: string;
  metadata: NFTMetadata;
  transactionHash: string;
  status: 'pending' | 'confirmed' | 'failed';
  customerId: string;
  accountId: string;
  createdAt: string;
}

export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: Record<string, any>;
}

// ==================== Approval (Maker-Checker) Types ====================
export interface Approval {
  id: string;
  approvalType: string;
  entityType: string;
  entityId: string;
  action: 'create' | 'update' | 'delete' | 'approve';
  requestData: any;
  status: 'pending' | 'approved' | 'rejected';
  priority: 'low' | 'medium' | 'high' | 'critical';
  makerId: string;
  makerName: string;
  checkerId?: string;
  checkerName?: string;
  makerComments?: string;
  checkerComments?: string;
  requestedAt: string;
  respondedAt?: string;
  expiresAt?: string;
}

// ==================== Teller Types ====================
export interface TellerSession {
  id: string;
  tellerId: string;
  tellerName: string;
  branchId: string;
  openingBalance: number;
  currentBalance: number;
  closingBalance?: number;
  totalDeposits: number;
  totalWithdrawals: number;
  totalTransactions: number;
  status: 'open' | 'closed';
  openedAt: string;
  closedAt?: string;
}

export interface CashDenomination {
  note2000: number;
  note500: number;
  note200: number;
  note100: number;
  note50: number;
  note20: number;
  note10: number;
  coin10: number;
  coin5: number;
  coin2: number;
  coin1: number;
  total: number;
}

// ==================== Report Types ====================
export interface Report {
  id: string;
  reportType: string;
  title: string;
  description: string;
  format: 'pdf' | 'excel' | 'csv';
  url: string;
  generatedBy: string;
  generatedAt: string;
  parameters: Record<string, any>;
}

// ==================== Branch Types ====================
export interface Branch {
  id: string;
  branchCode: string;
  branchName: string;
  ifscCode: string;
  micrCode?: string;
  address: Address;
  phone: string;
  email: string;
  managerId?: string;
  managerName?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

// ==================== Dashboard Statistics ====================
export interface DashboardStats {
  totalCustomers: number;
  totalAccounts: number;
  totalDeposits: number;
  totalLoans: number;
  todayTransactions: number;
  pendingApprovals: number;
  activeUsers: number;
  branchPerformance?: number;
}
