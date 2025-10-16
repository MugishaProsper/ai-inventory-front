import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { InventoryProvider } from "@/context/InventoryContext";
import Layout from "@/components/layout/Layout";
import Dashboard from "@/pages/Dashboard";
import Products from "@/pages/Products";
import ProductForm from "@/pages/ProductForm";
import Categories from "@/pages/Categories";
import Suppliers from "@/pages/Suppliers";
import Analytics from "@/pages/Analytics";
import AIInsights from "@/pages/AIInsights";
import SupplierView from "@/pages/SupplierView";
import Settings from "@/pages/Settings";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import { useAuth } from "@/context/AuthContext";
import ProductView from "@/pages/ProductView";

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function App() {
  return (
    <InventoryProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <Layout>
                  <Products />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/products/new"
            element={
              <ProtectedRoute>
                <Layout>
                  <ProductForm />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/products/:productId/edit"
            element={
              <ProtectedRoute>
                <Layout>
                  <ProductForm />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/products/:productId"
            element={
              <ProtectedRoute>
                <Layout>
                  <ProductView />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/products/new"
            element={
              <ProtectedRoute>
                <Layout>
                  <ProductForm />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/products/:productId/edit"
            element={
              <ProtectedRoute>
                <Layout>
                  <ProductForm />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/categories"
            element={
              <ProtectedRoute>
                <Layout>
                  <Categories />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/suppliers"
            element={
              <ProtectedRoute>
                <Layout>
                  <Suppliers />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/suppliers/:supplierId"
            element={
              <ProtectedRoute>
                <Layout>
                  <SupplierView />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <Layout>
                  <Analytics />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/ai-insights"
            element={
              <ProtectedRoute>
                <Layout>
                  <AIInsights />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Layout>
                  <Settings />
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </InventoryProvider>
  );
}

export default App;
