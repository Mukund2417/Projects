import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, User, Check, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';
import { authAPI } from '../services/api';
import { useAuthStore } from '../stores/authStore';
import { toast } from 'sonner';

interface LoginProps {
  onLogin: (user: any) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: '' 
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuthStore();

  // Password criteria validation
  const getPasswordCriteria = (password: string) => {
    return {
      length: password.length >= 6,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
  };

  const passwordCriteria = getPasswordCriteria(signupForm.password);
  const isPasswordValid = Object.values(passwordCriteria).every(Boolean);

  const fillDemoCredentials = () => {
    setLoginForm({
      email: 'test@demo.com',
      password: 'Demo@123'
    });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await authAPI.login(loginForm.email, loginForm.password);
      const { user, token } = response.data;
      
      login(user, token);
      onLogin(user);
      toast.success('Login successful!');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signupForm.password !== signupForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await authAPI.register({
        name: signupForm.name,
        email: signupForm.email,
        password: signupForm.password
      });
      
      const { user, token } = response.data;
      login(user, token);
      onLogin(user);
      toast.success('Account created successfully!');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: string) => {
    setIsLoading(true);
    
    try {
      const response = await authAPI.socialLogin(provider, {
        email: `user@${provider}.com`,
        name: 'John Doe',
        socialId: `social_${Date.now()}`
      });
      
      const { user, token } = response.data;
      login(user, token);
      onLogin(user);
      toast.success(`${provider} login successful!`);
    } catch (error: any) {
      const message = error.response?.data?.message || `${provider} login failed`;
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/5 to-secondary/10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-green-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-3xl">🚌</span>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-green-600 bg-clip-text text-transparent">
            Punjab Bus
          </h1>
          <p className="text-muted-foreground mt-2">Government of Punjab • Smart Transit System</p>
          <p className="text-sm text-muted-foreground">Safe • Reliable • Affordable</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Get Started</CardTitle>
            <CardDescription>
              Sign in to your account or create a new one
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        className="pl-10"
                        value={loginForm.email}
                        onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        className="pl-10 pr-10"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Signing In...' : 'Sign In'}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup" className="space-y-4">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter your full name"
                        className="pl-10"
                        value={signupForm.name}
                        onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="Enter your email"
                        className="pl-10"
                        value={signupForm.email}
                        onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Create a password"
                        className="pl-10 pr-10"
                        value={signupForm.password}
                        onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    
                    {/* Password Criteria */}
                    {signupForm.password && (
                      <div className="mt-2 space-y-1 text-sm">
                        <div className="flex items-center gap-2">
                          {passwordCriteria.length ? (
                            <Check className="h-3 w-3 text-green-500" />
                          ) : (
                            <X className="h-3 w-3 text-red-500" />
                          )}
                          <span className={passwordCriteria.length ? 'text-green-600' : 'text-red-600'}>
                            At least 6 characters
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {passwordCriteria.uppercase ? (
                            <Check className="h-3 w-3 text-green-500" />
                          ) : (
                            <X className="h-3 w-3 text-red-500" />
                          )}
                          <span className={passwordCriteria.uppercase ? 'text-green-600' : 'text-red-600'}>
                            One uppercase letter
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {passwordCriteria.lowercase ? (
                            <Check className="h-3 w-3 text-green-500" />
                          ) : (
                            <X className="h-3 w-3 text-red-500" />
                          )}
                          <span className={passwordCriteria.lowercase ? 'text-green-600' : 'text-red-600'}>
                            One lowercase letter
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {passwordCriteria.number ? (
                            <Check className="h-3 w-3 text-green-500" />
                          ) : (
                            <X className="h-3 w-3 text-red-500" />
                          )}
                          <span className={passwordCriteria.number ? 'text-green-600' : 'text-red-600'}>
                            One number
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {passwordCriteria.special ? (
                            <Check className="h-3 w-3 text-green-500" />
                          ) : (
                            <X className="h-3 w-3 text-red-500" />
                          )}
                          <span className={passwordCriteria.special ? 'text-green-600' : 'text-red-600'}>
                            One special character
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirm-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Confirm your password"
                        className="pl-10"
                        value={signupForm.confirmPassword}
                        onChange={(e) => setSignupForm({ ...signupForm, confirmPassword: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading || !isPasswordValid || signupForm.password !== signupForm.confirmPassword}
                  >
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
            
            <div className="mt-6">
              <Separator className="mb-6" />
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => handleSocialLogin('google')}
                  disabled={isLoading}
                >
                  Continue with Google
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => handleSocialLogin('apple')}
                  disabled={isLoading}
                >
                  Continue with Apple
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="text-center mt-6 text-sm text-muted-foreground">
          <p>By continuing, you agree to our Terms of Service and Privacy Policy</p>
        </div>
      </div>
    </div>
  );
}