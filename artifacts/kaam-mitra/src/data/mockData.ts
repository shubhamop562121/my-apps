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

export const workers: Worker[] = [
  {
    id: "w1",
    name: "Ramesh Kumar",
    profession: "Plumber",
    category: "plumber",
    city: "New Delhi",
    experience: 8,
    verified: true,
    rating: 4.8,
    reviewCount: 124,
    phone: "+91 98765 43210",
    about: "Experienced plumber with 8 years of expertise in residential and commercial plumbing. Specializes in pipe fitting, leak repairs, and bathroom installations. Available 24/7 for emergency services.",
    services: ["Pipe Fitting", "Leak Repair", "Bathroom Installation", "Water Heater", "Drain Cleaning"],
    avatar: "",
  },
  {
    id: "w2",
    name: "Suresh Sharma",
    profession: "Electrician",
    category: "electrician",
    city: "Mumbai",
    experience: 12,
    verified: true,
    rating: 4.9,
    reviewCount: 208,
    phone: "+91 87654 32109",
    about: "Licensed electrician with 12 years in residential wiring, panel upgrades, and safety audits. Certified by the Government of Maharashtra.",
    services: ["Wiring", "Panel Upgrade", "Fan Installation", "MCB Repair", "Safety Audit"],
    avatar: "",
  },
  {
    id: "w3",
    name: "Ajay Verma",
    profession: "Carpenter",
    category: "carpenter",
    city: "Bengaluru",
    experience: 6,
    verified: true,
    rating: 4.7,
    reviewCount: 89,
    phone: "+91 76543 21098",
    about: "Skilled carpenter specializing in custom furniture, modular kitchen fitting, and interior woodwork. Uses premium wood and modern techniques.",
    services: ["Custom Furniture", "Modular Kitchen", "Door Fitting", "Wardrobe", "Interior Woodwork"],
    avatar: "",
  },
  {
    id: "w4",
    name: "Manoj Yadav",
    profession: "Painter",
    category: "painter",
    city: "Hyderabad",
    experience: 9,
    verified: false,
    rating: 4.5,
    reviewCount: 67,
    phone: "+91 65432 10987",
    about: "Professional painter with expertise in interior and exterior wall painting, texture work, and waterproofing solutions.",
    services: ["Interior Painting", "Exterior Painting", "Texture Work", "Waterproofing", "Polish"],
    avatar: "",
  },
  {
    id: "w5",
    name: "Dinesh Patel",
    profession: "AC Technician",
    category: "ac-repair",
    city: "Pune",
    experience: 7,
    verified: true,
    rating: 4.6,
    reviewCount: 143,
    phone: "+91 54321 09876",
    about: "Certified AC technician trained in servicing all major brands including LG, Samsung, Voltas, and Daikin. Offers annual maintenance contracts.",
    services: ["AC Service", "AC Installation", "Gas Refilling", "PCB Repair", "Annual Maintenance"],
    avatar: "",
  },
  {
    id: "w6",
    name: "Harish Singh",
    profession: "CCTV Installer",
    category: "cctv",
    city: "Jaipur",
    experience: 5,
    verified: true,
    rating: 4.7,
    reviewCount: 58,
    phone: "+91 43210 98765",
    about: "Expert CCTV installer for homes, shops, and offices. Works with all major brands. Also handles DVR/NVR setup and remote viewing configuration.",
    services: ["Camera Installation", "DVR Setup", "Remote Viewing", "Maintenance", "Upgrades"],
    avatar: "",
  },
  {
    id: "w7",
    name: "Ravi Gupta",
    profession: "Mason",
    category: "mason",
    city: "New Delhi",
    experience: 15,
    verified: false,
    rating: 4.4,
    reviewCount: 32,
    phone: "+91 32109 87654",
    about: "Master mason with 15 years experience in brick laying, plastering, tile work, and civil construction projects.",
    services: ["Brick Laying", "Plastering", "Tile Work", "Waterproofing", "Civil Work"],
    avatar: "",
  },
  {
    id: "w8",
    name: "Pradeep Mishra",
    profession: "Cleaning Worker",
    category: "cleaning",
    city: "Mumbai",
    experience: 4,
    verified: true,
    rating: 4.6,
    reviewCount: 95,
    phone: "+91 21098 76543",
    about: "Professional home and office cleaning expert. Uses eco-friendly products. Offers one-time deep cleaning and regular maintenance packages.",
    services: ["Deep Cleaning", "Regular Maintenance", "Sofa Cleaning", "Kitchen Deep Clean", "Bathroom Sanitize"],
    avatar: "",
  },
  {
    id: "w9",
    name: "Vikram Chauhan",
    profession: "Welder",
    category: "welder",
    city: "Bengaluru",
    experience: 11,
    verified: true,
    rating: 4.8,
    reviewCount: 77,
    phone: "+91 10987 65432",
    about: "Expert welder specializing in MS fabrication, grills, gates, and structural welding. Works on-site and at workshop.",
    services: ["MS Fabrication", "Gate Making", "Grill Work", "Structural Welding", "Repairs"],
    avatar: "",
  },
  {
    id: "w10",
    name: "Santosh Tiwari",
    profession: "RO Technician",
    category: "ro-repair",
    city: "Hyderabad",
    experience: 6,
    verified: true,
    rating: 4.5,
    reviewCount: 112,
    phone: "+91 09876 54321",
    about: "Certified RO technician for all brands including Kent, Aquaguard, and Pureit. Offers filter replacement, service, and annual AMC.",
    services: ["RO Service", "Filter Replacement", "Installation", "Repair", "Annual AMC"],
    avatar: "",
  },
  {
    id: "w11",
    name: "Ashok Pandey",
    profession: "Labour",
    category: "labour",
    city: "Pune",
    experience: 3,
    verified: false,
    rating: 4.3,
    reviewCount: 28,
    phone: "+91 98765 12345",
    about: "Reliable labour available for loading/unloading, shifting, construction assistance, and general daily wage work.",
    services: ["Loading/Unloading", "House Shifting", "Construction Help", "Daily Wage", "Cleaning"],
    avatar: "",
  },
  {
    id: "w12",
    name: "Sunil Nair",
    profession: "Electrician",
    category: "electrician",
    city: "Jaipur",
    experience: 4,
    verified: true,
    rating: 4.6,
    reviewCount: 51,
    phone: "+91 87654 12345",
    about: "Young and skilled electrician available for all electrical work including wiring, light fitting, inverter installation, and repairs.",
    services: ["Wiring", "Light Fitting", "Inverter Install", "Switch Repair", "Fan Repair"],
    avatar: "",
  },
];

export const savedWorkerIds = ["w1", "w3", "w5"];

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
    message: "A new verified plumber Ramesh Kumar is now available in New Delhi.",
    time: "2 mins ago",
    read: false,
  },
  {
    id: "n2",
    type: "request_approved",
    title: "Request Approved",
    message: "Your AC repair request #r3 has been approved.",
    time: "1 hour ago",
    read: false,
  },
  {
    id: "n3",
    type: "worker_assigned",
    title: "Worker Assigned",
    message: "Dinesh Patel has been assigned to your AC repair request.",
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
    message: "Harish Singh just joined KaamMitra in Jaipur.",
    time: "2 days ago",
    read: true,
  },
];
