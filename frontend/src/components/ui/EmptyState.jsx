import { FileSearch } from "lucide-react";

export default function EmptyState({
  title = "Nothing found",
  description = "No data available.",
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
      <FileSearch
        size={44}
        className="mb-4 text-slate-400"
      />

      <h3 className="text-lg font-semibold text-slate-800">
        {title}
      </h3>

      <p className="mt-2 max-w-md text-sm text-slate-500">
        {description}
      </p>
    </div>
  );
}