'use server';

import pool from '@/lib/db';
import redis from '@/lib/redis';
import { encodeBase62 } from '@/lib/base62';

// Common tracking parameters to strip for privacy
const TRACKING_PARAMS = [
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
  'fbclid', 'gclid', 'dclid', 'wbraid', 'gbraid', // Facebook & Google
  'ttclid', 'twclid', 'igshid', 'li_fat_id',      // TikTok, Twitter, Instagram, LinkedIn
  'mc_cid', 'mc_eid', 'msclkid', 'epik'           // Mailchimp, Microsoft, Pinterest
];

function stripTrackers(urlString: string): string {
  try {
    const url = new URL(urlString);
    TRACKING_PARAMS.forEach(param => url.searchParams.delete(param));
    return url.toString();
  } catch {
    return urlString;
  }
}

export type CreateLinkState = {
  success: boolean;
  message?: string;
  shortCode?: string;
  originalUrl?: string;
};

export async function createLink(
  prevState: CreateLinkState,
  formData: FormData
): Promise<CreateLinkState> {
  let originalUrl = formData.get('original_url')?.toString();

  if (!originalUrl) {
    return { success: false, message: 'URL is required.' };
  }

  // Basic HTTP/HTTPS validation
  try {
    const url = new URL(originalUrl);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return { success: false, message: 'URL must start with http:// or https://' };
    }
    
    // Strip privacy-invasive tracking parameters!
    originalUrl = stripTrackers(originalUrl);
  } catch {
    return { success: false, message: 'Invalid URL format.' };
  }

  const client = await pool.connect();

  try {
    // 1. Get the next sequence ID from PostgreSQL BEFORE insertion (solves chicken-and-egg)
    const seqResult = await client.query("SELECT nextval('links_id_seq') AS id");
    const id = seqResult.rows[0].id;

    // 2. Encode the database sequence ID into a Base62 shortcode
    const shortCode = encodeBase62(id);

    // 3. Insert the complete record into PostgreSQL
    await client.query(
      'INSERT INTO links (id, original_url, short_code) VALUES ($1, $2, $3)',
      [id, originalUrl, shortCode]
    );

    // 4. Instantly cache the mapping in Redis for high-speed redirects
    await redis.set(shortCode, originalUrl);

    return { success: true, shortCode, originalUrl };
  } catch (error) {
    console.error('Error creating link:', error);
    return { success: false, message: 'Failed to create short link due to server error.' };
  } finally {
    client.release();
  }
}
