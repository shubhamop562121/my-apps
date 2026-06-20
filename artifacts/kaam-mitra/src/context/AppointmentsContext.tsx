import { createContext, useContext, useState, ReactNode } from "react";

export type Appointment = {
  id: string;
  workerId: string;
  workerName: string;
  category: string;
  userName: string;
  userPhone: string;
  address: string;
  description: string;
  preferredDate: string;
  preferredTime: string;
  status: "Pending" | "Approved" | "Assigned" | "In Progress" | "Completed" | "Rejected";
  assignedWorkerName?: string;
  bookedAt: string;
};

type AppointmentsContextType = {
  appointments: Appointment[];
  addAppointment: (a: Omit<Appointment, "id" | "bookedAt" | "status">) => string;
};

const AppointmentsContext = createContext<AppointmentsContextType | null>(null);

const initial: Appointment[] = [
  {
    id: "apt1",
    workerId: "w1",
    workerName: "Ramesh Kumar",
    category: "Plumber",
    userName: "Rahul Sharma",
    userPhone: "+91 98765 43210",
    address: "45, Lajpat Nagar, New Delhi",
    description: "Kitchen sink leaking, needs urgent repair",
    preferredDate: "2024-01-15",
    preferredTime: "10:00 AM",
    status: "Completed",
    assignedWorkerName: "Ramesh Kumar",
    bookedAt: "2024-01-14",
  },
  {
    id: "apt2",
    workerId: "w2",
    workerName: "Suresh Sharma",
    category: "Electrician",
    userName: "Rahul Sharma",
    userPhone: "+91 98765 43210",
    address: "45, Lajpat Nagar, New Delhi",
    description: "Main switch board replacement needed",
    preferredDate: "2024-01-20",
    preferredTime: "2:00 PM",
    status: "In Progress",
    assignedWorkerName: "Suresh Sharma",
    bookedAt: "2024-01-18",
  },
  {
    id: "apt3",
    workerId: "w5",
    workerName: "Dinesh Patel",
    category: "AC Repair",
    userName: "Rahul Sharma",
    userPhone: "+91 98765 43210",
    address: "45, Lajpat Nagar, New Delhi",
    description: "AC not cooling properly, gas may be low",
    preferredDate: "2024-01-22",
    preferredTime: "11:00 AM",
    status: "Approved",
    bookedAt: "2024-01-20",
  },
];

export function AppointmentsProvider({ children }: { children: ReactNode }) {
  const [appointments, setAppointments] = useState<Appointment[]>(initial);

  const addAppointment = (a: Omit<Appointment, "id" | "bookedAt" | "status">): string => {
    const id = `apt${Date.now()}`;
    const newApt: Appointment = {
      ...a,
      id,
      status: "Pending",
      bookedAt: new Date().toISOString().split("T")[0],
    };
    setAppointments((prev) => [newApt, ...prev]);
    return id;
  };

  return (
    <AppointmentsContext.Provider value={{ appointments, addAppointment }}>
      {children}
    </AppointmentsContext.Provider>
  );
}

export function useAppointments() {
  const ctx = useContext(AppointmentsContext);
  if (!ctx) throw new Error("useAppointments must be used within AppointmentsProvider");
  return ctx;
}
