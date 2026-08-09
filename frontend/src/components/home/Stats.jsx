import { Brain, Newspaper, ShieldCheck, Users } from "lucide-react";
import Container from "../layout/Container";

const stats = [
  {
    icon: <Brain size={28} />,
    value: "50K+",
    label: "Articles Analyzed",
  },
  {
    icon: <Newspaper size={28} />,
    value: "120+",
    label: "News Sources",
  },
  {
    icon: <ShieldCheck size={28} />,
    value: "95%",
    label: "AI Accuracy",
  },
  {
    icon: <Users size={28} />,
    value: "15K+",
    label: "Monthly Users",
  },
];

export default function Stats() {
  return (
    <section className="py-20 bg-white">
      <Container>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => (
            <div
              key={item.label}
              className="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                {item.icon}
              </div>

              <h2 className="mt-6 text-4xl font-bold text-slate-900">
                {item.value}
              </h2>

              <p className="mt-2 text-slate-600">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}