import { useState } from "react";
import { Mail, Lock, ShieldCheck, FileWarning, Trash2, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import ConfirmActionModal from "../components/ConfirmActionModal";
import { useUserProfile } from "../hooks/useUserProfile";

const LoginSecurity = () => {
  const { profile, changePassword, isUpdating, error, successMessage, clearMessages } = useUserProfile();
  const [twoStep, setTwoStep] = useState(false);
  const [modal, setModal] = useState<"deactivate" | "delete" | "password" | null>(null);

  // Change password form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordValidationErr, setPasswordValidationErr] = useState<string | null>(null);

  const handleOpenPasswordModal = () => {
    clearMessages();
    setPasswordValidationErr(null);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setModal("password");
  };

  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordValidationErr(null);

    if (newPassword.length < 8) {
      setPasswordValidationErr("New password must be at least 8 characters long.");
      return;
    }
    if (!/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/.test(newPassword)) {
      setPasswordValidationErr("New password must contain at least 1 uppercase, 1 lowercase, and 1 number/special character.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordValidationErr("New passwords do not match.");
      return;
    }

    try {
      await changePassword({ currentPassword, newPassword });
      setTimeout(() => {
        setModal(null);
      }, 1500);
    } catch {
      // Error handled by hook
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#F7F9F8] rounded-lg px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#E2E2E2] shrink-0 overflow-hidden flex items-center justify-center border border-[#D5E5D8]">
              {profile?.avatar ? (
                <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-lg font-bold text-[#2F7A3D]">
                  {profile?.name?.charAt(0).toUpperCase() || "A"}
                </span>
              )}
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#2B2B2B]">{profile?.name || "Admin"}</h2>
              <p className="text-xs text-[#9A9A9A]">{profile?.email || "admin@olage.ng"}</p>
            </div>
          </div>
        </div>

        <h3 className="text-sm font-semibold text-[#2B2B2B] mb-4 flex items-center gap-2">
          <ShieldCheck size={16} className="text-[#2F7A3D]" />
          Account Security
        </h3>

        <div className="space-y-2.5">
          <div className="w-full flex items-center justify-between bg-white rounded-md px-4 py-3.5">
            <span className="flex items-center gap-2.5 text-sm text-[#2B2B2B]">
              <Mail size={15} className="text-[#2F7A3D]" />
              Email Address
            </span>
            <span className="text-sm text-[#9A9A9A]">{profile?.email || "—"}</span>
          </div>

          <button
            type="button"
            onClick={handleOpenPasswordModal}
            className="w-full flex items-center justify-between bg-[#EAF6EC] rounded-md px-4 py-3.5 hover:bg-[#E0F1E3] transition-colors cursor-pointer"
          >
            <span className="min-w-0 text-left">
              <span className="flex items-center gap-2.5 text-sm text-[#2B2B2B] font-medium">
                <Lock size={15} className="text-[#2F7A3D]" />
                Password
              </span>
              <span className="block text-xs text-[#8A8A8A] mt-0.5 ml-[23px]">
                Change account password securely
              </span>
            </span>
            <span className="text-xs font-semibold text-[#2F7A3D] px-3 py-1 bg-white rounded border border-[#2F7A3D]/20">
              Update
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

      {/* Change Password Modal */}
      {modal === "password" && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4"
          onClick={() => setModal(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-lg px-7 py-7 w-full max-w-[460px] shadow-[0_10px_30px_rgba(0,0,0,0.15)]"
          >
            <h2 className="text-base font-semibold text-[#2B2B2B] mb-1">Change Password</h2>
            <p className="text-xs text-[#777] mb-5">
              Enter your current password and a new secure password.
            </p>

            {(passwordValidationErr || error) && (
              <div className="mb-4 bg-[#FDF2F2] border border-[#F8B4B4] rounded-md p-3 flex items-start gap-2 text-xs text-[#9B1C1C]">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span>{passwordValidationErr || error}</span>
              </div>
            )}

            {successMessage && (
              <div className="mb-4 bg-[#EDF8F0] border border-[#A7E3B6] rounded-md p-3 flex items-center gap-2 text-xs text-[#206631]">
                <CheckCircle2 size={16} className="shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            <form onSubmit={handleChangePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-[#555] mb-1.5 font-medium">Current Password</label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full h-10 px-3 rounded-md border border-[#D9D9D9] text-sm text-[#333] outline-none focus:border-[#2F7A3D]"
                />
              </div>

              <div>
                <label className="block text-xs text-[#555] mb-1.5 font-medium">New Password</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full h-10 px-3 rounded-md border border-[#D9D9D9] text-sm text-[#333] outline-none focus:border-[#2F7A3D]"
                />
                <p className="text-[11px] text-[#888] mt-1">
                  At least 8 chars, 1 uppercase, 1 lowercase, 1 number/symbol.
                </p>
              </div>

              <div>
                <label className="block text-xs text-[#555] mb-1.5 font-medium">Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full h-10 px-3 rounded-md border border-[#D9D9D9] text-sm text-[#333] outline-none focus:border-[#2F7A3D]"
                />
              </div>

              <div className="flex items-center gap-3 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setModal(null)}
                  disabled={isUpdating}
                  className="text-xs font-medium text-[#555] bg-[#EAEAEA] hover:bg-[#DEDEDE] rounded-md px-4 py-2 transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex items-center gap-1.5 text-xs font-medium text-white bg-[#2F7A3D] hover:bg-[#256331] rounded-md px-4 py-2 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isUpdating && <Loader2 size={14} className="animate-spin" />}
                  {isUpdating ? "Updating..." : "Change Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmActionModal
        open={modal === "deactivate"}
        title="Deactivate account?"
        description="Your store and products will be hidden until you reactivate your account. You can reactivate anytime by logging back in."
        confirmLabel="Deactivate"
        onCancel={() => setModal(null)}
        onConfirm={() => {
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
          setModal(null);
        }}
      />
    </div>
  );
};

export default LoginSecurity;
