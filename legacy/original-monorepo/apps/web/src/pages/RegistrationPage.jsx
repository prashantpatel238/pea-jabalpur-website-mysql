
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, Link } from 'react-router-dom';
import apiServerClient from '@/lib/apiServerClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const RegistrationPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirm_password: '',
    gender: '',
    date_of_birth: '',
    marital_status: '',
    spouse_name: '',
    marriage_date: '',
    member_category: 'General Member'
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name) newErrors.name = 'Full name is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (formData.password !== formData.confirm_password) {
      newErrors.confirm_password = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setLoading(true);

    const payload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      gender: formData.gender || undefined,
      date_of_birth: formData.date_of_birth || undefined,
      marital_status: formData.marital_status || undefined,
      spouse_name: formData.spouse_name || undefined,
      marriage_date: formData.marriage_date || undefined,
      member_category: formData.member_category
    };

    console.log('--- REGISTRATION PAYLOAD ---');
    console.log(JSON.stringify(payload, null, 2));

    try {
      const response = await apiServerClient.fetch('/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.message || 'Registration failed');
      }
      
      const data = await response.json();
      console.log('--- REGISTRATION SUCCESS ---', data);

      toast.success('Registration successful! Your profile is pending admin approval.');
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      console.error('--- REGISTRATION ERROR ---', error);
      toast.error(error.message || 'Registration failed. Please try again.', { duration: 6000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Join Now - Professional Engineers Association</title>
        <meta name="description" content="Create your member account and join our community" />
      </Helmet>
      <Header />
      
      <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="bg-primary px-8 py-10 text-center">
              <h1 className="text-3xl font-bold text-primary-foreground tracking-tight">Join the Association</h1>
              <p className="text-primary-foreground/80 mt-2">Fill out the form below to apply for membership</p>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-8">
              
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4 border-b border-slate-100 pb-2">Account Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" className="text-slate-900" />
                    {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" className="text-slate-900" />
                    {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="9876543210" className="text-slate-900" />
                    {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="member_category">Membership Category</Label>
                    <Select value={formData.member_category} onValueChange={(val) => handleSelectChange('member_category', val)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="General Member">General Member</SelectItem>
                        <SelectItem value="Student Member">Student Member</SelectItem>
                        <SelectItem value="Associate Member">Associate Member</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password *</Label>
                    <Input id="password" name="password" type="password" value={formData.password} onChange={handleChange} placeholder="••••••••" className="text-slate-900" />
                    {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm_password">Confirm Password *</Label>
                    <Input id="confirm_password" name="confirm_password" type="password" value={formData.confirm_password} onChange={handleChange} placeholder="••••••••" className="text-slate-900" />
                    {errors.confirm_password && <p className="text-sm text-destructive">{errors.confirm_password}</p>}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4 border-b border-slate-100 pb-2">Personal Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select value={formData.gender} onValueChange={(val) => handleSelectChange('gender', val)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date_of_birth">Date of Birth</Label>
                    <Input id="date_of_birth" name="date_of_birth" type="date" value={formData.date_of_birth} onChange={handleChange} className="text-slate-900" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="marital_status">Marital Status</Label>
                    <Select value={formData.marital_status} onValueChange={(val) => handleSelectChange('marital_status', val)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Single">Single</SelectItem>
                        <SelectItem value="Married">Married</SelectItem>
                        <SelectItem value="Divorced">Divorced</SelectItem>
                        <SelectItem value="Widowed">Widowed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {formData.marital_status === 'Married' && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="spouse_name">Spouse Name</Label>
                        <Input id="spouse_name" name="spouse_name" value={formData.spouse_name} onChange={handleChange} className="text-slate-900" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="marriage_date">Marriage Date</Label>
                        <Input id="marriage_date" name="marriage_date" type="date" value={formData.marriage_date} onChange={handleChange} className="text-slate-900" />
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full text-lg py-6"
                  disabled={loading}
                >
                  {loading ? 'Submitting Application...' : 'Submit Application'}
                </Button>
              </div>
            </form>

            <div className="bg-slate-50 px-8 py-6 text-center border-t border-slate-200">
              <p className="text-sm text-slate-600">
                Already have an account?{' '}
                <Link to="/login" className="text-primary font-semibold hover:underline">
                  Log in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default RegistrationPage;
