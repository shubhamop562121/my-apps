export type Worker = {
  id: string;
  name: string;
  profession: string;
  category: string;
  city: string;
  experience: number;
  verified: boolean;
  rating: number;
  reviewCount: number;
  phone: string;
  about: string;
  services: string[];
  avatar: string;
  saved?: boolean;
};

export type ServiceRequest = {
  id: string;
  category: string;
  description: string;
  date: string;
  status: "Pending" | "Approved" | "In Progress" | "Completed" | "Cancelled";
  workerName?: string;
  workerPhone?: string;
};

export type Notification = {
  id: string;
  type: "new_worker" | "request_approved" | "worker_assigned" | "status_updated";
  title: string;
  message: string;
  time: string;
  read: boolean;
};

export const categories = [
  { slug: "plumber", label: "Plumber", icon: "Droplets", color: "#3B82F6" },
  { slug: "electrician", label: "Electrician", icon: "Zap", color: "#F59E0B" },
  { slug: "carpenter", label: "Carpenter", icon: "Hammer", color: "#92400E" },
  { slug: "mason", label: "Mason", icon: "Building2", color: "#6B7280" },
  { slug: "painter", label: "Painter", icon: "Paintbrush", color: "#8B5CF6" },
  { slug: "ac-repair", label: "AC Repair", icon: "Wind", color: "#06B6D4" },
  { slug: "welder", label: "Welder", icon: "Flame", color: "#EF4444" },
  { slug: "labour", label: "Labour", icon: "HardHat", color: "#D97706" },
  { slug: "cctv", label: "CCTV", icon: "Camera", color: "#1D4ED8" },
  { slug: "ro-repair", label: "RO Repair", icon: "Waves", color: "#0891B2" },
  { slug: "cleaning", label: "Cleaning", icon: "Sparkles", color: "#10B981" },
  { slug: "other", label: "More", icon: "Grid3x3", color: "#9CA3AF" },
];

export const serviceRequests: ServiceRequest[] = [
  {
    id: "r1",
    category: "Plumber",
    description: "Kitchen sink leaking, needs urgent repair",
    date: "2024-01-15",
    status: "Completed",
    workerName: "Ramesh Kumar",
    workerPhone: "+91 98765 43210",
  },
  {
    id: "r2",
    category: "Electrician",
    description: "Main switch board replacement needed",
    date: "2024-01-20",
    status: "In Progress",
    workerName: "Suresh Sharma",
    workerPhone: "+91 87654 32109",
  },
  {
    id: "r3",
    category: "AC Repair",
    description: "AC not cooling properly, gas may be low",
    date: "2024-01-22",
    status: "Approved",
    workerName: "Dinesh Patel",
    workerPhone: "+91 54321 09876",
  },
  {
    id: "r4",
    category: "Painter",
    description: "2BHK interior painting, 3 rooms",
    date: "2024-01-25",
    status: "Pending",
  },
  {
    id: "r5",
    category: "CCTV",
    description: "Install 4 cameras at shop entrance",
    date: "2024-01-18",
    status: "Cancelled",
  },
];

export const notifications: Notification[] = [
  {
    id: "n1",
    type: "new_worker",
    title: "New Plumber Available",
    message: "A new verified plumber is now available in New Delhi.",
    time: "2 mins ago",
    read: false,
  },
  {
    id: "n2",
    type: "request_approved",
    title: "Request Approved",
    message: "Your AC repair request has been approved.",
    time: "1 hour ago",
    read: false,
  },
  {
    id: "n3",
    type: "worker_assigned",
    title: "Worker Assigned",
    message: "A technician has been assigned to your AC repair request.",
    time: "3 hours ago",
    read: true,
  },
  {
    id: "n4",
    type: "status_updated",
    title: "Request Status Updated",
    message: "Your electrician request is now In Progress.",
    time: "Yesterday",
    read: true,
  },
  {
    id: "n5",
    type: "new_worker",
    title: "New CCTV Installer",
    message: "A new CCTV installer just joined KaamMitra in Jaipur.",
    time: "2 days ago",
    read: true,
  },
];
