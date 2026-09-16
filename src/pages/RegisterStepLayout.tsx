import type { ReactNode } from "react";

interface RegisterStepLayoutProps {
  stepLabel: string;
  children: ReactNode;
}

const RegisterStepLayout = ({ stepLabel, children }: RegisterStepLayoutProps) => {
  return (
    <div className="min-h-screen w-full bg-[#E4FBE7] flex items-start justify-center px-6 py-14">
      <div className="w-full max-w-[600px]">
        <h1 className="text-xl font-bold text-[#2B2B2B] text-center mb-1">
          Register With Olage Limited
        </h1>
        <p className="text-sm text-[#555] text-center mb-10">{stepLabel}</p>

        {children}
      </div>
    </div>
  );
};

export default RegisterStepLayout;