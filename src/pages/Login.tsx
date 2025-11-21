import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Lock, User, Eye, EyeOff } from 'lucide-react';
import { DEMO_CREDENTIALS } from '@/types/auth';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const success = await login(username, password);
    
    if (success) {
      navigate('/dashboard');
    }
    
    setLoading(false);
  };

  const handleDemoLogin = (demoUsername: string, demoPassword: string) => {
    setUsername(demoUsername);
    setPassword(demoPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Branding */}
        <div className="hidden lg:flex flex-col justify-center space-y-6 p-8">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <Building2 className="w-7 h-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">CoreBank</h1>
              <p className="text-sm text-muted-foreground">Core Banking System</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">
              Enterprise Banking Platform
            </h2>
            <p className="text-muted-foreground">
              Secure, scalable, and comprehensive core banking solution with role-based access control and maker-checker workflows.
            </p>
            
            <div className="grid grid-cols-2 gap-4 pt-4">
              {[
                'Multi-role Access',
                'Maker-Checker',
                'Real-time Processing',
                'Audit Trails',
              ].map((feature) => (
                <div key={feature} className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-success" />
                  <span className="text-sm text-muted-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right side - Login Form */}
        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center lg:hidden mb-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-primary-foreground" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access the system
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Demo Accounts</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {DEMO_CREDENTIALS.map((cred) => (
                <Button
                  key={cred.username}
                  variant="outline"
                  size="sm"
                  onClick={() => handleDemoLogin(cred.username, cred.password)}
                  className="text-xs"
                >
                  {cred.role.replace('_', ' ').toUpperCase()}
                </Button>
              ))}
            </div>

            <p className="text-xs text-center text-muted-foreground">
              Click any demo account to auto-fill credentials
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
