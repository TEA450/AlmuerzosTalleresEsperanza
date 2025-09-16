import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import MakeOrder from './pages/MakeOrder';
import OrderOptions from './pages/OrderOptions';
import OrderSummary from './pages/OrderSummary';
import History from './pages/History';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/make-order" element={<MakeOrder />} />
          <Route path="/order-options/:personId" element={<OrderOptions />} />
          <Route path="/order-summary" element={<OrderSummary />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;