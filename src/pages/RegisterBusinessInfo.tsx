import { useNavigate } from "react-router-dom";
import RegisterStepLayout from "./RegisterStepLayout";

interface RegisterBusinessInfoProps {
  onContinue: () => void;
}

const RegisterBusinessInfo = ({ onContinue }: RegisterBusinessInfoProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onContinue();
  };

  return (
    <RegisterStepLayout stepLabel="Business Information">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm text-[#333] mb-2">Business Name</label>
          <input
            type="text"
            required
            placeholder="Enter your business name"
            className="w-full h-11 px-4 rounded-md border border-[#F2A65A] bg-white text-sm text-[#333] placeholder:text-[#B0B0B0] outline-none focus:border-[#F2762E] transition-colors"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm text-[#333] mb-2">Phone Number</label>
            <input
              type="tel"
              required
              placeholder="Enter your phone number"
              className="w-full h-11 px-4 rounded-md border border-[#F2A65A] bg-white text-sm text-[#333] placeholder:text-[#B0B0B0] outline-none focus:border-[#F2762E] transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm text-[#333] mb-2">Email Address</label>
            <input
              type="email"
              required
              placeholder="Enter your email address"
              className="w-full h-11 px-4 rounded-md border border-[#F2A65A] bg-white text-sm text-[#333] placeholder:text-[#B0B0B0] outline-none focus:border-[#F2762E] transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm text-[#333] mb-2">CAC Registration Number</label>
            <input
              type="text"
              required
              placeholder="Enter your CAC number"
              className="w-full h-11 px-4 rounded-md border border-[#F2A65A] bg-white text-sm text-[#333] placeholder:text-[#B0B0B0] outline-none focus:border-[#F2762E] transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm text-[#333] mb-2">Office Location</label>
            <input
              type="text"
              required
              placeholder="Enter your office location"
              className="w-full h-11 px-4 rounded-md border border-[#F2A65A] bg-white text-sm text-[#333] placeholder:text-[#B0B0B0] outline-none focus:border-[#F2762E] transition-colors"
            />
          </div>
        </div>

        <div className="flex justify-center pt-4">
          <button
            type="submit"
            className="
              w-full max-w-[420px] h-12
              bg-[#F2762E] hover:bg-[#E0651E]
              text-white text-sm font-semibold
              rounded-md
              transition-colors cursor-pointer
            "
          >
            Continue
          </button>
        </div>
      </form>
    </RegisterStepLayout>
  );
};

export default RegisterBusinessInfo;