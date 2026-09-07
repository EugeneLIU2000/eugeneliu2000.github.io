'use client';

import { useEffect, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import publicationData from '@/content/publications.json';

// Oldest preprints start at the bottom; later work extends the route upward.
const route = [
  {
    id: '2403.03761',
    label: 'Inverse circuits',
    sprite: 7,
    x: 40,
    y: 86,
    side: 'left',
  },
  {
    id: '2403.04704',
    label: 'Inverse evolution',
    sprite: 6,
    x: 57,
    y: 77,
    side: 'right',
  },
  {
    id: '2405.03338',
    label: 'State localization',
    sprite: 5,
    x: 39,
    y: 68,
    side: 'left',
  },
  {
    id: '2411.14292',
    label: 'Symmetry tests',
    sprite: 4,
    x: 57,
    y: 59,
    side: 'right',
  },
  {
    id: '2412.01696',
    label: 'State properties',
    sprite: 2,
    x: 38,
    y: 50,
    side: 'left',
  },
  {
    id: '2501.16228',
    label: 'Quantum learning',
    sprite: 3,
    x: 56,
    y: 41,
    side: 'right',
  },
  {
    id: '2511.04608',
    label: 'Qubit routing',
    sprite: 1,
    x: 38,
    y: 32,
    side: 'left',
  },
  {
    id: '2607.26154',
    label: 'Quantum magic',
    sprite: 0,
    x: 55,
    y: 23,
    side: 'right',
  },
].map((hold) => {
  const paper = publicationData.publications.find(
    (entry) => entry.arxiv === hold.id,
  );
  if (!paper) throw new Error(`No publication found for hold ${hold.id}`);
  return { ...hold, paper };
});

const futureHolds = [
  [20, 5, 1, -20],
  [42, 3, 4, 18],
  [64, 6, 6, -12],
  [82, 3, 7, 20],
  [12, 17, 5, 9],
  [35, 15, 2, -9],
  [53, 12, 3, 13],
  [76, 16, 0, -15],
  [19, 29, 7, -25],
  [78, 31, 4, 13],
  [17, 42, 0, 30],
  [85, 43, 2, -10],
  [20, 55, 6, -10],
  [78, 57, 5, 17],
  [14, 68, 1, 30],
  [85, 72, 3, -13],
  [16, 83, 4, -16],
  [79, 87, 7, 15],
  [28, 95, 2, 22],
  [61, 94, 0, -9],
  [48, 36, 5, -12],
  [48, 54, 1, 17],
  [48, 72, 2, -15],
  [48, 90, 6, 12],
];

// Normalized contact positions in each generated frame, measured from its cell.
const gripPoints = [
  [0.284, 0.345],
  [0.72, 0.137],
  [0.255, 0.257],
  [0.265, 0.221],
];
const footPoints = [
  [0.68, 0.829],
  [0.76, 0.655],
  [0.728, 0.62],
  [0.767, 0.81],
];
const otherHandPoints = [
  [0.733, 0.433],
  [0.19, 0.322],
  [0.715, 0.264],
  [0.777, 0.398],
];
const otherFootPoints = [
  [0.28, 0.805],
  [0.354, 0.846],
  [0.35, 0.858],
  [0.3, 0.751],
];

function spritePosition(sprite: number) {
  return `${((sprite % 4) * 100) / 3}% ${Math.floor(sprite / 4) * 100}%`;
}

export function BoulderingResearch() {
  const [selectedId, setSelectedId] = useState('2607.26154');
  const [climberStep, setClimberStep] = useState(route.length - 1);
  const targetStep = route.findIndex((hold) => hold.id === selectedId);
  const selected = route[targetStep];
  const current = route[climberStep];
  const moving = climberStep !== targetStep;

  useEffect(() => {
    if (!moving) return;
    // Reading the paper is immediate; the optional illustration follows separately.
    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    const timer = window.setTimeout(
      () => {
        setClimberStep((step) =>
          reducedMotion ? targetStep : step + Math.sign(targetStep - step),
        );
      },
      reducedMotion ? 0 : 430,
    );
    return () => window.clearTimeout(timer);
  }, [moving, targetStep, climberStep]);

  return (
    <div className="publication-climb">
      <div className="climb-toolbar">
        <p>Select a colored hold to view a paper.</p>
        <div className="hold-legend">
          <span>
            <i className="legend-color" />
            Papers
          </span>
          <span>
            <i className="legend-gray" />
            Space for future papers
          </span>
        </div>
      </div>
      <a className="selected-paper-jump" href="#selected-publication">
        View selected paper ↓
      </a>
      <div className="climb-layout">
        <div
          className="climbing-canvas"
          aria-label="Climbing route through eight papers"
        >
          {futureHolds.map(([x, y, sprite, angle], index) => (
            <span
              key={index}
              className="future-hold rock-sprite"
              aria-hidden="true"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                backgroundPosition: spritePosition(sprite),
                transform: `translate(-50%, -50%) rotate(${angle}deg)`,
              }}
            />
          ))}
          {route.flatMap((hold, index) =>
            [footPoints, otherHandPoints, otherFootPoints].map(
              (contacts, contact) => (
                <span
                  key={`support-${hold.id}-${contact}`}
                  aria-hidden="true"
                  className="support-hold rock-sprite"
                  style={{
                    left: `calc(${hold.x}% + ${contacts[index % 4][0] - gripPoints[index % 4][0]} * var(--climber-size))`,
                    top: `calc(${hold.y}% + ${(contacts[index % 4][1] - gripPoints[index % 4][1]) * 2} * var(--climber-size))`,
                    backgroundPosition: spritePosition((index + 4) % 8),
                  }}
                />
              ),
            ),
          )}
          {route.map((hold) => (
            <button
              key={hold.id}
              type="button"
              className={`paper-hold paper-hold-${hold.side}`}
              style={{ left: `${hold.x}%`, top: `${hold.y}%` }}
              onClick={() => setSelectedId(hold.id)}
              aria-pressed={selectedId === hold.id}
              aria-controls="selected-publication"
              aria-label={`${hold.label}: ${hold.paper.title}`}
            >
              <span
                className="rock-sprite"
                aria-hidden="true"
                style={{ backgroundPosition: spritePosition(hold.sprite) }}
              />
              <span className="paper-hold-label">
                {hold.label}
                <small>arXiv {hold.paper.firstSubmitted.slice(0, 4)}</small>
              </span>
            </button>
          ))}
          <div
            className={`route-climber ${moving ? 'is-climbing' : ''}`}
            aria-hidden="true"
            style={
              {
                left: `${current.x}%`,
                top: `${current.y}%`,
                '--pose': `${((climberStep % 4) * 100) / 3}%`,
                '--grip-x': gripPoints[climberStep % 4][0],
                '--grip-y': gripPoints[climberStep % 4][1],
              } as React.CSSProperties
            }
          >
            <span />
          </div>
        </div>
        <article
          className="selected-publication"
          id="selected-publication"
          aria-live="polite"
          aria-labelledby="selected-paper-title"
        >
          <p className="selected-topic">{selected.label}</p>
          <h3 id="selected-paper-title">{selected.paper.title}</h3>
          <p className="paper-summary">{selected.paper.topic}</p>
          <p className="authors">
            {selected.paper.authors.map((author, i) => (
              <span key={author}>
                {i > 0 ? ', ' : ''}
                {author === 'Yingjian Liu' ? <strong>{author}</strong> : author}
              </span>
            ))}
          </p>
          <p className="selected-venue">
            {selected.paper.venue || 'arXiv preprint'}
            {selected.paper.volume ? ` ${selected.paper.volume}` : ''}
            {selected.paper.articleNumber
              ? `, ${selected.paper.articleNumber}`
              : ''}
            {selected.paper.pages ? `, pp. ${selected.paper.pages}` : ''}
          </p>
          <div className="selected-dates">
            <span>arXiv: {selected.paper.firstSubmitted}</span>
            {selected.paper.publicationDate && (
              <span>Published: {selected.paper.publicationDate}</span>
            )}
          </div>
          <div className="paper-links">
            <a href={selected.paper.arxivUrl}>
              Read on arXiv <ArrowUpRight size={14} />
            </a>
            {selected.paper.doi && (
              <a href={`https://doi.org/${selected.paper.doi}`}>
                Published paper <ArrowUpRight size={14} />
              </a>
            )}
            {selected.paper.codeUrl && (
              <a href={selected.paper.codeUrl}>
                Code <ArrowUpRight size={14} />
              </a>
            )}
          </div>
        </article>
      </div>
    </div>
  );
}
