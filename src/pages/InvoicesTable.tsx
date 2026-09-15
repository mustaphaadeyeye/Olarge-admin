interface Invoice {
  id: string;
  label: string;
  date: string;
  amount: string;
  status: "Paid" | "Pending" | "Failed";
}

const invoices: Invoice[] = [
  { id: "1", label: "Account sale", date: "May 17, 2026", amount: "#65,000", status: "Paid" },
  { id: "2", label: "Subscription", date: "May 17, 2026", amount: "#65,000", status: "Paid" },
  { id: "3", label: "Account sale", date: "May 17, 2026", amount: "#65,000", status: "Paid" },
  { id: "4", label: "Account sale", date: "May 17, 2026", amount: "#65,000", status: "Paid" },
];

const statusStyles: Record<Invoice["status"], string> = {
  Paid: "bg-[#DCEFFF] text-[#1E6FBF]",
  Pending: "bg-[#FFF1D6] text-[#B5790A]",
  Failed: "bg-[#FBDCDC] text-[#C22525]",
};

const InvoicesTable = () => {
  return (
    <div>
      <h2 className="text-sm font-semibold text-[#2B2B2B] mb-3">Invoices</h2>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse">
          <thead>
            <tr>
              <th className="text-left text-xs font-medium text-[#8A8A8A] pb-2.5">Invoice</th>
              <th className="text-left text-xs font-medium text-[#8A8A8A] pb-2.5">Date</th>
              <th className="text-left text-xs font-medium text-[#8A8A8A] pb-2.5">Amount</th>
              <th className="text-left text-xs font-medium text-[#8A8A8A] pb-2.5">Status</th>
              <th className="text-left text-xs font-medium text-[#8A8A8A] pb-2.5">Action</th>
            </tr>
          </thead>

          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.id} className="border-t border-[#E3F1E5]">
                <td className="text-sm text-[#2B2B2B] py-3">{inv.label}</td>
                <td className="text-sm text-[#555] py-3">{inv.date}</td>
                <td className="text-sm text-[#555] py-3">{inv.amount}</td>
                <td className="py-3">
                  <span className={`text-xs font-medium rounded-full px-3 py-1 ${statusStyles[inv.status]}`}>
                    {inv.status}
                  </span>
                </td>
                <td className="py-3">
                  <button type="button" className="text-sm text-[#2F7A3D] hover:underline cursor-pointer">
                    Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InvoicesTable;