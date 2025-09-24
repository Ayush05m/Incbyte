import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/services/auth.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from "sonner";
import { useNavigate, useLocation } from 'react-router-dom';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// Ensure LoginFormData has required email and password fields
type LoginFormData = {
  email: string;
  password: string;
};

export const LoginForm: React.FC = () => {
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
  });

  const [isDemoSubmitting, setIsDemoSubmitting] = React.useState(false);

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await authService.login(data);
      console.log(response);
      login(response.user, response.token);
      toast.success("Login successful!");
      navigate(from, { replace: true });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed. Please check your connection and try again.';
      setError('root', { message });
      toast.error(message);
    }
  };

  const handleDemoLogin = async () => {
    setIsDemoSubmitting(true);
    try {
      const response = await authService.login({ email: 'demo@example.com', password: 'password' });
      login(response.user, response.token);
      toast.success("Logged in as Demo User!");
      navigate(from, { replace: true });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Demo login failed. Please try again.';
      setError('root', { message });
      toast.error(message);
    } finally {
      setIsDemoSubmitting(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            {...register('email')}
            placeholder="user@example.com"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>
        
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            {...register('password')}
            placeholder="••••••••"
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
        </div>
        
        {errors.root && (
          <div className="text-red-500 text-sm">{errors.root.message}</div>
        )}
        
        <Button
          type="submit"
          disabled={isSubmitting || isDemoSubmitting}
          className="w-full"
        >
          {isSubmitting ? 'Signing In...' : 'Sign In'}
        </Button>
      </form>

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">
            Or
          </span>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={handleDemoLogin}
        disabled={isSubmitting || isDemoSubmitting}
        className="w-full"
      >
        {isDemoSubmitting ? 'Logging in...' : 'Login as Demo User'}
      </Button>
    </>
  );
};