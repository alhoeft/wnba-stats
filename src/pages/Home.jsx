import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getLeaders } from '../services/espn';

const FEATURED_CATS = [
  { key: 'pointsPerGame',   label: 'Points',   abbr: 'PPG' },
  { key: 'reboundsPerGame', label: 'Rebounds',  abbr: 'RPG' },
  { key: 'assistsPerGame',  label: 'Assists',   abbr: 'APG' },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getLeaders()
      .then(data => {
        const leaders = data.leaders ?? [];
        const cards = FEATURED_CATS.map(({ key, label, abbr }) => {
          const cat = leaders.find(l => l.name === key);
          const top = cat?.leaders?.[0];
          if (!top) return null;
          return {
            label,
            abbr,
            displayValue: top.displayValue,
            athlete: top.athlete,
          };
        }).filter(Boolean);
        setFeatured(cards);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      {/* Banner */}
      <div className="home-banner">
        <h1 className="home-banner-title">WNBA Stats</h1>
      </div>

      {/* League leaders */}
      <div className="container py-5">
        <h2 className="page-title mb-4">League Leaders</h2>

        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border" style={{ color: 'var(--wnba-orange)' }} role="status" />
          </div>
        )}
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="row g-4 justify-content-center">
          {featured.map(({ label, abbr, displayValue, athlete }) => (
            <div key={label} className="col-12 col-md-4">
              <Link to={`/player/${athlete?.id}`} className="text-decoration-none">
                <div className="card border-0 text-center leader-feature-card">
                  <div className="leader-feature-cat">{label}</div>
                  <img
                    src={athlete?.headshot?.href}
                    alt={athlete?.displayName}
                    className="leader-feature-img mx-auto"
                    onError={e => { e.target.style.display = 'none'; }}
                  />
                  <div className="leader-feature-name">{athlete?.displayName}</div>
                  <div className="leader-feature-team">{athlete?.team?.displayName}</div>
                  <div className="leader-feature-stat">
                    {displayValue} <span className="leader-feature-abbr">{abbr}</span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
