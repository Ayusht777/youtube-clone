import { cn } from '../../utils/cn';

const Button = ({ type = 'button', className, children, icon: Icon, ...props }) => {
  return (
    <button
      type={type}
      className={cn(
        'bg-button text-button-text hover:text-button border border-button-border px-2 py-1 rounded-md transition-colors duration-300 ease-in-out hover:bg-button-hover flex items-center gap-x-1 justify-center',
        className
      )}
      {...props}
    >
      {Icon && <Icon className="size-4" />}
      {children}
    </button>
  );
};

export default Button;
