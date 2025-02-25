import { NextRequest, NextResponse } from 'next/server';

const INTERNAL_BASE_URL = 'https://dawavinternaluser-btgsaphegvahbug9.eastus-01.azurewebsites.net';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    console.log('Validation request:', data);

    const response = await fetch(`${INTERNAL_BASE_URL}/api/WAVInternalUser/validate-otp`, {
      method: 'POST',
      headers: {
        'accept': '*/*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();
    console.log('Validation response:', responseData);

    if (!response.ok) {
      return NextResponse.json(
        { error: responseData.message || 'Validation failed' },
        { status: response.status }
      );
    }

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to validate OTP' },
      { status: 500 }
    );
  }
}