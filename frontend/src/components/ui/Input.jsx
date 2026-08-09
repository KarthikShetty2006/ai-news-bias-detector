export default function Input({
  className = "",
  ...props
}) {
  return (
    <input
      className={`
        w-full
        rounded-xl
        border
        border-[var(--border)]
        bg-white
        px-4
        py-3
        outline-none
        transition-all
        duration-200
        placeholder:text-slate-400
        focus:border-blue-500
        focus:ring-4
        focus:ring-blue-100
        ${className}
      `}
      {...props}
    />
  );
}