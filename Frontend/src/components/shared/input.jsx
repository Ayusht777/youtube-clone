import { cn } from '../../utils/cn';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

const baseInputStyles = 'w-full bg-input-background text-input-text placeholder:text-input-placeholder border border-input-border rounded-md px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-button transition-colors duration-300';

const Input = ({ type = 'text', className, placeholder, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);

  if (type.toLowerCase() !== 'password') {
    return (
      <input
        type={type}
        className={cn(baseInputStyles, className)}
        placeholder={placeholder}
        {...props}
      />
    );
  }

  return (
    <div className="relative">
      <input
        type={showPassword ? 'text' : 'password'}
        className={cn(baseInputStyles, className)}
        placeholder={placeholder}
        {...props}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
      >
        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
};

export default Input;
