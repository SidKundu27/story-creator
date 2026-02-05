import React from 'react';
import './MarkdownToolbar.css';

const MarkdownToolbar = ({ onInsert, textareaRef }) => {
  const insertMarkdown = (before, after = before) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end) || 'text';
    const beforeText = textarea.value.substring(0, start);
    const afterText = textarea.value.substring(end);

    const newValue = beforeText + before + selectedText + after + afterText;
    
    // Update via callback
    onInsert(newValue);
    
    // Restore focus and selection
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + before.length + selectedText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const formatOptions = [
    {
      label: 'Bold',
      title: 'Make text bold',
      icon: '𝐁',
      action: () => insertMarkdown('**', '**'),
      shortcut: 'Ctrl+B'
    },
    {
      label: 'Italic',
      title: 'Make text italic',
      icon: '𝐈',
      action: () => insertMarkdown('*', '*'),
      shortcut: 'Ctrl+I'
    },
    {
      label: 'Underline',
      title: 'Underline text',
      icon: 'U',
      action: () => insertMarkdown('__', '__'),
      shortcut: 'Ctrl+U'
    },
    {
      label: 'Strike',
      title: 'Strikethrough text',
      icon: 'S',
      action: () => insertMarkdown('~~', '~~'),
      shortcut: 'Ctrl+S'
    },
    {
      label: 'Highlight',
      title: 'Highlight text',
      icon: '✎',
      action: () => insertMarkdown('[#', ']'),
      shortcut: 'Ctrl+H'
    },
    {
      label: 'Link',
      title: 'Insert link',
      icon: '🔗',
      action: () => insertMarkdown('[link text](', ')'),
      shortcut: 'Ctrl+K'
    },
    {
      label: 'Center',
      title: 'Center text',
      icon: '◆',
      action: () => insertMarkdown('{', '}'),
      shortcut: 'Ctrl+E'
    }
  ];

  return (
    <div className="markdown-toolbar">
      <div className="toolbar-group">
        <span className="toolbar-label">Formatting:</span>
        {formatOptions.map((option, idx) => (
          <button
            key={idx}
            type="button"
            className="format-btn"
            onClick={option.action}
            title={`${option.title} (${option.shortcut})`}
            aria-label={option.label}
          >
            <span className="format-icon">{option.icon}</span>
          </button>
        ))}
      </div>
      
      <div className="toolbar-legend">
        <small>
          <strong>**bold**</strong> • 
          <em>*italic*</em> • 
          <u>__underline__</u> • 
          <del>~~strike~~</del> • 
          [#highlight] • [text](url) • {'{center}'}
        </small>
      </div>
    </div>
  );
};

export default MarkdownToolbar;
