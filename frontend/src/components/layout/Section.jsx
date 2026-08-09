export default function Section({
  children,
  className = "",
}) {
  return (
    <section
      className={`
        py-14
        md:py-20
        ${className}
      `}
    >
      {children}
    </section>
  );
}