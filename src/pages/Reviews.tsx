import Wrapper from "../components/Wrapper";
import RatingBar from "./RatingBar";
import ReviewCard from "./ReviewCard";

const ratings = [
  { stars: 5, count: 250, percentage: 79 },
  { stars: 4, count: 55, percentage: 17 },
  { stars: 3, count: 9, percentage: 3 },
  { stars: 2, count: 3, percentage: 1 },
  { stars: 1, count: 1, percentage: 0.5 },
];

const reviews = Array.from({ length: 4 }).map((_, i) => ({
  id: String(i + 1),
  name: "Raymond Oyekunle",
  country: "Nigeria",
  rating: 5,
  timeAgo: "2 month ago",
  comment: "Amazing product, will definitely order for more.",
  response: "Thank you so much",
}));

const Reviews = () => {
  return (
    <Wrapper>
      <section className="w-full">
        <h1 className="text-xl font-semibold text-[#2B2B2B] mb-5">Reviews</h1>

        <div className="bg-white rounded-lg border border-[#EEEEEE] shadow-[0_2px_8px_rgba(0,0,0,0.08)] px-6 py-6">
          {/* Rating summary */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-sm font-medium text-[#2B2B2B]">318 reviews</span>
              <span className="text-[#FFA800] text-sm">★★★★★</span>
            </div>

            <div className="space-y-2 max-w-md">
              {ratings.map((r) => (
                <RatingBar key={r.stars} {...r} />
              ))}
            </div>
          </div>

          {/* Review grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-5 mb-4">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>

          <button type="button" className="text-sm text-[#2F7A3D] font-medium hover:underline cursor-pointer">
            See more
          </button>
        </div>
      </section>
    </Wrapper>
  );
};

export default Reviews;