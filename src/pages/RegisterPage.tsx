import { RegisterForm } from '@/components/auth/RegisterForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const RegisterPage = () => {
  return (
    <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-5rem)] px-4 py-8 sm:py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Create an Account</CardTitle>
          <CardDescription>Join the Sweet Shop to start your journey.</CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterForm />
          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary-600 hover:underline">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterPage;