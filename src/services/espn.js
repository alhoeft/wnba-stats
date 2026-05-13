const BASE = 'https://site.api.espn.com/apis/site/v2/sports/basketball/wnba';
const BASE_V2 = 'https://site.api.espn.com/apis/v2/sports/basketball/wnba';

export async function getScoreboard() {
  const res = await fetch(`${BASE}/scoreboard`);
  if (!res.ok) throw new Error('Failed to fetch scoreboard');
  return res.json();
}

export async function getStandings() {
  const res = await fetch(`${BASE}/standings`);
  if (!res.ok) throw new Error('Failed to fetch standings');
  return res.json();
}

export async function getLeaders() {
  const res = await fetch(`${BASE_V2}/leaders`);
  if (!res.ok) throw new Error('Failed to fetch leaders');
  return res.json();
}
