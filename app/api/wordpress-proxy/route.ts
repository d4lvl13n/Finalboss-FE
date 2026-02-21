import { NextRequest, NextResponse } from 'next/server';
import siteConfig from '@/app/lib/siteConfig';

// WordPress backend URL
const WORDPRESS_URL = siteConfig.wordpressUrl;

export async function POST(request: NextRequest) {
  try {
    // Forward the GraphQL request to WordPress
    const requestBody = await request.json();
    
    console.log('Proxying request to:', `${WORDPRESS_URL}/graphql`);
    
    const response = await fetch(`${WORDPRESS_URL}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });
    
    const data = await response.json();
    
    // Return the response with CORS headers
    return NextResponse.json(data, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        // Prevent caching of GraphQL responses
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    console.error('WordPress Proxy Error:', error);
    console.error('WordPress URL:', WORDPRESS_URL);
    
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    return NextResponse.json(
      { errors: [{ message: 'Error connecting to WordPress' }] },
      { status: 500 }
    );
  }
}

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
} 