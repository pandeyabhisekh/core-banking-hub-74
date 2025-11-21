# Core Banking System - API Documentation

## Overview
This document provides comprehensive API documentation for the Core Banking System (CBS). All APIs are designed to work with Django backend through an Nginx API Gateway.

## Base Configuration
- **API Gateway**: Nginx
- **Base URL**: `http://localhost:8000/api` (configurable in `.env`)
- **Authentication**: JWT Bearer Token
- **Content-Type**: `application/json`

## Environment Variables
```bash
VITE_API_BASE_URL=http://localhost:8000/api
```

## Authentication

### Headers
All authenticated requests must include:
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "string",
  "password": "string"
}

Response:
{
  "success": true,
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": "string",
      "username": "string",
      "email": "string",
      "role": "string"
    }
  }
}
```

---

## Customer Management (CIF)

### List Customers
```http
GET /api/customers?page=1&limit=20&search=name
```

### Create Customer
```http
POST /api/customers
{
  "firstName": "string",
  "lastName": "string",
  "dateOfBirth": "YYYY-MM-DD",
  "email": "string",
  "phone": "string",
  "pan": "string",
  "aadhar": "string",
  "address": {
    "line1": "string",
    "city": "string",
    "state": "string",
    "pincode": "string",
    "country": "string"
  },
  "customerType": "individual"
}
```

### Get Customer Details
```http
GET /api/customers/{customerId}
```

### Update Customer
```http
PUT /api/customers/{customerId}
```

### Upload KYC Documents
```http
POST /api/customers/{customerId}/kyc
Content-Type: multipart/form-data

FormData:
- document_type: "pan" | "aadhar" | "address_proof"
- file: <binary>
```

---

## Account Management

### Create Savings Account
```http
POST /api/accounts/savings
{
  "customerId": "string",
  "branchId": "string",
  "initialDeposit": number,
  "accountType": "savings",
  "nomineeDetails": {
    "name": "string",
    "relationship": "string"
  }
}
```

### Create Current Account
```http
POST /api/accounts/current
{
  "customerId": "string",
  "branchId": "string",
  "overdraftLimit": number,
  "businessType": "string"
}
```

### Create Fixed Deposit
```http
POST /api/accounts/fixed-deposit
{
  "customerId": "string",
  "principalAmount": number,
  "tenure": number,
  "interestRate": number,
  "autoRenew": boolean,
  "maturityInstruction": "reinvest" | "transfer" | "credit_savings"
}
```

### Get Account Balance
```http
GET /api/accounts/{accountId}/balance
```

### Get Account Statement
```http
GET /api/accounts/{accountId}/statement?from=YYYY-MM-DD&to=YYYY-MM-DD&format=pdf
```

### Freeze Account
```http
POST /api/accounts/{accountId}/freeze
{
  "reason": "string",
  "remarks": "string"
}
```

### Unfreeze Account
```http
POST /api/accounts/{accountId}/unfreeze
{
  "approvedBy": "string",
  "remarks": "string"
}
```

---

## Transaction Processing

### Cash Deposit
```http
POST /api/transactions/cash-deposit
{
  "accountId": "string",
  "amount": number,
  "denomination": {
    "note2000": number,
    "note500": number,
    "note100": number
  },
  "depositorName": "string",
  "remarks": "string"
}
```

### Cash Withdrawal
```http
POST /api/transactions/cash-withdrawal
{
  "accountId": "string",
  "amount": number,
  "verificationMethod": "passbook" | "kyc" | "biometric",
  "remarks": "string"
}
```

### Internal Transfer
```http
POST /api/transactions/transfer
{
  "fromAccountId": "string",
  "toAccountNumber": "string",
  "amount": number,
  "purpose": "string",
  "remarks": "string"
}
```

### Reverse Transaction
```http
POST /api/transactions/{transactionId}/reverse
{
  "reason": "string",
  "approvedBy": "string"
}
```

---

## Money Transfer

### NEFT Transfer
```http
POST /api/transfers/neft
{
  "fromAccountId": "string",
  "beneficiaryName": "string",
  "beneficiaryAccount": "string",
  "ifscCode": "string",
  "amount": number,
  "purpose": "string"
}

Response:
{
  "success": true,
  "data": {
    "transferId": "string",
    "referenceNumber": "string",
    "status": "pending",
    "estimatedCompletionTime": "ISO8601"
  }
}
```

### RTGS Transfer
```http
POST /api/transfers/rtgs
{
  "fromAccountId": "string",
  "beneficiaryName": "string",
  "beneficiaryAccount": "string",
  "ifscCode": "string",
  "amount": number,
  "purpose": "string"
}
```

### IMPS Transfer
```http
POST /api/transfers/imps
{
  "fromAccountId": "string",
  "beneficiaryAccount": "string",
  "ifscCode": "string",
  "amount": number,
  "purpose": "string"
}
```

### Validate Beneficiary
```http
POST /api/transfers/neft/validate-beneficiary
{
  "accountNumber": "string",
  "ifscCode": "string"
}

Response:
{
  "success": true,
  "data": {
    "accountHolderName": "string",
    "bankName": "string",
    "branchName": "string"
  }
}
```

---

## Loan Management

### Apply for Loan
```http
POST /api/loans/personal
{
  "customerId": "string",
  "loanAmount": number,
  "tenure": number,
  "purpose": "string",
  "employmentType": "salaried" | "self_employed",
  "monthlyIncome": number,
  "existingLiabilities": number,
  "collateral": {
    "type": "string",
    "value": number
  }
}
```

### Loan Types
- **Personal Loan**: `/api/loans/personal`
- **Home Loan**: `/api/loans/home`
- **Auto Loan**: `/api/loans/auto`
- **Education Loan**: `/api/loans/education`
- **Business Loan**: `/api/loans/business`
- **Gold Loan**: `/api/loans/gold`
- **Agriculture Loan**: `/api/loans/agriculture`

### Get EMI Schedule
```http
GET /api/loans/{loanId}/emi-schedule
```

### EMI Payment
```http
POST /api/loans/{loanId}/repayment
{
  "accountId": "string",
  "amount": number,
  "paymentMode": "debit_account" | "cash" | "cheque"
}
```

### Loan Prepayment
```http
POST /api/loans/{loanId}/prepayment
{
  "accountId": "string",
  "amount": number,
  "type": "partial" | "full"
}
```

### Approve Loan
```http
POST /api/loans/{loanId}/approve
{
  "sanctionedAmount": number,
  "interestRate": number,
  "tenure": number,
  "remarks": "string",
  "approvedBy": "string"
}
```

### Disburse Loan
```http
POST /api/loans/{loanId}/disburse
{
  "accountId": "string",
  "disbursementMode": "account_credit" | "cheque" | "dd",
  "remarks": "string"
}
```

---

## Fixed Deposit (FD)

### Create FD
```http
POST /api/fixed-deposits
{
  "customerId": "string",
  "principalAmount": number,
  "tenure": number,
  "interestRate": number,
  "autoRenew": boolean,
  "nomineeDetails": {
    "name": "string",
    "relationship": "string"
  }
}
```

### Premature Closure
```http
POST /api/fixed-deposits/{fdId}/premature-close
{
  "accountId": "string",
  "reason": "string"
}
```

### Renew FD
```http
POST /api/fixed-deposits/{fdId}/renew
{
  "tenure": number,
  "autoRenew": boolean
}
```

---

## Recurring Deposit (RD)

### Create RD
```http
POST /api/recurring-deposits
{
  "customerId": "string",
  "monthlyInstallment": number,
  "tenure": number,
  "interestRate": number
}
```

### Pay Installment
```http
POST /api/recurring-deposits/{rdId}/installment
{
  "accountId": "string",
  "amount": number
}
```

---

## SIP (Systematic Investment Plan)

### Create SIP
```http
POST /api/sip
{
  "customerId": "string",
  "accountId": "string",
  "fundName": "string",
  "installmentAmount": number,
  "frequency": "monthly",
  "startDate": "YYYY-MM-DD",
  "duration": number
}
```

### Pause SIP
```http
POST /api/sip/{sipId}/pause
```

### Resume SIP
```http
POST /api/sip/{sipId}/resume
```

### Get SIP Returns
```http
GET /api/sip/{sipId}/returns
```

---

## Forex Operations

### Get Exchange Rates
```http
GET /api/forex/rates?base=INR&quote=USD
```

### Buy Foreign Currency
```http
POST /api/forex/buy
{
  "accountId": "string",
  "fromCurrency": "INR",
  "toCurrency": "USD",
  "amount": number,
  "purpose": "travel" | "business" | "education"
}
```

### Sell Foreign Currency
```http
POST /api/forex/sell
{
  "accountId": "string",
  "fromCurrency": "USD",
  "toCurrency": "INR",
  "amount": number
}
```

---

## NFT Transactions

### Mint NFT
```http
POST /api/nft/mint
{
  "customerId": "string",
  "accountId": "string",
  "metadata": {
    "name": "string",
    "description": "string",
    "image": "string",
    "attributes": {}
  }
}
```

### Transfer NFT
```http
POST /api/nft/transfer
{
  "tokenId": "string",
  "fromAddress": "string",
  "toAddress": "string"
}
```

---

## Teller Operations

### Open Counter
```http
POST /api/teller/open
{
  "tellerId": "string",
  "branchId": "string",
  "openingBalance": number,
  "denomination": { }
}
```

### Close Counter
```http
POST /api/teller/close
{
  "tellerSessionId": "string",
  "closingBalance": number,
  "denomination": { }
}
```

### Get Cash Position
```http
GET /api/teller/cash-position
```

---

## Approvals (Maker-Checker)

### Get Pending Approvals
```http
GET /api/approvals/pending?role=head_department
```

### Approve Request
```http
POST /api/approvals/{approvalId}/approve
{
  "comments": "string",
  "additionalData": {}
}
```

### Reject Request
```http
POST /api/approvals/{approvalId}/reject
{
  "reason": "string",
  "comments": "string"
}
```

---

## Reports

### Generate Daily Transaction Report
```http
POST /api/reports/daily-transactions
{
  "date": "YYYY-MM-DD",
  "branchId": "string",
  "format": "pdf" | "excel"
}
```

### Branch Performance Report
```http
GET /api/reports/branch-performance?from=YYYY-MM-DD&to=YYYY-MM-DD&branchId=string
```

### Trial Balance
```http
GET /api/reports/trial-balance?date=YYYY-MM-DD
```

### Export Report
```http
POST /api/reports/export
{
  "reportType": "string",
  "format": "pdf" | "excel" | "csv",
  "filters": {}
}
```

---

## Error Responses

### Standard Error Format
```json
{
  "success": false,
  "error": "Error message",
  "statusCode": 400,
  "details": {}
}
```

### Common Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Internal Server Error

---

## Nginx Configuration

```nginx
# /etc/nginx/conf.d/cbs-api-gateway.conf

upstream django_backend {
    server 127.0.0.1:8000;
}

server {
    listen 80;
    server_name api.corebank.local;

    # API Gateway
    location /api/ {
        proxy_pass http://django_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # CORS Headers
        add_header 'Access-Control-Allow-Origin' '*' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'Authorization, Content-Type' always;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # Rate Limiting
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=100r/m;
    location /api/ {
        limit_req zone=api_limit burst=20 nodelay;
    }
}
```

---

## Testing APIs

### Using cURL
```bash
# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"staff","password":"staff@123"}'

# Get customers (with auth token)
curl -X GET http://localhost:8000/api/customers \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Using Postman
1. Import the API collection
2. Set environment variable `API_BASE_URL`
3. Use `{{API_BASE_URL}}/customers` format
4. Set Authorization header

---

## Rate Limits
- **Authentication**: 5 requests per minute
- **Standard APIs**: 100 requests per minute
- **Reporting APIs**: 20 requests per minute

---

## Support
For API support, contact: api-support@corebank.local
