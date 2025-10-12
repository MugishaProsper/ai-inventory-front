import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { InventoryProvider } from '@/context/InventoryContext'
import Layout from '@/components/layout/Layout'
import Dashboard from '@/pages/Dashboard'
import Products from '@/pages/Products'
import Categories from '@/pages/Categories'
import Suppliers from '@/pages/Suppliers'
import Analytics from '@/pages/Analytics'
import AIInsights from '@/pages/AIInsights'
import Settings from '@/pages/Settings'
import Login from './pages/auth/Login'

function App() {
  return (
    <InventoryProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/suppliers" element={<Suppliers />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/ai-insights" element={<AIInsights />} />
            <Route path="/settings" element={<Settings />} />
            <Route path='/login' element={<Login/>} />
          </Routes>
        </Layout>
      </Router>
    </InventoryProvider>
  )
}

export default App