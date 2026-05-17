import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Orders from './pages/Orders';
import AddItem from './pages/AddItem';
import Toast from './components/Toast';
import { AdminRoute, CustomerRoute } from './components/ProtectedRoute';

function App() {
  const location = useLocation();

  return (
    <div className="app">
      <Navbar />
      <main className="main-content" key={location.pathname}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/checkout"
            element={
              <CustomerRoute>
                <Checkout />
              </CustomerRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <CustomerRoute>
                <Orders />
              </CustomerRoute>
            }
          />
          <Route
            path="/admin/add"
            element={
              <AdminRoute>
                <AddItem />
              </AdminRoute>
            }
          />
        </Routes>
      </main>
      <Toast />
    </div>
  );
}

export default App;
