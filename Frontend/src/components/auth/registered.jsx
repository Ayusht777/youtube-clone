import Button from '../shared/Button';
import Input from '../shared/Input';
const Register = () => {
  return (
    <div className="bg-inherit w-full h-screen flex justify-center items-center">
      <form action="" className="flex flex-col gap-4">
        <Input 
          placeholder="Enter your email" 
          type="email" 
        />
        <Input 
          placeholder="Create a password" 
          type="password" 
        />
        <Input 
          placeholder="Choose a username" 
          type="text" 
        />
        <Input 
          placeholder="Enter your full name" 
          type="text" 
        />
        <Button type='submit'>Create Account</Button>
      </form>
    </div>
  );
};

export default Register;
