'use client';

import { useRef, useState } from 'react';
import { Popover as PopoverPrimitive } from '@base-ui/react/popover';
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
    x: 26,
    y: 94,
  },
  {
    id: '2403.04704',
    label: 'Inverse evolution',
    sprite: 6,
    x: 48,
    y: 87,
  },
  {
    id: '2405.03338',
    label: 'State localization',
    sprite: 5,
    x: 72,
    y: 80,
  },
  {
    id: '2411.14292',
    label: 'Symmetry tests',
    sprite: 4,
    x: 30,
    y: 73,
  },
  {
    id: '2412.01696',
    label: 'State properties',
    sprite: 2,
    x: 57,
    y: 66,
  },
  {
    id: '2501.16228',
    label: 'Quantum learning',
    sprite: 3,
    x: 24,
    y: 59,
  },
  {
    id: '2511.04608',
    label: 'Qubit routing',
    sprite: 1,
    x: 72,
    y: 51,
  },
  {
    id: '2607.26154',
    label: 'Quantum magic',
    sprite: 0,
    x: 46,
    y: 43,
  },
].map((hold) => {
  const paper = publicationData.publications.find(
    (entry) => entry.arxiv === hold.id,
  );
  if (!paper) throw new Error(`No publication found for hold ${hold.id}`);
  return { ...hold, paper };
});

const futureHolds = [
  [15, 6, 1, -20],
  [35, 4, 4, 18],
  [57, 7, 6, -12],
  [80, 5, 7, 20],
  [24, 13, 5, 9],
  [46, 12, 2, -9],
  [69, 15, 3, 13],
  [88, 17, 0, -15],
  [12, 23, 7, -25],
  [34, 21, 4, 13],
  [54, 22, 0, 30],
  [76, 25, 2, -10],
  [20, 32, 6, -10],
  [43, 30, 5, 17],
  [63, 32, 1, 30],
  [85, 34, 3, -13],
  [11, 40, 4, -16],
  [31, 38, 7, 15],
  [56, 37, 2, 22],
  [73, 41, 0, -9],
  [89, 46, 5, -12],
  [19, 48, 1, 17],
  [36, 52, 2, -15],
  [84, 57, 6, 12],
  [48, 57, 2, -14],
  [13, 64, 7, 23],
  [77, 66, 1, 12],
  [43, 71, 4, -16],
  [16, 78, 3, 17],
  [58, 77, 6, -19],
  [87, 84, 0, 15],
  [31, 86, 5, -11],
  [66, 91, 3, 18],
  [13, 92, 4, -8],
  [84, 95, 1, 13],
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
  const [pinnedId, setPinnedId] = useState<string | null>(null);
  const pinnedIdRef = useRef<string | null>(null);
  const keyboardPinRef = useRef<string | null>(null);
  const [handles] = useState(() =>
    Object.fromEntries(
      route.map((hold) => [hold.id, PopoverPrimitive.createHandle()]),
    ),
  );

  return (
    <div
      className="publication-climb"
      id="publication-wall"
      aria-labelledby="wall-title"
    >
      <div className="climb-toolbar">
        <div>
          <h3 id="wall-title">Publication wall</h3>
          <p>Hover to preview. Click to keep a paper open.</p>
        </div>
        <span className="future-note">
          <i /> Space for future papers
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
              handle={handles[hold.id]}
              open={openId === hold.id}
              onOpenChange={(open, details) => {
                if (details.reason === 'trigger-hover' && pinnedIdRef.current) {
                  details.cancel();
                  return;
                }
                if (!open && pinnedIdRef.current === hold.id) {
                  pinnedIdRef.current = null;
                  keyboardPinRef.current = null;
                  setPinnedId(null);
                }
                setOpenId((current) =>
                  open ? hold.id : current === hold.id ? null : current,
                );
              }}
            >
              <PopoverTrigger
                id={`hold-${hold.id}`}
                handle={handles[hold.id]}
                className="paper-hold"
                style={{ left: `${hold.x}%`, top: `${hold.y}%` }}
                openOnHover={pinnedId === null}
                delay={160}
                closeDelay={300}
                data-pinned={pinnedId === hold.id || undefined}
                onClick={(event) => {
                  // Use one explicit click transition for both early and late hover previews.
                  event.preventBaseUIHandler();
                  if (pinnedIdRef.current === hold.id) {
                    handles[hold.id].close();
                    return;
                  }
                  pinnedIdRef.current = hold.id;
                  keyboardPinRef.current = event.detail === 0 ? hold.id : null;
                  setPinnedId(hold.id);
                  handles[hold.id].open(`hold-${hold.id}`);
                }}
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
                sideOffset={14}
                initialFocus={(type) =>
                  type === 'keyboard' || keyboardPinRef.current === hold.id
                }
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
                  <PopoverPrimitive.Close
                    className="preview-close"
                    type="button"
                    aria-label="Close paper details"
                  >
                    <X size={16} />
                  </PopoverPrimitive.Close>
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
