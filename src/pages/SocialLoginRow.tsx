const SocialLoginRow = () => {
  return (
    <div className="mt-6">
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-[#C9E8CD]" />
        <span className="text-xs text-[#6B6B6B]">Or log in with</span>
        <div className="flex-1 h-px bg-[#C9E8CD]" />
      </div>

      <div className="flex items-center justify-center gap-4 mt-4">
        <button
          type="button"
          className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-sm hover:shadow transition-shadow cursor-pointer"
          aria-label="Continue with Facebook"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
            <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.44 2.91h-2.34V22c4.78-.79 8.44-4.94 8.44-9.94z" />
          </svg>
        </button>

        <button
          type="button"
          className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-sm hover:shadow transition-shadow cursor-pointer"
          aria-label="Continue with Google"
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z" />
            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.28v3.09C3.26 21.3 7.31 24 12 24z" />
            <path fill="#FBBC05" d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.28A11.98 11.98 0 000 12c0 1.94.46 3.77 1.28 5.38l3.99-3.09z" />
            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.28 6.62l3.99 3.09c.95-2.85 3.6-4.96 6.73-4.96z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default SocialLoginRow;