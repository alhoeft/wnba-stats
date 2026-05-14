import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { getLeaders } from '../services/espn';

const STAT_LABELS = {
  pointsPerGame:    'Points',
  reboundsPerGame:  'Rebounds',
  assistsPerGame:   'Assists',
  stealsPerGame:    'Steals',
  blocksPerGame:    'Blocks',
};
const STAT_ORDER = Object.keys(STAT_LABELS);

const EMPTY_FILTERS = { draftYears: new Set(), teams: new Set(), colleges: new Set(), positions: new Set() };

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const { fullName, team, value } = payload[0].payload;
  return (
    <div style={{ background: '#1e1e1e', border: '1px solid #333', borderRadius: 3, padding: '8px 12px' }} className="small">
      <div className="fw-semibold text-white">{fullName}</div>
      <div style={{ color: '#999' }}>{team}</div>
      <div style={{ color: 'var(--wnba-orange)' }} className="fw-bold">{value}</div>
    </div>
  );
}

function FilterChip({ label, active, onClick }) {
  return (
    <button
      className={`btn btn-sm filter-chip ${active ? 'btn-primary-wnba' : 'btn-outline-secondary'}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

function FilterSection({ title, options, selected, onToggle }) {
  if (!options.length) return null;
  return (
    <div className="mb-3">
      <div className="filter-section-title">{title}</div>
      <div className="d-flex flex-wrap gap-1 mt-1 filter-chips-scroll">
        {options.map(opt => (
          <FilterChip
            key={opt.value}
            label={opt.label}
            active={selected.has(opt.value)}
            onClick={() => onToggle(opt.value)}
          />
        ))}
      </div>
    </div>
  );
}

function FilterDropdown({ draftYears, teams, collegeNames, positions, filters, onToggle, onClear }) {
  const totalActive = filters.draftYears.size + filters.teams.size + filters.colleges.size + filters.positions.size;

  return (
    <div className="filter-dropdown shadow">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <span className="fw-semibold" style={{ color: 'var(--wnba-dark)' }}>Filters</span>
        {totalActive > 0 && (
          <button className="btn btn-sm btn-link p-0 text-danger text-decoration-none" onClick={onClear}>
            Clear all
          </button>
        )}
      </div>

      <FilterSection
        title="Draft Class"
        options={draftYears.map(y => ({ value: y, label: String(y) }))}
        selected={filters.draftYears}
        onToggle={v => onToggle('draftYears', v)}
      />
      <FilterSection
        title="Position"
        options={positions.map(p => ({ value: p, label: p }))}
        selected={filters.positions}
        onToggle={v => onToggle('positions', v)}
      />
      <FilterSection
        title="Team"
        options={teams.map(t => ({ value: t.abbreviation, label: t.abbreviation }))}
        selected={filters.teams}
        onToggle={v => onToggle('teams', v)}
      />
      <FilterSection
        title="College"
        options={collegeNames.map(n => ({ value: n, label: n }))}
        selected={filters.colleges}
        onToggle={v => onToggle('colleges', v)}
      />
    </div>
  );
}

export default function Leaders() {
  const [allLeaders, setAllLeaders] = useState([]);
  const [selectedCat, setSelectedCat] = useState('pointsPerGame');
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [visibleCount, setVisibleCount] = useState(25);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dropdownRef = useRef(null);

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

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function toggleFilter(category, value) {
    setFilters(prev => {
      const next = new Set(prev[category]);
      next.has(value) ? next.delete(value) : next.add(value);
      return { ...prev, [category]: next };
    });
    setVisibleCount(25);
  }

  function clearFilters() {
    setFilters(EMPTY_FILTERS);
    setVisibleCount(25);
  }

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border" style={{ color: 'var(--wnba-orange)' }} role="status" />
      </div>
    );
  }
  if (error) return <div className="alert alert-danger">{error}</div>;

  const allEntries = allLeaders.flatMap(cat => cat.leaders ?? []);

  const draftYears = [...new Set(allEntries.map(l => l.athlete?.draftYear).filter(Boolean))].sort((a, b) => b - a);
  const teams = [...new Map(allEntries.map(l => l.athlete?.team).filter(t => t?.abbreviation).map(t => [t.abbreviation, t])).values()].sort((a, b) => a.abbreviation.localeCompare(b.abbreviation));
  const collegeNames = [...new Set(allEntries.map(l => l.athlete?.college).filter(Boolean))].sort();
  const positions = [...new Set(allEntries.map(l => l.athlete?.position).filter(Boolean))].sort();

  const totalActiveFilters = filters.draftYears.size + filters.teams.size + filters.colleges.size + filters.positions.size;

  const availableCats = STAT_ORDER.filter(k => allLeaders.some(l => l.name === k));
  const category = allLeaders.find(l => l.name === selectedCat);

  const filteredLeaders = (category?.leaders ?? [])
    .filter(l => filters.draftYears.size === 0 || filters.draftYears.has(l.athlete?.draftYear))
    .filter(l => filters.teams.size === 0     || filters.teams.has(l.athlete?.team?.abbreviation))
    .filter(l => filters.colleges.size === 0  || filters.colleges.has(l.athlete?.college))
    .filter(l => filters.positions.size === 0 || filters.positions.has(l.athlete?.position))
    .sort((a, b) => (parseFloat(b.displayValue) || 0) - (parseFloat(a.displayValue) || 0));

  const leaders = filteredLeaders.slice(0, visibleCount);
  const hasMore = visibleCount < filteredLeaders.length;

  const chartData = leaders.map(l => ({
    name: l.athlete?.shortName?.split(' ').pop() ?? l.athlete?.displayName?.split(' ').pop() ?? '',
    value: parseFloat(l.displayValue) || 0,
    fullName: l.athlete?.displayName ?? '',
    team: l.athlete?.team?.displayName ?? '',
    color: l.athlete?.team?.color ?? 'var(--wnba-dark)',
  }));

  return (
    <>
      <h2 className="page-title">Stat Leaders</h2>

      <div className="d-flex align-items-center justify-content-between gap-2 mb-4 flex-wrap">
        <div className="d-flex gap-2 flex-wrap">
          {availableCats.map(cat => (
            <button
              key={cat}
              className={`btn btn-sm ${selectedCat === cat ? 'btn-primary-wnba' : 'btn-outline-dark'}`}
              onClick={() => { setSelectedCat(cat); setVisibleCount(25); }}
            >
              {STAT_LABELS[cat]}
            </button>
          ))}
        </div>

        <div className="position-relative" ref={dropdownRef}>
          <button
            className={`btn btn-sm d-flex align-items-center gap-2 ${totalActiveFilters > 0 ? 'btn-primary-wnba' : 'btn-outline-dark'}`}
            onClick={() => setDropdownOpen(o => !o)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
              <path d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5z"/>
            </svg>
            Filter
            {totalActiveFilters > 0 && (
              <span className="filter-badge">{totalActiveFilters}</span>
            )}
          </button>

          {dropdownOpen && (
            <FilterDropdown
              draftYears={draftYears}
              teams={teams}
              collegeNames={collegeNames}
              positions={positions}
              filters={filters}
              onToggle={toggleFilter}
              onClear={clearFilters}
            />
          )}
        </div>
      </div>

      {chartData.length > 0 && (
        <div className="card border-0 shadow-sm rounded-3 p-3 mb-4">
          <h6 className="fw-semibold mb-3">
            {STAT_LABELS[selectedCat]} — Top {chartData.length}
          </h6>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 56 }}>
              <XAxis dataKey="name" angle={-35} textAnchor="end" tick={{ fontSize: 12, fill: '#ccc' }} interval={0} />
              <YAxis tick={{ fontSize: 12, fill: '#ccc' }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" radius={[2, 2, 0, 0]}>
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {filteredLeaders.length === 0 && (
        <div className="text-center text-muted py-4">No players found for the selected filters.</div>
      )}

      <div className="d-flex flex-column gap-2">
        {leaders.map((leader, i) => (
          <Link key={i} to={`/player/${leader.athlete?.id}`} className="text-decoration-none">
            <div className="card border-0 shadow-sm rounded-3 px-3 py-2 leader-card">
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
                  <div className="fw-semibold text-white">{leader.athlete?.displayName}</div>
                  <div className="text-muted small">
                    {leader.athlete?.team?.displayName}
                    {leader.athlete?.draftYear && (
                      <span className="ms-2 draft-year-badge">{leader.athlete.draftYear}</span>
                    )}
                  </div>
                </div>
                <span className="leader-stat">{leader.displayValue}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {hasMore && (
        <div className="text-center mt-3">
          <button
            className="btn btn-outline-dark btn-sm px-4"
            onClick={() => setVisibleCount(c => c + 25)}
          >
            See More
          </button>
        </div>
      )}
    </>
  );
}
