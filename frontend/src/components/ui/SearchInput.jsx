import { Search } from "lucide-react";
import Input from "./Input";

export default function SearchInput({
  className = "",
  ...props
}) {
  return (
    <div className={`relative ${className}`}>
      <Search
        size={18}
        className="
          absolute
          left-4
          top-1/2
          -translate-y-1/2
          text-slate-400
        "
      />

      <Input
        className="pl-11"
        {...props}
      />
    </div>
  );
}