import Button from "../shared/Button"
const Registered = () => {
  return (
    <div className="bg-inherit w-full h-screen flex justify-center items-center">
        <form action="" className="flex flex-col gap-4">
        <input type="text" placeholder="Username" />
        <input type="text" placeholder="Full Name" />
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />
        <Button>Sign Up</Button>
        </form>
    </div>
  )
}

export default Registered