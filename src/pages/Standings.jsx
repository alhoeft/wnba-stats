import { useState, useEffect } from 'react';
import { getStandings } from '../services/espn';

function getStat(stats, name) {
  return stats?.find(s => s.name === name)?.displayValue ?? '-';
}

function ConferenceTable({ conference }) {
  const entries = conference.standings?.entries ?? [];

  return (
    <div>
      <p className="conf-title">{conference.name}</p>
      <div className="table-responsive">
        <table className="table table-hover standings-table mb-0">
          <thead>
            <tr>
              <th>Team</th>
              <th>W</th>
              <th>L</th>
              <th>PCT</th>
              <th>GB</th>
              <th className="d-none d-md-table-cell">Home</th>
              <th className="d-none d-md-table-cell">Away</th>
              <th className="d-none d-lg-table-cell">Streak</th>
            </tr>
          </thead>
          <tbody>
            {entries.map(entry => (
              <tr key={entry.team.id}>
                <td>
                  <div className="d-flex align-items-center gap-2">
                    <img
                      src={entry.team.logo}
                      alt={entry.team.displayName}
                      style={{ width: 24, height: 24, objectFit: 'contain' }}
                      onError={e => { e.target.style.display = 'none'; }}
                    />
                    <span className="fw-semibold small">{entry.team.shortDisplayName}</span>
                  </div>
                </td>
                <td>{getStat(entry.stats, 'wins')}</td>
                <td>{getStat(entry.stats, 'losses')}</td>
                <td>{getStat(entry.stats, 'winPercent')}</td>
                <td>{getStat(entry.stats, 'gamesBehind')}</td>
                <td className="d-none d-md-table-cell">{getStat(entry.stats, 'home')}</td>
                <td className="d-none d-md-table-cell">{getStat(entry.stats, 'road')}</td>
                <td className="d-none d-lg-table-cell">{getStat(entry.stats, 'streak')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function Standings() {
  const [conferences, setConferences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getStandings()
      .then(data => setConferences(data.children ?? []))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border" style={{ color: 'var(--wnba-orange)' }} role="status" />
      </div>
    );
  }
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <>
      <h2 className="page-title">Standings</h2>
      <div className="row g-4">
        {conferences.map(conf => (
          <div key={conf.id} className="col-12 col-xl-6">
            <div className="card border-0 shadow-sm rounded-3 p-3">
              <ConferenceTable conference={conf} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
