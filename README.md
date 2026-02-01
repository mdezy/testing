# Testing App

A comprehensive Next.js application demonstrating best practices for testing at all levels of the testing pyramid.

## 🧪 Testing Strategy

This project implements the **testing pyramid** - a proven approach that provides fast feedback and comprehensive coverage.

### 1. Unit Tests (`npm run test:unit`)

**Purpose**: Test individual functions and components in isolation

**What they test**:
- Component rendering and user interactions
- Business logic and validation
- Password hashing and verification
- Form state management

**Why they matter**:
- ✅ **Fast execution** - milliseconds per test
- ✅ **Immediate feedback** - quick development cycle
- ✅ **Isolated failures** - easy to debug
- ✅ **CI/CD friendly** - run on every commit

**Files**:
- `src/components/__tests__/LoginForm.test.tsx`
- `src/services/__tests__/auth.service.test.ts`

### 2. Integration Tests (`npm run test:integration`)

**Purpose**: Test how different parts work together with real dependencies

**What they test**:
- API endpoints with real database
- Authentication flow end-to-end
- Error handling and edge cases
- Concurrent request handling

**Why they matter**:
- ✅ **Real environment** - actual database, no mocks
- ✅ **Integration confidence** - components work together
- ✅ **Database testing** - queries and transactions
- ✅ **API contract testing** - request/response validation

**Files**:
- `src/app/api/login/__tests__/route.integration.test.ts`

### 3. E2E Tests (`npm run test:e2e`)

**Purpose**: Test complete user journeys from browser to database

**What they test**:
- User interactions and workflows
- Cross-browser compatibility
- Mobile responsiveness
- Accessibility and keyboard navigation
- Network error handling

**Why they matter**:
- ✅ **User perspective** - tests what users actually experience
- ✅ **Cross-browser** - Chrome, Firefox, Safari, mobile
- ✅ **Real scenarios** - complete workflows
- ✅ **UI validation** - visual and interaction testing

**Files**:
- `e2e/login.spec.ts`

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Setup

1. **Install dependencies**:
```bash
npm install
```

2. **Seed the database**:
```bash
npm run db:seed
```

This creates test users:
- `admin@example.com` / `admin123`
- `user@example.com` / `user123`
- `test@example.com` / `test123`

3. **Start development server**:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🧪 Running Tests

### Unit Tests
```bash
npm run test:unit          # Run all unit tests
```

### Integration Tests
```bash
npm run test:integration    # Run API integration tests
```

### E2E Tests
```bash
npm run test:e2e           # Run all E2E tests
npx playwright test --headed  # Show browser window
npx playwright test --ui      # Interactive test runner
```

### All Tests
```bash
npm run test:unit && npm run test:integration && npm run test:e2e
```

## 📁 Project Structure

```
src/
├── app/
│   ├── api/login/              # API routes
│   │   ├── route.ts           # Login endpoint
│   │   └── __tests__/         # Integration tests
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Home page with LoginForm
├── components/
│   ├── LoginForm.tsx          # Login form component
│   └── __tests__/             # Component tests
├── services/
│   ├── auth.service.ts        # Authentication business logic
│   └── __tests__/             # Service unit tests
└── lib/
    └── database.ts            # SQLite database setup

e2e/
└── login.spec.ts              # E2E tests

scripts/
└── seed-database.ts           # Database seeding script
```

## 🎯 Best Practices Demonstrated

### 1. **Test Pyramid**
- Many fast unit tests
- Fewer integration tests
- Minimal E2E tests
- Clear separation of concerns

### 2. **No Mocking in Integration Tests**
- Real database for authentic testing
- No artificial test doubles
- Tests actual behavior, not implementation

### 3. **Service Layer Architecture**
- Business logic separated from HTTP layer
- Easy to test in isolation
- Reusable across different interfaces

### 4. **Proper Error Handling**
- Validation at multiple levels
- Graceful degradation
- User-friendly error messages

### 5. **Accessibility Testing**
- Keyboard navigation
- Screen reader compatibility
- Semantic HTML structure

## 📊 Test Coverage

- **Unit Tests**: Components, business logic, utilities
- **Integration Tests**: API endpoints, database operations
- **E2E Tests**: Critical user journeys, cross-browser compatibility

## 📚 Learn More

- [Testing Pyramid](https://martinfowler.com/bliki/TestPyramid.html)
- [Next.js Testing](https://nextjs.org/docs/testing)
- [Playwright Testing](https://playwright.dev/)
- [Jest Testing](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
