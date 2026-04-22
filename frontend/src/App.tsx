// frontend/src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';

import Register from './pages/auth/Register';
import VerifyOtp from './pages/auth/VerifyOtp';
import GuestCheckout from './pages/auth/GuestCheckout';
import Login from './pages/auth/Login';

import BrandsPage from './pages/brands/BrandsPage';
import BrandDetailPage from './pages/brands/BrandDetailPage';

import OrderSample from './pages/order/OrderSample';
import OrderFlight from './pages/order/OrderFlight';
import OrderSuccess from './pages/order/OrderSuccess';

import Dashboard from './pages/dashboard/Dashboard';

import { AuthProvider } from './context/AuthProvider';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth/register" element={<Register/>}/>
          <Route path="/auth/verify-otp" element={<VerifyOtp/>}/>
          <Route path="/auth/guest" element={<GuestCheckout/>}/>
          <Route path="/auth/login" element={<Login/>}/>

          <Route path="/brands" element={<BrandsPage />} />
          <Route path="/brands/:slug" element={<BrandDetailPage />} />

          <Route path="/order/sample" element={<OrderSample/>}/>
          <Route path="/order/flight" element={<OrderFlight/>}/>
          <Route path="/order/success" element={<OrderSuccess/>}/>

          <Route path="/dashboard" element={<Dashboard/>}/>
          {/* future routes: /recommend, /order, /vote */}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
