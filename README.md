# Musafir SaaS UI

A React TypeScript application built with Vite for the Musafir SaaS platform.

## Features

- ⚡ **Vite** - Fast development server and optimized builds
- ⚛️ **React 18** - Latest React with hooks and concurrent features
- 🔷 **TypeScript** - Type-safe development
- 🎨 **Material-UI** - Comprehensive UI component library
- 🎯 **Redux Toolkit** - State management
- 🌍 **i18next** - Internationalization
- 🎨 **Tailwind CSS** - Utility-first CSS framework
- 🧪 **Jest** - Testing framework with React Testing Library


## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v8 or higher) or yarn

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev

# Start with specific environment
npm run dev:uat    # UAT environment
npm run dev:qa     # QA environment
npm run dev:dev    # Development environment
```

### Building

```bash
# Build for production
npm run build

# Build for specific environment
npm run build:uat  # UAT environment
npm run build:qa   # QA environment
npm run build:dev  # Development environment
```

### Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Code Quality

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Check TypeScript types
npm run typecheck

# Format code
npm run format

# Check code formatting
npm run format:check
```

### Bundle Analysis

```bash
# Analyze bundle size
npm run analyze

# Generate bundle report
npm run bundle-report
```



## Environment Configuration

The application supports multiple environments through the `REACT_APP_ENV` environment variable:

- `development` - Development environment
- `qa` - QA environment
- `uat` - UAT environment
- `production` - Production environment

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── store/         # Redux store and slices
├── utility/       # Utility functions and helpers
├── assets/        # Static assets
└── routes/        # Routing configuration
```

## Available Scripts

### Development
- `npm run dev` - Start development server
- `npm run dev:uat` - Start development server for UAT
- `npm run dev:qa` - Start development server for QA
- `npm run dev:dev` - Start development server for development

### Building
- `npm run build` - Build for production
- `npm run build:uat` - Build for UAT
- `npm run build:qa` - Build for QA
- `npm run build:dev` - Build for development
- `npm run preview` - Preview production build

### Testing
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage

### Code Quality
- `npm run lint` - Lint code
- `npm run lint:fix` - Fix linting issues
- `npm run typecheck` - Check TypeScript types
- `npm run format` - Format code
- `npm run format:check` - Check code formatting

### Analysis
- `npm run analyze` - Analyze bundle size
- `npm run bundle-report` - Generate bundle report

## Security

This project implements several security best practices:

- **Content Security Policy (CSP)** - Configured in nginx.conf
- **Security Headers** - X-Frame-Options, X-Content-Type-Options, etc.
- **HTTPS Enforcement** - Configured for production
- **Dependency Auditing** - Regular security audits with `npm audit`
- **Non-root Docker Container** - Secure container configuration

## Performance

Performance optimizations include:

- **Code Splitting** - Automatic chunk splitting for vendor libraries
- **Tree Shaking** - Unused code elimination
- **Asset Optimization** - Compressed images and fonts
- **Caching Strategy** - Long-term caching for static assets
- **Bundle Analysis** - Tools to monitor bundle size

## Migration from Webpack

This project was migrated from Webpack to Vite for improved development experience and faster builds. The migration included:

- ✅ Replaced Webpack with Vite
- ✅ Removed Module Federation (unused)
- ✅ Updated build scripts
- ✅ Configured PostCSS and Tailwind CSS
- ✅ Maintained all existing functionality
