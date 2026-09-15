import { ThumbsUp, ThumbsDown } from "lucide-react";

interface Review {
  id: string;
  name: string;
  country: string;
  rating: number;
  timeAgo: string;
  comment: string;
  response?: string;
}

const ReviewCard = ({ review }: { review: Review }) => {
  return (
    <div className="border-b border-[#F0F0F0] pb-5">
      <div className="flex items-start gap-3 mb-2">
        <span className="w-9 h-9 rounded-full bg-[#E5EDE7] flex items-center justify-center text-[#2F7A3D] font-semibold text-sm shrink-0">
          {review.name.charAt(0)}
        </span>

        <div className="min-w-0">
          <p className="text-sm font-medium text-[#2B2B2B]">{review.name}</p>
          <p className="text-xs text-[#8A8A8A] flex items-center gap-1">
            <span>🇳🇬</span> {review.country}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-2">
        <span className="text-[#FFA800] text-sm tracking-tight">
          {"★".repeat(review.rating)}
        </span>
        <span className="text-xs text-[#9A9A9A]">{review.timeAgo}</span>
      </div>

      <p className="text-sm text-[#444] mb-2.5">{review.comment}</p>

      <div className="flex items-center gap-4 mb-3">
        <span className="text-xs text-[#8A8A8A]">Helpful?</span>
        <button type="button" className="flex items-center gap-1 text-xs text-[#8A8A8A] hover:text-[#2F7A3D] cursor-pointer">
          <ThumbsUp size={13} /> Yes
        </button>
        <button type="button" className="flex items-center gap-1 text-xs text-[#8A8A8A] hover:text-[#E23434] cursor-pointer">
          <ThumbsDown size={13} /> No
        </button>
      </div>

      {review.response && (
        <div className="bg-[#F7F9F8] rounded-md px-3.5 py-2.5">
          <p className="text-xs font-medium text-[#2B2B2B] mb-0.5">Olagets Response</p>
          <p className="text-xs text-[#666]">{review.response} 😊</p>
        </div>
      )}
    </div>
  );
};

export default ReviewCard;