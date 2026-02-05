/**
 * Simple markdown-style parser for story content
 * Supports: **bold**, *italic*, __underline__, ~~strikethrough~~
 * [link text](url), [#highlight], centered text with {center text}
 */

export const parseMarkdown = (text) => {
  // Escape HTML special characters first
  let escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Process markdown-style formatting
  // **bold**
  escaped = escaped.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  // *italic*
  escaped = escaped.replace(/\*(.*?)\*/g, '<em>$1</em>');

  // __underline__
  escaped = escaped.replace(/__(.*?)__/g, '<u>$1</u>');

  // ~~strikethrough~~
  escaped = escaped.replace(/~~(.*?)~~/g, '<del>$1</del>');

  // [link text](url)
  escaped = escaped.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

  // [#highlight text] - for highlighted sections
  escaped = escaped.replace(/\[#(.*?)\]/g, '<mark>$1</mark>');

  // {center text} - for centered text
  escaped = escaped.replace(/\{(.*?)\}/g, '<div style="text-align: center; margin: 20px 0;"><em>$1</em></div>');

  return escaped;
};

/**
 * Extract inline formatting information from text
 * Returns array of formatting objects with position and type
 */
export const extractFormatting = (text) => {
  const patterns = [
    { regex: /\*\*(.*?)\*\*/g, type: 'bold' },
    { regex: /\*(.*?)\*/g, type: 'italic' },
    { regex: /__(.*?)__/g, type: 'underline' },
    { regex: /~~(.*?)~~/g, type: 'strikethrough' }
  ];

  const formatting = [];
  patterns.forEach(pattern => {
    let match;
    while ((match = pattern.regex.exec(text)) !== null) {
      formatting.push({
        type: pattern.type,
        start: match.index,
        end: match.index + match[0].length,
        text: match[1]
      });
    }
  });

  return formatting.sort((a, b) => a.start - b.start);
};

/**
 * Parse special formatting directives in content
 * Can specify background color, text color, alignment, etc.
 */
export const parseFormattingDirectives = (text) => {
  const directives = {};

  // Check for style directives at the beginning of content
  // Format: @bgcolor: #ffffff; @textcolor: #333333; @align: center;
  const styleMatch = text.match(/@(\w+):\s*([^;]+);/g);
  if (styleMatch) {
    styleMatch.forEach(directive => {
      const [key, value] = directive.replace('@', '').replace(';', '').split(':').map(s => s.trim());
      directives[key] = value;
    });
  }

  return directives;
};

/**
 * Remove formatting directives from display text
 */
export const stripFormattingDirectives = (text) => {
  return text.replace(/@(\w+):\s*([^;]+);/g, '').trim();
};
