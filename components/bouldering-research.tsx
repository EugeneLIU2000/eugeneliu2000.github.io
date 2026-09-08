'use client';

import { useState } from 'react';
import { ArrowUpRight, X } from 'lucide-react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverTitle,
} from '@/components/ui/popover';
import publicationData from '@/content/publications.json';

// Oldest preprints start at the bottom; later work extends the route upward.
const route = [
  {
    id: '2403.03761',
    label: 'Inverse circuits',
    sprite: 7,
    x: 40,
    y: 90,
  },
  {
    id: '2403.04704',
    label: 'Inverse evolution',
    sprite: 6,
    x: 60,
    y: 80,
  },
  {
    id: '2405.03338',
    label: 'State localization',
    sprite: 5,
    x: 37,
    y: 70,
  },
  {
    id: '2411.14292',
    label: 'Symmetry tests',
    sprite: 4,
    x: 60,
    y: 60,
  },
  {
    id: '2412.01696',
    label: 'State properties',
    sprite: 2,
    x: 36,
    y: 50,
  },
  {
    id: '2501.16228',
    label: 'Quantum learning',
    sprite: 3,
    x: 58,
    y: 40,
  },
  {
    id: '2511.04608',
    label: 'Qubit routing',
    sprite: 1,
    x: 36,
    y: 29,
  },
  {
    id: '2607.26154',
    label: 'Quantum magic',
    sprite: 0,
    x: 55,
    y: 18,
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
  [45, 26, 2, -14],
  [52, 34, 7, 23],
  [43, 43, 1, 12],
  [53, 54, 4, -16],
  [46, 63, 3, 17],
  [44, 73, 6, -19],
  [54, 83, 0, 15],
  [34, 89, 5, -11],
];

// Contact positions in the fourth illustration frame, relative to its cell.
const grip = [0.265, 0.221];
const supports = [
  [0.767, 0.81],
  [0.777, 0.398],
  [0.3, 0.751],
];
const highestHold = route.reduce((highest, hold) =>
  hold.y < highest.y ? hold : highest,
);

function spritePosition(sprite: number) {
  return `${((sprite % 4) * 100) / 3}% ${Math.floor(sprite / 4) * 100}%`;
}

export function BoulderingResearch() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="publication-climb">
      <div className="climb-toolbar">
        <span className="future-note">
          <i /> Space for further mysterious discoveries
        </span>
      </div>
      <div className="wall-surface">
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
          {supports.map(([x, y], index) => (
            <span
              key={index}
              aria-hidden="true"
              className="support-hold rock-sprite"
              style={{
                left: `calc(${highestHold.x}% + ${x - grip[0]} * var(--climber-size))`,
                top: `calc(${highestHold.y}% + ${(y - grip[1]) * 2} * var(--climber-size))`,
                backgroundPosition: spritePosition(index + 4),
              }}
            />
          ))}
          {route.map((hold) => (
            <Popover
              key={hold.id}
              open={openId === hold.id}
              onOpenChange={(open) =>
                setOpenId((current) =>
                  open ? hold.id : current === hold.id ? null : current,
                )
              }
            >
              <PopoverTrigger
                id={`hold-${hold.id}`}
                className="paper-hold"
                style={{ left: `${hold.x}%`, top: `${hold.y}%` }}
                openOnHover
                delay={130}
                closeDelay={220}
                aria-label={hold.paper.title}
              >
                <span
                  className="rock-sprite"
                  aria-hidden="true"
                  style={{ backgroundPosition: spritePosition(hold.sprite) }}
                />
              </PopoverTrigger>
              <PopoverContent
                className="paper-preview"
                side="bottom"
                align="center"
                sideOffset={10}
                initialFocus={(type) => type === 'keyboard'}
                data-paper={hold.id}
              >
                <div className="paper-preview-topline">
                  <p>
                    {hold.paper.status === 'Preprint'
                      ? 'Preprint'
                      : 'Publication'}{' '}
                    ·{' '}
                    {(
                      hold.paper.publicationDate || hold.paper.firstSubmitted
                    ).slice(0, 4)}
                  </p>
                  <button
                    className="preview-close"
                    type="button"
                    aria-label="Close paper details"
                    onClick={() => setOpenId(null)}
                  >
                    <X size={16} />
                  </button>
                </div>
                <PopoverTitle className="paper-preview-title">
                  <a
                    href={
                      hold.paper.doi
                        ? `https://doi.org/${hold.paper.doi}`
                        : hold.paper.arxivUrl
                    }
                  >
                    {hold.paper.title}
                  </a>
                </PopoverTitle>
                <p className="authors">
                  {hold.paper.authors.map((author, i) => (
                    <span key={author}>
                      {i > 0 ? ', ' : ''}
                      {author === 'Yingjian Liu' ? (
                        <strong>{author}</strong>
                      ) : (
                        author
                      )}
                    </span>
                  ))}
                </p>
                <p className="paper-preview-venue">
                  {hold.paper.venue ===
                  '2026 ACM/IEEE 53rd Annual International Symposium on Computer Architecture (ISCA)'
                    ? 'International Symposium on Computer Architecture (ISCA)'
                    : hold.paper.venue || 'arXiv preprint'}
                  {hold.paper.volume ? ` ${hold.paper.volume}` : ''}
                  {hold.paper.articleNumber
                    ? `, ${hold.paper.articleNumber}`
                    : ''}
                  {hold.paper.pages ? `, pp. ${hold.paper.pages}` : ''}
                </p>
                <div className="paper-links">
                  <a href={hold.paper.arxivUrl}>
                    arXiv <ArrowUpRight size={14} />
                  </a>
                  {hold.paper.doi && (
                    <a href={`https://doi.org/${hold.paper.doi}`}>
                      Published paper <ArrowUpRight size={14} />
                    </a>
                  )}
                  {hold.paper.codeUrl && (
                    <a href={hold.paper.codeUrl}>
                      Code <ArrowUpRight size={14} />
                    </a>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          ))}
          <div
            className="route-climber"
            aria-hidden="true"
            style={{ left: `${highestHold.x}%`, top: `${highestHold.y}%` }}
          >
            <span />
          </div>
        </div>
      </div>
    </div>
  );
}
