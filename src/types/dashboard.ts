export type Vendor =
  | 'Nutanix'
  | 'NetApp'
  | 'Cohesity'
  | 'Cisco'
  | 'Dell'
  | 'Lenovo'
  | 'IBM'
  | 'HPE'
  | 'Other';

export type CertStatus = 'completed' | 'up_next' | 'planned';

export type Domain =
  | 'HCI'
  | 'Storage'
  | 'Data Protection'
  | 'Networking'
  | 'Compute'
  | 'AI Infra';

export type Pillar =
  | 'Compute & GPU Sizing'
  | 'Enterprise Storage & IOPS'
  | 'Network Fabric (Spine-Leaf / EVPN-VXLAN)'
  | 'Kubernetes & IaC (Terraform)'
  | 'Security Architecture'
  | 'CXO BOQ & Capstone';

export type DayStatus = 'not_started' | 'in_progress' | 'mastered';

export type FieldType = 'Customer Meeting' | 'BOQ';

export type Theme = 'dark' | 'light';

export interface Certification {
  id: string;
  vendor: Vendor;
  title: string;
  code: string;
  status: CertStatus;
  date: string;
  credentialUrl?: string;
  domain: Domain;
}

export interface PlanDay {
  day: number;
  pillar: Pillar;
  title: string;
  status: DayStatus;
  notes: string;
  resources: string[];
}

export interface CustomerMeeting {
  id: string;
  type: FieldType;
  title: string;
  organization: string;
  date: string;
  location?: string;
  techTags?: string[];
  oemTags: string[];
  summary: string;
  keyTakeaways: string[];
}

// Backwards-compatible alias for existing imports
export type FieldEntry = CustomerMeeting;

export type OemSessionCategory =
  | 'Agentic AI & MCP'
  | 'Observability & SecOps'
  | 'Data Center & Fabric'
  | 'Cloud & Storage'
  | 'Industrial & OT';

export interface OemSession {
  id: string;
  oem: string;
  title: string;
  speakerOrLead?: string;
  category: OemSessionCategory;
  date: string;
  summary: string;
  keyTopics: string[];
  oemTags: string[];
}

export interface DashboardState {
  certifications: Certification[];
  planDays: PlanDay[];
  fieldEntries: FieldEntry[];
  theme: Theme;
  oemSessions?: OemSession[];
}
