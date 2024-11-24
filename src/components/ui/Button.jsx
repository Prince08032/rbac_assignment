const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyles = "flex items-center gap-2 px-4 py-2 rounded-md transition-colors";
  const variants = {
    primary: "bg-blue-500 hover:bg-blue-600 text-white",
    secondary: "border border-black/[.08] dark:border-white/[.145] hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a]",
    danger: "bg-red-500 hover:bg-red-600 text-white",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button; 