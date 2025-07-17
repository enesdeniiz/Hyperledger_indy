import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import TestnetPage from './pages/TestnetPage';
import LoginPage from './pages/LoginPage';
import LearnedPage from './pages/LearnedPage';
import HomePage from './pages/HomePage';
import ScrollToTop from './components/ScrollToTop';

const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen">
        <header className="bg-primary-700 text-white shadow-md">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-xl font-bold">
            DID Tutorial
          </div>

            <nav>
              <ul className="flex space-x-4">
                <li>
                  <Link to="/" className="hover:text-primary-200">Ana Sayfa</Link>
                </li>
                <li>
                  <Link to="/register" className="hover:text-primary-200">Kayıt Ol</Link>
                </li>
                <li>
                  <Link to="/testnet" className="hover:text-primary-200">Testnet</Link>
                </li>
                <li>
                  <Link to="/login" className="hover:text-primary-200">Giriş Yap</Link>
                </li>
                <li>
                  <Link to="/learned" className="hover:text-primary-200">Öğrendiklerim</Link>
                </li>
              </ul>
            </nav>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/testnet" element={<TestnetPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/learned" element={<LearnedPage />} />
          </Routes>
        </main>

        <footer className="bg-secondary-800 text-white py-6">
          <div className="container mx-auto px-4">
            <p className="text-center">
              © {new Date().getFullYear()} DID Öğretici - Dijital Kimlik Kavramlarını Öğrenmek İçin İnteraktif Bir Uygulama
            </p>
            <p className="text-center text-sm mt-2">
              Bu uygulama eğitim amaçlıdır ve gerçek bir DID sistemi ile bağlantılı değildir.
            </p>

          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
