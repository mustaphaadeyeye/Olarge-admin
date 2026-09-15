import type { ReactNode } from "react";

interface WrapperProps {
  children: ReactNode;
}

const Wrapper = ({ children }: WrapperProps) => {
  return (
    <main className="min-h-screen w-full pl-60 pt-[72px]">
      <div className="px-5 py-6 sm:px-6 lg:px-8">
        {children}
      </div>
    </main>
  );
};

export default Wrapper;