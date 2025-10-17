import React from 'react';
import ReactDOM from 'react-dom/client';
import { AuthProvider } from '@/context/AuthContext';
import { CategoriesProvider } from '@/context/CategoriesContext';
import { SupplierProvider } from '@/context/SupplierContext';
import { AnalyticsProvider } from '@/context/AnalyticsContext';
import { AiInsightsProvider } from '@/context/AiInsightsContext';
import { ProductProvider } from '@/context/ProductContext';
import { SettingsProvider } from '@/context/SettingsContext';
import { ChatProvider } from '@/context/ChatContext';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <AnalyticsProvider>
        <CategoriesProvider>
          <SupplierProvider>
            <AiInsightsProvider>
              <ProductProvider>
                <SettingsProvider>
                  <ChatProvider>
                    <App />
                  </ChatProvider>
                </SettingsProvider>
              </ProductProvider>
            </AiInsightsProvider>
          </SupplierProvider>
        </CategoriesProvider>
      </AnalyticsProvider>
    </AuthProvider>
  </React.StrictMode>
);