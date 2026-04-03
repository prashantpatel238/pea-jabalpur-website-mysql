
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { toast } from 'sonner';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { user } = await login(email, password);
      toast.success('Login successful');
      if (user.role === 'admin' || user.role === 'member_manager') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(error.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Login - Professional Engineers Association</title>
      </Helmet>
      <Header />
      
      <main className="min-h-[80vh] flex items-center justify-center py-12 px-4 bg-[var(--bg-light)]">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="card-base w-full max-w-[400px] p-8"
        >
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-[var(--secondary-blue)] rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="font-bold text-xl text-[var(--primary-blue)]">PEA</span>
            </div>
            <h1 className="text-2xl font-bold text-[var(--text-dark)]">Welcome Back</h1>
            <p className="text-[var(--text-gray)] text-sm mt-2">Sign in to your member account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[var(--text-dark)] mb-1.5">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-[var(--radius-sm)] border border-border focus:outline-none focus:border-[var(--primary-blue)] focus:ring-1 focus:ring-[var(--primary-blue)] transition-colors"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-medium text-[var(--text-dark)]">Password</label>
                <a href="#" className="text-sm text-[var(--primary-blue)] hover:underline">Forgot password?</a>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-[var(--radius-sm)] border border-border focus:outline-none focus:border-[var(--primary-blue)] focus:ring-1 focus:ring-[var(--primary-blue)] transition-colors"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center">
              <input type="checkbox" id="remember" className="w-4 h-4 text-[var(--primary-blue)] border-gray-300 rounded focus:ring-[var(--primary-blue)]" />
              <label htmlFor="remember" className="ml-2 text-sm text-[var(--text-gray)]">Remember me</label>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-[var(--text-gray)]">
            Don't have an account?{' '}
            <Link to="/signup" className="text-[var(--primary-blue)] font-semibold hover:underline">
              Apply for Membership
            </Link>
          </div>
        </motion.div>
      </main>

      <Footer />
    </>
  );
};

export default LoginPage;
