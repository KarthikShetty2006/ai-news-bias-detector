import Container from "./Container";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white/70">
      <Container>

        <div className="flex flex-col items-center justify-between gap-4 py-8 text-sm text-slate-500 md:flex-row">

          <p>
            © {new Date().getFullYear()} AI News Bias Detector
          </p>

          <p>
            Built with React, AI & Machine Learning
          </p>

        </div>

      </Container>
    </footer>
  );
}