import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Check,
  AlertTriangle,
  XCircle,
  Download,
  FileText,
  Sparkles,
  RotateCcw,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AuditBridge — Compliance Readiness in Minutes" },
      {
        name: "description",
        content:
          "Assess your startup's SOC 2 readiness in minutes. Get a scored gap analysis and prioritized remediation plan before pursuing certification.",
      },
      { property: "og:title", content: "AuditBridge — Compliance Readiness in Minutes" },
      {
        property: "og:description",
        content:
          "Assess your startup's SOC 2 readiness in minutes with a scored gap analysis and prioritized remediation plan.",
      },
    ],
  }),
  component: AuditBridge,
});

type Answer = "yes" | "partial" | "no";

interface Question {
  id: string;
  area: string;
  question: string;
  risk: string;
  remediation: string;
  policy: string;
}

const QUESTIONS: Question[] = [
  {
    id: "access",
    area: "Access Control Policy",
    question: "Do you have a documented access control policy?",
    risk: "Without a documented policy, access decisions become inconsistent and unauditable, a primary SOC 2 finding.",
    remediation: "Draft a formal access control policy covering provisioning, review cadence, and termination.",
    policy:
      "AuditBridge shall maintain a documented Access Control Policy governing the provisioning, modification, and revocation of access to all production systems and customer data. Access is granted on a least-privilege basis, requires documented approval from the resource owner, and is reviewed no less than quarterly. Terminations result in revocation of all access within 24 hours of separation.",
  },
  {
    id: "mfa",
    area: "Multi-Factor Authentication",
    question: "Is multi-factor authentication enforced for admin accounts?",
    risk: "Single-factor admin accounts are the most common root cause of breaches and an automatic SOC 2 exception.",
    remediation: "Enforce MFA via SSO or identity provider for all administrative and production access.",
    policy:
      "All administrative and privileged accounts must authenticate using multi-factor authentication enforced at the identity provider. Acceptable second factors include hardware security keys (WebAuthn) and time-based one-time passwords. SMS-based factors are prohibited for privileged access.",
  },
  {
    id: "vuln",
    area: "Vulnerability Management",
    question: "Do you have a process for tracking and remediating vulnerabilities?",
    risk: "Untriaged vulnerabilities accumulate and leave exploitable surface area auditors will flag.",
    remediation: "Stand up automated scanning with SLAs for critical, high, and medium severity remediation.",
    policy:
      "AuditBridge operates a continuous vulnerability management program covering application dependencies, container images, and infrastructure. Findings are triaged within one business day and remediated according to severity SLAs: critical within 7 days, high within 30 days, and medium within 90 days.",
  },
  {
    id: "encryption",
    area: "Data Encryption",
    question: "Is customer data encrypted at rest and in transit?",
    risk: "Unencrypted customer data exposes the business to breach disclosure and direct SOC 2 control failures.",
    remediation: "Enable AES-256 at rest on all data stores and require TLS 1.2+ for every external endpoint.",
    policy:
      "All customer data is encrypted at rest using AES-256 and in transit using TLS 1.2 or higher. Encryption keys are managed in a dedicated key management service with automated rotation and access logging. Internal service-to-service traffic within production networks is encrypted end-to-end.",
  },
  {
    id: "incident",
    area: "Incident Response Plan",
    question: "Do you have an incident response plan?",
    risk: "Without a tested plan, response time and customer notification obligations are unlikely to be met.",
    remediation: "Document an IR plan with roles, severity tiers, and run a tabletop exercise annually.",
    policy:
      "AuditBridge maintains a documented Incident Response Plan defining severity classifications, on-call escalation, customer notification timelines, and post-incident review procedures. The plan is exercised through a tabletop simulation at least annually and updated based on lessons learned from real and simulated incidents.",
  },
  {
    id: "logging",
    area: "Logging & Monitoring",
    question: "Do you log and monitor access to production systems?",
    risk: "Without centralized logs and alerting, intrusions go undetected and evidence is unavailable to auditors.",
    remediation: "Centralize logs in a SIEM with alerting on privileged access and anomalous events.",
    policy:
      "Production system access, administrative actions, and security-relevant events are logged to a centralized, tamper-evident log store with a minimum 12-month retention period. Automated alerts trigger on privileged access, failed authentication patterns, and anomalous data egress, and are routed to the on-call security responder.",
  },
  {
    id: "vendor",
    area: "Vendor Risk Management",
    question: "Do you have a vendor risk management process?",
    risk: "Unassessed vendors inherit risk into your environment and produce direct SOC 2 subservice findings.",
    remediation: "Maintain a vendor inventory with security review tiers and annual reassessment.",
    policy:
      "AuditBridge maintains an inventory of all third-party vendors with access to customer data or production systems. Each vendor is assigned a risk tier based on data sensitivity and is subject to security review at onboarding and annually thereafter, including review of SOC 2 reports or equivalent attestations.",
  },
];

type Screen = "landing" | "assessment" | "results";

function AuditBridge() {
  const [screen, setScreen] = useState<Screen>("landing");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});

  const reset = () => {
    setAnswers({});
    setStep(0);
    setScreen("landing");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/60 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <button
            onClick={reset}
            className="flex items-center gap-2 text-left"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-foreground">AuditBridge</div>
              <div className="text-xs text-muted-foreground">SOC 2 Readiness</div>
            </div>
          </button>
          {screen !== "landing" && (
            <button
              onClick={reset}
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:text-foreground"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Restart
            </button>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-12 md:py-20">
        {screen === "landing" && (
          <Landing onStart={() => setScreen("assessment")} />
        )}
        {screen === "assessment" && (
          <Assessment
            step={step}
            setStep={setStep}
            answers={answers}
            setAnswers={setAnswers}
            onComplete={() => setScreen("results")}
          />
        )}
        {screen === "results" && <Results answers={answers} onRestart={reset} />}
      </main>

      <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground">
        AuditBridge · Demo readiness assessment · Not an attestation of compliance
      </footer>
    </div>
  );
}

function Landing({ onStart }: { onStart: () => void }) {
  return (
    <section className="text-center">
      <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
        <Sparkles className="h-3.5 w-3.5 text-primary" />
        Built for pre-audit startups
      </div>
      <h1 className="mt-6 font-display text-5xl leading-[1.05] text-foreground md:text-6xl">
        AuditBridge — Compliance<br />Readiness in Minutes
      </h1>
      <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
        Assess your startup's SOC 2 readiness against the core Trust Service Criteria
        before you pursue certification. Get a scored gap analysis and a prioritized
        remediation plan in under five minutes.
      </p>
      <button
        onClick={onStart}
        className="mt-10 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-[var(--primary-hover)]"
      >
        Start Assessment
        <ArrowRight className="h-4 w-4" />
      </button>

      <div className="mt-16 grid gap-4 md:grid-cols-3">
        {[
          { n: "7", label: "Trust Service Criteria" },
          { n: "5 min", label: "Average completion time" },
          { n: "0", label: "Auditor calls required" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-5 text-left">
            <div className="font-display text-3xl text-primary">{s.n}</div>
            <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Assessment({
  step,
  setStep,
  answers,
  setAnswers,
  onComplete,
}: {
  step: number;
  setStep: (n: number) => void;
  answers: Record<string, Answer>;
  setAnswers: (a: Record<string, Answer>) => void;
  onComplete: () => void;
}) {
  const q = QUESTIONS[step];
  const current = answers[q.id];
  const progress = ((step + (current ? 1 : 0)) / QUESTIONS.length) * 100;

  const select = (a: Answer) => {
    setAnswers({ ...answers, [q.id]: a });
  };

  const next = () => {
    if (step === QUESTIONS.length - 1) onComplete();
    else setStep(step + 1);
  };

  return (
    <section>
      <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
        <span>
          Question {step + 1} of {QUESTIONS.length}
        </span>
        <span>{q.area}</span>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mt-10 rounded-2xl border border-border bg-card p-8 shadow-sm md:p-10">
        <h2 className="font-display text-3xl leading-tight text-foreground md:text-4xl">
          {q.question}
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">
          Select the option that most accurately reflects current practice.
        </p>

        <div className="mt-8 grid gap-3">
          {(
            [
              { v: "yes", label: "Yes", desc: "Documented, implemented, and operating" },
              { v: "partial", label: "Partial", desc: "Started, but gaps or inconsistencies remain" },
              { v: "no", label: "No", desc: "Not in place today" },
            ] as { v: Answer; label: string; desc: string }[]
          ).map((opt) => {
            const active = current === opt.v;
            return (
              <button
                key={opt.v}
                onClick={() => select(opt.v)}
                className={`flex items-start gap-4 rounded-xl border p-4 text-left transition ${
                  active
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                    : "border-border bg-background hover:border-primary/40 hover:bg-accent/40"
                }`}
              >
                <div
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                    active ? "border-primary bg-primary" : "border-border"
                  }`}
                >
                  {active && <Check className="h-3 w-3 text-primary-foreground" strokeWidth={3} />}
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">{opt.label}</div>
                  <div className="text-xs text-muted-foreground">{opt.desc}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <button
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
          className="inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <button
          onClick={next}
          disabled={!current}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-[var(--primary-hover)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {step === QUESTIONS.length - 1 ? "See Results" : "Next"}
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}

function Results({
  answers,
  onRestart,
}: {
  answers: Record<string, Answer>;
  onRestart: () => void;
}) {
  const { score, gaps, topGap } = useMemo(() => {
    const weights: Record<Answer, number> = { yes: 1, partial: 0.5, no: 0 };
    const total = QUESTIONS.reduce(
      (sum, q) => sum + weights[answers[q.id] ?? "no"],
      0,
    );
    const score = Math.round((total / QUESTIONS.length) * 100);
    const gaps = QUESTIONS.filter((q) => answers[q.id] !== "yes").sort((a, b) => {
      const order: Record<Answer, number> = { no: 0, partial: 1, yes: 2 };
      return order[answers[a.id]] - order[answers[b.id]];
    });
    return { score, gaps, topGap: gaps[0] };
  }, [answers]);

  const tone =
    score >= 80
      ? { label: "Audit-Ready", color: "var(--color-success)", text: "text-[color:var(--success)]" }
      : score >= 50
      ? { label: "In Progress", color: "var(--color-warning)", text: "text-[color:var(--warning)]" }
      : { label: "Significant Gaps", color: "var(--color-destructive)", text: "text-[color:var(--destructive)]" };

  return (
    <section className="space-y-8">
      <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Readiness Score
            </div>
            <div className="mt-2 flex items-baseline gap-3">
              <span className="font-display text-6xl text-foreground">{score}%</span>
              <span className={`text-sm font-semibold ${tone.text}`}>{tone.label}</span>
            </div>
            <p className="mt-3 max-w-md text-sm text-muted-foreground">
              Based on {QUESTIONS.length} core SOC 2 Trust Service Criteria controls.
            </p>
          </div>
          <button
            disabled
            className="inline-flex cursor-not-allowed items-center gap-2 rounded-lg border border-border bg-secondary px-4 py-2.5 text-sm font-semibold text-secondary-foreground opacity-70"
            title="Available in the full version"
          >
            <Download className="h-4 w-4" />
            Download Report
          </button>
        </div>
        <div className="mt-6 h-3 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{ width: `${score}%`, backgroundColor: tone.color }}
          />
        </div>
      </div>

      <div>
        <h2 className="font-display text-3xl text-foreground">Prioritized gaps</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Address missing controls first, then strengthen partial ones.
        </p>

        {gaps.length === 0 ? (
          <div className="mt-6 rounded-xl border border-border bg-card p-8 text-center">
            <Check className="mx-auto h-8 w-8 text-[color:var(--success)]" />
            <div className="mt-3 font-semibold text-foreground">No gaps identified</div>
            <p className="mt-1 text-sm text-muted-foreground">
              You're in strong shape across the core SOC 2 criteria covered here.
            </p>
          </div>
        ) : (
          <ul className="mt-6 space-y-3">
            {gaps.map((g) => {
              const a = answers[g.id];
              const isNo = a === "no";
              return (
                <li
                  key={g.id}
                  className="rounded-xl border border-border bg-card p-5 shadow-sm"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                        isNo
                          ? "bg-[color:var(--destructive)]/10 text-[color:var(--destructive)]"
                          : "bg-[color:var(--warning)]/15 text-[color:var(--warning)]"
                      }`}
                    >
                      {isNo ? (
                        <XCircle className="h-4 w-4" />
                      ) : (
                        <AlertTriangle className="h-4 w-4" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-semibold text-foreground">{g.area}</h3>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                            isNo
                              ? "bg-[color:var(--destructive)]/10 text-[color:var(--destructive)]"
                              : "bg-[color:var(--warning)]/15 text-[color:var(--warning)]"
                          }`}
                        >
                          {isNo ? "Missing" : "Partial"}
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        <span className="font-medium text-foreground">Risk: </span>
                        {g.risk}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        <span className="font-medium text-foreground">Remediation: </span>
                        {g.remediation}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {topGap && (
        <div>
          <h2 className="font-display text-3xl text-foreground">Sample policy excerpt</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Generated for your highest-priority gap. Customize and adopt as a starting draft.
          </p>

          <article className="mt-6 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <div className="flex items-center justify-between border-b border-border bg-surface px-6 py-3">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <FileText className="h-4 w-4" />
                {topGap.area} Policy · Draft v0.1
              </div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                Generated
              </div>
            </div>
            <div className="px-8 py-8 md:px-10 md:py-10">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Section 1 · Purpose
              </div>
              <h3 className="mt-2 font-display text-2xl text-foreground">
                {topGap.area}
              </h3>
              <p className="mt-5 text-[15px] leading-7 text-foreground">
                {topGap.policy}
              </p>
              <div className="mt-8 border-t border-border pt-4 text-xs text-muted-foreground">
                Owner: Security · Review cadence: Annual · Last reviewed: Pending adoption
              </div>
            </div>
          </article>
        </div>
      )}

      <div className="flex justify-center pt-4">
        <button
          onClick={onRestart}
          className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Start a new assessment
        </button>
      </div>
    </section>
  );
}
