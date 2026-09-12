import { ArrowDown, ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import { BoulderingResearch } from '@/components/bouldering-research';
import { PublicationList } from '@/components/publication-list';
import { SiteHeader, SiteFooter } from '@/components/site-chrome';
import { LegacyPersonalLinks } from '@/components/legacy-personal-links';
import publicationData from '@/content/publications.json';
import updates from '@/content/updates.json';

const scholar = 'https://scholar.google.com/citations?user=kPzCqSAAAAAJ&hl=en';
const publications = [...publicationData.publications].sort((a, b) =>
  (b.publicationDate || b.firstSubmitted).localeCompare(
    a.publicationDate || a.firstSubmitted,
  ),
);

function SectionHeading({ title, id }: { title: string; id: string }) {
  return (
    <div className="section-heading">
      <h2 id={id}>{title}</h2>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <SiteHeader />
      <LegacyPersonalLinks />
      <main id="main">
        <section
          className="intro academic-intro section-width"
          id="about"
          aria-labelledby="intro-title"
        >
          <div className="intro-copy">
            <div className="intro-text">
              <div className="intro-identity">
                <h1 id="intro-title">Yingjian Liu</h1>
                <p className="intro-role">
                  PhD candidate in theoretical physics · Leiden University
                </p>
              </div>
              <div className="intro-details">
                <p className="bio">
                  I work in the{' '}
                  <a href="https://aqa.liacs.nl/">
                    Applied Quantum Algorithms group
                  </a>{' '}
                  at Leiden University, supervised by{' '}
                  <a href="https://jtura.cat/">Jordi Tura</a> and{' '}
                  <a href="https://stefanopolla.com/">Stefano Polla</a>.
                </p>
                <p className="bio">
                  My research focuses on quantum simulation, quantum algorithms,
                  and quantum information, with an emphasis on fault-tolerant
                  quantum computing.
                </p>
                <div className="intro-links">
                  <a className="text-link" href={scholar}>
                    Google Scholar <ArrowUpRight size={15} />
                  </a>
                  <a
                    className="text-link"
                    href="https://www.universiteitleiden.nl/en/staffmembers/yingjian-liu"
                  >
                    University profile <ArrowUpRight size={15} />
                  </a>
                  <a
                    className="text-link"
                    href="mailto:yingjian@lorentz.leidenuniv.nl"
                  >
                    Email <ArrowUpRight size={15} />
                  </a>
                </div>
                <p className="personal-note">
                  Outside research, I enjoy bouldering.
                </p>
              </div>
            </div>
            <figure className="profile-photo">
              <Image
                src="/photos/yingjian-liu.jpg"
                alt="Yingjian Liu"
                width={1280}
                height={960}
                priority
              />
            </figure>
          </div>
        </section>
        <section
          className="research section-width"
          id="research"
          aria-labelledby="research-title"
        >
          <div className="research-heading">
            <SectionHeading
              title="Publications and preprints"
              id="research-title"
            />
            <a className="wall-jump text-link" href="#publication-wall">
              Explore the wall <ArrowDown size={15} />
            </a>
          </div>
          <PublicationList count={publications.length}>
            <ol className="publication-list">
              {publications.map((paper, index) => (
                <li
                  id={`paper-${paper.arxiv}`}
                  className={`publication ${index === 0 ? 'publication-featured' : ''}`}
                  key={paper.arxiv}
                >
                  <div className="publication-year">
                    {(paper.publicationDate || paper.firstSubmitted).slice(
                      0,
                      4,
                    )}
                    <span aria-hidden="true">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <article>
                    <div className="publication-meta">
                      <span className={paper.doi ? 'venue' : 'preprint-label'}>
                        {paper.venue ===
                        '2026 ACM/IEEE 53rd Annual International Symposium on Computer Architecture (ISCA)'
                          ? 'International Symposium on Computer Architecture (ISCA)'
                          : paper.venue || 'arXiv preprint'}
                        {paper.volume ? ` ${paper.volume}` : ''}
                        {paper.articleNumber ? `, ${paper.articleNumber}` : ''}
                        {paper.pages ? `, pp. ${paper.pages}` : ''}
                      </span>
                      {index === 0 && paper.status === 'Preprint' && (
                        <span className="latest-label">Latest preprint</span>
                      )}
                    </div>
                    <h3>
                      <a
                        href={
                          paper.doi
                            ? `https://doi.org/${paper.doi}`
                            : paper.arxivUrl
                        }
                      >
                        {paper.title}
                      </a>
                    </h3>
                    <p className="authors">
                      {paper.authors.map((author, i) => (
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
                    <p className="paper-summary">{paper.topic}</p>
                    <div className="paper-links">
                      <a href={paper.arxivUrl}>
                        arXiv <ArrowUpRight size={13} />
                      </a>
                      {paper.doi && (
                        <a href={`https://doi.org/${paper.doi}`}>
                          Published paper <ArrowUpRight size={13} />
                        </a>
                      )}
                      {paper.codeUrl && (
                        <a href={paper.codeUrl}>
                          Code <ArrowUpRight size={13} />
                        </a>
                      )}
                    </div>
                  </article>
                </li>
              ))}
            </ol>
          </PublicationList>
          <BoulderingResearch />
        </section>
        <section
          className="updates section-width"
          id="updates"
          aria-labelledby="updates-title"
        >
          <SectionHeading title="News" id="updates-title" />
          <div className="news-list">
            {updates.map((update) => (
              <div className="news-row" key={update.text}>
                <time dateTime={update.date}>{update.label}</time>
                <p>
                  {update.url ? (
                    <a href={update.url}>
                      {update.text}{' '}
                      <ArrowUpRight size={13} className="inline-arrow" />
                    </a>
                  ) : (
                    update.text
                  )}
                </p>
                <span
                  className={`news-kind ${update.type === 'Preprint' ? 'preprint' : ''}`}
                >
                  {update.type}
                </span>
              </div>
            ))}
          </div>
        </section>
        <section
          className="journey section-width"
          id="journey"
          aria-labelledby="journey-title"
        >
          <SectionHeading title="Education" id="journey-title" />
          <div className="cv-columns">
            <div className="experience">
              <div className="cv-entry">
                <p className="cv-date">
                  Sep 2021–Oct 2023 · France, Germany, Spain
                </p>
                <h4>Master of Science · Optics</h4>
                <p className="cv-institution">Erasmus Mundus Europhotonics</p>
                <p>Aix-Marseille University · France</p>
                <p>Karlsruhe Institute of Technology · Germany</p>
                <p>Universitat Politècnica de Catalunya · Spain</p>
                <p className="cv-note">
                  Erasmus Mundus Joint Master Degree scholarship.
                </p>
                <p className="cv-note">
                  Master’s thesis at ICFO — The Institute of Photonic Sciences,
                  Barcelona, on variational quantum simulation of many-body
                  systems, with Marcin Płodzień, Paolo Stornati, and Maciej
                  Lewenstein.
                </p>
              </div>
              <div className="cv-entry">
                <p className="cv-date">Sep 2017–Jun 2021 · China</p>
                <h4>Bachelor of Science · Electronics</h4>
                <p className="cv-institution">Shandong University</p>
              </div>
            </div>
            <div className="cv-side">
              <h3 className="subsection-title">Teaching</h3>
              <div className="teaching-entry">
                <p className="cv-date">Spring 2026 · Leiden University</p>
                <h4>Applied Quantum Algorithms</h4>
                <p>Teaching assistant</p>
              </div>
              <div className="teaching-entry">
                <p className="cv-date">Fall 2019 · Shandong University</p>
                <h4>Electrodynamics</h4>
                <p>Teaching assistant</p>
              </div>
              <div className="teaching-entry">
                <p className="cv-date">Spring 2019 · Shandong University</p>
                <h4>Methods of Mathematical Physics</h4>
                <p>Teaching assistant</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
