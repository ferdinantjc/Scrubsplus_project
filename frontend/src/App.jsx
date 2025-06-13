import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Collection from './pages/Collection';
import About from './pages/About';
import Contact from './pages/Contact';
import Product from './pages/Product';
import Cart from './pages/Cart';
import Login from './pages/Login';
import PlaceOrder from './pages/PlaceOrder';
import Orders from './pages/Orders';
import Verify from './pages/Verify';

import TryOnCamera from './pages/TryOnCamera';    // ✅ Real-time camera try-on
import TryOnPhoto from './pages/TryOnPhoto';      // ✅ Photo upload try-on via FASHN API

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SearchBar from './components/SearchBar';
import Chatbot from './components/Chatbot';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <>
      <ToastContainer />
      <Navbar />
      <SearchBar />

      <div className="relative px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/product/:productId" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/place-order" element={<PlaceOrder />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/verify" element={<Verify />} />

          {/* ✅ Try-On Routes */}
          <Route path="/tryon" element={<TryOnCamera />} />        {/* Real-time camera try-on */}
          <Route path="/tryon-photo" element={<TryOnPhoto />} />   {/* Photo upload via FASHN API */}
        </Routes>
      </div>

      <Footer />
      <Chatbot />
    </>
  );
};

export default App;
