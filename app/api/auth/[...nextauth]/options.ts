import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions, User } from "next-auth";
import { NextRequest } from "next/server";

const API_BASE_URL_INTERNAL = process.env.NEXT_PUBLIC_API_BASE_URL_INTERNAL;
const API_BASE_URL_EXTERNAL = process.env.NEXT_PUBLIC_API_BASE_URL_EXTERNAL;

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        otp: { label: 'OTP', type: 'text' },
      },
      async authorize(
        credentials: Record<"email" | "otp", string> | undefined,
        req: NextRequest
      ): Promise<User | null> {
        if (!credentials) {
          throw new Error("Configuration error");
        }

        const decodedEmail = decodeURIComponent(credentials.email);
        const isInternalUser = req.nextUrl.pathname.startsWith('/auth/verify-otp');
        const validateUrl = isInternalUser 
          ? `${API_BASE_URL_INTERNAL}/api/WAVInternalUser/validate-otp`
          : `${API_BASE_URL_EXTERNAL}/api/WAVExternalUser/validate-otp`;

        const payload = {
          email: decodedEmail,
          otp: credentials.otp
        };

        console.log('=== OTP Validation Debug ===');
        console.log('URL:', validateUrl);
        console.log('Payload:', payload);

        try {
          const verifyRes = await fetch(validateUrl, {
            method: 'POST',
            headers: {
              'accept': '*/*',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload),
          });

          console.log('Response Status:', verifyRes.status);
          const responseText = await verifyRes.text();
          console.log('Raw Response:', responseText);

          const validationData = JSON.parse(responseText);
          console.log('Parsed Response:', validationData);
          
          if (!verifyRes.ok || !validationData?.message) {
            console.error('Validation Failed:', validationData);
            return null;
          }

          // Fetch user details after successful validation
          const userDetailsUrl = isInternalUser 
            ? `${API_BASE_URL_INTERNAL}/api/WAVInternalUser`
            : `${API_BASE_URL_EXTERNAL}/api/WAVExternalUser`;

          const userDetailsRes = await fetch(userDetailsUrl, {
            method: 'GET',
            headers: {
              'accept': '*/*',
              'Content-Type': 'application/json'
            },
          });

          if (!userDetailsRes.ok) {
            const userDetailsErrorText = await userDetailsRes.text();
            console.error('Failed to fetch user details:', userDetailsErrorText);
            return null;
          }

          const userDetails = await userDetailsRes.json();

          // Return user info after successful validation and fetching details
          return {
            id: userDetails.id, // Unique identifier
            wavInternalUserId: isInternalUser ? userDetails.wavInternalUserId : null, // Internal user ID
            wavExternalUserId: !isInternalUser ? userDetails.wavExternalUserId : null, // External user ID
            email: userDetails.email, // User email
            onboarderStatus: userDetails.onboarderStatus, // Onboarder status
            role: isInternalUser ? 'internal' : 'external', // User role
            userRole: userDetails.userRole, // User role
            verified: userDetails.verified || false, // Ensure this property is included
            onboarded: userDetails.onboarded || false, // Ensure this property is included
          } as User; // Use type assertion if necessary

        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: '/auth/otp-login',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        // token.wavInternalUserId = user.wavInternalUserId; // Store wavInternalUserId in the token
        // token.wavExternalUserId = user.wavExternalUserId; // Store wavExternalUserId in the token
        token.email = user.email;
        token.onboarderStatus = user.onboarderStatus; // Store onboarderStatus in the token
        // token.role = user.role; // Store user role in the token
        token.userRole = user.userRole; // Store user role in the token
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        (session.user as any).id = token.id;
        (session.user as any).wavInternalUserId = token.wavInternalUserId; // Include wavInternalUserId in session
        (session.user as any).wavExternalUserId = token.wavExternalUserId; // Include wavExternalUserId in session
        (session.user as any).email = token.email;
        (session.user as any).onboarderStatus = token.onboarderStatus; // Include onboarderStatus in session
        (session.user as any).role = token.role; // Include role in session
      }
      return session;
    }
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true, // Enable debug messages
};