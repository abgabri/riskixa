import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { ShieldCheck, FileCheck2, ArrowRight, Linkedin } from "lucide-react";
import riskixaLogo from "@/assets/riskixa-logo.png.asset.json";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Riskixa — Compliance Readiness in Minutes" },
      {
        name: "description",
        content:
          "Riskixa empowers pre-audit teams to evaluate security posture across SOC 2, ISO 27001, HIPAA, and AWS Cloud Security — built by CISA-certified practitioner Abel Gabriel.",
      },
      { property: "og:title", content: "About Riskixa" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      {
        property: "og:description",
        content:
          "Built by practitioners, for practitioners. Riskixa turns complex regulatory requirements into actionable remediation strategies.",
      },
    ],
  }),
  component: AboutPage,
});

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const els = root.querySelectorAll<HTMLElement>("[data-reveal]");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("reveal-in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return ref;
}

function AboutPage() {
  const rootRef = useReveal();

  return (
    <div ref={rootRef} className="min-h-screen scroll-smooth bg-white text-slate-900 antialiased">
      <style>{`
        [data-reveal]{opacity:0;transform:translateY(16px);transition:opacity .7s ease-out,transform .7s ease-out}
        [data-reveal].reveal-in{opacity:1;transform:none}
        .grid-bg{
          background-image:
            linear-gradient(to right, rgba(15,23,42,0.06) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(15,23,42,0.06) 1px, transparent 1px);
          background-size: 44px 44px;
          mask-image: radial-gradient(ellipse at center, black 40%, transparent 75%);
        }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2">
            <img src={riskixaLogo.url} alt="Riskixa" className="h-9 w-auto" />
          </Link>
          <nav className="flex items-center gap-6 text-sm font-medium text-slate-600">
            <Link to="/" className="transition-colors hover:text-slate-900">Assessments</Link>
            <Link to="/about" className="text-slate-900">About</Link>
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-md bg-[#0b1f3a] px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[#0a1a30] hover:shadow-md"
            >
              Start free <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-bg" aria-hidden />
        <div className="pointer-events-none absolute inset-x-0 -top-40 h-96 bg-gradient-to-b from-[#0b1f3a]/5 to-transparent" aria-hidden />
        <div className="relative mx-auto max-w-4xl px-6 py-24 text-center md:py-32">
          <div data-reveal className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-medium text-slate-600 shadow-sm">
            <ShieldCheck className="h-3.5 w-3.5 text-[#0b1f3a]" />
            Built for pre-audit teams
          </div>
          <h1
            data-reveal
            className="mt-6 text-4xl font-semibold tracking-tight text-[#0b1f3a] sm:text-5xl md:text-6xl"
            style={{ transitionDelay: "80ms" }}
          >
            Compliance Readiness in Minutes.
          </h1>
          <p
            data-reveal
            className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600"
            style={{ transitionDelay: "160ms" }}
          >
            Riskixa empowers pre-audit teams to seamlessly evaluate their security posture across
            industry-leading frameworks, transforming complex regulatory requirements into
            actionable remediation strategies.
          </p>
        </div>
      </section>

      {/* Founder */}
      <section className="border-t border-slate-200/70 bg-white">
        <div className="mx-auto max-w-3xl px-6 py-24 text-center">
          <p data-reveal className="text-sm font-semibold uppercase tracking-wider text-[#0b1f3a]/70">
            The Expert Behind Riskixa
          </p>
          <h2
            data-reveal
            className="mt-3 text-3xl font-semibold tracking-tight text-[#0b1f3a] sm:text-4xl"
            style={{ transitionDelay: "60ms" }}
          >
            Built by Practitioners, for Practitioners.
          </h2>
          <div className="mt-6 space-y-5 text-[17px] leading-relaxed text-slate-600">
            <p data-reveal style={{ transitionDelay: "120ms" }}>
              Riskixa was developed by{" "}
              <a
                href="https://www.linkedin.com/in/abgabriel/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-slate-900 underline decoration-slate-400 underline-offset-4 transition-colors hover:text-[#0b1f3a] hover:decoration-[#0b1f3a]"
              >
                Abel Gabriel
              </a>
              , a CISA-certified IT Risk and Compliance leader with over a decade of hands-on
              experience in the global banking, fintech and telecommunications sectors. Holding a Master
              of Science in Information Technology Management, his background combines rigorous
              academic theory with high-stakes practical application.
            </p>
            <p data-reveal style={{ transitionDelay: "180ms" }}>
              Having led comprehensive internal control reviews, engineered automated compliance
              metrics, and guided enterprise teams through rigorous certifications, Riskixa was
              born out of a first-hand understanding of the complexities of the audit process. It
              is designed to bridge the gap between technical security and business strategy,
              giving organizations the clarity they need before the formal audit begins.
            </p>
          </div>
          <div data-reveal style={{ transitionDelay: "240ms" }} className="mt-8 flex flex-wrap justify-center gap-3">
            {["CISA Certified", "MS in IT Management", "10+ years", "Banking, Fintech & Telecom"].map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700"
              >
                <FileCheck2 className="h-3 w-3 text-[#0b1f3a]" />
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-[#0b1f3a] text-white">
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
          aria-hidden
        />
        <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-blue-400/10 blur-3xl" aria-hidden />
        <div className="relative mx-auto max-w-3xl px-6 py-24 text-center">
          <p data-reveal className="mx-auto max-w-2xl text-xs leading-relaxed text-white/60">
            Riskixa provides demo readiness assessments intended for internal evaluation and
            planning. It does not constitute a formal attestation of compliance.
          </p>
          <h3
            data-reveal
            className="mt-8 text-3xl font-semibold tracking-tight sm:text-4xl"
            style={{ transitionDelay: "80ms" }}
          >
            Ready to streamline your audit prep?
          </h3>
          <div
            data-reveal
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
            style={{ transitionDelay: "160ms" }}
          >
            <Link
              to="/"
              className="group inline-flex items-center gap-2 rounded-md bg-white px-6 py-3 text-sm font-semibold text-[#0b1f3a] shadow-lg shadow-black/20 transition-all hover:-translate-y-0.5 hover:bg-slate-100 hover:shadow-xl"
            >
              Try an Assessment
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a
              href="https://www.linkedin.com/in/abgabriel/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-white/30 bg-transparent px-6 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:border-white hover:bg-white/5"
            >
              <Linkedin className="h-4 w-4" />
              Connect with the Founder
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-500">
        Riskixa · Demo readiness assessment · Not an attestation of compliance
      </footer>
    </div>
  );
}
