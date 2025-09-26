import { LoginForm } from '@/components/auth/LoginForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const LoginPage = () => {
  return (
    <div className="flex items-center justify-center py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Welcome Back!</CardTitle>
          <CardDescription>Sign in to continue to your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
          <p className="text-center text-sm text-gray-600 mt-4">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-primary-600 hover:underline">
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;