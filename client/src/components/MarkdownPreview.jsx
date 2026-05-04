import React from 'react';
import { parseMarkdown, stripFormattingDirectives } from '../utils/markdownParser';
import './MarkdownPreview.css';

const MarkdownPreview = ({ content, isVisible }) => {
  if (!isVisible) return null;

  const displayContent = stripFormattingDirectives(content || '');

  return (
    <div className="markdown-preview">
      <div className="preview-header">
        <h4>Preview</h4>
      </div>
      <div className="preview-content">
        {displayContent ? (
          displayContent.split('\n\n').map((paragraph, idx) => (
            <p
              key={idx}
              className="preview-paragraph"
              dangerouslySetInnerHTML={{ __html: parseMarkdown(paragraph) }}
            />
          ))
        ) : (
          <p className="preview-empty">Your formatted text will appear here...</p>
        )}
      </div>
    </div>
  );
};

export default MarkdownPreview;
