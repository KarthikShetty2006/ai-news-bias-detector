import { motion } from "framer-motion";

export default function Button({
  children,
  type = "button",
  variant = "primary",
  className = "",
  disabled = false,
  ...props
}) {
  const variants = {
    primary:
      "bg-[image:var(--button-gradient)] text-white hover:opacity-95",

    secondary:
      "bg-white border border-[var(--border)] text-slate-700 hover:bg-slate-50",

    danger:
      "bg-red-500 text-white hover:bg-red-600",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.015 }}
      whileTap={{ scale: 0.985 }}
      transition={{ duration: 0.15 }}
      type={type}
      disabled={disabled}
      className={`
        inline-flex
        items-center
        justify-center
        rounded-xl
        px-5
        py-3
        font-medium
        shadow-sm
        transition-all
        duration-200
        disabled:opacity-60
        disabled:pointer-events-none
        ${variants[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.button>
  );
}