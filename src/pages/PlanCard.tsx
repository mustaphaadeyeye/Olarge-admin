interface PlanCardProps {
  name: string;
  price: string;
  cadence: string;
  description: string;
  variant: "selected" | "outlined" | "filled";
}

const PlanCard = ({ name, price, cadence, description, variant }: PlanCardProps) => {
  const styles = {
    selected: "bg-[#F2FAF3] border-2 border-[#2F7A3D]",
    outlined: "bg-[#EEF6FE] border border-[#CFE3F7]",
    filled: "bg-[#FFA800] border border-[#FFA800]",
  }[variant];

  const textColor = variant === "filled" ? "text-white" : "text-[#2B2B2B]";
  const subTextColor = variant === "filled" ? "text-white/85" : "text-[#8A8A8A]";

  return (
    <div className={`rounded-lg px-5 py-5 ${styles}`}>
      <p className={`text-sm font-medium mb-4 ${textColor}`}>{name}</p>
      <h2 className={`text-2xl font-bold mb-0.5 ${textColor}`}>
        {price} <span className="text-sm font-normal">{cadence}</span>
      </h2>
      <p className={`text-xs ${subTextColor}`}>{description}</p>
    </div>
  );
};

export default PlanCard;