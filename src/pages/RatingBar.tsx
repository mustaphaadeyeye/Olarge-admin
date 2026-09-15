interface RatingBarProps {
  stars: number;
  count: number;
  percentage: number;
}

const RatingBar = ({ stars, count, percentage }: RatingBarProps) => (
  <div className="flex items-center gap-3">
    <span className="text-sm text-[#555] w-4">{stars}</span>
    <span className="text-[#FFA800] text-sm">★</span>
    <div className="flex-1 h-1.5 rounded-full bg-[#F0F0F0] overflow-hidden">
      <div className="h-full bg-[#FFA800] rounded-full" style={{ width: `${percentage}%` }} />
    </div>
    <span className="text-xs text-[#9A9A9A] w-10 text-right">({count})</span>
  </div>
);

export default RatingBar;