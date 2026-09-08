/* oxlint-disable jsx-a11y/prefer-tag-over-role -- Inline SVG is needed for country paths; the image role exposes the map's accessible name. */
import countries from '@/content/world-map.json';
import places from '@/content/footprints.json';

const visitedCodes = new Set(places.flatMap((place) => place.codes));

export function Footprints() {
  return (
    <div className="footprints-content">
      <p className="footprints-intro">Places I’ve visited.</p>
      <figure className="footprints-map">
        <svg
          viewBox="0 0 1000 430"
          role="img"
          aria-labelledby="map-title map-description"
        >
          <title id="map-title">Places I’ve visited</title>
          <desc id="map-description">
            {`Highlighted places: ${places.map((place) => place.name).join(', ')}.`}
          </desc>
          {countries.map((country) => (
            <path
              key={country.code}
              d={country.path}
              data-country={country.code}
              data-visited={visitedCodes.has(country.code) || undefined}
            >
              <title>
                {`${country.name}${visitedCodes.has(country.code) ? ' · visited' : ''}`}
              </title>
            </path>
          ))}
        </svg>
        <figcaption className="map-legend">
          <i aria-hidden="true" /> Visited
        </figcaption>
      </figure>
      <ul className="visited-places" aria-label="Visited places">
        {places.map((place) => (
          <li key={place.name}>{place.name}</li>
        ))}
      </ul>
      <p className="map-credit">
        Map data: <a href="https://www.naturalearthdata.com/">Natural Earth</a>
      </p>
    </div>
  );
}
