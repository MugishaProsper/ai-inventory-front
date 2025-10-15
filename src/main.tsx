import React from 'react';
import ReactDOM from 'react-dom/client';
import { AuthProvider } from '@/context/AuthContext';
import { CategoriesProvider } from '@/context/CategoriesContext';
import { SupplierProvider } from '@/context/SupplierContext';
import { AnalyticsProvider } from '@/context/AnalyticsContext';
import { AiInsightsProvider } from '@/context/AiInsightsContext';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <AnalyticsProvider>
        <CategoriesProvider>
          <SupplierProvider>
            <AiInsightsProvider>
              <App />
            </AiInsightsProvider>
          </SupplierProvider>
        </CategoriesProvider>
      </AnalyticsProvider>
    </AuthProvider>
  </React.StrictMode>
);