# E-Bank Frontend

A React frontend application for the E-Bank system, built with React, Vite, and Tailwind CSS.

## Features

- **Authentication**: Login and registration with role-based access control
- **Agent Dashboard**: For AGENT_GUICHET role
  - Customer management (create, view, delete)
  - Bank account management (view, update status, delete)
- **Client Dashboard**: For CLIENT role
  - View personal information
  - View bank accounts
- **UI**: Built with Tailwind CSS

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API running on `http://localhost:8080`

## Installation

1. Install dependencies:
```bash
npm install
```

## Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3002`

## Building for Production

Build the application for production:

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── Layout.jsx
│   ├── ProtectedRoute.jsx
│   ├── CustomerManagement.jsx
│   ├── CreateCustomerModal.jsx
│   └── BankAccountManagement.jsx
├── context/            # React context providers
│   └── AuthContext.jsx
├── pages/              # Page components
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── AgentDashboard.jsx
│   └── ClientDashboard.jsx
├── services/           # API service layer
│   ├── api.js
│   ├── authService.js
│   ├── clientService.js
│   └── bankAccountService.js
├── App.jsx             # Main app component
├── main.jsx            # Entry point
└── index.css           # Global styles with Tailwind
```

## API Integration

The frontend communicates with the backend API through the API Gateway at `http://localhost:8080/api`. The proxy is configured in `vite.config.js` to forward `/api` requests to the backend.

### Available Endpoints

- **Authentication**: `/api/auth/*`
- **Clients**: `/api/clients/*`
- **Bank Accounts**: `/api/accounts/*`

## User Roles

- **AGENT_GUICHET**: Can manage customers and bank accounts
- **CLIENT**: Can view their own information and bank accounts

## Technologies Used

- React 18
- React Router DOM
- Vite
- Tailwind CSS
- Axios