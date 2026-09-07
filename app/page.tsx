import { ArrowUpRight, ArrowDown, MapPin, Mail } from 'lucide-react';
import { PhotoJournal, type JournalPhoto } from '@/components/photo-journal';
import publicationData from '@/content/publications.json';
import updates from '@/content/updates.json';
import photos from '@/content/photos.json';

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
      <header className="site-header">
        <a className="wordmark" href="#about" aria-label="Yingjian Liu, home">
          YL<span>.</span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#about">About</a>
          <a href="#research">Publications</a>
          <a href="#journey">CV</a>
          <a href="#life">Photos</a>
        </nav>
        <a
          className="header-contact"
          href="mailto:yingjian@lorentz.leidenuniv.nl"
        >
          Email <ArrowUpRight size={16} />
        </a>
      </header>
      <main id="main">
        <section
          className="intro section-width"
          id="about"
          aria-labelledby="intro-title"
        >
          <div className="intro-copy">
            <h1 id="intro-title">Yingjian Liu</h1>
            <p className="intro-role">
              PhD candidate in theoretical physics · Leiden University
            </p>
            <p className="bio">
              I am a PhD candidate in the{' '}
              <a href="https://aqa.liacs.nl/">
                Applied Quantum Algorithms group
              </a>{' '}
              at Leiden University, supervised by{' '}
              <a href="https://jtura.cat/">Jordi Tura</a> and{' '}
              <a href="https://stefanopolla.com/">Stefano Polla</a>.
            </p>
            <p className="bio">
              My research focuses on quantum simulation, quantum algorithms, and
              quantum information, with an emphasis on fault-tolerant quantum
              computing.
            </p>
            <div className="intro-links">
              <a className="button-link" href="#research">
                Publications <ArrowDown size={16} />
              </a>
              <a className="text-link" href={scholar}>
                Google Scholar <ArrowUpRight size={16} />
              </a>
            </div>
          </div>
          <aside className="profile-note">
            <div className="profile-initials" aria-hidden="true">
              YL
            </div>
            <p>
              <MapPin size={15} aria-hidden="true" /> Leiden, the Netherlands
            </p>
            <a href="https://www.universiteitleiden.nl/en/staffmembers/yingjian-liu">
              Leiden University profile <ArrowUpRight size={14} />
            </a>
            <a href="mailto:yingjian@lorentz.leidenuniv.nl">
              yingjian@lorentz.leidenuniv.nl <ArrowUpRight size={14} />
            </a>
          </aside>
        </section>
        <section
          className="updates section-width"
          id="updates"
          aria-labelledby="updates-title"
        >
          <SectionHeading title="News" id="updates-title" />
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
        </section>
        <section
          className="research section-width"
          id="research"
          aria-labelledby="research-title"
        >
          <SectionHeading
            title="Publications and preprints"
            id="research-title"
          />
          <div className="research-intro">
            <a className="text-link" href={scholar}>
              Google Scholar <ArrowUpRight size={16} />
            </a>
          </div>
          <ol className="publication-list">
            {publications.map((paper, index) => (
              <li
                className={`publication ${index === 0 ? 'publication-featured' : ''}`}
                key={paper.arxiv}
              >
                <div className="publication-year">
                  {(paper.publicationDate || paper.firstSubmitted).slice(0, 4)}
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
        </section>
        <section
          className="journey section-width"
          id="journey"
          aria-labelledby="journey-title"
        >
          <SectionHeading
            title="Education and research experience"
            id="journey-title"
          />
          <div className="europe-card">
            <p className="eyebrow">
              Erasmus Mundus Europhotonics · Sep 2021–Oct 2023
            </p>
            <h3>Master of Science in Optics</h3>
            <p>
              Joint master’s programme at universities in France, Germany, and
              Spain. Supported by an Erasmus Mundus Joint Master Degree
              scholarship.
            </p>
            <div className="country-grid">
              <div>
                <h4>France</h4>
                <p>Aix-Marseille University</p>
              </div>
              <div>
                <h4>Germany</h4>
                <p>Karlsruhe Institute of Technology</p>
              </div>
              <div>
                <h4>Spain</h4>
                <p>Universitat Politècnica de Catalunya</p>
              </div>
            </div>
            <div className="master-thesis">
              <span>Master’s thesis · May–Oct 2023</span>
              <p>
                At <strong>ICFO — The Institute of Photonic Sciences</strong>,
                Barcelona, I worked on variational quantum simulation of
                many-body quantum systems with Marcin Płodzień, Paolo Stornati,
                and Maciej Lewenstein.
              </p>
            </div>
          </div>
          <div className="cv-columns">
            <div className="experience">
              <h3 className="subsection-title">Positions and degrees</h3>
              <div className="cv-entry">
                <p className="cv-date">Nov 2024–present · The Netherlands</p>
                <h4>PhD candidate · Theoretical physics</h4>
                <p className="cv-institution">Leiden University</p>
                <p>
                  Quantum simulation and quantum computing in the fault-tolerant
                  era. Advised by Jordi Tura and Stefano Polla.
                </p>
              </div>
              <div className="cv-entry">
                <p className="cv-date">Dec 2023–Oct 2024 · China</p>
                <h4>Research assistant</h4>
                <p className="cv-institution">
                  Hong Kong University of Science and Technology (Guangzhou)
                </p>
                <p>
                  Quantum algorithm design and quantum information theory, with
                  Xin Wang.
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
              <h3 className="subsection-title awards-heading">
                Selected awards
              </h3>
              <p className="award-line">
                <span>2021–2023</span>Erasmus Mundus scholarship
              </p>
              <p className="award-line">
                <span>2019</span>National Encouragement Scholarship
              </p>
            </div>
          </div>
        </section>
        <section
          className="life section-width"
          id="life"
          aria-labelledby="life-title"
        >
          <SectionHeading title="Photos" id="life-title" />
          <PhotoJournal photos={photos as JournalPhoto[]} />
        </section>
      </main>
      <footer className="site-footer section-width">
        <div>
          <a className="footer-name" href="#about">
            Yingjian Liu
          </a>
          <p>Theoretical physics · Leiden University</p>
        </div>
        <a className="text-link" href="mailto:yingjian@lorentz.leidenuniv.nl">
          <Mail size={17} /> Email <ArrowUpRight size={16} />
        </a>
        <div className="copyright">
          <p>© 2026 Yingjian Liu</p>
          <p>Last updated September 2026</p>
        </div>
      </footer>
    </>
  );
}
