export type Answer = "yes" | "partial" | "no";

export interface Question {
  id: string;
  ref: string;
  area: string;
  question: string;
  context: string;
  risk: string;
  remediation: string;
  policy: string;
}

export interface Domain {
  id: string;
  name: string;
  questions: Question[];
}

export interface Framework {
  id: "soc2" | "iso27001" | "hipaa" | "aws" | "sox" | "glba" | "nist";
  name: string;
  shortName: string;
  headerLabel: string;
  citationLabel: (question: Question) => string;
  description: string;
  domains: Domain[];
}