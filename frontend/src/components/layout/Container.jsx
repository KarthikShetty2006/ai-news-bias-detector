export default function Container({ children, className = "" }) {
  return (
    <div
      className={className}
      style={{
        width: "calc(100% - 48px)",
        maxWidth: "1280px",
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      {children}
    </div>
  );
}