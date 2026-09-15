interface PaymentMethodRowProps {
  brand: string;
  expiry: string;
  isDefault?: boolean;
}

const PaymentMethodRow = ({ brand, expiry, isDefault }: PaymentMethodRowProps) => (
  <div className="flex items-center justify-between bg-white rounded-lg border border-[#E3F1E5] px-4 py-3.5">
    <div className="flex items-center gap-3">
      <span className="w-9 h-6 rounded bg-[#FFA800] flex items-center justify-center shrink-0" />
      <div>
        <p className="text-sm text-[#2B2B2B] font-medium">{brand}</p>
        <p className="text-xs text-[#9A9A9A]">Expires {expiry}</p>
      </div>
    </div>

    {isDefault && (
      <span className="text-xs font-medium text-[#2F7A3D] bg-[#E3F5E6] rounded-full px-3 py-1">
        Default
      </span>
    )}
  </div>
);

export default PaymentMethodRow;