import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">
        Welcome to the Sweet Shop!
      </h1>
      <p className="text-md sm:text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
        Your one-stop destination for the most delicious and delightful sweets. Explore our collection and satisfy your cravings.
      </p>
      <Button asChild size="lg">
        <Link to="/dashboard">Explore Sweets</Link>
      </Button>
    </div>
  );
};

export default HomePage;