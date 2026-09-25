import type { ReactNode } from "react";

interface WrapperProps {
  children: ReactNode;
}

const Wrapper = ({ children }: WrapperProps) => {
  return (
    <main className="min-h-screen w-full pl-0 lg:pl-60 pt-[72px] transition-[padding] duration-300">
      <div className="px-3.5 py-5 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {children}
      </div>
    </main>
  );
};

export default Wrapper;