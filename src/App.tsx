import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';
import { useCartStore } from './store/cartStore';
import { useProductsStore } from './store/productsStore';
import AgeVerification from './components/common/AgeVerification';
import Loader from './components/common/Loader';
import BottomNav from './components/common/BottomNav';
import TopNav from './components/common/TopNav';
import Noise from './components/common/Noise';
import PrivateRoute from './components/common/PrivateRoute';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import ProductPage from './pages/ProductPage';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import AdminOrders from './pages/admin/Orders';
import AdminUsers from './pages/admin/Users';
import AdminSettings from './pages/admin/Settings';
import AdminRoute from './components/common/AdminRoute';
import NewProduct from './pages/admin/NewProduct';
import EditProduct from './pages/admin/EditProduct'; // ДОБАВИТЬ ИМПОРТ

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAgeVerified, setIsAgeVerified] = useState(false);
  const { checkAuth, isAuthenticated } = useAuthStore();
  const { fetchCart } = useCartStore();
  const { fetchProducts } = useProductsStore();

  useEffect(() => {
    const init = async () => {
      // Check age verification
      const verified = localStorage.getItem('ageVerified');
      if (verified === 'true') {
        setIsAgeVerified(true);
      }
      
      // Check authentication
      checkAuth();
      
      // Fetch products
      await fetchProducts();
      
      // Fetch cart if authenticated
      if (isAuthenticated) {
        await fetchCart();
      }
      
      setIsLoading(false);
    };

    init();
  }, [checkAuth, fetchProducts, fetchCart, isAuthenticated]);

  const handleAgeVerification = () => {
    localStorage.setItem('ageVerified', 'true');
    setIsAgeVerified(true);
  };

  if (isLoading) {
    return <Loader />;
  }

  if (!isAgeVerified) {
    return <AgeVerification onVerify={handleAgeVerification} />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-darker">
        {/* Эффект шума на весь сайт */}
        <Noise
          patternSize={200}
          patternScaleX={1}
          patternScaleY={1}
          patternRefreshInterval={3}
          patternAlpha={50}
        />
        
        {/* TopNav для десктопа */}
        <TopNav />
        
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#18181B',
              color: '#fff',
              border: '1px solid rgba(35, 192, 219, 0.2)',
            },
          }}
        />
        
        <main className="pb-20 lg:pb-0 lg:pt-20">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected routes */}
            <Route path="/cart" element={
              <PrivateRoute>
                <Cart />
              </PrivateRoute>
            } />
            <Route path="/profile" element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            } />
            <Route path="/checkout" element={
              <PrivateRoute>
                <Checkout />
              </PrivateRoute>
            } />
            
            {/* Admin routes */}
            <Route path="/admin" element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } />
            <Route path="/admin/products" element={
              <AdminRoute>
                <AdminProducts />
              </AdminRoute>
            } />
            <Route path="/admin/products/new" element={
              <AdminRoute>
                <NewProduct />
              </AdminRoute>
            } />
            <Route path="/admin/products/edit/:id" element={
              <AdminRoute>
                <EditProduct />
              </AdminRoute>
            } />
            <Route path="/admin/orders" element={
              <AdminRoute>
                <AdminOrders />
              </AdminRoute>
            } />
            <Route path="/admin/users" element={
              <AdminRoute>
                <AdminUsers />
              </AdminRoute>
            } />
            <Route path="/admin/settings" element={
              <AdminRoute>
                <AdminSettings />
              </AdminRoute>
            } />
          </Routes>
        </main>
        
        <BottomNav />
      </div>
    </Router>
  );
}

export default App;