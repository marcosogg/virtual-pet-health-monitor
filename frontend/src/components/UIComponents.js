import React from "react";

export const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) => {
  const baseClasses =
    "font-bold rounded transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variantClasses = {
    primary: "bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500",
    secondary:
      "bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
  };
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export const Card = ({ children, className = "", ...props }) => {
  return (
    <div
      className={`bg-white shadow-md rounded-lg p-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const Input = React.forwardRef(({ label, error, ...props }, ref) => {
  return (
    <div className="mb-4">
      {label && (
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor={props.id}
        >
          {label}
        </label>
      )}
      <input
        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-primary-500 ${
          error ? "border-red-500" : ""
        }`}
        ref={ref}
        {...props}
      />
      {error && <p className="text-red-500 text-xs italic mt-1">{error}</p>}
    </div>
  );
});

export const Select = React.forwardRef(
  ({ label, options, error, ...props }, ref) => {
    return (
      <div className="mb-4">
        {label && (
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor={props.id}
          >
            {label}
          </label>
        )}
        <select
          className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-primary-500 ${
            error ? "border-red-500" : ""
          }`}
          ref={ref}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="text-red-500 text-xs italic mt-1">{error}</p>}
      </div>
    );
  }
);

export const LoadingSpinner = () => (
  <div className="flex justify-center items-center">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
  </div>
);

export const Alert = ({ children, type = "info" }) => {
  const typeClasses = {
    info: "bg-blue-100 border-blue-500 text-blue-700",
    success: "bg-green-100 border-green-500 text-green-700",
    warning: "bg-yellow-100 border-yellow-500 text-yellow-700",
    error: "bg-red-100 border-red-500 text-red-700",
  };

  return (
    <div className={`border-l-4 p-4 ${typeClasses[type]}`} role="alert">
      {children}
    </div>
  );
};

export const Icon = ({ name, className = "", text = "" }) => {
  const icons = {
    heart: "❤️",
    thermometer: "🌡️",
    lung: "🫁",
    running: "🏃",
    moon: "🌙",
    droplet: "💧",
    dog: "🐕",
    cat: "🐈",
    food: "🍖",
    water: "💧",
    paw: "🐾",
    bell: "🔔",
    chart: "📊",
    calendar: "📅",
    pill: "💊",
    vaccine: "💉",
    stethoscope: "🩺",
    bone: "🦴",
    fish: "🐠",
    bird: "🐦",
    rabbit: "🐰",
    hamster: "🐹",
    turtle: "🐢",
    poop: "💩",
    leash: "🐕‍🦺",
    brush: "🧹",
    scissors: "✂️",
    bath: "🛁",
    toy: "🧸",
    bed: "🛏️",
    house: "🏠",
    park: "🏞️",
    vet: "👨‍⚕️",
    microscope: "🔬",
    "x-ray": "🦴",
    bandage: "🩹",
    weight: "⚖️",
    collar: "🔗",
    clock: "⏰",
    sun: "☀️",
    rain: "🌧️",
    snow: "❄️",
    hot: "🥵",
    cold: "🥶",
    flea: "🐜",
    tick: "🕷️",
    grooming: "💇",
    tooth: "🦷",
    ear: "👂",
    eye: "👁️",
    nose: "👃",
    "paw-print": "🐾",
    "first-aid-kit": "🧳",
    "pet-carrier": "🧳",
    "pet-food-bowl": "🥣",
  };

  return (
    <div className={`flex items-center ${className}`}>
      <span className="mr-2">{icons[name] || name}</span>
      {text && <span>{text}</span>}
    </div>
  );
};

export const Tooltip = ({ children, text }) => {
  return (
    <div className="relative group">
      {children}
      <div className="absolute z-10 invisible group-hover:visible bg-gray-800 text-white text-xs rounded py-1 px-2 bottom-full left-1/2 transform -translate-x-1/2 mb-2">
        {text}
        <svg
          className="absolute text-gray-800 h-2 w-full left-0 top-full"
          x="0px"
          y="0px"
          viewBox="0 0 255 255"
        >
          <polygon className="fill-current" points="0,0 127.5,127.5 255,0" />
        </svg>
      </div>
    </div>
  );
};

export const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed z-10 inset-0 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
          onClick={onClose}
        ></div>
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3
                  className="text-lg leading-6 font-medium text-gray-900"
                  id="modal-title"
                >
                  {title}
                </h3>
                <div className="mt-2">{children}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const MetricCard = ({
  icon,
  label,
  value,
  unit,
  normalRange,
  timestamp,
  onViewDetails,
}) => {
  const getStatusColor = (value, normalRange) => {
    if (value === "N/A") return "text-gray-500";
    if (value < normalRange[0]) return "text-red-500";
    if (value > normalRange[1]) return "text-red-500";
    if (value === normalRange[0] || value === normalRange[1])
      return "text-yellow-500";
    return "text-green-500";
  };

  const isAbnormal = (value, normalRange) => {
    return value < normalRange[0] || value > normalRange[1];
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <Icon name={icon} className="w-8 h-8 mr-4" />
          <div>
            <p className="text-sm font-medium text-gray-500 capitalize">
              {label}
            </p>
            <p
              className={`text-2xl font-bold ${getStatusColor(
                value,
                normalRange
              )}`}
            >
              {value === "N/A" ? "N/A" : `${value} ${unit}`}
            </p>
          </div>
        </div>
        {isAbnormal(value, normalRange) && (
          <Tooltip text="This value is outside the normal range">
            <Icon name="bell" className="w-6 h-6 text-red-500" />
          </Tooltip>
        )}
      </div>
      <div className="flex items-center justify-between text-sm text-gray-500">
        {/* <p>Last updated: {new Date(timestamp).toLocaleString()}</p> */}
        <Button size="sm" onClick={onViewDetails}>
          View Details
        </Button>
      </div>
    </div>
  );
};

export const Dropdown = ({ options, value, onChange, className = "" }) => {
  return (
    <select
      className={`shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-primary-500 ${className}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};
