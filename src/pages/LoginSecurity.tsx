import { useState } from "react";
import { Mail, Lock, ShieldCheck, FileWarning, Trash2 } from "lucide-react";
import ConfirmActionModal from "../components/ConfirmActionModal";

const LoginSecurity = () => {
  const [twoStep, setTwoStep] = useState(false);
  const [modal, setModal] = useState<"deactivate" | "delete" | null>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#F7F9F8] rounded-lg px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#E2E2E2] shrink-0" />
            <div>
              <h2 className="text-base font-semibold text-[#2B2B2B]">Ope John</h2>
              <p className="text-xs text-[#9A9A9A]">opejohn@gmail.com</p>
            </div>
          </div>

          <button
            type="button"
            className="
              text-sm font-medium text-[#2F7A3D]
              border border-[#2F7A3D]/40
              rounded-md px-4 py-1.5
              hover:bg-[#2F7A3D]/5
              transition-colors cursor-pointer
            "
          >
            Edit
          </button>
        </div>

        <h3 className="text-sm font-semibold text-[#2B2B2B] mb-4 flex items-center gap-2">
          <ShieldCheck size={16} className="text-[#2F7A3D]" />
          Account Security
        </h3>

        <div className="space-y-2.5">
          <button
            type="button"
            className="w-full flex items-center justify-between bg-white rounded-md px-4 py-3.5 hover:bg-[#FAFAFA] transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2.5 text-sm text-[#2B2B2B]">
              <Mail size={15} className="text-[#2F7A3D]" />
              Email Address
            </span>
            <span className="text-sm text-[#9A9A9A]">opejohn@gmail.com</span>
          </button>

          <button
            type="button"
            className="w-full flex items-center justify-between bg-[#EAF6EC] rounded-md px-4 py-3.5 hover:bg-[#E0F1E3] transition-colors cursor-pointer"
          >
            <span className="min-w-0 text-left">
              <span className="flex items-center gap-2.5 text-sm text-[#2B2B2B] font-medium">
                <Lock size={15} className="text-[#2F7A3D]" />
                Password
              </span>
              <span className="block text-xs text-[#8A8A8A] mt-0.5 ml-[23px]">
                Set a password to login to your account
              </span>
            </span>
          </button>

          <div className="w-full flex items-center justify-between bg-white rounded-md px-4 py-3.5">
            <span className="min-w-0 text-left">
              <span className="flex items-center gap-2.5 text-sm text-[#2B2B2B] font-medium">
                <ShieldCheck size={15} className="text-[#2F7A3D]" />
                2-step verification
              </span>
              <span className="block text-xs text-[#8A8A8A] mt-0.5 ml-[23px]">
                Add an additional layer of security to your account
              </span>
            </span>

            <button
              type="button"
              onClick={() => setTwoStep((v) => !v)}
              className={`w-10 h-5.5 rounded-full relative transition-colors cursor-pointer shrink-0 ${
                twoStep ? "bg-[#2F7A3D]" : "bg-[#D9D9D9]"
              }`}
              style={{ height: 22 }}
              aria-label="Toggle 2-step verification"
            >
              <span
                className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                  twoStep ? "translate-x-[22px]" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Account actions */}
      <div>
        <h3 className="text-sm font-semibold text-[#2B2B2B] mb-3">Account Actions</h3>

        <div className="space-y-2.5">
          <div className="flex items-center justify-between bg-[#F7F9F8] rounded-lg px-5 py-4">
            <span className="flex items-start gap-2.5">
              <FileWarning size={16} className="text-[#555] mt-0.5" />
              <span>
                <span className="block text-sm font-medium text-[#2B2B2B]">Deactivate Account</span>
                <span className="block text-xs text-[#9A9A9A] mt-0.5">
                  Your store and products will be hidden until you reactivate your account.
                </span>
              </span>
            </span>

            <button
              type="button"
              onClick={() => setModal("deactivate")}
              className="
                text-sm font-medium text-white
                bg-[#2F7A3D] hover:bg-[#256331]
                rounded-md px-4 py-2
                transition-colors cursor-pointer shrink-0
              "
            >
              Deactivate
            </button>
          </div>

          <div className="flex items-center justify-between bg-[#F7F9F8] rounded-lg px-5 py-4">
            <span className="flex items-start gap-2.5">
              <Trash2 size={16} className="text-[#E23434] mt-0.5" />
              <span>
                <span className="block text-sm font-medium text-[#2B2B2B]">Delete Account</span>
                <span className="block text-xs text-[#9A9A9A] mt-0.5">
                  This action cannot be undone. All products, orders, and account information will be permanently deleted.
                </span>
              </span>
            </span>

            <button
              type="button"
              onClick={() => setModal("delete")}
              className="
                text-sm font-medium text-white
                bg-[#E23434] hover:bg-[#C22525]
                rounded-md px-4 py-2
                transition-colors cursor-pointer shrink-0
              "
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      <ConfirmActionModal
        open={modal === "deactivate"}
        title="Deactivate account?"
        description="Your store and products will be hidden until you reactivate your account. You can reactivate anytime by logging back in."
        confirmLabel="Deactivate"
        onCancel={() => setModal(null)}
        onConfirm={() => {
          // TODO: call deactivate API
          setModal(null);
        }}
      />

      <ConfirmActionModal
        open={modal === "delete"}
        title="Delete account?"
        description="This action cannot be undone. All products, orders, and account information will be permanently deleted."
        confirmLabel="Delete"
        onCancel={() => setModal(null)}
        onConfirm={() => {
          // TODO: call delete API
          setModal(null);
        }}
      />
    </div>
  );
};

export default LoginSecurity;