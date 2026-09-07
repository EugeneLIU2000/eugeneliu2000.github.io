'use client';

import { Camera, Maximize2 } from 'lucide-react';
import Image from 'next/image';
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
} from '@/components/ui/empty';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

export type JournalPhoto = {
  src: string;
  alt: string;
  caption: string;
  location?: string;
  date?: string;
};

export function PhotoJournal({ photos }: { photos: JournalPhoto[] }) {
  if (!photos.length)
    return (
      <Empty className="album-empty">
        <EmptyHeader>
          <Camera size={28} strokeWidth={1.3} aria-hidden="true" />
          <EmptyTitle className="album-empty-title">
            Photos coming soon
          </EmptyTitle>
          <EmptyDescription>
            Personal photographs will be added here.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );

  return (
    <div className="photo-grid">
      {photos.map((photo) => (
        <Dialog key={photo.src}>
          <figure className="journal-photo">
            <DialogTrigger
              className="photo-trigger"
              aria-label={`View photograph: ${photo.caption}`}
            >
              <Image
                unoptimized
                src={photo.src}
                alt={photo.alt}
                loading="lazy"
                width={800}
                height={600}
              />
              <span className="photo-expand">
                <Maximize2 size={17} aria-hidden="true" />
              </span>
            </DialogTrigger>
            <figcaption>
              <span>{photo.caption}</span>
              <small>
                {[photo.location, photo.date].filter(Boolean).join(' · ')}
              </small>
            </figcaption>
          </figure>
          <DialogContent className="photo-dialog">
            <Image
              unoptimized
              src={photo.src}
              alt={photo.alt}
              width={1600}
              height={1200}
            />
            <div>
              <DialogTitle>{photo.caption}</DialogTitle>
              <DialogDescription>
                {[photo.location, photo.date].filter(Boolean).join(' · ') ||
                  'Personal photograph.'}
              </DialogDescription>
            </div>
          </DialogContent>
        </Dialog>
      ))}
    </div>
  );
}
