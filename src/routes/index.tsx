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
          "Assess SOC 2, ISO/IEC 27001:2022, HIPAA Security Rule, or Cloud Security (AWS) readiness in minutes. Get a scored gap analysis, domain breakdown, and prioritized remediation plan.",
      },
      { property: "og:title", content: "AuditBridge — Compliance Readiness in Minutes" },
      {
        property: "og:description",
        content:
          "Multi-framework readiness assessment: SOC 2, ISO/IEC 27001:2022, HIPAA, and Cloud Security (AWS). Scored gap analysis and prioritized remediation.",
      },
    ],
  }),
  component: AuditBridge,
});

type Answer = "yes" | "partial" | "no";

interface Question {
  id: string;
  ref: string; // e.g. "CC6.1", "A.8.5", "164.312(a)"
  area: string;
  question: string;
  context: string;
  risk: string;
  remediation: string;
  policy: string;
}

interface Domain {
  id: string;
  name: string;
  questions: Question[];
}

interface Framework {
  id: "soc2" | "iso27001" | "hipaa" | "aws";
  name: string;
  shortName: string;
  headerLabel: string;
  citationLabel: (q: Question) => string;
  description: string;
  domains: Domain[];
}

/* ---------------- SOC 2 ---------------- */
const SOC2: Framework = {
  id: "soc2",
  name: "SOC 2",
  shortName: "SOC 2",
  headerLabel: "SOC 2 Full Readiness Assessment",
  description:
    "AICPA Trust Services Criteria — Security (Common Criteria CC1–CC9).",
  citationLabel: (q) => `SOC 2 Trust Services Criteria ${q.ref}`,
  domains: [
    {
      id: "cc1",
      name: "CC1 · Control Environment",
      questions: [
        {
          id: "cc1.1", ref: "CC1.1", area: "Integrity & Ethical Values",
          question: "Has leadership formally communicated a code of conduct and ethics policy to all personnel?",
          context: "Tone at the top — documented standards of conduct that personnel acknowledge.",
          risk: "Without a documented code of conduct, ethical expectations are inconsistent and unenforceable, an immediate CC1 finding.",
          remediation: "Publish a code of conduct and require annual acknowledgement from every employee and contractor.",
          policy: "The organization shall maintain a documented Code of Conduct establishing expected standards of integrity and ethical behavior. All personnel acknowledge the Code at onboarding and annually thereafter, and violations are addressed through the formal disciplinary process.",
        },
        {
          id: "cc1.2", ref: "CC1.2", area: "Board Oversight",
          question: "Does the board or equivalent governing body exercise oversight of the security program?",
          context: "Independent oversight of management's design and operation of internal control.",
          risk: "Absent board oversight, security decisions lack accountability and strategic alignment.",
          remediation: "Establish a quarterly security review with the board or an audit committee with documented minutes.",
          policy: "The Board of Directors exercises oversight of the information security program through quarterly reviews of risk posture, control effectiveness, and incident activity, with minutes retained as evidence.",
        },
        {
          id: "cc1.3", ref: "CC1.3", area: "Organizational Structure",
          question: "Are security roles, responsibilities, and reporting lines formally documented?",
          context: "Defined structures, reporting lines, authorities, and responsibilities.",
          risk: "Ambiguous ownership leads to controls that are designed but not consistently operated.",
          remediation: "Document a security org chart with named owners for each control domain.",
          policy: "Information security roles and responsibilities are documented in a RACI matrix mapped to each control domain and reviewed annually by the security leadership team.",
        },
        {
          id: "cc1.4", ref: "CC1.4", area: "Competence",
          question: "Are job descriptions, background checks, and competency requirements defined for security-relevant roles?",
          context: "Commitment to attract, develop, and retain competent individuals.",
          risk: "Unqualified personnel in sensitive roles is a recurring root cause of control failures.",
          remediation: "Require background checks and documented competency criteria for all security-relevant hires.",
          policy: "All personnel in security-relevant roles undergo background screening proportional to risk and meet documented competency criteria prior to receiving production access.",
        },
      ],
    },
    {
      id: "cc2",
      name: "CC2 · Communication and Information",
      questions: [
        {
          id: "cc2.1", ref: "CC2.1", area: "Quality of Information",
          question: "Do you maintain accurate, current documentation of systems, data flows, and control owners?",
          context: "Information needed to support the functioning of internal control.",
          risk: "Outdated system documentation produces inaccurate scoping and missed control coverage.",
          remediation: "Maintain a system description and data flow diagram reviewed at least annually.",
          policy: "AuditBridge maintains a current system description, including data flows and control owners, reviewed annually and after any material architectural change.",
        },
        {
          id: "cc2.2", ref: "CC2.2", area: "Internal Communication",
          question: "Are security policies and changes communicated to all personnel on a defined cadence?",
          context: "Internal communication of objectives, responsibilities, and control changes.",
          risk: "Personnel acting on stale guidance create exceptions auditors will flag.",
          remediation: "Distribute policy updates through a tracked channel with acknowledgement.",
          policy: "Security policies are published in a central repository and material updates are communicated to all personnel with required acknowledgement within 30 days.",
        },
        {
          id: "cc2.3", ref: "CC2.3", area: "External Communication",
          question: "Do you have defined channels for customers and external parties to report security concerns?",
          context: "External communication of policies, responsibilities, and a way to report concerns.",
          risk: "Lack of a reporting channel delays detection of customer-reported incidents.",
          remediation: "Publish a security contact and vulnerability disclosure policy.",
          policy: "A published security contact and Vulnerability Disclosure Policy enable customers, researchers, and partners to report concerns; submissions are triaged within one business day.",
        },
      ],
    },
    {
      id: "cc3",
      name: "CC3 · Risk Assessment",
      questions: [
        {
          id: "cc3.1", ref: "CC3.1", area: "Risk Identification",
          question: "Do you perform and document a formal risk assessment at least annually?",
          context: "Identification and analysis of risks to the achievement of objectives.",
          risk: "Without a documented risk assessment, control selection cannot be justified to auditors.",
          remediation: "Run an annual risk assessment workshop with documented inherent and residual risk ratings.",
          policy: "A formal information security risk assessment is conducted at least annually and after material changes, with risks scored for likelihood and impact and tracked in a risk register.",
        },
        {
          id: "cc3.2", ref: "CC3.2", area: "Fraud Risk",
          question: "Does the risk assessment explicitly consider fraud risk, including misuse of privileged access?",
          context: "Consideration of the potential for fraud in assessing risks.",
          risk: "Ignoring fraud scenarios leaves segregation-of-duties gaps unaddressed.",
          remediation: "Add a fraud risk section covering privileged misuse, financial fraud, and collusion.",
          policy: "The annual risk assessment includes an explicit fraud-risk analysis covering privileged misuse, segregation-of-duties conflicts, and collusion scenarios, with mitigating controls documented in the risk register.",
        },
        {
          id: "cc3.3", ref: "CC3.3", area: "Change Risk",
          question: "Do you reassess risks in response to significant changes (new products, vendors, infrastructure)?",
          context: "Identification and assessment of changes that could significantly impact internal control.",
          risk: "New systems silently introduce risks that bypass the original control design.",
          remediation: "Require a security risk review as a release gate for material changes.",
          policy: "Material changes to products, infrastructure, or critical vendors trigger a security risk review prior to production deployment, with results recorded in the risk register.",
        },
      ],
    },
    {
      id: "cc4",
      name: "CC4 · Monitoring Activities",
      questions: [
        {
          id: "cc4.1", ref: "CC4.1", area: "Ongoing Evaluations",
          question: "Do you perform periodic internal control testing throughout the year?",
          context: "Ongoing and separate evaluations to ascertain whether controls are present and functioning.",
          risk: "Annual-only testing misses drift; auditors expect continuous evidence.",
          remediation: "Stand up a control testing calendar with quarterly evidence collection.",
          policy: "Internal control testing is performed on a documented quarterly schedule, with evidence retained for the audit window and deficiencies tracked to remediation.",
        },
        {
          id: "cc4.2", ref: "CC4.2", area: "Deficiency Reporting",
          question: "Are control deficiencies tracked to remediation with owners and due dates?",
          context: "Evaluation and communication of deficiencies to those responsible for corrective action.",
          risk: "Findings without owners or dates do not get fixed and become repeat exceptions.",
          remediation: "Maintain a deficiency tracker reviewed monthly by security leadership.",
          policy: "All identified control deficiencies are logged with an assigned owner, severity, and remediation due date, and are reviewed in the monthly security leadership meeting until closed.",
        },
        {
          id: "cc4.3", ref: "CC4.3", area: "Continuous Monitoring",
          question: "Do automated tools monitor critical security controls (e.g., MFA, encryption, logging) continuously?",
          context: "Use of automated monitoring to detect control failures in real time.",
          risk: "Manual checks alone cannot detect control drift between audit cycles.",
          remediation: "Adopt a continuous compliance monitoring platform tied to production systems.",
          policy: "Critical security controls are continuously monitored via automated tooling, with alerts routed to the security team on detected drift.",
        },
      ],
    },
    {
      id: "cc5",
      name: "CC5 · Control Activities",
      questions: [
        {
          id: "cc5.1", ref: "CC5.1", area: "Selection of Controls",
          question: "Are controls selected and developed based on the documented risk assessment?",
          context: "Control activities that contribute to the mitigation of risks.",
          risk: "Controls disconnected from risk produce wasted effort and gaps where it matters.",
          remediation: "Map every control in the framework to a risk register entry.",
          policy: "Security controls are selected based on the risk assessment, documented in a control matrix that maps each control to one or more risks and to the applicable Trust Services Criteria.",
        },
        {
          id: "cc5.2", ref: "CC5.2", area: "Technology Controls",
          question: "Are general IT controls (access, change, operations) implemented for systems supporting customer data?",
          context: "Technology controls supporting the achievement of objectives.",
          risk: "Missing ITGCs invalidate reliance on automated controls during the audit.",
          remediation: "Implement IAM, change management, and operations controls for all in-scope systems.",
          policy: "General IT controls covering access provisioning, change management, and production operations are implemented and tested for all systems that store or process customer data.",
        },
        {
          id: "cc5.3", ref: "CC5.3", area: "Policies & Procedures",
          question: "Are security policies and procedures documented, approved, and reviewed annually?",
          context: "Deployment of policies and procedures that put control activities into action.",
          risk: "Unapproved or stale policies cannot be relied on as control evidence.",
          remediation: "Adopt a policy management cycle with annual review and executive approval.",
          policy: "All security policies are approved by the executive sponsor, reviewed at least annually, and version-controlled in the policy management system.",
        },
      ],
    },
    {
      id: "cc6",
      name: "CC6 · Logical & Physical Access Controls",
      questions: [
        {
          id: "cc6.1", ref: "CC6.1", area: "Logical Access",
          question: "Is access to production systems provisioned on a documented least-privilege basis?",
          context: "Logical access security software, infrastructure, and architectures.",
          risk: "Excess privilege is the most common root cause of large breaches and SOC 2 findings.",
          remediation: "Implement role-based access with documented approvals and quarterly access reviews.",
          policy: "Access to production systems is granted on a least-privilege basis through documented role definitions, requires resource-owner approval, and is reviewed quarterly with deviations remediated within 14 days.",
        },
        {
          id: "cc6.2", ref: "CC6.2", area: "Provisioning & Termination",
          question: "Is access revoked within 24 hours of personnel departure or role change?",
          context: "Registration and authorization of new users; removal upon termination.",
          risk: "Lingering access for departed personnel is an automatic exception.",
          remediation: "Integrate HRIS termination events with identity provider deprovisioning.",
          policy: "Termination and role-change events in the HRIS trigger automated deprovisioning of all production access within 24 hours, with evidence retained in the access log.",
        },
        {
          id: "cc6.3", ref: "CC6.3", area: "Authentication",
          question: "Is multi-factor authentication enforced for all administrative and remote access?",
          context: "Authentication controls including MFA and credential management.",
          risk: "Single-factor admin access is the leading breach vector and an automatic SOC 2 exception.",
          remediation: "Enforce phishing-resistant MFA via SSO for all privileged and remote access.",
          policy: "Multi-factor authentication is enforced at the identity provider for all administrative and remote access; acceptable factors are WebAuthn hardware keys and TOTP. SMS factors are prohibited for privileged access.",
        },
        {
          id: "cc6.6", ref: "CC6.6", area: "Encryption",
          question: "Is customer data encrypted at rest and in transit using current standards?",
          context: "Encryption of data at rest and in transit; key management.",
          risk: "Unencrypted customer data produces breach-disclosure exposure and direct CC6.6 failure.",
          remediation: "Enable AES-256 at rest and require TLS 1.2+ on all external endpoints.",
          policy: "Customer data is encrypted at rest with AES-256 and in transit with TLS 1.2 or higher; encryption keys are managed in a dedicated key management service with automated rotation and access logging.",
        },
        {
          id: "cc6.4", ref: "CC6.4", area: "Physical Access",
          question: "Are physical access controls in place at facilities and via cloud provider attestations?",
          context: "Physical access to facilities and protected information assets.",
          risk: "Unattested physical security creates a gap for in-scope offices and data centers.",
          remediation: "Collect SOC 2/ISO reports from cloud providers and document office access controls.",
          policy: "Physical access to corporate facilities is controlled by badge access with logging; data center physical security is inherited from cloud providers and validated annually via their SOC 2 reports.",
        },
      ],
    },
    {
      id: "cc7",
      name: "CC7 · System Operations",
      questions: [
        {
          id: "cc7.1", ref: "CC7.1", area: "Vulnerability Management",
          question: "Do you scan for vulnerabilities continuously and remediate per documented SLAs?",
          context: "Detection and management of vulnerabilities in production systems.",
          risk: "Untriaged vulnerabilities accumulate as exploitable surface auditors will flag.",
          remediation: "Implement scanning with SLAs: critical 7d, high 30d, medium 90d.",
          policy: "AuditBridge operates continuous vulnerability scanning across dependencies, container images, and infrastructure; findings are remediated per severity SLAs of 7, 30, and 90 days for critical, high, and medium.",
        },
        {
          id: "cc7.2", ref: "CC7.2", area: "Monitoring & Anomaly Detection",
          question: "Are security-relevant events logged centrally with alerting on anomalous activity?",
          context: "Monitoring of system components for anomalies indicative of malicious acts.",
          risk: "Without centralized alerting, intrusions go undetected and evidence is unavailable.",
          remediation: "Centralize logs in a SIEM with alerting on privileged access and anomalies.",
          policy: "Security-relevant events are forwarded to a centralized, tamper-evident log store with 12-month retention; automated alerts trigger on privileged access, failed authentication patterns, and anomalous egress.",
        },
        {
          id: "cc7.3", ref: "CC7.3", area: "Incident Response",
          question: "Is there a documented and exercised incident response plan?",
          context: "Identification, response, and recovery from security incidents.",
          risk: "Without a tested plan, response time and customer notification obligations are unlikely to be met.",
          remediation: "Document an IR plan with severity tiers and run an annual tabletop exercise.",
          policy: "A documented Incident Response Plan defines severity classifications, on-call escalation, customer notification timelines, and post-incident review; the plan is exercised through a tabletop simulation at least annually.",
        },
        {
          id: "cc7.4", ref: "CC7.4", area: "Recovery",
          question: "Are backups taken, encrypted, and tested for restoration on a defined cadence?",
          context: "Recovery activities supporting business continuity.",
          risk: "Untested backups frequently fail during real incidents.",
          remediation: "Encrypt backups and perform documented restoration tests at least semi-annually.",
          policy: "Production data is backed up daily, encrypted at rest, and stored in a separate region; restoration is tested at least semi-annually with results documented.",
        },
      ],
    },
    {
      id: "cc8",
      name: "CC8 · Change Management",
      questions: [
        {
          id: "cc8.1", ref: "CC8.1", area: "Change Authorization",
          question: "Are production changes authorized, peer-reviewed, and traceable to a ticket?",
          context: "Changes to infrastructure, data, software, and procedures are authorized, designed, and tested.",
          risk: "Unauthorized changes circumvent controls and produce unexplained production states.",
          remediation: "Require peer review and ticket linkage on every production change.",
          policy: "All production changes require peer review, an associated change ticket, and automated CI checks before merge; emergency changes are reviewed retroactively within one business day.",
        },
        {
          id: "cc8.2", ref: "CC8.2", area: "Testing",
          question: "Are changes tested in a non-production environment before release?",
          context: "Pre-production testing to validate changes before deployment.",
          risk: "Releases without testing create reliability and security regressions.",
          remediation: "Require automated test coverage gates and staging deploys.",
          policy: "Changes are validated in a staging environment with automated test gates prior to production deployment, and rollback procedures are documented for each release.",
        },
        {
          id: "cc8.3", ref: "CC8.3", area: "Segregation of Duties",
          question: "Is segregation of duties enforced between code authors and production deployers?",
          context: "Separation of incompatible duties in the change process.",
          risk: "Self-merged production changes are a high-risk segregation-of-duties failure.",
          remediation: "Enforce branch protection requiring approval from a different reviewer.",
          policy: "Branch protection prohibits self-merge to production branches; a separate reviewer must approve every change, and CI/CD audit logs are retained for the audit window.",
        },
      ],
    },
    {
      id: "cc9",
      name: "CC9 · Risk Mitigation",
      questions: [
        {
          id: "cc9.1", ref: "CC9.1", area: "Business Disruption",
          question: "Have you identified and documented mitigations for the top business disruption scenarios?",
          context: "Identification and mitigation of disruption risks (incidents, outages, force majeure).",
          risk: "Undocumented disruption planning leaves business continuity untested.",
          remediation: "Document a BCP with RTO/RPO targets per critical system.",
          policy: "A Business Continuity Plan documents recovery time and recovery point objectives for each critical system and is tested annually through a simulated disruption exercise.",
        },
        {
          id: "cc9.2", ref: "CC9.2", area: "Vendor Risk Management",
          question: "Are third-party vendors with access to customer data risk-assessed and reviewed annually?",
          context: "Management of risk associated with vendors and business partners.",
          risk: "Unassessed vendors inherit risk into the environment and create subservice findings.",
          remediation: "Maintain a vendor inventory with risk tiers and annual reassessment.",
          policy: "All vendors with access to customer data or production systems are inventoried, risk-tiered, and reviewed annually, including evaluation of SOC 2 reports or equivalent attestations.",
        },
        {
          id: "cc9.3", ref: "CC9.3", area: "Insurance",
          question: "Is cyber liability insurance maintained at coverage levels aligned to assessed risk?",
          context: "Risk transfer through insurance and contractual mechanisms.",
          risk: "Inadequate coverage leaves residual risk uncapped after a major incident.",
          remediation: "Review cyber liability coverage annually with broker and risk owner.",
          policy: "Cyber liability insurance is maintained at coverage levels aligned to the annual risk assessment and reviewed jointly by the CFO and security leadership at renewal.",
        },
      ],
    },
  ],
};

/* ---------------- ISO/IEC 27001:2022 ---------------- */
const ISO: Framework = {
  id: "iso27001",
  name: "ISO/IEC 27001:2022",
  shortName: "ISO 27001",
  headerLabel: "ISO/IEC 27001:2022 Full Readiness Assessment",
  description:
    "ISO/IEC 27001:2022 Annex A controls — organizational, people, physical, and technological.",
  citationLabel: (q) => `ISO/IEC 27001:2022 Annex ${q.ref}`,
  domains: [
    {
      id: "a5-gov",
      name: "A.5 · Policies & Governance",
      questions: [
        {
          id: "a5.1", ref: "A.5.1", area: "Information Security Policies",
          question: "Is there a top-management-approved information security policy reviewed annually?",
          context: "A.5.1 — Policies for information security.",
          risk: "Without an approved policy, controls lack the authority required by ISO 27001 Clause 5.",
          remediation: "Adopt an InfoSec policy approved by top management and reviewed annually.",
          policy: "An Information Security Policy approved by top management defines objectives, scope, and management commitment, and is reviewed at planned intervals and after significant changes.",
        },
        {
          id: "a5.2", ref: "A.5.2", area: "Roles & Responsibilities",
          question: "Are information security roles and responsibilities defined and allocated?",
          context: "A.5.2 — Information security roles and responsibilities.",
          risk: "Unallocated responsibilities lead to unowned controls and operational gaps.",
          remediation: "Document a RACI for security responsibilities across the organization.",
          policy: "Information security responsibilities are defined and allocated in accordance with the organization's needs and documented in role descriptions and a responsibility matrix.",
        },
        {
          id: "a5.9", ref: "A.5.9", area: "Inventory of Assets",
          question: "Is an inventory of information and other associated assets maintained?",
          context: "A.5.9 — Inventory of information and other associated assets.",
          risk: "Unknown assets cannot be protected and become findings during certification.",
          remediation: "Maintain an asset inventory with owners, classification, and review cadence.",
          policy: "An inventory of information and associated assets is maintained with assigned owners, classification level, and is reviewed quarterly for accuracy and completeness.",
        },
        {
          id: "a5.12", ref: "A.5.12", area: "Classification of Information",
          question: "Is information classified and handled according to a defined classification scheme?",
          context: "A.5.12 — Classification of information.",
          risk: "Without classification, sensitive data receives the same protection as public data.",
          remediation: "Adopt a 3- or 4-tier classification scheme with handling requirements per tier.",
          policy: "Information is classified as Public, Internal, Confidential, or Restricted based on confidentiality requirements, and handling rules for storage, transmission, and disposal are documented for each tier.",
        },
      ],
    },
    {
      id: "a5-supplier",
      name: "A.5 · Supplier & Incident Management",
      questions: [
        {
          id: "a5.19", ref: "A.5.19", area: "Supplier Relationships",
          question: "Are information security requirements defined and agreed for each supplier relationship?",
          context: "A.5.19 — Information security in supplier relationships.",
          risk: "Unmanaged supplier risk is a leading source of breaches and certification findings.",
          remediation: "Add security clauses to supplier contracts and risk-tier the supplier inventory.",
          policy: "Information security requirements for mitigating risks associated with supplier access are documented in supplier agreements and enforced through onboarding due diligence and annual reassessment.",
        },
        {
          id: "a5.24", ref: "A.5.24", area: "Incident Management Planning",
          question: "Is incident management planned and documented with defined roles and procedures?",
          context: "A.5.24 — Information security incident management planning and preparation.",
          risk: "Ad-hoc incident handling causes delayed containment and missed notification timelines.",
          remediation: "Document an IR plan with severity tiers, roles, and notification timelines.",
          policy: "Information security incident management procedures define severity classification, response roles, communication paths, and notification timelines, and are tested through annual tabletop exercises.",
        },
        {
          id: "a5.30", ref: "A.5.30", area: "ICT Readiness for Business Continuity",
          question: "Is ICT readiness for business continuity planned, implemented, and tested?",
          context: "A.5.30 — ICT readiness for business continuity.",
          risk: "Untested continuity plans fail during real disruption events.",
          remediation: "Document RTO/RPO per critical system and test annually.",
          policy: "ICT continuity plans documenting recovery time and recovery point objectives are maintained for all critical systems and validated annually through simulated disruption exercises.",
        },
        {
          id: "a5.31", ref: "A.5.31", area: "Legal & Regulatory Requirements",
          question: "Are applicable legal, statutory, regulatory, and contractual requirements identified and tracked?",
          context: "A.5.31 — Legal, statutory, regulatory and contractual requirements.",
          risk: "Untracked obligations produce inadvertent non-compliance.",
          remediation: "Maintain a legal/regulatory register reviewed at least annually.",
          policy: "A legal, regulatory, and contractual requirements register is maintained for all applicable obligations and reviewed annually with legal counsel.",
        },
      ],
    },
    {
      id: "a6",
      name: "A.6 · People Controls",
      questions: [
        {
          id: "a6.1", ref: "A.6.1", area: "Screening",
          question: "Are background verification checks carried out on all candidates prior to employment?",
          context: "A.6.1 — Screening.",
          risk: "Unscreened personnel in trusted roles is a recurring root cause of insider events.",
          remediation: "Require background checks proportional to role risk.",
          policy: "Background verification checks are conducted for all candidates in accordance with applicable laws, ethics, and the risk classification of the role to be performed.",
        },
        {
          id: "a6.3", ref: "A.6.3", area: "Awareness, Education & Training",
          question: "Do all personnel complete information security awareness training annually?",
          context: "A.6.3 — Information security awareness, education and training.",
          risk: "Untrained personnel are the primary phishing and social-engineering vector.",
          remediation: "Roll out annual security training with tracked completion.",
          policy: "All personnel complete information security awareness training at onboarding and annually thereafter, with completion tracked in the learning management system.",
        },
        {
          id: "a6.4", ref: "A.6.4", area: "Disciplinary Process",
          question: "Is there a documented disciplinary process for information security violations?",
          context: "A.6.4 — Disciplinary process.",
          risk: "Inconsistent enforcement undermines the credibility of the security program.",
          remediation: "Document a disciplinary process tied to the code of conduct and acknowledged by personnel.",
          policy: "A documented disciplinary process is invoked against personnel who commit information security violations and is communicated as part of onboarding and annual acknowledgements.",
        },
        {
          id: "a6.7", ref: "A.6.7", area: "Remote Working",
          question: "Are security measures defined for personnel working remotely or in untrusted locations?",
          context: "A.6.7 — Remote working.",
          risk: "Remote work without endpoint controls extends the trust boundary uncontrolled.",
          remediation: "Require managed endpoints, full-disk encryption, and VPN/Zero Trust access.",
          policy: "Remote working is permitted only from organization-managed endpoints with full-disk encryption, endpoint detection and response, and authenticated access via the corporate identity provider.",
        },
      ],
    },
    {
      id: "a7",
      name: "A.7 · Physical Controls",
      questions: [
        {
          id: "a7.2", ref: "A.7.2", area: "Physical Entry",
          question: "Are secure areas protected by appropriate entry controls and visitor logs?",
          context: "A.7.2 — Physical entry.",
          risk: "Unmonitored physical access produces unaccounted entries into secure areas.",
          remediation: "Implement badge access and visitor sign-in for restricted areas.",
          policy: "Secure areas are protected by badge-based entry controls with logged access, and all visitors are escorted and recorded in a visitor log retained for one year.",
        },
        {
          id: "a7.7", ref: "A.7.7", area: "Clear Desk & Clear Screen",
          question: "Is a clear desk and clear screen policy defined and enforced?",
          context: "A.7.7 — Clear desk and clear screen.",
          risk: "Exposed credentials or sensitive papers create avoidable disclosure risk.",
          remediation: "Adopt a clear desk/screen policy with automatic screen locking on endpoints.",
          policy: "A clear desk and clear screen policy requires personnel to secure sensitive materials when unattended; managed endpoints enforce automatic screen lock after 5 minutes of inactivity.",
        },
        {
          id: "a7.10", ref: "A.7.10", area: "Storage Media",
          question: "Are removable storage media and end-of-life devices securely sanitized or destroyed?",
          context: "A.7.10 — Storage media handling and disposal.",
          risk: "Improperly disposed media is a common cause of inadvertent data disclosure.",
          remediation: "Use certified sanitization or destruction for all decommissioned media.",
          policy: "Storage media containing organizational data is sanitized using NIST SP 800-88 methods or physically destroyed at end of life, with certificates of destruction retained.",
        },
      ],
    },
    {
      id: "a8-access",
      name: "A.8 · Access & Cryptography",
      questions: [
        {
          id: "a8.2", ref: "A.8.2", area: "Privileged Access Rights",
          question: "Are privileged access rights restricted, allocated, and reviewed regularly?",
          context: "A.8.2 — Privileged access rights.",
          risk: "Standing admin rights are the most exploited access path in breaches.",
          remediation: "Restrict privileged access to named roles with quarterly review and just-in-time elevation where possible.",
          policy: "Privileged access rights are allocated to named roles on a least-privilege basis, reviewed quarterly, and elevated just-in-time through an approval workflow where technically feasible.",
        },
        {
          id: "a8.5", ref: "A.8.5", area: "Secure Authentication",
          question: "Is secure authentication (MFA, phishing-resistant where possible) enforced for all systems?",
          context: "A.8.5 — Secure authentication.",
          risk: "Weak or single-factor authentication is the leading initial-access vector in incidents.",
          remediation: "Enforce MFA at the identity provider; prefer WebAuthn for privileged access.",
          policy: "Secure authentication procedures require multi-factor authentication at the identity provider; phishing-resistant WebAuthn credentials are required for all privileged access.",
        },
        {
          id: "a8.24", ref: "A.8.24", area: "Use of Cryptography",
          question: "Is the use of cryptography governed by a documented policy with approved algorithms and key management?",
          context: "A.8.24 — Use of cryptography.",
          risk: "Unapproved or deprecated algorithms produce avoidable cryptographic exposure.",
          remediation: "Adopt a cryptography policy specifying approved algorithms and key management practices.",
          policy: "A Cryptography Policy specifies approved algorithms (AES-256, TLS 1.2+), key length requirements, and the lifecycle for key generation, distribution, rotation, and destruction within the key management service.",
        },
      ],
    },
    {
      id: "a8-ops",
      name: "A.8 · Operations & Monitoring",
      questions: [
        {
          id: "a8.8", ref: "A.8.8", area: "Management of Technical Vulnerabilities",
          question: "Are technical vulnerabilities identified, evaluated, and remediated on a defined schedule?",
          context: "A.8.8 — Management of technical vulnerabilities.",
          risk: "Untriaged vulnerabilities accumulate and become exploitable surface.",
          remediation: "Run continuous scanning with severity-based SLAs.",
          policy: "Technical vulnerabilities are identified through continuous scanning of dependencies, container images, and infrastructure; remediation SLAs are 7, 30, and 90 days for critical, high, and medium severity.",
        },
        {
          id: "a8.15", ref: "A.8.15", area: "Logging",
          question: "Are logs produced, stored, protected, and analyzed for security-relevant events?",
          context: "A.8.15 — Logging.",
          risk: "Without protected logs, incidents cannot be investigated or evidenced to auditors.",
          remediation: "Centralize logs in a tamper-evident store with retention and access controls.",
          policy: "Security-relevant logs are forwarded to a centralized, tamper-evident log store with 12-month retention, restricted access, and automated alerting on anomalies.",
        },
        {
          id: "a8.23", ref: "A.8.23", area: "Web Filtering / Network Security",
          question: "Are network security controls (segmentation, egress filtering, web filtering) in place?",
          context: "A.8.20–A.8.23 — Network controls, segregation, services, and web filtering.",
          risk: "Flat networks let intrusions move laterally without resistance.",
          remediation: "Segment production from corporate networks and restrict egress.",
          policy: "Production networks are segmented from corporate networks, egress is restricted to allowlisted destinations, and web filtering is enforced on managed endpoints.",
        },
        {
          id: "a8.25", ref: "A.8.25", area: "Secure Development Life Cycle",
          question: "Is a secure development lifecycle defined and enforced (reviews, SAST, dependency scanning)?",
          context: "A.8.25 — Secure development life cycle.",
          risk: "Insecure development practices produce vulnerabilities that bypass downstream controls.",
          remediation: "Adopt an SDLC with peer review, SAST, and dependency scanning gates.",
          policy: "The secure development life cycle requires peer review, static analysis, and dependency vulnerability scanning prior to merge; security findings block release until remediated or risk-accepted.",
        },
        {
          id: "a8.13", ref: "A.8.13", area: "Information Backup",
          question: "Are backups taken, protected, and tested per a documented policy?",
          context: "A.8.13 — Information backup.",
          risk: "Untested backups frequently fail during real recovery events.",
          remediation: "Encrypt backups, store off-region, and test restoration semi-annually.",
          policy: "Production data is backed up daily, encrypted with AES-256, stored in a separate region, and restoration is tested at least semi-annually with results documented.",
        },
      ],
    },
  ],
};

/* ---------------- HIPAA Security Rule ---------------- */
const HIPAA: Framework = {
  id: "hipaa",
  name: "HIPAA Security Rule",
  shortName: "HIPAA",
  headerLabel: "HIPAA Security Rule Full Readiness Assessment",
  description:
    "45 CFR Part 164 Subpart C — Administrative, Physical, and Technical Safeguards for ePHI.",
  citationLabel: (q) => `45 CFR §${q.ref}`,
  domains: [
    {
      id: "admin-risk",
      name: "Administrative · Risk Management",
      questions: [
        {
          id: "164.308a1ii.A", ref: "164.308(a)(1)(ii)(A)", area: "Risk Analysis",
          question: "Have you conducted an accurate and thorough risk analysis of ePHI confidentiality, integrity, and availability?",
          context: "Required — assess potential risks and vulnerabilities to ePHI.",
          risk: "No risk analysis is the most-cited HIPAA penalty trigger by OCR.",
          remediation: "Conduct a documented, asset-based risk analysis covering all ePHI repositories.",
          policy: "An accurate and thorough analysis of potential risks and vulnerabilities to the confidentiality, integrity, and availability of ePHI is conducted at least annually and after material changes, with results documented in the risk register.",
        },
        {
          id: "164.308a1ii.B", ref: "164.308(a)(1)(ii)(B)", area: "Risk Management",
          question: "Are security measures implemented to reduce risks to a reasonable and appropriate level?",
          context: "Required — implement security measures sufficient to reduce risks.",
          risk: "Identified risks without mitigation produce direct enforcement findings.",
          remediation: "Tie each identified risk to a documented mitigation owner and due date.",
          policy: "Security measures are implemented and tracked for each identified risk to reduce risk to a reasonable and appropriate level, with owners, due dates, and effectiveness reviewed quarterly.",
        },
        {
          id: "164.308a1ii.C", ref: "164.308(a)(1)(ii)(C)", area: "Sanction Policy",
          question: "Is a sanction policy applied to workforce members who fail to comply with security policies?",
          context: "Required — apply appropriate sanctions for non-compliance.",
          risk: "Lack of enforcement undermines the entire administrative safeguard.",
          remediation: "Document a sanction policy tied to the workforce code of conduct.",
          policy: "Workforce members who fail to comply with information security policies are subject to a documented sanction process administered by Human Resources and the Security Officer.",
        },
        {
          id: "164.308a1ii.D", ref: "164.308(a)(1)(ii)(D)", area: "Information System Activity Review",
          question: "Do you regularly review records of information system activity (logs, access reports, incident tracking)?",
          context: "Required — regularly review system activity records.",
          risk: "Logs that are collected but never reviewed do not satisfy the safeguard.",
          remediation: "Establish documented weekly/monthly review of access and audit logs.",
          policy: "Records of information system activity — including audit logs, access reports, and incident tracking — are reviewed on a documented monthly cadence by the Security Officer with findings tracked to remediation.",
        },
      ],
    },
    {
      id: "admin-workforce",
      name: "Administrative · Workforce & Access",
      questions: [
        {
          id: "164.308a3", ref: "164.308(a)(3)", area: "Workforce Security",
          question: "Are procedures in place to ensure only authorized workforce members access ePHI?",
          context: "Required — authorization and supervision of workforce with ePHI access.",
          risk: "Unmanaged workforce access creates undetected exposure of ePHI.",
          remediation: "Document authorization and supervision procedures for ePHI access.",
          policy: "Workforce members are authorized to access ePHI only after documented approval based on least privilege, and access is supervised by the data owner with quarterly attestation.",
        },
        {
          id: "164.308a4", ref: "164.308(a)(4)", area: "Information Access Management",
          question: "Are access authorization and modification procedures documented and consistently followed?",
          context: "Required — isolate health-care clearinghouse functions and authorize/establish/modify access.",
          risk: "Inconsistent provisioning produces unauthorized access detected only at audit.",
          remediation: "Adopt formal access request, approval, and modification workflows.",
          policy: "Access to ePHI is granted, modified, and revoked through a documented workflow requiring data-owner approval, with all changes logged for audit.",
        },
        {
          id: "164.308a5", ref: "164.308(a)(5)", area: "Security Awareness & Training",
          question: "Are periodic security reminders, malware protection, login monitoring, and password management training provided to all workforce members?",
          context: "Addressable — security awareness and training program.",
          risk: "Untrained workforce is the leading source of HIPAA breaches.",
          remediation: "Roll out annual training plus periodic reminders covering all four required topics.",
          policy: "All workforce members complete security awareness training at onboarding and annually thereafter, covering security reminders, malware protection, login monitoring, and password management; completion is tracked in the learning management system.",
        },
        {
          id: "164.308a6", ref: "164.308(a)(6)", area: "Security Incident Procedures",
          question: "Are security incident response and reporting procedures documented and followed?",
          context: "Required — identify, respond to, and document security incidents and outcomes.",
          risk: "Without procedures, suspected incidents go un-triaged and breach notification timelines may be missed.",
          remediation: "Document an incident response process with classification, response, and breach notification.",
          policy: "A documented Security Incident Procedure defines identification, response, mitigation, documentation, and breach-notification timelines consistent with the Breach Notification Rule; outcomes are documented for each incident.",
        },
      ],
    },
    {
      id: "admin-contingency",
      name: "Administrative · Contingency & BAAs",
      questions: [
        {
          id: "164.308a7", ref: "164.308(a)(7)", area: "Contingency Plan",
          question: "Do you have a contingency plan covering data backup, disaster recovery, and emergency mode operations?",
          context: "Required — contingency plan for systems containing ePHI.",
          risk: "Absent contingency planning leaves ePHI availability unprotected during disruption.",
          remediation: "Document data backup, DR, and emergency mode plans and test annually.",
          policy: "A Contingency Plan documents data backup, disaster recovery, and emergency mode operations procedures for all systems containing ePHI, with annual testing and documented results.",
        },
        {
          id: "164.308a8", ref: "164.308(a)(8)", area: "Evaluation",
          question: "Do you perform periodic evaluation of the Security Rule program to ensure ongoing compliance?",
          context: "Required — periodic technical and non-technical evaluation.",
          risk: "Without periodic evaluation, control drift goes undetected.",
          remediation: "Schedule annual technical and non-technical evaluation of safeguards.",
          policy: "A periodic technical and non-technical evaluation of the Security Rule program is performed at least annually and following operational or environmental changes, with results documented and remediation tracked.",
        },
        {
          id: "164.308b", ref: "164.308(b)", area: "Business Associate Contracts",
          question: "Are written Business Associate Agreements in place with all vendors that create, receive, maintain, or transmit ePHI?",
          context: "Required — BAAs satisfying §164.314 with each business associate.",
          risk: "Disclosing ePHI to a vendor without a BAA is a direct HIPAA violation.",
          remediation: "Inventory vendors with ePHI access and execute BAAs before data sharing.",
          policy: "A written Business Associate Agreement compliant with 45 CFR §164.314 is executed with every vendor that creates, receives, maintains, or transmits ePHI prior to any disclosure of ePHI.",
        },
      ],
    },
    {
      id: "physical",
      name: "Physical Safeguards",
      questions: [
        {
          id: "164.310a1", ref: "164.310(a)(1)", area: "Facility Access Controls",
          question: "Are facility access controls in place to limit physical access to systems housing ePHI?",
          context: "Required — limit physical access to electronic information systems.",
          risk: "Unrestricted facility access exposes ePHI systems to unauthorized physical access.",
          remediation: "Implement badge access with logging for areas housing ePHI systems.",
          policy: "Facility access controls limit physical access to systems housing ePHI through badge-based entry, logging, and validation of cloud provider physical security attestations.",
        },
        {
          id: "164.310b", ref: "164.310(b)", area: "Workstation Use",
          question: "Are policies defined for proper use of workstations that access ePHI?",
          context: "Required — define proper functions, manner of performance, and physical attributes of workstations.",
          risk: "Undefined workstation use produces inconsistent handling of ePHI.",
          remediation: "Document workstation use policies for all roles accessing ePHI.",
          policy: "Workstation Use policies define proper functions, manner of performance, and physical attributes of workstations that access ePHI, including required configurations and prohibited uses.",
        },
        {
          id: "164.310d1", ref: "164.310(d)(1)", area: "Device and Media Controls",
          question: "Are policies in place for the receipt, removal, disposal, and reuse of hardware and electronic media containing ePHI?",
          context: "Required — govern receipt and removal of hardware and electronic media.",
          risk: "Improper disposal of media is a frequent root cause of reportable breaches.",
          remediation: "Document device/media lifecycle with sanitization at end of life.",
          policy: "Device and media controls govern receipt, movement, reuse, and disposal of hardware and electronic media containing ePHI, with NIST SP 800-88 sanitization or destruction required at end of life and certificates retained.",
        },
      ],
    },
    {
      id: "tech-access",
      name: "Technical · Access & Audit",
      questions: [
        {
          id: "164.312a", ref: "164.312(a)", area: "Access Control",
          question: "Are technical access controls (unique user IDs, emergency access, automatic logoff, encryption) implemented for ePHI systems?",
          context: "Required and addressable — unique user identification, emergency access, automatic logoff, encryption/decryption.",
          risk: "Missing technical access controls is the most common technical-safeguard finding.",
          remediation: "Enforce unique IDs, automatic logoff, and encryption on all ePHI systems.",
          policy: "Technical access controls enforce unique user identification, an emergency access procedure, automatic logoff after 15 minutes of inactivity, and encryption/decryption of ePHI at rest and in transit.",
        },
        {
          id: "164.312a2iii", ref: "164.312(a)(2)(iii)", area: "Automatic Logoff",
          question: "Do information systems terminate electronic sessions after a predetermined time of inactivity?",
          context: "Addressable — terminate session after a predetermined period.",
          risk: "Persistent sessions on unattended workstations expose ePHI.",
          remediation: "Set OS and application idle timeouts to 15 minutes or less.",
          policy: "Information systems that access ePHI terminate electronic sessions after no more than 15 minutes of inactivity and require re-authentication to resume.",
        },
        {
          id: "164.312a2iv", ref: "164.312(a)(2)(iv)", area: "Encryption & Decryption",
          question: "Is ePHI encrypted at rest using a mechanism the workforce cannot circumvent?",
          context: "Addressable — implement a mechanism to encrypt and decrypt ePHI.",
          risk: "Unencrypted ePHI is the leading source of reportable HIPAA breaches.",
          remediation: "Enable AES-256 at rest on all stores containing ePHI with managed keys.",
          policy: "ePHI is encrypted at rest using AES-256 with keys managed in a dedicated key management service; workforce members do not have direct access to encryption keys.",
        },
        {
          id: "164.312b", ref: "164.312(b)", area: "Audit Controls",
          question: "Do hardware, software, and procedural mechanisms record and examine activity in ePHI systems?",
          context: "Required — audit controls in systems that contain or use ePHI.",
          risk: "Without audit controls, unauthorized access cannot be detected or investigated.",
          remediation: "Forward ePHI system logs to a centralized, tamper-evident store with review.",
          policy: "Audit controls record activity in information systems that contain or use ePHI; logs are forwarded to a centralized, tamper-evident store with 12-month retention and reviewed on a documented monthly cadence.",
        },
      ],
    },
    {
      id: "tech-integrity",
      name: "Technical · Integrity & Transmission",
      questions: [
        {
          id: "164.312c", ref: "164.312(c)", area: "Integrity",
          question: "Are mechanisms in place to authenticate that ePHI has not been altered or destroyed in an unauthorized manner?",
          context: "Required and addressable — protect ePHI from improper alteration or destruction.",
          risk: "Without integrity controls, undetected modification of ePHI is possible.",
          remediation: "Use checksums, write-once logs, and database-level integrity controls.",
          policy: "Integrity controls — including database constraints, write-once audit logging, and checksum verification on critical data flows — protect ePHI from improper alteration or destruction, with anomalies alerted to the Security Officer.",
        },
        {
          id: "164.312d", ref: "164.312(d)", area: "Person/Entity Authentication",
          question: "Do you verify that a person or entity seeking access to ePHI is the one claimed?",
          context: "Required — authenticate persons or entities accessing ePHI.",
          risk: "Single-factor authentication is the leading initial-access vector in healthcare breaches.",
          remediation: "Enforce multi-factor authentication for all access to ePHI.",
          policy: "Person and entity authentication for ePHI access is enforced at the identity provider with multi-factor authentication; phishing-resistant WebAuthn is required for privileged access.",
        },
        {
          id: "164.312e", ref: "164.312(e)", area: "Transmission Security",
          question: "Is ePHI protected against unauthorized access during electronic transmission over networks?",
          context: "Required and addressable — integrity controls and encryption during transmission.",
          risk: "Unencrypted ePHI in transit is exposed to interception and is a reportable breach risk.",
          remediation: "Require TLS 1.2+ on all external endpoints carrying ePHI.",
          policy: "ePHI transmitted over electronic communications networks is protected with TLS 1.2 or higher, with integrity verified through cryptographic mechanisms; legacy protocols are disabled at the network edge.",
        },
      ],
    },
  ],
};

const FRAMEWORKS: Framework[] = [SOC2, ISO, HIPAA];

/* ---------------- App ---------------- */

type Screen = "framework" | "assessment" | "results";

function AuditBridge() {
  const [screen, setScreen] = useState<Screen>("framework");
  const [framework, setFramework] = useState<Framework | null>(null);
  const [domainIdx, setDomainIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});

  const reset = () => {
    setAnswers({});
    setDomainIdx(0);
    setFramework(null);
    setScreen("framework");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/60 backdrop-blur print:hidden">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <button onClick={reset} className="flex items-center gap-2 text-left">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-foreground">AuditBridge</div>
              <div className="text-xs text-muted-foreground">
                {framework ? framework.headerLabel : "Multi-framework readiness"}
              </div>
            </div>
          </button>
          {screen !== "framework" && (
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

      <main className="mx-auto max-w-3xl px-6 py-12 md:py-16 print:max-w-none print:px-0 print:py-0">
        {screen === "framework" && (
          <FrameworkSelect
            onPick={(f) => {
              setFramework(f);
              setDomainIdx(0);
              setAnswers({});
              setScreen("assessment");
            }}
          />
        )}
        {screen === "assessment" && framework && (
          <Assessment
            framework={framework}
            domainIdx={domainIdx}
            setDomainIdx={setDomainIdx}
            answers={answers}
            setAnswers={setAnswers}
            onComplete={() => setScreen("results")}
          />
        )}
        {screen === "results" && framework && (
          <Results framework={framework} answers={answers} onRestart={reset} />
        )}
      </main>

      <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground print:hidden">
        AuditBridge · Demo readiness assessment · Not an attestation of compliance
      </footer>
    </div>
  );
}

/* ---------------- Framework selection ---------------- */

function FrameworkSelect({ onPick }: { onPick: (f: Framework) => void }) {
  const totalQs = (f: Framework) =>
    f.domains.reduce((s, d) => s + d.questions.length, 0);

  return (
    <section className="text-center">
      <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
        <Sparkles className="h-3.5 w-3.5 text-primary" />
        Built for pre-audit teams
      </div>
      <h1 className="mt-6 font-display text-5xl leading-[1.05] text-foreground md:text-6xl">
        AuditBridge — Compliance<br />Readiness in Minutes
      </h1>
      <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
        Choose a framework to begin a full readiness assessment across its core
        control domains. You'll get a scored gap analysis, a domain-by-domain
        breakdown, and a prioritized remediation plan.
      </p>

      <div className="mt-10 grid gap-4 text-left md:grid-cols-3">
        {FRAMEWORKS.map((f) => (
          <button
            key={f.id}
            onClick={() => onPick(f)}
            className="group flex flex-col rounded-2xl border border-border bg-card p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className="text-xs font-semibold uppercase tracking-wider text-primary">
                {f.shortName}
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-primary" />
            </div>
            <h3 className="mt-3 font-display text-2xl leading-tight text-foreground">
              {f.name}
            </h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
              {f.description}
            </p>
            <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="rounded-full bg-secondary px-2 py-0.5 font-medium text-secondary-foreground">
                {f.domains.length} domains
              </span>
              <span>{totalQs(f)} questions</span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Assessment ---------------- */

function Assessment({
  framework,
  domainIdx,
  setDomainIdx,
  answers,
  setAnswers,
  onComplete,
}: {
  framework: Framework;
  domainIdx: number;
  setDomainIdx: (n: number) => void;
  answers: Record<string, Answer>;
  setAnswers: (a: Record<string, Answer>) => void;
  onComplete: () => void;
}) {
  const domain = framework.domains[domainIdx];
  const totalDomains = framework.domains.length;
  const answeredInDomain = domain.questions.filter((q) => answers[q.id]).length;
  const allAnsweredInDomain = answeredInDomain === domain.questions.length;
  const overallAnswered = framework.domains.reduce(
    (sum, d) => sum + d.questions.filter((q) => answers[q.id]).length,
    0,
  );
  const overallTotal = framework.domains.reduce(
    (sum, d) => sum + d.questions.length,
    0,
  );
  const progress = (overallAnswered / overallTotal) * 100;

  const set = (qid: string, a: Answer) =>
    setAnswers({ ...answers, [qid]: a });

  const next = () => {
    if (domainIdx === totalDomains - 1) onComplete();
    else setDomainIdx(domainIdx + 1);
  };

  return (
    <section>
      <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
        <span>
          Domain {domainIdx + 1} of {totalDomains}
        </span>
        <span>
          {answeredInDomain} of {domain.questions.length} answered
        </span>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mt-8">
        <div className="text-xs font-semibold uppercase tracking-wider text-primary">
          {framework.shortName}
        </div>
        <h2 className="mt-1 font-display text-3xl leading-tight text-foreground md:text-4xl">
          {domain.name}
        </h2>
      </div>

      <div className="mt-6 space-y-4">
        {domain.questions.map((q, i) => {
          const current = answers[q.id];
          return (
            <div
              key={q.id}
              className="rounded-2xl border border-border bg-card p-6 shadow-sm md:p-7"
            >
              <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                <span>
                  Question {i + 1} · {q.ref}
                </span>
                <span>{q.area}</span>
              </div>
              <h3 className="mt-2 font-display text-xl leading-snug text-foreground md:text-2xl">
                {q.question}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {q.context}
              </p>

              <div className="mt-5 grid gap-2 md:grid-cols-3">
                {(
                  [
                    { v: "yes", label: "Yes", desc: "Documented & operating" },
                    { v: "partial", label: "Partial", desc: "Gaps remain" },
                    { v: "no", label: "No", desc: "Not in place" },
                  ] as { v: Answer; label: string; desc: string }[]
                ).map((opt) => {
                  const active = current === opt.v;
                  return (
                    <button
                      key={opt.v}
                      onClick={() => set(q.id, opt.v)}
                      className={`flex items-start gap-3 rounded-xl border p-3 text-left transition ${
                        active
                          ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                          : "border-border bg-background hover:border-primary/40 hover:bg-accent/40"
                      }`}
                    >
                      <div
                        className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
                          active ? "border-primary bg-primary" : "border-border"
                        }`}
                      >
                        {active && (
                          <Check
                            className="h-2.5 w-2.5 text-primary-foreground"
                            strokeWidth={3}
                          />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-foreground">
                          {opt.label}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {opt.desc}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex items-center justify-between">
        <button
          onClick={() => setDomainIdx(Math.max(0, domainIdx - 1))}
          disabled={domainIdx === 0}
          className="inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ArrowLeft className="h-4 w-4" />
          Previous domain
        </button>
        <button
          onClick={next}
          disabled={!allAnsweredInDomain}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-[var(--primary-hover)] disabled:cursor-not-allowed disabled:opacity-40"
          title={
            allAnsweredInDomain ? "" : "Answer every question in this domain to continue"
          }
        >
          {domainIdx === totalDomains - 1 ? "See Results" : "Next domain"}
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}

/* ---------------- Results ---------------- */

const WEIGHTS: Record<Answer, number> = { yes: 1, partial: 0.5, no: 0 };

type GapFilter = "all" | "no" | "partial";

function Results({
  framework,
  answers,
  onRestart,
}: {
  framework: Framework;
  answers: Record<string, Answer>;
  onRestart: () => void;
}) {
  const { score, domainScores, gaps, topGap, missingCount, partialCount, totalQuestions } =
    useMemo(() => {
      const allQs = framework.domains.flatMap((d) => d.questions);
      const total = allQs.reduce(
        (s, q) => s + WEIGHTS[answers[q.id] ?? "no"],
        0,
      );
      const score = Math.round((total / allQs.length) * 100);

      const domainScores = framework.domains.map((d) => {
        const sum = d.questions.reduce(
          (s, q) => s + WEIGHTS[answers[q.id] ?? "no"],
          0,
        );
        return {
          domain: d,
          score: Math.round((sum / d.questions.length) * 100),
        };
      });

      const gaps = allQs
        .filter((q) => answers[q.id] !== "yes")
        .sort((a, b) => {
          const order: Record<Answer, number> = { no: 0, partial: 1, yes: 2 };
          return (
            order[answers[a.id] ?? "no"] - order[answers[b.id] ?? "no"]
          );
        });

      const missingCount = allQs.filter((q) => (answers[q.id] ?? "no") === "no").length;
      const partialCount = allQs.filter((q) => answers[q.id] === "partial").length;

      return {
        score,
        domainScores,
        gaps,
        topGap: gaps[0],
        missingCount,
        partialCount,
        totalQuestions: allQs.length,
      };
    }, [framework, answers]);

  const [gapFilter, setGapFilter] = useState<GapFilter>("all");
  const [showAllGaps, setShowAllGaps] = useState(false);

  const filteredGaps = useMemo(() => {
    if (gapFilter === "all") return gaps;
    return gaps.filter((g) => (answers[g.id] ?? "no") === gapFilter);
  }, [gaps, gapFilter, answers]);

  const visibleGaps = showAllGaps ? filteredGaps : filteredGaps.slice(0, 5);

  const tone =
    score >= 80
      ? {
          label: "Audit-Ready",
          color: "var(--color-success)",
          text: "text-[color:var(--success)]",
        }
      : score >= 50
      ? {
          label: "In Progress",
          color: "var(--color-warning)",
          text: "text-[color:var(--warning)]",
        }
      : {
          label: "Significant Gaps",
          color: "var(--color-destructive)",
          text: "text-[color:var(--destructive)]",
        };

  const handleDownload = () => {
    if (typeof window !== "undefined") window.print();
  };

  const renderGapCard = (g: Question) => {
    const a = answers[g.id] ?? "no";
    const isNo = a === "no";
    return (
      <li
        key={g.id}
        className="rounded-xl border border-border bg-card p-5 shadow-sm print:shadow-none print:break-inside-avoid"
      >
        <div className="flex items-start gap-4">
          <div
            className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
              isNo
                ? "bg-[color:var(--destructive)]/10 text-[color:var(--destructive)]"
                : "bg-[color:var(--warning)]/15 text-[color:var(--warning)]"
            }`}
          >
            {isNo ? <XCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-semibold text-foreground">
                {g.ref} — {g.area}
              </h3>
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
  };

  const filterTabs: { id: GapFilter; label: string; count: number }[] = [
    { id: "all", label: "All", count: gaps.length },
    { id: "no", label: "Missing", count: missingCount },
    { id: "partial", label: "Partial", count: partialCount },
  ];

  return (
    <section className="space-y-6 print:space-y-6">
      <div className="hidden print:block">
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          AuditBridge Report
        </div>
        <h1 className="mt-1 font-display text-3xl text-foreground">
          {framework.headerLabel}
        </h1>
      </div>

      {/* Top row: score + stat cards */}
      <div className="grid gap-4 lg:grid-cols-4">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm print:shadow-none lg:col-span-2 lg:row-span-1">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {framework.name} Readiness Score
              </div>
              <div className="mt-2 flex items-baseline gap-3">
                <span className="font-display text-6xl text-foreground">{score}%</span>
                <span className={`text-sm font-semibold ${tone.text}`}>{tone.label}</span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {totalQuestions} controls · {framework.domains.length} domains
              </p>
            </div>
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition hover:bg-[var(--primary-hover)] print:hidden"
            >
              <Download className="h-3.5 w-3.5" />
              Download
            </button>
          </div>
          <div className="mt-5 h-2.5 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{ width: `${score}%`, backgroundColor: tone.color }}
            />
          </div>
        </div>

        <StatCard
          label="Missing Controls"
          value={missingCount}
          accent="var(--color-destructive)"
          icon={<XCircle className="h-4 w-4" />}
        />
        <StatCard
          label="Partial Controls"
          value={partialCount}
          accent="var(--color-warning)"
          icon={<AlertTriangle className="h-4 w-4" />}
        />
      </div>

      {/* Domain grid */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm print:shadow-none print:break-inside-avoid">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="font-display text-2xl text-foreground">Domain breakdown</h2>
          <span className="text-xs text-muted-foreground">
            {framework.domains.length} domains assessed
          </span>
        </div>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {domainScores.map(({ domain, score: ds }) => {
            const dtone =
              ds >= 80
                ? "var(--color-success)"
                : ds >= 50
                ? "var(--color-warning)"
                : "var(--color-destructive)";
            return (
              <li
                key={domain.id}
                className="rounded-xl border border-border bg-surface p-4 print:break-inside-avoid"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-foreground">
                      {domain.name}
                    </div>
                    <div className="mt-0.5 text-[11px] text-muted-foreground">
                      {domain.questions.length} controls
                    </div>
                  </div>
                  <div
                    className="text-base font-semibold tabular-nums"
                    style={{ color: dtone }}
                  >
                    {ds}%
                  </div>
                </div>
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${ds}%`, backgroundColor: dtone }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Prioritized gaps with tabs */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm print:shadow-none">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-2xl text-foreground">Prioritized gaps</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Address missing controls first, then strengthen partial ones.
            </p>
          </div>
          <div className="inline-flex rounded-lg border border-border bg-surface p-1 print:hidden">
            {filterTabs.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setGapFilter(t.id);
                  setShowAllGaps(false);
                }}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                  gapFilter === t.id
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.label}
                <span className="ml-1.5 text-[10px] tabular-nums opacity-70">
                  {t.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {gaps.length === 0 ? (
          <div className="mt-5 rounded-xl border border-border bg-surface p-8 text-center">
            <Check className="mx-auto h-8 w-8 text-[color:var(--success)]" />
            <div className="mt-3 font-semibold text-foreground">No gaps identified</div>
            <p className="mt-1 text-sm text-muted-foreground">
              You're in strong shape across the {framework.shortName} controls covered here.
            </p>
          </div>
        ) : (
          <>
            {/* On-screen filtered + paginated list */}
            <ul className="mt-5 space-y-3 print:hidden">
              {visibleGaps.length === 0 ? (
                <li className="rounded-xl border border-dashed border-border bg-surface p-6 text-center text-sm text-muted-foreground">
                  No gaps in this category.
                </li>
              ) : (
                visibleGaps.map(renderGapCard)
              )}
            </ul>

            {filteredGaps.length > 5 && (
              <div className="mt-4 flex justify-center print:hidden">
                <button
                  onClick={() => setShowAllGaps((v) => !v)}
                  className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:text-foreground"
                >
                  {showAllGaps
                    ? "Show top 5"
                    : `Show all ${filteredGaps.length} gaps`}
                </button>
              </div>
            )}

            {/* Print-only: all gaps */}
            <ul className="mt-5 hidden space-y-3 print:block">
              {gaps.map(renderGapCard)}
            </ul>
          </>
        )}
      </div>

      {/* Policy excerpt — visually distinct */}
      {topGap && (
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm print:shadow-none print:break-inside-avoid">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <h2 className="font-display text-2xl text-foreground">
              Sample policy excerpt
            </h2>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Bonus output — generated draft for your highest-priority gap.
          </p>

          <article className="mt-5 overflow-hidden rounded-xl border border-border bg-card shadow-sm print:shadow-none">
            <div className="flex items-center justify-between border-b border-border bg-surface px-6 py-3">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <FileText className="h-4 w-4" />
                {topGap.area} · Draft v0.1
              </div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                Generated
              </div>
            </div>
            <div className="px-8 py-8 md:px-10 md:py-10">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Section 1 · Purpose — {framework.citationLabel(topGap)}
              </div>
              <h3 className="mt-2 font-display text-2xl text-foreground">
                {topGap.area}
              </h3>
              <p className="mt-5 text-[15px] leading-7 text-foreground">
                {topGap.policy}
              </p>
              <div className="mt-8 border-t border-border pt-4 text-xs text-muted-foreground">
                Owner: Security · Review cadence: Annual · Last reviewed: Pending
                adoption · Reference: {framework.citationLabel(topGap)}
              </div>
            </div>
          </article>
        </div>
      )}

      <div className="flex justify-center pt-2 print:hidden">
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

function StatCard({
  label,
  value,
  accent,
  icon,
}: {
  label: string;
  value: number;
  accent: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm print:shadow-none">
      <div className="flex items-center justify-between">
        <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </div>
        <div
          className="flex h-7 w-7 items-center justify-center rounded-lg"
          style={{ backgroundColor: `color-mix(in oklab, ${accent} 12%, transparent)`, color: accent }}
        >
          {icon}
        </div>
      </div>
      <div className="mt-3 font-display text-4xl text-foreground" style={{ color: accent }}>
        {value}
      </div>
    </div>
  );
}
