import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

/**
 * Submit a support/contact message. Lands in the admin "Messages" inbox as
 * status "open".
 */
export async function sendSupportMessage(input: {
  name: string;
  phone: string;
  subject: string;
  message: string;
}): Promise<void> {
  const message = input.message.trim().slice(0, 2000);
  if (!message) throw new Error("Please enter a message.");
  const name = (input.name?.trim() || "Anonymous").slice(0, 80);
  const phone = (input.phone?.trim() || "").slice(0, 20);
  const subject = (input.subject?.trim() || "Support request").slice(0, 120);
  await addDoc(collection(db, "messages"), {
    name,
    phone,
    subject,
    message,
    status: "open",
    createdAt: serverTimestamp(),
  });
}
