interface ConfirmActionModalProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
}

const ConfirmActionModal = ({
  open,
  title,
  description,
  confirmLabel,
  onCancel,
  onConfirm,
}: ConfirmActionModalProps) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4"
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-lg px-7 py-7 w-full max-w-[400px] shadow-[0_10px_30px_rgba(0,0,0,0.15)]"
      >
        <h2 className="text-base font-semibold text-[#2B2B2B] mb-2">{title}</h2>
        <p className="text-sm text-[#777] mb-6">{description}</p>

        <div className="flex items-center gap-3 justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="
              text-sm font-medium text-[#555]
              bg-[#EAEAEA] hover:bg-[#DEDEDE]
              rounded-md px-4 py-2.5
              transition-colors cursor-pointer
            "
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="
              text-sm font-medium text-white
              bg-[#E23434] hover:bg-[#C22525]
              rounded-md px-4 py-2.5
              transition-colors cursor-pointer
            "
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmActionModal;