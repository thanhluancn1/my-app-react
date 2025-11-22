// src/components/Button.jsx
export default function Button({
  label,
  onClick,
  type = "primary",
  icon = null,       // có thể truyền icon JSX
  loading = false,   // trạng thái loading
  disabled = false,  // disable button
}) {
  const baseClass = "px-4 py-2 rounded font-semibold flex items-center justify-center gap-2 transition-colors duration-200";

  let typeClass = "";
  switch (type) {
    case "primary":
      typeClass = "bg-blue-500 text-white hover:bg-blue-600";
      break;
    case "secondary":
      typeClass = "bg-gray-300 text-black hover:bg-gray-400";
      break;
    case "danger":
      typeClass = "bg-red-500 text-white hover:bg-red-600";
      break;
    default:
      typeClass = "bg-blue-500 text-white hover:bg-blue-600";
  }

  if (disabled) {
    typeClass += " opacity-50 cursor-not-allowed hover:bg-none";
  }

  return (
    <button
      className={`${baseClass} ${typeClass}`}
      onClick={loading || disabled ? null : onClick}
      disabled={disabled || loading}
    >
      {loading && (
        <svg
          className="animate-spin h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z"
          ></path>
        </svg>
      )}
      {icon && !loading && icon}
      {!loading && label}
    </button>
  );
}
