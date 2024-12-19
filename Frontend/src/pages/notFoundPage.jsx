import { useNavigate } from 'react-router';
import Button from '../components/shared/Button';
import {ArrowLeft} from "lucide-react"
const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="text-9xl font-bold text-text-primary mb-4">404</div>
      <div className="text-4xl text-text-secondary mb-8">Page Not Found</div>
      <p className="text-text-secondary text-center mb-8 max-w-md">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Button 
        onClick={() => navigate(-1)}
        type="button"
        icon={ArrowLeft}
      >
        Go Back
      </Button>
    </div>
  );
};

export default NotFound;
