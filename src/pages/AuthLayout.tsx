import type { ReactNode } from "react";
import authImg from "../assets/authimg.png";

interface AuthLayoutProps {
  formTitle: string;
  children: ReactNode;
}

const AuthLayout = ({ formTitle, children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen w-full bg-[#E4FBE7] flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-[900px] grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        {/* Left: welcome + mascot */}
        <div className="flex flex-col justify-center">
          <h1 className="text-[28px] leading-tight font-bold text-[#2B2B2B] mb-8">
            Welcome to
            <br />
            Olarge Limited
          </h1>

         
          <div className="w-[220px] h-[240px] flex items-end">
            <img
              src={authImg}
              alt="Olage mascot"
              className="w-full h-full object-contain object-bottom"
            />
          </div>
        </div>

        {/* Right: form */}
        <div>
          <h2 className="text-lg font-semibold text-[#2B2B2B] text-center mb-6">
            {formTitle}
          </h2>

          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;