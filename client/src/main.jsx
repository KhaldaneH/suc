import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { AppContextProvider } from './context/AppContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { ClerkProvider } from '@clerk/clerk-react';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      afterSignOutUrl="/"
      appearance={{
        variables: {
          colorPrimary: '#2563eb', // Tailwind blue-600
          colorText: '#1f2937', // Tailwind gray-800
          fontFamily: 'Inter, sans-serif',
          borderRadius: '8px',
        },
        elements: {
          card: 'shadow-lg border border-gray-200 p-6',
          formButtonPrimary: 'bg-blue-600 hover:bg-blue-700 text-white rounded-md',
          headerTitle: 'text-2xl font-bold text-center text-gray-800',
          footerActionText: 'text-sm text-gray-500',
        },
      }}
    >
      <AppContextProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </AppContextProvider>
    </ClerkProvider>
  </BrowserRouter>,
);
