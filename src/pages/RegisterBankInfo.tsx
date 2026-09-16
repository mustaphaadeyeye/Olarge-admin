import RegisterStepLayout from "./RegisterStepLayout";

interface RegisterBankInfoProps {
  onBack: () => void;
  onSubmit: () => void;
}

const RegisterBankInfo = ({ onBack, onSubmit }: RegisterBankInfoProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <RegisterStepLayout stepLabel="Bank Information">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm text-[#333] mb-2">Bank Name</label>
            <input
              type="text"
              required
              placeholder="Enter your bank name"
              className="w-full h-11 px-4 rounded-md border border-[#F2A65A] bg-white text-sm text-[#333] placeholder:text-[#B0B0B0] outline-none focus:border-[#F2762E] transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm text-[#333] mb-2">Bank Account Number</label>
            <input
              type="text"
              required
              placeholder="Enter your account number"
              className="w-full h-11 px-4 rounded-md border border-[#F2A65A] bg-white text-sm text-[#333] placeholder:text-[#B0B0B0] outline-none focus:border-[#F2762E] transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
            <label className="block text-sm text-[#333] mb-2">BVN</label>
            <input
              type="text"
              required
              placeholder="Enter your BVN"
              className="w-full h-11 px-4 rounded-md border border-[#F2A65A] bg-white text-sm text-[#333] placeholder:text-[#B0B0B0] outline-none focus:border-[#F2762E] transition-colors"
            />
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 pt-4">
          <button
            type="button"
            onClick={onBack}
            className="
              w-full max-w-[200px] h-12
              bg-white hover:bg-[#F7F7F7]
              border border-[#D9D9D9]
              text-[#333] text-sm font-semibold
              rounded-md
              transition-colors cursor-pointer
            "
          >
            Back
          </button>

          <button
            type="submit"
            className="
              w-full max-w-[200px] h-12
              bg-[#F2762E] hover:bg-[#E0651E]
              text-white text-sm font-semibold
              rounded-md
              transition-colors cursor-pointer
            "
          >
            Submit
          </button>
        </div>
      </form>
    </RegisterStepLayout>
  );
};

export default RegisterBankInfo;