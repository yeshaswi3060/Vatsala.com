import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { WishlistProvider } from './contexts/WishlistContext';
import { ToastProvider } from './contexts/ToastContext';
import { ProfileProvider } from './contexts/ProfileContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Preloader from './components/Preloader';
import ProtectedRoute from './components/ProtectedRoute';
import Toast from './components/Toast';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import OrderConfirmation from './pages/OrderConfirmation';
import Wishlist from './pages/Wishlist';
import Profile from './pages/Profile';
import AdminRoute from './components/AdminRoute';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminProductEdit from './pages/admin/AdminProductEdit';
import AdminUsers from './pages/admin/AdminUsers';
import AdminPromoCodes from './pages/admin/AdminPromoCodes';

const PublicLayout = () => (
  <>
    <Header />
    <main style={{ marginTop: 0 }}>
      {/* Header is sticky but not fixed-overlay, so no margins needed */}
      <Outlet />
    </main>
    <Footer />
  </>
);

const AppContent = () => {
  const { user } = useAuth();

  return (
    <CartProvider userId={user?.id || null}>
      <WishlistProvider userId={user?.id || null}>
        <ProfileProvider userId={user?.id || null}>
          <Preloader />
          <Toast />
          <Router>
            <ScrollToTop />
            <div className="app">
              <Routes>
                {/* Public Routes wrapped in PublicLayout */}
                <Route element={<PublicLayout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/products/:id" element={<ProductDetail />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/checkout"
                    element={
                      <ProtectedRoute>
                        <Checkout />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/orders"
                    element={
                      <ProtectedRoute>
                        <Orders />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/order-confirmation/:orderId"
                    element={
                      <ProtectedRoute>
                        <OrderConfirmation />
                      </ProtectedRoute>
                    }
                  />
                </Route>

                {/* Admin Routes - No Navbar/Footer */}
                <Route element={<AdminRoute />}>
                  <Route element={<AdminLayout />}>
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/admin/products" element={<AdminProducts />} />
                    <Route path="/admin/products/:id" element={<AdminProductEdit />} />

                    <Route path="/admin/orders" element={<AdminOrders />} />
                    <Route path="/admin/users" element={<AdminUsers />} />
                    <Route path="/admin/promocodes" element={<AdminPromoCodes />} />
                  </Route>
                </Route>
              </Routes>
            </div>
          </Router>
        </ProfileProvider>
      </WishlistProvider>
    </CartProvider>
  );
};

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
