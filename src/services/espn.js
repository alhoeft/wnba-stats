import { DRAFT_YEAR_OVERRIDES } from './draftOverrides.js';

const CORE = 'https://sports.core.api.espn.com/v2/sports/basketball/leagues/wnba';
const COLLEGES = 'https://sports.core.api.espn.com/v2/colleges';


function extractId(ref) {
  const match = ref?.match(/\/(\d+)(?:\?|$)/);
  return match?.[1] ?? null;
}

const WANTED_CATS = new Set([
  'pointsPerGame', 'reboundsPerGame', 'assistsPerGame', 'stealsPerGame', 'blocksPerGame',
]);

export async function getLeaders() {
  const res = await fetch(`${CORE}/seasons/2025/types/2/leaders?limit=200`);
  if (!res.ok) throw new Error('Failed to fetch leaders');
  const data = await res.json();

  const categories = (data.categories ?? []).filter(c => WANTED_CATS.has(c.name));

  const athleteIds = new Set();
  const teamIds = new Set();
  for (const cat of categories) {
    for (const leader of cat.leaders ?? []) {
      const aid = extractId(leader.athlete?.$ref);
      const tid = extractId(leader.team?.$ref);
      if (aid) athleteIds.add(aid);
      if (tid) teamIds.add(tid);
    }
  }

  const fetchJson = url => fetch(url).then(r => r.ok ? r.json() : null).catch(() => null);

  const [athletes, teams] = await Promise.all([
    Promise.all([...athleteIds].map(id =>
      fetchJson(`${CORE}/seasons/2025/athletes/${id}`).then(d => d ? [id, d] : null)
    )).then(results => Object.fromEntries(results.filter(Boolean))),
    Promise.all([...teamIds].map(id =>
      fetchJson(`${CORE}/seasons/2025/teams/${id}`).then(d => d ? [id, d] : null)
    )).then(results => Object.fromEntries(results.filter(Boolean))),
  ]);

  // Collect unique college IDs from fetched athletes and resolve them
  const collegeIds = new Set(
    Object.values(athletes).map(a => extractId(a?.college?.$ref)).filter(Boolean)
  );
  const colleges = await Promise.all([...collegeIds].map(id =>
    fetchJson(`${COLLEGES}/${id}`).then(d => d ? [id, d] : null)
  )).then(results => Object.fromEntries(results.filter(Boolean)));

  const leaders = categories.map(cat => ({
    name: cat.name,
    leaders: (cat.leaders ?? []).map(leader => {
      const aid = extractId(leader.athlete?.$ref);
      const tid = extractId(leader.team?.$ref);
      const athlete = athletes[aid];
      const team = teams[tid];
      const collegeId = extractId(athlete?.college?.$ref);
      const college = collegeId ? colleges[collegeId] : null;
      return {
        displayValue: leader.displayValue,
        athlete: {
          id: aid,
          displayName: athlete?.displayName ?? '',
          shortName: athlete?.shortName ?? '',
          draftYear: athlete?.draft?.year ?? DRAFT_YEAR_OVERRIDES[aid] ?? null,
          college: college?.name ?? null,
          position: athlete?.position?.abbreviation ?? null,
          headshot: {
            href: athlete?.headshot?.href
              ?? `https://a.espncdn.com/i/headshots/wnba/players/full/${aid}.png`,
          },
          team: {
            displayName: team?.displayName ?? '',
            abbreviation: team?.abbreviation ?? '',
            color: team?.color ? `#${team.color}` : null,
          },
        },
      };
    }),
  }));

  return { leaders };
}

export async function getPlayerDetails(id) {
  const fetchJson = url => fetch(url).then(r => { if (!r.ok) throw new Error('Failed to fetch'); return r.json(); });
  const [athlete, stats] = await Promise.all([
    fetchJson(`${CORE}/seasons/2025/athletes/${id}`),
    fetchJson(`${CORE}/seasons/2025/types/2/athletes/${id}/statistics/0`),
  ]);

  const teamId = extractId(athlete.team?.$ref);
  const team = teamId
    ? await fetchJson(`${CORE}/seasons/2025/teams/${teamId}`).catch(() => null)
    : null;

  return { athlete, stats, team };
}
