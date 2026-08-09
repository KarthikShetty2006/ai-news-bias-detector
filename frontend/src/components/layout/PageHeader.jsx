export default function PageHeader({
  title,
  subtitle,
  action,
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
          {title}
        </h1>

        {subtitle && (
          <p className="mt-2 text-slate-600 max-w-2xl">
            {subtitle}
          </p>
        )}
      </div>

      {action}
    </div>
  );
}