export type Worker = {
  id: string; name: string; phone: string; category: string; city: string;
  experience: number; rating: number; reviewCount: number; status: "active" | "inactive";
  verified: boolean; joinedAt: string; description: string;
};

export type User = {
  id: string; name: string; phone: string; city: string;
  status: "active" | "blocked"; registeredAt: string; totalRequests: number;
};

export type Category = {
  id: string; name: string; icon: string; workerCount: number; status: "active" | "inactive";
};

export type City = {
  id: string; name: string; state: string; workerCount: number; status: "active" | "inactive";
};

export type Review = {
  id: string; workerName: string; userName: string; rating: number;
  comment: string; createdAt: string; status: "approved" | "pending" | "removed";
};

export type Ad = {
  id: string; title: string; imageUrl: string; linkUrl: string;
  position: string; status: "active" | "inactive"; startDate: string; endDate: string;
};

export type Message = {
  id: string; name: string; phone: string; subject: string;
  message: string; createdAt: string; status: "open" | "resolved";
};

export type Appointment = {
  id: string;
  userName: string;
  userPhone: string;
  address: string;
  category: string;
  workerName: string;
  description: string;
  preferredDate: string;
  preferredTime: string;
  status: "Pending" | "Approved" | "Assigned" | "In Progress" | "Completed" | "Rejected";
  assignedWorkerName?: string;
  assignedWorkerId?: string;
  bookedAt: string;
  note?: string;
};

export const users: User[] = [
  { id: "u1", name: "Rahul Sharma", phone: "+91 98765 43210", city: "New Delhi", status: "active", registeredAt: "2024-01-05", totalRequests: 5 },
  { id: "u2", name: "Priya Verma", phone: "+91 87654 32109", city: "Mumbai", status: "active", registeredAt: "2024-01-12", totalRequests: 3 },
  { id: "u3", name: "Amit Joshi", phone: "+91 76543 21098", city: "Bangalore", status: "blocked", registeredAt: "2024-02-03", totalRequests: 1 },
  { id: "u4", name: "Sneha Patel", phone: "+91 65432 10987", city: "Ahmedabad", status: "active", registeredAt: "2024-02-15", totalRequests: 8 },
  { id: "u5", name: "Kiran Singh", phone: "+91 54321 09876", city: "Jaipur", status: "active", registeredAt: "2024-03-01", totalRequests: 2 },
  { id: "u6", name: "Deepak Kumar", phone: "+91 43210 98765", city: "Lucknow", status: "active", registeredAt: "2024-03-10", totalRequests: 4 },
  { id: "u7", name: "Anita Rao", phone: "+91 32109 87654", city: "Hyderabad", status: "active", registeredAt: "2024-03-20", totalRequests: 6 },
  { id: "u8", name: "Rajesh Nair", phone: "+91 21098 76543", city: "Chennai", status: "blocked", registeredAt: "2024-04-02", totalRequests: 0 },
];

export const categories: Category[] = [
  { id: "c1", name: "Plumber", icon: "💧", workerCount: 45, status: "active" },
  { id: "c2", name: "Electrician", icon: "⚡", workerCount: 52, status: "active" },
  { id: "c3", name: "Carpenter", icon: "🪚", workerCount: 38, status: "active" },
  { id: "c4", name: "Painter", icon: "🎨", workerCount: 29, status: "active" },
  { id: "c5", name: "Mason", icon: "🧱", workerCount: 24, status: "active" },
  { id: "c6", name: "AC Repair", icon: "❄️", workerCount: 31, status: "active" },
  { id: "c7", name: "Welder", icon: "🔥", workerCount: 18, status: "active" },
  { id: "c8", name: "Labour", icon: "👷", workerCount: 67, status: "active" },
  { id: "c9", name: "CCTV", icon: "📷", workerCount: 22, status: "inactive" },
  { id: "c10", name: "RO Repair", icon: "💦", workerCount: 15, status: "active" },
  { id: "c11", name: "Cleaning", icon: "🧹", workerCount: 40, status: "active" },
];

export const cities: City[] = [
  { id: "ct1", name: "New Delhi", state: "Delhi", workerCount: 120, status: "active" },
  { id: "ct2", name: "Mumbai", state: "Maharashtra", workerCount: 98, status: "active" },
  { id: "ct3", name: "Bangalore", state: "Karnataka", workerCount: 87, status: "active" },
  { id: "ct4", name: "Hyderabad", state: "Telangana", workerCount: 65, status: "active" },
  { id: "ct5", name: "Chennai", state: "Tamil Nadu", workerCount: 54, status: "active" },
  { id: "ct6", name: "Jaipur", state: "Rajasthan", workerCount: 43, status: "active" },
  { id: "ct7", name: "Lucknow", state: "Uttar Pradesh", workerCount: 39, status: "active" },
  { id: "ct8", name: "Ahmedabad", state: "Gujarat", workerCount: 51, status: "active" },
  { id: "ct9", name: "Chandigarh", state: "Punjab", workerCount: 28, status: "inactive" },
  { id: "ct10", name: "Pune", state: "Maharashtra", workerCount: 44, status: "active" },
];

export const reviews: Review[] = [
  { id: "r1", workerName: "Ramesh Kumar", userName: "Rahul Sharma", rating: 5, comment: "Excellent work! Fixed the leakage within 30 minutes.", createdAt: "2024-04-10", status: "approved" },
  { id: "r2", workerName: "Suresh Sharma", userName: "Priya Verma", rating: 4, comment: "Good job, professional behavior.", createdAt: "2024-04-12", status: "approved" },
  { id: "r3", workerName: "Dinesh Patel", userName: "Amit Joshi", rating: 3, comment: "AC working but took too long.", createdAt: "2024-04-15", status: "pending" },
  { id: "r4", workerName: "Mahesh Yadav", userName: "Sneha Patel", rating: 5, comment: "Amazing carpentry work. Highly recommend!", createdAt: "2024-04-18", status: "approved" },
  { id: "r5", workerName: "Ravi Gupta", userName: "Kiran Singh", rating: 2, comment: "Paint quality was poor.", createdAt: "2024-04-20", status: "pending" },
  { id: "r6", workerName: "Ajay Singh", userName: "Deepak Kumar", rating: 5, comment: "Built our boundary wall perfectly.", createdAt: "2024-04-22", status: "approved" },
  { id: "r7", workerName: "Vikram Nair", userName: "Anita Rao", rating: 1, comment: "Very rude behavior. Not recommended.", createdAt: "2024-04-25", status: "removed" },
];

export const ads: Ad[] = [
  { id: "a1", title: "Summer Sale Banner", imageUrl: "https://placehold.co/800x200/1D4ED8/FFFFFF?text=Summer+Sale", linkUrl: "https://kaammitra.in/sale", position: "Home Top", status: "active", startDate: "2024-04-01", endDate: "2024-06-30" },
  { id: "a2", title: "Electrician Special", imageUrl: "https://placehold.co/800x200/16A34A/FFFFFF?text=Electrician+Special", linkUrl: "https://kaammitra.in/electric", position: "Category Page", status: "active", startDate: "2024-04-15", endDate: "2024-05-15" },
  { id: "a3", title: "Monsoon Plumbing", imageUrl: "https://placehold.co/800x200/0891B2/FFFFFF?text=Monsoon+Ready", linkUrl: "https://kaammitra.in/plumbing", position: "Home Bottom", status: "inactive", startDate: "2024-06-01", endDate: "2024-08-31" },
];

export const messages: Message[] = [
  { id: "m1", name: "Rahul Sharma", phone: "+91 98765 43210", subject: "App not working", message: "I am unable to login to the app. Please help.", createdAt: "2024-04-10", status: "resolved" },
  { id: "m2", name: "Priya Verma", phone: "+91 87654 32109", subject: "Worker not responding", message: "The worker I contacted is not picking up calls.", createdAt: "2024-04-12", status: "open" },
  { id: "m3", name: "Amit Joshi", phone: "+91 76543 21098", subject: "Wrong category listed", message: "The plumber showed up but said he only does electrical work.", createdAt: "2024-04-14", status: "open" },
  { id: "m4", name: "Sneha Patel", phone: "+91 65432 10987", subject: "Refund request", message: "Worker did not complete the job but I was charged.", createdAt: "2024-04-16", status: "open" },
  { id: "m5", name: "Kiran Singh", phone: "+91 54321 09876", subject: "Great experience", message: "Just wanted to say thank you, excellent service!", createdAt: "2024-04-18", status: "resolved" },
];

export const appointments: Appointment[] = [
  { id: "apt1", userName: "Rahul Sharma", userPhone: "+91 98765 43210", address: "45, Lajpat Nagar, New Delhi", category: "Plumber", workerName: "Ramesh Kumar", description: "Kitchen sink leaking, needs urgent repair", preferredDate: "2024-06-22", preferredTime: "10:00 AM", status: "Pending", bookedAt: "2024-06-20" },
  { id: "apt2", userName: "Priya Verma", userPhone: "+91 87654 32109", address: "12, Andheri West, Mumbai", category: "Electrician", workerName: "Suresh Sharma", description: "Main switch board replacement needed", preferredDate: "2024-06-23", preferredTime: "2:00 PM", status: "Pending", bookedAt: "2024-06-20" },
  { id: "apt3", userName: "Sneha Patel", userPhone: "+91 65432 10987", address: "78, Satellite, Ahmedabad", category: "AC Repair", workerName: "Dinesh Patel", description: "AC not cooling properly, gas may be low", preferredDate: "2024-06-23", preferredTime: "11:00 AM", status: "Approved", bookedAt: "2024-06-19" },
  { id: "apt4", userName: "Deepak Kumar", userPhone: "+91 43210 98765", address: "23, Gomti Nagar, Lucknow", category: "Carpenter", workerName: "Mahesh Yadav", description: "Need custom wardrobe for bedroom", preferredDate: "2024-06-24", preferredTime: "9:00 AM", status: "Assigned", assignedWorkerName: "Mahesh Yadav", assignedWorkerId: "w4", bookedAt: "2024-06-18" },
  { id: "apt5", userName: "Anita Rao", userPhone: "+91 32109 87654", address: "56, Banjara Hills, Hyderabad", category: "Cleaning", workerName: "Harish Tiwari", description: "Deep cleaning for 3BHK apartment before moving", preferredDate: "2024-06-20", preferredTime: "8:00 AM", status: "In Progress", assignedWorkerName: "Harish Tiwari", assignedWorkerId: "w10", bookedAt: "2024-06-17" },
  { id: "apt6", userName: "Kiran Singh", userPhone: "+91 54321 09876", address: "11, C-Scheme, Jaipur", category: "Mason", workerName: "Ajay Singh", description: "Repair crack in boundary wall", preferredDate: "2024-06-15", preferredTime: "10:00 AM", status: "Completed", assignedWorkerName: "Ajay Singh", assignedWorkerId: "w6", bookedAt: "2024-06-13" },
  { id: "apt7", userName: "Amit Joshi", userPhone: "+91 76543 21098", address: "34, Koramangala, Bangalore", category: "Welder", workerName: "Vikram Nair", description: "Gate repair and welding work", preferredDate: "2024-06-25", preferredTime: "3:00 PM", status: "Rejected", bookedAt: "2024-06-19", note: "Worker not available on that date" },
];

export const dashboardStats = {
  totalUsers: 8,
  totalCategories: 11,
  totalCities: 10,
  totalReviews: 7,
  activeAds: 2,
  pendingAppointments: appointments.filter((a) => a.status === "Pending").length,
  monthlyGrowth: [
    { month: "Jan", users: 2, workers: 3 },
    { month: "Feb", users: 2, workers: 2 },
    { month: "Mar", users: 3, workers: 2 },
    { month: "Apr", users: 1, workers: 3 },
  ],
};
