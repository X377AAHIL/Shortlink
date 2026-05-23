export interface TimeseriesData {
  date: string;
  clicks: number;
}

export interface DeviceData {
  device: string;
  clicks: number;
}

export interface TinybirdResponse<T> {
  meta: any[];
  data: T[];
  rows: number;
}

export async function getClicksTimeseries(shortCode: string): Promise<TimeseriesData[]> {
  const endpoint = process.env.TINYBIRD_TIMESERIES_API;
  if (!endpoint) return [];

  try {
    const url = new URL(endpoint);
    url.searchParams.append('short_code', shortCode);

    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${process.env.TINYBIRD_TOKEN}`,
      },
      next: { revalidate: 30 } // Cache lightly to balance performance with freshness
    });

    if (!res.ok) {
      console.error('Failed to fetch timeseries. Status:', res.status);
      return [];
    }
    
    const json = (await res.json()) as TinybirdResponse<TimeseriesData>;
    return json.data || [];
  } catch (error) {
    console.error('Error fetching timeseries data:', error);
    return [];
  }
}

export async function getDevicesData(shortCode: string): Promise<DeviceData[]> {
  const endpoint = process.env.TINYBIRD_DEVICES_API;
  if (!endpoint) return [];

  try {
    const url = new URL(endpoint);
    url.searchParams.append('short_code', shortCode);

    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${process.env.TINYBIRD_TOKEN}`,
      },
      next: { revalidate: 30 }
    });

    if (!res.ok) {
      console.error('Failed to fetch device data. Status:', res.status);
      return [];
    }
    
    const json = (await res.json()) as TinybirdResponse<DeviceData>;
    return json.data || [];
  } catch (error) {
    console.error('Error fetching device data:', error);
    return [];
  }
}
