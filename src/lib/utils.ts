import { clsx, type ClassValue } from "clsx";
import crypto from "crypto";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateReferralCode(userId: string): string {
  const salt = crypto.randomBytes(4).toString("hex");
  const hash = crypto
    .createHash("sha256")
    .update(userId + salt)
    .digest("hex");
  return hash.substr(0, 8);
}
