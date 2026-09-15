const BankDetails = () => {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-base font-semibold text-[#2B2B2B]">Account Name</h2>
        <button
          type="button"
          className="
            text-sm font-medium text-white
            bg-[#2F7A3D] hover:bg-[#256331]
            rounded-md px-4 py-2.5
            transition-colors cursor-pointer
          "
        >
          Add Bank Account
        </button>
      </div>

      <div className="mb-5">
        <input
          type="text"
          placeholder="Account holder name"
          className="w-full h-11 px-4 rounded-md border border-[#D9D9D9] text-sm text-[#333] outline-none focus:border-[#2F7A3D] transition-colors"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
        <div>
          <label className="block text-sm text-[#444] mb-2">Bank Name</label>
          <input
            type="text"
            className="w-full h-11 px-4 rounded-md border border-[#D9D9D9] text-sm text-[#333] outline-none focus:border-[#2F7A3D] transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm text-[#444] mb-2">Account Number</label>
          <input
            type="text"
            className="w-full h-11 px-4 rounded-md border border-[#D9D9D9] text-sm text-[#333] outline-none focus:border-[#2F7A3D] transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm text-[#444] mb-2">BVN</label>
          <input
            type="text"
            className="w-full h-11 px-4 rounded-md border border-[#D9D9D9] text-sm text-[#333] outline-none focus:border-[#2F7A3D] transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm text-[#444] mb-2">Preferred Payment Method</label>
          <input
            type="text"
            className="w-full h-11 px-4 rounded-md border border-[#D9D9D9] text-sm text-[#333] outline-none focus:border-[#2F7A3D] transition-colors"
          />
        </div>
      </div>
    </div>
  );
};

export default BankDetails;