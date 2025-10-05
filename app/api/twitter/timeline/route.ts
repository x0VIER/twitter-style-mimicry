import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { username, bearerToken } = await request.json();

    if (!username || !bearerToken) {
      return NextResponse.json(
        { error: 'Username and bearer token are required' },
        { status: 400 }
      );
    }

    // First, get the user ID from the username
    const userLookupUrl = `https://api.x.com/2/users/by/username/${username}`;
    const userResponse = await fetch(userLookupUrl, {
      headers: {
        'Authorization': `Bearer ${bearerToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!userResponse.ok) {
      const errorData = await userResponse.json();
      return NextResponse.json(
        { error: 'Failed to fetch user data', details: errorData },
        { status: userResponse.status }
      );
    }

    const userData = await userResponse.json();
    const userId = userData.data.id;

    // Now fetch the user's tweets (up to 3200)
    const tweets: any[] = [];
    let paginationToken: string | undefined;
    const maxResults = 100; // Maximum per request
    const maxTweets = 3200; // Twitter API limit

    while (tweets.length < maxTweets) {
      const timelineUrl = new URL(`https://api.x.com/2/users/${userId}/tweets`);
      timelineUrl.searchParams.append('max_results', maxResults.toString());
      timelineUrl.searchParams.append('tweet.fields', 'created_at,public_metrics,entities');
      timelineUrl.searchParams.append('exclude', 'retweets,replies');
      
      if (paginationToken) {
        timelineUrl.searchParams.append('pagination_token', paginationToken);
      }

      const timelineResponse = await fetch(timelineUrl.toString(), {
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!timelineResponse.ok) {
        const errorData = await timelineResponse.json();
        
        // If we've already collected some tweets, return them
        if (tweets.length > 0) {
          break;
        }
        
        return NextResponse.json(
          { error: 'Failed to fetch timeline', details: errorData },
          { status: timelineResponse.status }
        );
      }

      const timelineData = await timelineResponse.json();
      
      if (timelineData.data && timelineData.data.length > 0) {
        tweets.push(...timelineData.data);
      }

      // Check if there's a next page
      if (timelineData.meta?.next_token && tweets.length < maxTweets) {
        paginationToken = timelineData.meta.next_token;
      } else {
        break;
      }
    }

    return NextResponse.json({
      success: true,
      username,
      userId,
      tweetCount: tweets.length,
      tweets: tweets.slice(0, maxTweets),
    });

  } catch (error: any) {
    console.error('Twitter API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
