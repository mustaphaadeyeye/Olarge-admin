import { useState, useEffect, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import cropProduceImg from "../assets/crop_produce.jpg";
import cropGrainsImg from "../assets/crop_grains.jpg";
import cropVeggiesImg from "../assets/crop_veggies.jpg";
import cropTubersImg from "../assets/crop_tubers.jpg";

export interface CarouselSlide {
  image: string;
  category: string;
  title: string;
}

const DEFAULT_SLIDES: CarouselSlide[] = [
  {
    image: cropProduceImg,
    category: "Direct from Farms",
    title: "From local farm gates to regional supply, manage agriculture with precision.",
  },
  {
    image: cropGrainsImg,
    category: "Bulk Grain Distribution",
    title: "Streamline bulk cereal and grain inventory across certified warehouses.",
  },
  {
    image: cropVeggiesImg,
    category: "Fresh Produce Logistics",
    title: "Connecting farmers and wholesale buyers with premium harvests daily.",
  },
  {
    image: cropTubersImg,
    category: "Root Crops & Staples",
    title: "Empowering Nigerian farmers and agricultural merchants nationwide.",
  },
];

interface AuthLayoutProps {
  children: ReactNode;
  /** When true, renders the [ Log In | Sign Up ] segmented control */
  showTabs?: boolean;
  activeTab?: "login" | "signup";
  /** When true, renders a top bar with "< Back to Login" and the Olarge logo */
  showBackToLogin?: boolean;
  /** Main heading on the right side */
  title?: string;
  /** Optional subtitle below the main heading */
  subtitle?: string;
  /** Optional custom slides for the carousel */
  slides?: CarouselSlide[];
  /** Optional single banner title override */
  bannerTitle?: string;
  /** Optional single banner category override */
  bannerCategory?: string;
}

const AuthLayout = ({
  children,
  showTabs = false,
  activeTab = "login",
  showBackToLogin = false,
  title,
  subtitle,
  slides = DEFAULT_SLIDES,
  bannerTitle,
  bannerCategory,
}: AuthLayoutProps) => {
  const activeSlides = slides.map((s, idx) => {
    if (idx === 0) {
      return {
        ...s,
        category: bannerCategory || s.category,
        title: bannerTitle || s.title,
      };
    }
    return s;
  });
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-advance carousel slide every 5 seconds
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [activeSlides.length, isPaused]);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
  };

  return (
    <div className="min-h-screen w-full bg-[#FAFAFA] flex items-center justify-center p-4 sm:p-6 lg:p-10 font-sans">
      <div className="w-full max-w-[1080px] bg-white border border-gray-200 rounded-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
        {/* Left Column: Crop Produce Image Carousel */}
        <div className="lg:col-span-6 relative p-3 sm:p-4 flex flex-col">
          <div
            className="relative w-full h-[320px] lg:h-full min-h-[300px] rounded-lg overflow-hidden border border-gray-100 flex flex-col justify-end group select-none"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Sliding / Crossfading Images */}
            {activeSlides.map((slide, index) => {
              const isActive = index === currentSlide;
              return (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                    isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                  }`}
                >
                  <img
                    src={slide.image}
                    alt={slide.category}
                    className="w-full h-full object-cover object-center"
                  />
                  {/* Flat dark scrim overlay for crisp text readability */}
                  <div className="absolute inset-0 bg-black/45" />
                </div>
              );
            })}

            {/* Subtle Navigation Arrows on Hover */}
            <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous slide"
                className="w-7 h-7 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next slide"
                className="w-7 h-7 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Banner Text Overlay & Indicators */}
            <div className="relative z-20 p-6 sm:p-8 text-white space-y-3">
              <span className="inline-block text-xs font-semibold uppercase tracking-wider text-emerald-300">
                {activeSlides[currentSlide].category}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold leading-snug tracking-tight max-w-[380px] min-h-[56px] line-clamp-2">
                {activeSlides[currentSlide].title}
              </h2>

              {/* Interactive Carousel Indicator Pills */}
              <div className="flex items-center gap-2 pt-2">
                {activeSlides.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentSlide(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                      idx === currentSlide
                        ? "w-6 bg-white"
                        : "w-2 bg-white/40 hover:bg-white/70"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Form Area */}
        <div className="lg:col-span-6 flex flex-col justify-between p-6 sm:p-10 lg:p-12">
          {/* Top Bar / Navigation */}
          <div>
            {showBackToLogin ? (
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <ArrowLeft size={14} />
                  <span>Back to Login</span>
                </Link>

                <div className="flex items-center gap-1.5">
                  <span className="text-base font-bold text-gray-900 tracking-tight">Olarge</span>
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#F2762E]" />
                </div>
              </div>
            ) : showTabs ? (
              <div className="space-y-4 mb-6">
                {/* Brand Header */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
                      Welcome to <span className="text-[#F2762E]">Olarge</span>
                    </h1>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500 font-normal">
                    Your Gateway to Effortless Produce Management.
                  </p>
                </div>

                {/* Segmented [ Log In | Sign Up ] pill tabs */}
                <div className="w-full grid grid-cols-2 p-1 bg-gray-100 rounded-md border border-gray-200">
                  <Link
                    to="/login"
                    className={`py-2 text-center text-xs font-semibold rounded transition-colors ${
                      activeTab === "login"
                        ? "bg-[#F2762E] text-white"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Log In
                  </Link>
                  <Link
                    to="/signup"
                    className={`py-2 text-center text-xs font-semibold rounded transition-colors ${
                      activeTab === "signup"
                        ? "bg-[#F2762E] text-white"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Sign Up
                  </Link>
                </div>
              </div>
            ) : (
              /* Brand logo for non-tab, non-back pages if any */
              <div className="flex items-center justify-end mb-6">
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-bold text-gray-900 tracking-tight">Olarge</span>
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#F2762E]" />
                </div>
              </div>
            )}

            {/* Optional Title & Subtitle for specific pages (e.g. Verify Code, Forgot Password) */}
            {(title || subtitle) && (
              <div className="mb-6 space-y-1.5">
                {title && (
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">
                    {title}
                  </h2>
                )}
                {subtitle && (
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    {subtitle}
                  </p>
                )}
              </div>
            )}

            {/* Main Form Content */}
            <div className="w-full">{children}</div>
          </div>

          {/* Clean Flat Footer */}
          <div className="pt-6 mt-6 border-t border-gray-100 text-center">
            <p className="text-[11px] text-gray-400">
              By accessing your account, you agree to Olarge's{" "}
              <a href="#" className="text-gray-600 hover:underline">
                Terms of Use
              </a>{" "}
              &{" "}
              <a href="#" className="text-gray-600 hover:underline">
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;