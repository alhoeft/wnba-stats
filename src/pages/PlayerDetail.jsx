import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPlayerDetails } from '../services/espn';

const WANTED_STATS = [
  { name: 'gamesPlayed',           label: 'GP'   },
  { name: 'avgPoints',             label: 'PPG'  },
  { name: 'avgRebounds',           label: 'RPG'  },
  { name: 'avgAssists',            label: 'APG'  },
  { name: 'avgSteals',             label: 'SPG'  },
  { name: 'avgBlocks',             label: 'BPG'  },
  { name: 'avgMinutes',            label: 'MPG'  },
  { name: 'avgTurnovers',          label: 'TOPG' },
  { name: 'fieldGoalPct',          label: 'FG%'  },
  { name: 'threePointFieldGoalPct',label: '3P%'  },
  { name: 'freeThrowPct',          label: 'FT%'  },
];

function buildStatMap(stats) {
  const map = {};
  for (const cat of stats?.splits?.categories ?? []) {
    for (const s of cat.stats ?? []) {
      map[s.name] = s.displayValue;
    }
  }
  return map;
}

export default function PlayerDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getPlayerDetails(id)
      .then(setData)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border" style={{ color: 'var(--wnba-orange)' }} role="status" />
      </div>
    );
  }
  if (error) return <div className="alert alert-danger">{error}</div>;

  const { athlete, stats, team } = data;
  const statMap = buildStatMap(stats);
  const headshotUrl = athlete.headshot?.href
    ?? `https://a.espncdn.com/i/headshots/wnba/players/full/${id}.png`;

  return (
    <>
      <Link to="/leaders" className="btn btn-sm btn-outline-secondary mb-4">&larr; Back to Leaders</Link>

      <div className="card border-0 shadow-sm rounded-3 p-4 mb-4">
        <div className="d-flex align-items-center gap-4 flex-wrap">
          <img
            src={headshotUrl}
            alt={athlete.displayName}
            className="player-detail-headshot"
            onError={e => { e.target.style.display = 'none'; }}
          />
          <div>
            <h2 className="page-title mb-1">{athlete.displayName}</h2>
            <div className="text-muted fs-5">{team?.displayName ?? athlete.team?.displayName ?? ''}</div>
            {athlete.position?.displayName && (
              <span className="badge mt-2" style={{ backgroundColor: 'var(--wnba-dark)' }}>
                {athlete.position.displayName}
              </span>
            )}
          </div>
        </div>
      </div>

      <h5 className="fw-semibold mb-3" style={{ color: 'var(--wnba-dark)' }}>2025 Season Stats</h5>
      <div className="row g-3">
        {WANTED_STATS.map(({ name, label }) => {
          const val = statMap[name];
          if (val == null) return null;
          return (
            <div key={name} className="col-6 col-sm-4 col-md-3">
              <div className="card border-0 shadow-sm rounded-3 text-center py-3 px-2">
                <div className="stat-value">{val}</div>
                <div className="stat-label">{label}</div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
