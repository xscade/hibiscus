import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import AllTours from './pages/AllTours';
import TourDetails from './pages/TourDetails';
import About from './pages/About';
import Contact from './pages/Contact';
import Dashboard from './pages/Dashboard';
import { DataProvider } from './context/DataContext';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/tours" element={<AllTours />} />
              <Route path="/tours/:id" element={<TourDetails />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/admin" element={<Dashboard />} />
            </Routes>
          </Layout>
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;