import { generateSecret as otplibGenerateSecret, verify as otplibVerify, generateURI } from "otplib";
import QRCode from "qrcode";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import { encrypt, decrypt } from "./crypto-wallet";
import Twilio from "twilio";

// ── TOTP ─────────────────────────────────────────────────────────────

export function generateTOTPSecret(): string {
  return otplibGenerateSecret();
}

export function encryptTOTPSecret(secret: string): string {
  return encrypt(secret);
}

export function decryptTOTPSecret(encrypted: string): string {
  return decrypt(encrypted);
}

export async function verifyTOTP(token: string, encryptedSecret: string): Promise<boolean> {
  const secret = decryptTOTPSecret(encryptedSecret);
  try {
    const result = await otplibVerify({ token, secret });
    return result.valid === true;
  } catch {
    return false;
  }
}

export async function generateTOTPQRCode(
  secret: string,
  userEmail: string
): Promise<string> {
  const appName = process.env.TOTP_APP_NAME ?? "Vaulté";
  const otpAuthUrl = generateURI({ label: userEmail, issuer: appName, secret });
  return QRCode.toDataURL(otpAuthUrl);
}

// ── SMS OTP ───────────────────────────────────────────────────────────

export function generateSMSOTP(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export async function hashOTP(otp: string): Promise<string> {
  return bcrypt.hash(otp, 10);
}

export async function verifyOTPHash(otp: string, hash: string): Promise<boolean> {
  return bcrypt.compare(otp, hash);
}

export async function sendSMSOTP(phoneNumber: string, otp: string): Promise<void> {
  const client = Twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );

  await client.messages.create({
    body: `Your Vaulté verification code is: ${otp}. Valid for 10 minutes. Do not share this code.`,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: phoneNumber,
  });
}

// ── BACKUP CODES ──────────────────────────────────────────────────────

export function generateBackupCodes(count = 8): string[] {
  return Array.from({ length: count }, () =>
    randomBytes(4).toString("hex").toUpperCase().replace(/(.{4})/, "$1-")
  );
}

export async function hashBackupCodes(codes: string[]): Promise<string[]> {
  return Promise.all(codes.map((code) => bcrypt.hash(code, 10)));
}

export async function verifyBackupCode(
  code: string,
  hashes: string[]
): Promise<number> {
  for (let i = 0; i < hashes.length; i++) {
    if (await bcrypt.compare(code.toUpperCase(), hashes[i])) return i;
  }
  return -1;
}

// ── SESSION TOKEN ─────────────────────────────────────────────────────

export function generate2FASessionToken(): string {
  return randomBytes(32).toString("hex");
}
