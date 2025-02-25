import NextAuth from 'next-auth/next';
import { authOptions } from './options';

import { NextApiRequest, NextApiResponse } from 'next';

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  try {
    return NextAuth(req, res, authOptions);
  } catch (error) {
    console.error("Error during GET authentication:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  try {
    return NextAuth(req, res, authOptions);
  } catch (error) {
    console.error("Error during POST authentication:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

// Handle preflight requests for CORS
export async function OPTIONS(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return res.status(200).end();
}

// const handler = NextAuth(authOptions);

// export { handler as GET, handler as POST };