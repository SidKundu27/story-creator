const getInitials = (title = '') => title
  .split(' ')
  .filter(Boolean)
  .slice(0, 2)
  .map((word) => word[0].toUpperCase())
  .join('') || 'SC';

const hashString = (value = '') => {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }
  return hash;
};

const palette = [
  ['#0f172a', '#1d4ed8', '#38bdf8'],
  ['#111827', '#7c3aed', '#f472b6'],
  ['#111827', '#059669', '#34d399'],
  ['#1f2937', '#ea580c', '#fbbf24'],
  ['#0f172a', '#ef4444', '#fb7185'],
  ['#1e293b', '#8b5cf6', '#22d3ee'],
];

const escapeXml = (value = '') => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&apos;');

export const buildStoryArt = (story = {}, options = {}) => {
  const title = story.title || 'Story Creator';
  const seedSource = `${story._id || ''}:${title}:${story.authorName || ''}`;
  const hash = hashString(seedSource);
  const colors = palette[hash % palette.length];
  const width = options.width || 900;
  const height = options.height || 640;
  const initials = getInitials(title);
  const genre = (story.mainCategory || story.genres?.[0] || story.tags?.[0] || 'Original').toUpperCase();
  const accent = colors[1];
  const accent2 = colors[2];
  const titleText = escapeXml(title);
  const authorText = escapeXml(story.authorName || 'Story Creator');

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${titleText}">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${colors[0]}" />
          <stop offset="60%" stop-color="${accent}" />
          <stop offset="100%" stop-color="${accent2}" />
        </linearGradient>
        <radialGradient id="glow" cx="30%" cy="25%" r="75%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.28" />
          <stop offset="55%" stop-color="#ffffff" stop-opacity="0.06" />
          <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
        </radialGradient>
        <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
          <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#ffffff" stroke-opacity="0.08" stroke-width="1" />
        </pattern>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#bg)" />
      <rect width="${width}" height="${height}" fill="url(#glow)" />
      <rect width="${width}" height="${height}" fill="url(#grid)" />
      <circle cx="${Math.round(width * 0.8)}" cy="${Math.round(height * 0.2)}" r="${Math.round(Math.min(width, height) * 0.18)}" fill="#ffffff" fill-opacity="0.08" />
      <circle cx="${Math.round(width * 0.18)}" cy="${Math.round(height * 0.78)}" r="${Math.round(Math.min(width, height) * 0.14)}" fill="#ffffff" fill-opacity="0.06" />
      <text x="50%" y="45%" text-anchor="middle" dominant-baseline="middle" font-family="system-ui, -apple-system, Segoe UI, Roboto, sans-serif" font-size="${Math.max(36, Math.round(height * 0.09))}" font-weight="800" fill="#ffffff" fill-opacity="0.96">${initials}</text>
      <text x="50%" y="58%" text-anchor="middle" dominant-baseline="middle" font-family="system-ui, -apple-system, Segoe UI, Roboto, sans-serif" font-size="${Math.max(14, Math.round(height * 0.025))}" letter-spacing="3" fill="#ffffff" fill-opacity="0.78">${genre}</text>
      <text x="50%" y="82%" text-anchor="middle" dominant-baseline="middle" font-family="system-ui, -apple-system, Segoe UI, Roboto, sans-serif" font-size="${Math.max(16, Math.round(height * 0.03))}" fill="#ffffff" fill-opacity="0.88">${titleText}</text>
      <text x="50%" y="88%" text-anchor="middle" dominant-baseline="middle" font-family="system-ui, -apple-system, Segoe UI, Roboto, sans-serif" font-size="${Math.max(11, Math.round(height * 0.018))}" fill="#ffffff" fill-opacity="0.68">${authorText}</text>
    </svg>
  `.trim();

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

export const getStoryCoverImage = (story, options = {}) => {
  if (story?.coverImage) return story.coverImage;
  return buildStoryArt(story, options);
};
