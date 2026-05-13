import { useState, useEffect } from 'react';
import { getScoreboard } from '../services/espn';

function Spinner() {
  return (
    <div className="text-center py-5">
      <div className="spinner-border" style={{ color: 'var(--wnba-orange)' }} role="status" />
    </div>
  );
}

function GameCard({ event }) {
  const comp = event.competitions[0];
  const away = comp.competitors.find(c => c.homeAway === 'away');
  const home = comp.competitors.find(c => c.homeAway === 'home');
  const { state, shortDetail, description } = comp.status.type;
  const isLive = state === 'in';
  const isPre = state === 'pre';

  const gameTime = isPre
    ? new Date(event.date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZoneName: 'short' })
    : null;

  return (
    <div className="card game-card p-3 h-100">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <span className={`badge status-badge ${isLive ? 'bg-danger' : isPre ? 'bg-secondary' : 'bg-dark'}`}>
          {isLive
            ? `Q${comp.status.period} · ${comp.status.displayClock}`
            : isPre ? gameTime : shortDetail || description}
        </span>
      </div>

      <div className="d-flex align-items-center justify-content-between gap-2">
        <TeamBlock team={away} score={away.score} winner={away.winner} isPre={isPre} />
        <span className="text-muted fw-bold">@</span>
        <TeamBlock team={home} score={home.score} winner={home.winner} isPre={isPre} />
      </div>
    </div>
  );
}

function TeamBlock({ team, score, winner, isPre }) {
  return (
    <div className="text-center" style={{ flex: 1 }}>
      <img
        src={team.team.logo}
        alt={team.team.displayName}
        className="team-logo mb-1"
        onError={e => { e.target.style.display = 'none'; }}
      />
      <div className="fw-semibold small">{team.team.abbreviation}</div>
      {!isPre && (
        <div className={`score-display ${winner ? '' : 'text-muted'}`}>
          {score ?? '-'}
        </div>
      )}
    </div>
  );
}

export default function Scores() {
  const [events, setEvents] = useState([]);
  const [dateLabel, setDateLabel] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getScoreboard()
      .then(data => {
        setEvents(data.events ?? []);
        if (data.day?.date) {
          setDateLabel(
            new Date(data.day.date).toLocaleDateString('en-US', {
              weekday: 'long', month: 'long', day: 'numeric',
            })
          );
        }
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <>
      <div className="d-flex align-items-baseline gap-3 mb-4">
        <h2 className="page-title mb-0">Scores</h2>
        {dateLabel && <span className="text-muted">{dateLabel}</span>}
      </div>

      {events.length === 0 ? (
        <p className="text-muted">No games scheduled today.</p>
      ) : (
        <div className="row g-3">
          {events.map(event => (
            <div key={event.id} className="col-12 col-md-6 col-xl-4">
              <GameCard event={event} />
            </div>
          ))}
        </div>
      )}
    </>
  );
}
