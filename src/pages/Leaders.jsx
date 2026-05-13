import { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { getLeaders } from '../services/espn';

const STAT_LABELS = {
  pointsPerGame: 'Points',
  reboundsPerGame: 'Rebounds',
  assistsPerGame: 'Assists',
  stealsPerGame: 'Steals',
  blocksPerGame: 'Blocks',
};

const STAT_ORDER = Object.keys(STAT_LABELS);

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const { fullName, team, value } = payload[0].payload;
  return (
    <div className="bg-white border rounded p-2 shadow-sm small">
      <div className="fw-semibold">{fullName}</div>
      <div className="text-muted">{team}</div>
      <div style={{ color: 'var(--wnba-orange)' }} className="fw-bold">{value}</div>
    </div>
  );
}

export default function Leaders() {
  const [allLeaders, setAllLeaders] = useState([]);
  const [selectedCat, setSelectedCat] = useState('pointsPerGame');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getLeaders()
      .then(data => {
        const leaders = data.leaders ?? [];
        setAllLeaders(leaders);
        const first = STAT_ORDER.find(k => leaders.some(l => l.name === k));
        if (first) setSelectedCat(first);
      })
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

  const availableCats = STAT_ORDER.filter(k => allLeaders.some(l => l.name === k));
  const category = allLeaders.find(l => l.name === selectedCat);
  const leaders = (category?.leaders ?? []).slice(0, 10);

  const chartData = leaders.map(l => ({
    name: l.athlete?.shortName?.split(' ').pop() ?? l.athlete?.displayName?.split(' ').pop() ?? '',
    value: parseFloat(l.displayValue) || 0,
    fullName: l.athlete?.displayName ?? '',
    team: l.athlete?.team?.displayName ?? '',
  }));

  return (
    <>
      <h2 className="page-title">Stat Leaders</h2>

      <div className="d-flex gap-2 mb-4 flex-wrap">
        {availableCats.map(cat => (
          <button
            key={cat}
            className={`btn btn-sm ${selectedCat === cat ? 'btn-primary-wnba' : 'btn-outline-dark'}`}
            onClick={() => setSelectedCat(cat)}
          >
            {STAT_LABELS[cat]}
          </button>
        ))}
      </div>

      {chartData.length > 0 && (
        <div className="card border-0 shadow-sm rounded-3 p-3 mb-4">
          <h6 className="fw-semibold mb-3">
            {STAT_LABELS[selectedCat]} — Top {chartData.length}
          </h6>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 56 }}>
              <XAxis
                dataKey="name"
                angle={-35}
                textAnchor="end"
                tick={{ fontSize: 12 }}
                interval={0}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {chartData.map((_, i) => (
                  <Cell key={i} fill={i === 0 ? 'var(--wnba-orange)' : 'var(--wnba-dark)'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="d-flex flex-column gap-2">
        {leaders.map((leader, i) => (
          <div key={i} className="card border-0 shadow-sm rounded-3 px-3 py-2">
            <div className="d-flex align-items-center gap-3">
              <span className="leader-rank">#{i + 1}</span>
              {leader.athlete?.headshot?.href && (
                <img
                  src={leader.athlete.headshot.href}
                  alt={leader.athlete.displayName}
                  className="leader-headshot"
                  onError={e => { e.target.style.display = 'none'; }}
                />
              )}
              <div className="flex-grow-1">
                <div className="fw-semibold">{leader.athlete?.displayName}</div>
                <div className="text-muted small">{leader.athlete?.team?.displayName}</div>
              </div>
              <span className="leader-stat">{leader.displayValue}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
