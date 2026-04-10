import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, User as UserIcon, Phone, LogIn, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '../app/components/ui/button';
import { Card } from '../app/components/ui/card';
import { Input } from '../app/components/ui/input';
import { Label } from '../app/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../app/components/ui/tabs';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

interface AuthPagesProps {
  onNavigate: (page: string) => void;
  initialTab?: 'login' | 'signup';
}

export const AuthPages: React.FC<AuthPagesProps> = ({ onNavigate, initialTab = 'login' }) => {
  const { login, signup, isLoading, error } = useAuth();
  
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>(initialTab);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginForm.email || !loginForm.password) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const success = await login(loginForm.email, loginForm.password);
      if (success) {
        toast.success('Login successful! Welcome back!', {
          duration: 1000  
        });
        onNavigate('home');
      } else {
        // Error is already set in context, but we can show a toast too
        if (error) {
          toast.error(error);
        } else {
          toast.error('Invalid email or password. Please try again.');
        }
      }
    } catch (error) {
      toast.error('An error occurred. Please try again later.');
      console.error('Login error:', error);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!signupForm.name) {
      toast.error('Full name is required');
      return;
    }
    
    if (!signupForm.email) {
      toast.error('Email is required');
      return;
    }

    if (!signupForm.phone) {
      toast.error('Phone number is required');
      return;
    }

    if (!signupForm.password) {
      toast.error('Password is required');
      return;
    }

    // Email validation (valid format)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(signupForm.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    // Phone validation (required and must be 10 digits)
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(signupForm.phone)) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    // Password validation (minimum 8 characters)
    if (signupForm.password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    try {
      const success = await signup(signupForm.name, signupForm.email, signupForm.phone, signupForm.password);
      if (success) {
        toast.success('Account created successfully! Please login to continue.', {
          duration: 1000  // 1000ms = 1 second
        });
        // Clear signup form
        setSignupForm({ name: '', email: '', phone: '', password: '' });
        // Switch to login tab
        setActiveTab('login');
      } else {
        if (error) {
          toast.error(error);
        } else {
          toast.error('Registration failed. Please try again.');
        }
      }
    } catch (error) {
      toast.error('An error occurred during registration. Please try again.');
      console.error('Signup error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to TractorParts</h1>
            <p className="text-gray-600">Sign in to access exclusive features</p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-red-800">{error}</p>
                <p className="text-xs text-red-600 mt-1">
                  Please check your connection and try again. If the problem persists, contact support.
                </p>
              </div>
            </div>
          )}

          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'login' | 'signup')}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="login-email">Email</Label>
                  <div className="relative">
                    <Input
                      id="login-email"
                      type="email"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                      required
                      disabled={isLoading}
                      className="pl-10"
                      placeholder="Enter your email"
                    />
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="login-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="login-password"
                      type="password"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      required
                      disabled={isLoading}
                      className="pl-10"
                      placeholder="Enter your password"
                    />
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </div>
                <Button type="submit" className="w-full bg-gradient-to-r from-green-600 to-emerald-500" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4 mr-2" />
                      Login
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <Label htmlFor="signup-name">Full Name <span className="text-red-500">*</span></Label>
                  <div className="relative">
                    <Input
                      id="signup-name"
                      value={signupForm.name}
                      onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                      required
                      disabled={isLoading}
                      className="pl-10"
                      placeholder="Enter your name"
                    />
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="signup-email">Email <span className="text-red-500">*</span></Label>
                  <div className="relative">
                    <Input
                      id="signup-email"
                      type="email"
                      value={signupForm.email}
                      onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                      required
                      disabled={isLoading}
                      className="pl-10"
                      placeholder="Enter your email"
                    />
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="signup-phone">Phone Number <span className="text-red-500">*</span></Label>
                  <div className="relative">
                    <Input
                      id="signup-phone"
                      value={signupForm.phone}
                      onChange={(e) => setSignupForm({ ...signupForm, phone: e.target.value })}
                      required
                      disabled={isLoading}
                      className="pl-10"
                      placeholder="Enter your phone number"
                    />
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Enter a valid 10-digit phone number</p>
                </div>

                <div>
                  <Label htmlFor="signup-password">Password <span className="text-red-500">*</span></Label>
                  <div className="relative">
                    <Input
                      id="signup-password"
                      type="password"
                      value={signupForm.password}
                      onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                      required
                      disabled={isLoading}
                      className="pl-10"
                      placeholder="Enter your password (min. 8 characters)"
                    />
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Password must be at least 8 characters long</p>
                </div>

                <Button type="submit" className="w-full bg-gradient-to-r from-green-600 to-emerald-500" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6 text-center">
            <Button variant="link" onClick={() => onNavigate('home')}>
              Continue as Guest
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};