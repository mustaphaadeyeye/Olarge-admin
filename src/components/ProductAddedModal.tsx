import { CheckCircle2 } from "lucide-react";

interface ProductAddedModalProps {
  open: boolean;
  onClose: () => void;
}

const ProductAddedModal = ({ open, onClose }: ProductAddedModalProps) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-lg px-8 py-8 w-full max-w-[360px] flex flex-col items-center text-center shadow-[0_10px_30px_rgba(0,0,0,0.15)]"
      >
        <span className="w-14 h-14 rounded-full bg-[#2F7A3D]/10 flex items-center justify-center mb-4">
          <CheckCircle2 size={30} className="text-[#2F7A3D]" />
        </span>

        <h2 className="text-base font-semibold text-[#2B2B2B] mb-1">
          Product added
        </h2>
        <p className="text-sm text-[#8A8A8A] mb-6">
          Your new product has been saved and listed.
        </p>

        <button
          type="button"
          onClick={onClose}
          className="
            w-full
            bg-[#2F7A3D] hover:bg-[#256331]
            text-white text-sm font-medium
            rounded-md
            py-2.5
            transition-colors
            cursor-pointer
          "
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default ProductAddedModal;