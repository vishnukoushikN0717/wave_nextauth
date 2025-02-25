// app/api/verify-otp/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json(
        { error: "Email and OTP are required" },
        { status: 400 }
      );
    }

    // Fetch users from json-server
    const usersRes = await fetch("http://localhost:5000/users");
    const users = await usersRes.json();

    const user = users.find((u: any) => u.email === email);

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (user.otp !== otp) {
      return NextResponse.json(
        { error: "Invalid OTP" },
        { status: 400 }
      );
    }

    // Fetch additional user details based on role
    const detailsEndpoint = user.role === 'internal'
      ? 'http://localhost:5000/internal-users'
      : 'http://localhost:5000/external-users';

    const detailsRes = await fetch(detailsEndpoint);
    const detailsList = await detailsRes.json();
    const userDetails = detailsList.find((u: any) => u.email === email);

    return NextResponse.json({
      success: true,
      message: "OTP verified successfully",
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        companyRole: user.companyRole,
        verified: user.verified,
        onboarded: user.onboarded,
        details: userDetails || null
      }
    });

  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}