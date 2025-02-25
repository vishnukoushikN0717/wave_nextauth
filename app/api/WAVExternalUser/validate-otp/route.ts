import { NextRequest, NextResponse } from 'next/server';

const INTERNAL_BASE_URL = 'https://dawavinternaluser-btgsaphegvahbug9.eastus-01.azurewebsites.net';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    console.log('Received validation data:', data);

    const response = await fetch(`${INTERNAL_BASE_URL}/api/WAVInternalUser/validate-otp`, {
      method: 'POST',
      headers: {
        'accept': '*/*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const responseText = await response.text();
    console.log('Raw response text:', responseText);

    let responseData;
    try {
      responseData = responseText ? JSON.parse(responseText) : null;
    } catch (e) {
      responseData = { message: responseText };
    }

    if (!response.ok) {
      return NextResponse.json(
        { error: responseData?.message || 'Failed to validate OTP' },
        { status: response.status }
      );
    }

    return NextResponse.json(responseData || { message: 'OTP validated successfully' });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to validate OTP' },
      { status: 500 }
    );
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}