import { useNavigate } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import SocialLoginRow from "./SocialLoginRow";

const Login = () => {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <AuthLayout formTitle="Login Into Your Account">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm text-[#333] mb-2">Email Address</label>
          <input
            type="email"
            required
            placeholder="Enter your email address"
            className="w-full h-11 px-4 rounded-md border border-[#F2A65A] bg-white text-sm text-[#333] placeholder:text-[#B0B0B0] outline-none focus:border-[#F2762E] transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm text-[#333] mb-2">Password</label>
          <input
            type="password"
            required
            placeholder="Enter your password"
            className="w-full h-11 px-4 rounded-md border border-[#F2A65A] bg-white text-sm text-[#333] placeholder:text-[#B0B0B0] outline-none focus:border-[#F2762E] transition-colors"
          />

          <div className="flex justify-end mt-2">
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="text-xs text-[#555] hover:text-[#2F7A3D] transition-colors cursor-pointer"
            >
              Forgot password?
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="
            w-full h-12 mt-2
            bg-[#F2762E] hover:bg-[#E0651E]
            text-white text-sm font-semibold
            rounded-md
            transition-colors cursor-pointer
          "
        >
          Login Now
        </button>

        <p className="text-center text-sm text-[#555]">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/signup")}
            className="text-[#F2A100] font-medium hover:underline cursor-pointer"
          >
            Sign up
          </button>
        </p>
      </form>

      <SocialLoginRow />
    </AuthLayout>
  );
};

export default Login;