import { Check } from "lucide-react";

interface RegistrationSuccessModalProps {
  open: boolean;
  onClose: () => void;
}

const RegistrationSuccessModal = ({ open, onClose }: RegistrationSuccessModalProps) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="
          w-full max-w-[300px]
          rounded-2xl px-8 py-10
          flex flex-col items-center text-center
          shadow-[0_10px_30px_rgba(0,0,0,0.2)]
        "
        style={{
          background: "linear-gradient(135deg, #7FD8A0 0%, #F2E9A8 55%, #F2C08A 100%)",
        }}
      >
        <div className="w-16 h-16 rounded-xl bg-[#F0EDE4] flex items-center justify-center mb-6 shadow-[0_4px_10px_rgba(0,0,0,0.15)] rotate-[-4deg]">
          <Check size={30} strokeWidth={3} className="text-[#F2762E]" />
        </div>

        <p className="text-base font-bold text-[#2B2B2B] leading-snug mb-6">
          Registration Completed
          <br />
          Successfully!
        </p>

        <button
          type="button"
          onClick={onClose}
          className="
            text-sm font-semibold text-[#2B2B2B]
            bg-white/70 hover:bg-white
            rounded-md px-6 py-2.5
            transition-colors cursor-pointer
          "
        >
          Continue to Login
        </button>
      </div>
    </div>
  );
};

export default RegistrationSuccessModal;