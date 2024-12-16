import { cn } from "../../utils/cn";
const Button = ({children}) => {
  return <button className={cn("bg-button text-button-text")}>{children}</button>;
};

export default Button;
