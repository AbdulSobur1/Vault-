import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { db } from "@/lib/db";
import { users, accounts, currencyWallets, cryptoWallets } from "@/lib/schema";
import { eq, or } from "drizzle-orm";
import { generateAccountNumber } from "@/lib/utils";
import { generateWallet } from "@/lib/crypto-wallet";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { surname, firstname, middlename, email, password, phone, dob, gender, nationality, address, nin } = body;

    // Validate required fields
    if (!surname || !firstname || !email || !password || !nin) {
      return NextResponse.json(
        { success: false, message: "Surname, first name, email, password, and NIN are required." },
        { status: 400 }
      );
    }

    // Validate NIN length
    if (nin.length !== 11) {
      return NextResponse.json(
        { success: false, message: "NIN must be exactly 11 characters." },
        { status: 400 }
      );
    }

    // Validate age (must be at least 18)
    if (dob) {
      const birth = new Date(dob);
      const today = new Date();
      const age = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();
      const adjustedAge = m < 0 || (m === 0 && today.getDate() < birth.getDate()) ? age - 1 : age;
      if (adjustedAge < 18) {
        return NextResponse.json(
          { success: false, message: "You must be at least 18 years old to open an account." },
          { status: 400 }
        );
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: "Invalid email format." },
        { status: 400 }
      );
    }

    // Check for duplicate email or NIN
    const existingUser = await db.query.users.findFirst({
      where: or(eq(users.email, email), eq(users.nin, nin)),
    });

    if (existingUser) {
      const field = existingUser.email === email ? "Email" : "NIN";
      return NextResponse.json(
        { success: false, message: `${field} is already registered.` },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await hash(password, 12);

    // Create user
    const [newUser] = await db
      .insert(users)
      .values({
        surname,
        firstname,
        middlename: middlename || null,
        email,
        passwordHash,
        phone: phone || null,
        dob: dob || null,
        gender: gender || null,
        nationality: nationality || null,
        address: address || null,
        nin,
      })
      .returning();

    // Auto-create savings account
    await db.insert(accounts).values({
      userId: newUser.id,
      accountNumber: generateAccountNumber(),
      accountType: "savings",
      balance: "0.00",
      currency: "NGN",
    });

    // Auto-create default currency wallets
    await db.insert(currencyWallets).values([
      { userId: newUser.id, currency: "NGN", balance: "0" },
      { userId: newUser.id, currency: "USD", balance: "0" },
    ]);

    // Auto-generate crypto wallet
    try {
      const { address, encryptedPrivateKey, encryptedMnemonic } = generateWallet();
      await db.insert(cryptoWallets).values({
        userId: newUser.id,
        address,
        encryptedPrivateKey,
        encryptedMnemonic,
        network: 'ethereum',
      });
    } catch (cryptoError) {
      console.warn('Crypto wallet generation skipped:', cryptoError);
    }

    return NextResponse.json(
      { success: true, message: "Registration successful" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { success: false, message: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
