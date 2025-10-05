import { NextRequest, NextResponse } from 'next/server';

/**
 * POST endpoint for posting tweets
 * This can be used with automation tools like Zapier, Make.com, or cron jobs
 * 
 * Required body parameters:
 * - text: The tweet content
 * - accessToken: OAuth 2.0 Access Token
 * - accessTokenSecret: OAuth 2.0 Access Token Secret (if using OAuth 1.0a)
 * 
 * Note: This endpoint requires OAuth 1.0a User Context for posting tweets
 * OAuth 2.0 Bearer Token (App-Only) cannot be used for posting
 */
export async function POST(request: NextRequest) {
  try {
    const { text, accessToken, accessTokenSecret } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: 'Tweet text is required' },
        { status: 400 }
      );
    }

    if (text.length > 280) {
      return NextResponse.json(
        { error: 'Tweet text exceeds 280 characters' },
        { status: 400 }
      );
    }

    if (!accessToken || !accessTokenSecret) {
      return NextResponse.json(
        { 
          error: 'OAuth 1.0a credentials required for posting tweets',
          message: 'This endpoint requires accessToken and accessTokenSecret. Bearer tokens cannot post tweets.'
        },
        { status: 400 }
      );
    }

    // Note: Implementing OAuth 1.0a signature requires additional libraries
    // For production use, consider using the 'twitter-api-v2' npm package
    // This is a placeholder that shows the structure

    return NextResponse.json({
      success: false,
      message: 'Tweet posting requires OAuth 1.0a implementation',
      documentation: 'https://developer.x.com/en/docs/authentication/oauth-1-0a',
      recommendation: 'Use the Twitter API v2 directly with OAuth 1.0a or integrate with automation tools like Zapier',
      webhookInfo: {
        endpoint: '/api/twitter/post',
        method: 'POST',
        requiredFields: ['text', 'accessToken', 'accessTokenSecret'],
        example: {
          text: 'Your tweet content here',
          accessToken: 'your_oauth_access_token',
          accessTokenSecret: 'your_oauth_access_token_secret'
        }
      }
    });

  } catch (error: any) {
    console.error('Post tweet error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint to retrieve webhook information
 */
export async function GET() {
  return NextResponse.json({
    endpoint: '/api/twitter/post',
    method: 'POST',
    description: 'Post a tweet using OAuth 1.0a credentials',
    authentication: 'OAuth 1.0a User Context',
    requiredFields: {
      text: 'string (max 280 characters)',
      accessToken: 'string (OAuth 1.0a Access Token)',
      accessTokenSecret: 'string (OAuth 1.0a Access Token Secret)'
    },
    integrations: [
      {
        name: 'Zapier',
        description: 'Connect this endpoint to Zapier for automated posting',
        url: 'https://zapier.com/apps/twitter/integrations'
      },
      {
        name: 'Make (formerly Integromat)',
        description: 'Use Make.com to schedule and automate tweets',
        url: 'https://www.make.com/en/integrations/twitter'
      },
      {
        name: 'Vercel Cron Jobs',
        description: 'Schedule tweets using Vercel Cron Jobs',
        url: 'https://vercel.com/docs/cron-jobs'
      }
    ],
    notes: [
      'OAuth 2.0 Bearer Token (App-Only) cannot be used for posting tweets',
      'You must use OAuth 1.0a User Context with Access Token and Secret',
      'Consider using third-party automation tools for easier integration',
      'Always respect Twitter API rate limits and Terms of Service'
    ]
  });
}
