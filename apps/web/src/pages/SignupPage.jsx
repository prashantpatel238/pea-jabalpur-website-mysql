
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { toast } from 'sonner';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    full_name: '', email: '', mobile_number: '', gender: '', date_of_birth: '', password: '', passwordConfirm: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.passwordConfirm) return toast.error('Passwords do not match');
    if (formData.password.length < 8) return toast.error('Password must be at least 8 characters');
    
    setLoading(true);
    try {
      await signup({ ...formData, name: formData.full_name });
      setSubmitted(true);
    } catch (error) {
      toast.error(error.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <>
        <Header />
        <div className="min-h-[80vh] flex items-center justify-center bg-[var(--bg-light)] px-4">
          <div className="card-base max-w-[400px] text-center p-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600 text-2xl">✓</div>
            <h2 className="text-2xl font-bold mb-2">Application Submitted</h2>
            <p className="text-[var(--text-gray)] mb-6">Your membership application is under review. We will notify you via email once approved.</p>
            <button onClick={() => navigate('/')} className="btn-primary w-full">Return to Home</button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet><title>Apply for Membership - PEA</title></Helmet>
      <Header />
      
      <main className="min-h-[80vh] flex items-center justify-center py-12 px-4 bg-[var(--bg-light)]">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card-base w-full max-w-[500px] p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-[var(--text-dark)]">Join the Association</h1>
            <p className="text-[var(--text-gray)] text-sm mt-2">Fill out the form to apply for membership</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-dark)] mb-1">Full Name</label>
              <input type="text" name="full_name" required onChange={handleChange} className="w-full px-4 py-2.5 rounded-[var(--radius-sm)] border border-border focus:border-[var(--primary-blue)] outline-none" />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-dark)] mb-1">Email</label>
                <input type="email" name="email" required onChange={handleChange} className="w-full px-4 py-2.5 rounded-[var(--radius-sm)] border border-border focus:border-[var(--primary-blue)] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-dark)] mb-1">Mobile Number</label>
                <input type="tel" name="mobile_number" required onChange={handleChange} className="w-full px-4 py-2.5 rounded-[var(--radius-sm)] border border-border focus:border-[var(--primary-blue)] outline-none" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-dark)] mb-1">Gender</label>
                <select name="gender" required onChange={handleChange} className="w-full px-4 py-2.5 rounded-[var(--radius-sm)] border border-border focus:border-[var(--primary-blue)] outline-none bg-white">
                  <option value="">Select...</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-dark)] mb-1">Date of Birth</label>
                <input type="date" name="date_of_birth" required onChange={handleChange} className="w-full px-4 py-2.5 rounded-[var(--radius-sm)] border border-border focus:border-[var(--primary-blue)] outline-none" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-dark)] mb-1">Password</label>
                <input type="password" name="password" required onChange={handleChange} className="w-full px-4 py-2.5 rounded-[var(--radius-sm)] border border-border focus:border-[var(--primary-blue)] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-dark)] mb-1">Confirm Password</label>
                <input type="password" name="passwordConfirm" required onChange={handleChange} className="w-full px-4 py-2.5 rounded-[var(--radius-sm)] border border-border focus:border-[var(--primary-blue)] outline-none" />
              </div>
            </div>

            <div className="flex items-start mt-4">
              <input type="checkbox" required id="terms" className="mt-1 w-4 h-4 text-[var(--primary-blue)] border-gray-300 rounded" />
              <label htmlFor="terms" className="ml-2 text-sm text-[var(--text-gray)]">I agree to the Terms & Conditions and Privacy Policy of the association.</label>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full mt-6">
              {loading ? 'Submitting...' : 'Submit Application'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-[var(--text-gray)]">
            Already a member? <Link to="/login" className="text-[var(--primary-blue)] font-semibold hover:underline">Sign In</Link>
          </div>
        </motion.div>
      </main>

      <Footer />
    </>
  );
};

export default SignupPage;
