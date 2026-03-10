const TMDB_BASE = 'https://api.themoviedb.org/3';
const READ_TOKEN = process.env.NEXT_PUBLIC_TMDB_READ_TOKEN;

export async function tmdbFetch(endpoint: string, params: Record<string, any> = {}) {
    const url = new URL(`${TMDB_BASE}${endpoint}`);

    // Add params to search
    Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
    });

    // Default params
    if (!url.searchParams.has('language')) {
        url.searchParams.append('language', 'en-US');
    }

    const res = await fetch(url.toString(), {
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${READ_TOKEN}`,
        },
    });

    if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}));
        throw new Error(`TMDB error: ${res.status} ${JSON.stringify(errorBody)}`);
    }

    return res.json();
}
