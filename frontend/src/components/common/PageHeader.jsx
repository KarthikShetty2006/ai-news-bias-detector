export default function PageHeader({
  eyebrow,
  title,
  description,
  action,
}) {
  return (
    <div className="flex flex-col gap-5 border-b border-slate-200 pb-8 md:flex-row md:items-end md:justify-between">

      <div>
        {eyebrow && (
          <p className="mb-3 text-sm font-medium text-blue-600">
            {eyebrow}
          </p>
        )}

        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          {title}
        </h1>

        {description && (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            {description}
          </p>
        )}
      </div>

      {action && (
        <div className="shrink-0">
          {action}
        </div>
      )}
    </div>
  );
}