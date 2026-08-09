export default function Badge({
  children,
  color = "blue",
}) {
  const styles = {
    blue:
      "bg-blue-50 text-blue-700",

    green:
      "bg-green-50 text-green-700",

    red:
      "bg-red-50 text-red-700",

    purple:
      "bg-purple-50 text-purple-700",

    orange:
      "bg-orange-50 text-orange-700",

    slate:
      "bg-slate-100 text-slate-700",
  };

  return (
    <span
      className={`
        inline-flex
        items-center
        rounded-full
        px-3
        py-1
        text-sm
        font-medium
        ${styles[color]}
      `}
    >
      {children}
    </span>
  );
}