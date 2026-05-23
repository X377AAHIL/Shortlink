export interface ClickEvent {
  short_code: string;
  user_agent: string;
  ip_address: string;
}

export async function trackClick(event: ClickEvent): Promise<void> {
  try {
    const payload = {
      ...event,
      timestamp: new Date().toISOString(),
    };

    const baseUrl = process.env.TINYBIRD_URL || 'https://api.tinybird.co';
    const url = `${baseUrl}/v0/events?name=click_events`;

    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.TINYBIRD_TOKEN}`,
      },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    // Silently log errors to prevent breaking the redirection flow
    console.error('Error tracking click in Tinybird:', error);
  }
}
