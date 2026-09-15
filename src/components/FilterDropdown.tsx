import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

interface FilterDropdownProps {
  label: string;
  options: string[];
  value: string | null;
  onChange: (value: string | null) => void;
}

const FilterDropdown = ({ label, options, value, onChange }: FilterDropdownProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="
          flex items-center gap-2
          bg-[#F3F3F3] hover:bg-[#EAEAEA]
          text-sm text-[#555]
          rounded-md
          px-4 py-2
          transition-colors
          cursor-pointer
        "
      >
        {value ?? label}
        <ChevronDown size={15} className={`text-[#999] transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1.5 w-44 bg-white rounded-md border border-[#EEEEEE] shadow-[0_4px_16px_rgba(0,0,0,0.1)] py-1.5 z-20">
          <button
            type="button"
            onClick={() => {
              onChange(null);
              setOpen(false);
            }}
            className="w-full text-left text-sm text-[#888] px-4 py-2 hover:bg-[#F7F9F8] cursor-pointer"
          >
            All {label}
          </button>

          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className={`w-full text-left text-sm px-4 py-2 hover:bg-[#F7F9F8] cursor-pointer ${
                value === opt ? "text-[#2F7A3D] font-medium" : "text-[#444]"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;