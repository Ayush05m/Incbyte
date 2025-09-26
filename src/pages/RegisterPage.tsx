import { RegisterForm } from '@/components/auth/RegisterForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const RegisterPage = () => {
  return (
    <div className="flex items-center justify-center py-12">
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