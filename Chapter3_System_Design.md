# Chapter 3: System Design

## Table of Contents
- [3.1 Design Approach](#31-design-approach)
- [3.2 Detail Design](#32-detail-design)
  - [3.2.1 System Architecture](#321-system-architecture)
  - [3.2.2 Database Design](#322-database-design)
  - [3.2.3 User Interface Design](#323-user-interface-design)
  - [3.2.4 API Design](#324-api-design)
  - [3.2.5 Security Design](#325-security-design)
  - [3.2.6 AI Integration Design](#326-ai-integration-design)

---

## 3.1 Design Approach

**Selected Approach: Object-Oriented Design with Component-Based Architecture**

**Rationale for Object-Oriented Approach:**

**1. Modularity and Reusability:**
- **Component-Based Architecture:** React.js components promote reusability across different features
- **Object Encapsulation:** Each component encapsulates its state, logic, and presentation
- **Inheritance Patterns:** Base components extended for specialized functionality (e.g., PolicyBase → CSRPolicy)
- **Code Reusability:** Common components (Header, Footer, AIDisclaimer) used across multiple pages

**2. Maintainability and Scalability:**
- **Separation of Concerns:** Clear distinction between UI components, business logic, and data layers
- **Single Responsibility Principle:** Each component handles specific functionality
- **Open/Closed Principle:** Components open for extension, closed for modification
- **Dependency Injection:** Services injected through React Context and custom hooks

**3. Domain-Driven Design:**
- **Entity Modeling:** User, Activity, Document entities with clear relationships
- **Service Layer:** APIService, ActivityTracker, PreferencesService for business logic
- **Repository Pattern:** Database models abstract data access complexity
- **Domain Services:** Legal research, document generation, compliance management services

**4. Design Patterns Implementation:**
- **Model-View-Controller (MVC):** React components (View), custom hooks (Controller), MongoDB models (Model)
- **Observer Pattern:** React state management and context providers
- **Factory Pattern:** Dynamic component rendering based on document types
- **Strategy Pattern:** Different AI prompt strategies for various legal documents
- **Facade Pattern:** APIService provides simplified interface to Google Gemini API

**Advantages of Object-Oriented Approach:**
- **Abstraction:** Complex AI integration hidden behind simple interfaces
- **Polymorphism:** Different document types handled through common interfaces
- **Encapsulation:** Component state and logic contained within boundaries
- **Inheritance:** Base functionality extended for specialized features

---

## 3.2 Detail Design

### 3.2.1 System Architecture

**Multi-Tier Architecture Design:**

**1. Presentation Layer (Frontend - React.js)**
```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                       │
├─────────────────────────────────────────────────────────────┤
│  React Components:                                          │
│  ├── Pages: HomePage, Tools, Profile, etc.                 │
│  ├── Features: ComplianceCalendar, PolicyDrafting, etc.    │
│  ├── Common: Header, Footer, AIDisclaimer                  │
│  ├── Utils: PDFGenerator, WordGenerator, Export            │
│  └── Context: ThemeContext, PreferencesContext             │
├─────────────────────────────────────────────────────────────┤
│  State Management:                                          │
│  ├── React Hooks: useState, useEffect, useContext          │
│  ├── Custom Hooks: useActivityTracker, usePreferences      │
│  └── Context Providers: Theme, Preferences, Auth           │
└─────────────────────────────────────────────────────────────┘
```

**2. Business Logic Layer (Backend - Node.js/Express)**
```
┌─────────────────────────────────────────────────────────────┐
│                   BUSINESS LOGIC LAYER                     │
├─────────────────────────────────────────────────────────────┤
│  Controllers:                                               │
│  ├── AuthController: Registration, login, OTP verification │
│  ├── ActivityController: User activity tracking            │
│  ├── ProfileController: User profile management            │
│  └── ContactController: Contact form handling              │
├─────────────────────────────────────────────────────────────┤
│  Services:                                                  │
│  ├── EmailService: OTP and notification emails             │
│  ├── ValidationService: Input validation and sanitization  │
│  ├── ActivityTracker: User behavior analytics              │
│  └── SecurityService: Authentication and authorization     │
├─────────────────────────────────────────────────────────────┤
│  Middleware:                                                │
│  ├── AuthMiddleware: JWT token validation                  │
│  ├── ErrorMiddleware: Global error handling                │
│  └── ValidationMiddleware: Request validation              │
└─────────────────────────────────────────────────────────────┘
```

**3. Data Access Layer (Database - MongoDB)**
```
┌─────────────────────────────────────────────────────────────┐
│                    DATA ACCESS LAYER                       │
├─────────────────────────────────────────────────────────────┤
│  Models:                                                    │
│  ├── User Model: Profile, preferences, authentication      │
│  ├── Activity Model: User actions, document generation     │
│  └── Contact Model: Contact form submissions               │
├─────────────────────────────────────────────────────────────┤
│  Database Operations:                                       │
│  ├── CRUD Operations: Create, Read, Update, Delete         │
│  ├── Aggregation Pipelines: Analytics and reporting        │
│  ├── Indexing Strategy: Performance optimization           │
│  └── Connection Pooling: Efficient resource management     │
└─────────────────────────────────────────────────────────────┘
```

**4. External Integration Layer**
```
┌─────────────────────────────────────────────────────────────┐
│                 EXTERNAL INTEGRATION LAYER                 │
├─────────────────────────────────────────────────────────────┤
│  AI Services:                                               │
│  ├── Google Gemini 2.0 Flash API: Content generation       │
│  ├── Prompt Engineering: Legal domain-specific prompts     │
│  ├── Response Processing: Content formatting and parsing   │
│  └── Error Handling: Retry logic and fallback mechanisms   │
├─────────────────────────────────────────────────────────────┤
│  Authentication Services:                                   │
│  ├── Firebase Auth: Google OAuth integration               │
│  ├── JWT Service: Token generation and validation          │
│  └── OTP Service: Email-based verification                 │
├─────────────────────────────────────────────────────────────┤
│  Communication Services:                                    │
│  ├── Email Service: Nodemailer integration                 │
│  ├── File Export: PDF and Word document generation         │
│  └── Cloud Storage: Document and asset management          │
└─────────────────────────────────────────────────────────────┘
```

**Architecture Patterns:**
- **Microservices Ready:** Modular design supports future microservices migration
- **API-First Design:** RESTful APIs enable multiple client applications
- **Event-Driven Architecture:** Activity tracking through event publishing
- **Caching Strategy:** Redis integration for session and response caching
- **Load Balancing:** Horizontal scaling through load balancers

### 3.2.2 Database Design

**MongoDB Document Structure:**

**1. User Collection:**
```javascript
{
  _id: ObjectId,
  username: String,
  email: String (unique, indexed),
  phone: String,
  password: String (hashed),
  isAdmin: Boolean,
  isEmailVerified: Boolean,
  
  // Profile Information
  profileImage: String,
  designation: String,
  companyName: String,
  companyType: String,
  cin: String,
  address: String,
  
  // User Preferences
  preferences: {
    autoFillForms: Boolean,
    defaultQuarters: [String],
    darkModePreference: String
  },
  
  // Authentication & Security
  otp: String,
  otpExpiry: Date,
  otpAttempts: Number,
  failedLoginAttempts: Number,
  accountLockedUntil: Date,
  
  // Activity Tracking
  firstLoginDate: Date,
  lastLoginDate: Date (indexed),
  loginCount: Number,
  
  timestamps: { createdAt: Date, updatedAt: Date }
}
```

**2. Activity Collection:**
```javascript
{
  _id: ObjectId,
  userId: ObjectId (indexed, ref: User),
  username: String,
  email: String,
  
  // Activity Classification
  activityType: String (enum: [
    'compliance_calendar',
    'policy_generation',
    'document_generation',
    'meeting_assistance',
    'notice_reply',
    'feature_usage'
  ]),
  feature: String,
  action: String,
  
  // Data Storage
  inputData: Mixed,
  outputData: Mixed,
  metadata: Mixed,
  
  // Session Information
  sessionId: String,
  ipAddress: String,
  userAgent: String,
  
  timestamp: Date (indexed, TTL: 1 year),
  createdAt: Date,
  updatedAt: Date
}
```

**3. Contact Collection:**
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  subject: String,
  message: String,
  status: String (enum: ['new', 'in_progress', 'resolved']),
  createdAt: Date,
  updatedAt: Date
}
```

**Database Optimization:**
- **Indexing Strategy:** Compound indexes on userId + timestamp, email uniqueness
- **Sharding:** Horizontal partitioning based on userId for scalability
- **Aggregation Pipelines:** Efficient data analysis and reporting queries
- **Connection Pooling:** Mongoose connection pool for optimal performance
- **Data Retention:** TTL indexes for automatic cleanup of old activity logs

### 3.2.3 User Interface Design

**Component Hierarchy:**

**1. Application Structure:**
```
App
├── ThemeProvider
├── PreferencesProvider
├── Router
│   ├── Layout
│   │   ├── Header (Navigation, Theme Toggle, User Menu)
│   │   ├── Main Content (Route-based Components)
│   │   └── Footer (Links, Copyright, Social Media)
│   └── Routes
│       ├── Public Routes (Home, About, Contact, Login, Register)
│       ├── Protected Routes (Tools, Profile, Features)
│       └── Feature Routes (All AI-powered tools)
```

**2. Design System Components:**

**Base Components:**
- **Cards:** input-card, output-card with consistent styling
- **Forms:** form-group, form-label, form-control with validation
- **Buttons:** Primary, secondary, export buttons with loading states
- **Navigation:** Breadcrumbs, pagination, category filters
- **Feedback:** Loading spinners, progress bars, toast notifications

**Feature Components:**
- **Document Generators:** Policy drafting, agreement creation, notice replies
- **Interactive Workflows:** Step-by-step processes with progress tracking
- **Export Components:** PDF, Word, clipboard copy functionality
- **AI Integration:** Response display with ReactMarkdown formatting

**3. Responsive Design Strategy:**
```css
/* Mobile First Approach */
.container {
  /* Mobile: 320px - 768px */
  padding: 1rem;
}

@media (min-width: 768px) {
  /* Tablet: 768px - 1024px */
  .container { padding: 2rem; }
}

@media (min-width: 1024px) {
  /* Desktop: 1024px+ */
  .container { padding: 3rem; }
}
```

**4. Theme System:**
```css
:root {
  /* Light Theme */
  --primary-color: #2563eb;
  --secondary-color: #64748b;
  --background-color: #ffffff;
  --text-color: #1e293b;
  --card-bg: #f8fafc;
}

[data-theme="dark"] {
  /* Dark Theme */
  --primary-color: #3b82f6;
  --secondary-color: #94a3b8;
  --background-color: #0f172a;
  --text-color: #f1f5f9;
  --card-bg: #1e293b;
}
```

### 3.2.4 API Design

**RESTful API Structure:**

**1. Authentication Endpoints:**
```
POST   /api/auth/register        - User registration
POST   /api/auth/verify-otp      - OTP verification
POST   /api/auth/resend-otp      - Resend OTP
POST   /api/auth/login           - User login
POST   /api/auth/logout          - User logout
POST   /api/auth/forgot-password - Password reset
POST   /api/auth/reset-password  - Password update
GET    /api/auth/me              - Get current user
```

**2. User Management Endpoints:**
```
GET    /api/users/profile        - Get user profile
PUT    /api/users/profile        - Update profile
PUT    /api/users/preferences    - Update preferences
POST   /api/users/upload-avatar  - Upload profile image
DELETE /api/users/account        - Delete account
```

**3. Activity Tracking Endpoints:**
```
POST   /api/activity/track       - Track user activity
GET    /api/activity/history     - Get user activity history
GET    /api/activity/analytics   - Get usage analytics
DELETE /api/activity/clear       - Clear activity history
```

**4. Contact & Support Endpoints:**
```
POST   /api/form/contact         - Submit contact form
GET    /api/form/contact         - Get contact submissions (admin)
PUT    /api/form/contact/:id     - Update contact status (admin)
```

**API Response Format:**
```javascript
// Success Response
{
  success: true,
  data: { /* response data */ },
  message: "Operation completed successfully",
  timestamp: "2024-01-01T00:00:00.000Z"
}

// Error Response
{
  success: false,
  error: {
    code: "VALIDATION_ERROR",
    message: "Invalid input data",
    details: { /* field-specific errors */ }
  },
  timestamp: "2024-01-01T00:00:00.000Z"
}
```

### 3.2.5 Security Design

**Security Architecture:**

**1. Authentication & Authorization:**
```javascript
// JWT Token Structure
{
  header: {
    alg: "HS256",
    typ: "JWT"
  },
  payload: {
    userId: "user_id",
    email: "user@example.com",
    isAdmin: false,
    iat: timestamp,
    exp: timestamp + 30_days
  },
  signature: "HMAC_SHA256_signature"
}
```

**2. Data Protection:**
- **Encryption at Rest:** AES-256 encryption for sensitive data
- **Encryption in Transit:** HTTPS/TLS 1.3 for all communications
- **Password Hashing:** bcrypt with salt rounds = 12
- **API Key Security:** Environment variables with rotation policy

**3. Input Validation & Sanitization:**
```javascript
// Zod Schema Example
const userRegistrationSchema = z.object({
  username: z.string().min(3).max(50).regex(/^[a-zA-Z0-9_]+$/),
  email: z.string().email(),
  phone: z.string().regex(/^[0-9]{10}$/),
  password: z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
});
```

**4. Security Headers:**
```javascript
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"]
    }
  },
  hsts: { maxAge: 31536000, includeSubDomains: true }
}));
```

### 3.2.6 AI Integration Design

**Google Gemini Integration Architecture:**

**1. AI Service Layer:**
```javascript
class AIService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
    this.baseURL = 'https://generativelanguage.googleapis.com/v1beta';
    this.retryConfig = { maxRetries: 3, backoffFactor: 2 };
  }

  async generateContent(prompt, options = {}) {
    const requestConfig = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: options.temperature || 0.7,
        maxOutputTokens: options.maxTokens || 2048,
        topP: options.topP || 0.8
      }
    };

    return await this.makeRequest(requestConfig);
  }

  async makeRequest(config, attempt = 1) {
    try {
      const response = await axios.post(
        `${this.baseURL}/models/gemini-2.0-flash:generateContent`,
        config,
        {
          headers: { 'Content-Type': 'application/json' },
          params: { key: this.apiKey },
          timeout: 120000
        }
      );

      return this.processResponse(response.data);
    } catch (error) {
      return await this.handleError(error, config, attempt);
    }
  }
}
```

**2. Prompt Engineering System:**
```javascript
class PromptTemplateEngine {
  constructor() {
    this.templates = {
      policyDrafting: `
        You are an expert company secretary and legal professional specializing in Indian corporate law.
        Draft a comprehensive {{policyType}} policy for {{companyName}}.
        
        Company Details:
        - Company Name: {{companyName}}
        - Company Type: {{companyType}}
        - Industry: {{industry}}
        
        Requirements:
        - Follow Companies Act 2013 and SEBI regulations
        - Include proper legal references and citations
        - Maintain professional tone and structure
        - Ensure compliance with latest amendments
        
        Generate a detailed policy document with:
        1. Policy Objective
        2. Scope and Applicability
        3. Definitions
        4. Policy Guidelines
        5. Implementation Framework
        6. Monitoring and Review
      `,
      
      complianceCalendar: `
        Generate a quarterly compliance calendar for {{companyName}} ({{companyType}}).
        
        Parameters:
        - Financial Year: {{financialYear}}
        - Quarters: {{selectedQuarters}}
        - Company Type: {{companyType}}
        
        Format the output as a structured table with:
        - Quarter
        - Month
        - Act/Regulation
        - Due Date
        - Compliance Item
        - Applicable Form
        - Legal Provision for Non-Compliance
        - Remarks
        
        Focus on Companies Act 2013, SEBI regulations, and other applicable laws.
      `
    };
  }

  generatePrompt(templateName, variables) {
    let template = this.templates[templateName];
    
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      template = template.replace(regex, value);
    });
    
    return template;
  }
}
```

**3. Response Processing:**
```javascript
class ResponseProcessor {
  static processGeminiResponse(response) {
    try {
      const content = response.candidates[0].content.parts[0].text;
      
      return {
        success: true,
        content: content,
        metadata: {
          model: 'gemini-2.0-flash',
          timestamp: new Date().toISOString(),
          tokenCount: this.estimateTokenCount(content)
        }
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to process AI response',
        fallbackContent: 'Unable to generate content. Please try again.'
      };
    }
  }

  static estimateTokenCount(text) {
    // Rough estimation: 1 token ≈ 4 characters
    return Math.ceil(text.length / 4);
  }
}
```

**4. Error Handling & Fallbacks:**
```javascript
class AIErrorHandler {
  static async handleAPIError(error, retryFunction, attempt = 1) {
    const maxRetries = 3;
    
    if (error.code === 'ECONNABORTED' && attempt <= maxRetries) {
      // Timeout - retry with exponential backoff
      await this.delay(Math.pow(2, attempt) * 1000);
      return await retryFunction(attempt + 1);
    }
    
    if (error.response?.status === 429) {
      // Rate limit - wait and retry
      await this.delay(5000);
      return await retryFunction(attempt + 1);
    }
    
    // Return fallback response
    return {
      success: false,
      content: this.getFallbackContent(error),
      error: this.getErrorMessage(error)
    };
  }

  static getFallbackContent(error) {
    return `
      We apologize, but we're currently unable to generate content due to technical issues.
      Please try again in a few moments. If the problem persists, contact support.
      
      Error Reference: ${error.code || 'UNKNOWN_ERROR'}
    `;
  }
}
```

---

## Summary

This comprehensive system design document provides:

- **Object-Oriented Design Approach** with component-based architecture for modularity and maintainability
- **Multi-Tier Architecture** separating presentation, business logic, data access, and external integration layers
- **Scalable Database Design** using MongoDB with optimized indexing and data retention strategies
- **Responsive UI Design** with consistent component hierarchy and theme system
- **RESTful API Design** with comprehensive endpoint structure and standardized response formats
- **Enterprise Security Architecture** with multi-layer protection and compliance measures
- **Robust AI Integration** with prompt engineering, error handling, and fallback mechanisms

The design ensures scalability, maintainability, security, and optimal user experience while supporting the complex requirements of AI-powered company secretarial services.

---

*This document serves as Chapter 3 of the AI Company Secretary project report, providing detailed technical design specifications for successful system implementation.*
