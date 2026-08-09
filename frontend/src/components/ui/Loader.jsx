import { LoaderCircle } from "lucide-react";

export default function Loader({
  text = "Loading...",
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-4">
      <LoaderCircle
        size={34}
        className="animate-spin text-blue-600"
      />

      <p className="text-slate-500">
        {text}
      </p>
    </div>
  );
}