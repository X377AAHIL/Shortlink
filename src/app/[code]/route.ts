import { NextRequest, NextResponse } from 'next/server';
import { waitUntil } from '@vercel/functions';
import redis from '@/lib/redis';
import pool from '@/lib/db';
import { trackClick } from '@/lib/tinybird';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;

  try {
    const ip_address = request.headers.get('x-forwarded-for') || 'unknown';
    const user_agent = request.headers.get('user-agent') || 'unknown';

    // 1. Query Redis for the code
    const cachedUrl = await redis.get<string>(code);

    if (cachedUrl) {
      waitUntil(trackClick({ short_code: code, user_agent, ip_address }));
      return NextResponse.redirect(cachedUrl, 302);
    }

    // 2. If not in Redis, query PostgreSQL
    const client = await pool.connect();
    let originalUrl: string | null = null;

    try {
      const result = await client.query(
        'SELECT original_url FROM links WHERE short_code = $1',
        [code]
      );

      if (result.rows.length > 0) {
        originalUrl = result.rows[0].original_url;
      }
    } finally {
      client.release();
    }

    // 3. If found in DB, write to Redis and return redirect
    if (originalUrl) {
      // Cache it for future requests
      await redis.set(code, originalUrl);
      waitUntil(trackClick({ short_code: code, user_agent, ip_address }));
      return NextResponse.redirect(originalUrl, 302);
    }

    // 4. If not found in either system, return a 404 response
    return new NextResponse('Not Found', { status: 404 });
  } catch (error) {
    console.error('Error handling redirect:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
