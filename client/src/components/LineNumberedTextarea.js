import React, { useEffect, useRef } from 'react';
import './LineNumberedTextarea.css';

const LineNumberedTextarea = ({ value, onChange, onPaste, placeholder, textareaRef }) => {
  const lineNumbersRef = useRef(null);
  
  const updateLineNumbers = () => {
    if (!lineNumbersRef.current || !textareaRef.current) return;
    
    const lines = value.split('\n').length;
    const lineNumbers = Array.from({ length: lines }, (_, i) => i + 1).join('\n');
    lineNumbersRef.current.textContent = lineNumbers;
    
    // Sync scroll
    lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
  };

  useEffect(() => {
    updateLineNumbers();
  }, [value]);

  const handleScroll = (e) => {
    if (lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = e.target.scrollTop;
    }
  };

  const imageMatches = value.match(/!\[[^\]]*\]\(data:image\/[^)]+\)/g) || [];
  const displayValue = value.replace(/!\[([^\]]*)\]\(data:image\/[^)]+\)/g, '![$1](Image Preview)');

  const handleChange = (e) => {
    let nextValue = e.target.value;
    let index = 0;
    nextValue = nextValue.replace(/!\[([^\]]*)\]\(Image Preview\)/g, () => imageMatches[index++] || '');
    onChange({ target: { value: nextValue } });
  };

  return (
    <div className="line-numbered-editor">
      <div ref={lineNumbersRef} className="line-numbers" aria-hidden="true"></div>
      <textarea
        ref={textareaRef}
        value={displayValue}
        onChange={handleChange}
        onPaste={onPaste}
        onScroll={handleScroll}
        placeholder={placeholder}
        className="content-textarea-lined"
      />
    </div>
  );
};

export default LineNumberedTextarea;
