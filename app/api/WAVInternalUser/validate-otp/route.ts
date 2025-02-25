import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();
        console.log('Validating OTP:', data);

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/WAVInternalUser/validate-otp`, {
            method: 'POST',
            headers: {
                'accept': '*/*',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const responseData = await response.json();
        console.log('External API response:', responseData);

        return NextResponse.json(responseData, { status: response.status });
    } catch (error) {
        console.error('Validation error:', error);
        return NextResponse.json(
            { error: 'Failed to validate OTP' },
            { status: 500 }
        );
    }
}

// Handle OPTIONS request
export async function OPTIONS() {
    return new NextResponse(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
    });
}