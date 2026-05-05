import React, { useState } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import './MarkdownToolbar.css';

const MarkdownToolbar = ({ onInsert, textareaRef }) => {
  const [lastClickTime, setLastClickTime] = useState(0);
  const CLICK_DEBOUNCE_MS = 200;

  const insertMarkdown = (before, after = before) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end) || 'text';
    const beforeText = textarea.value.substring(0, start);
    const afterText = textarea.value.substring(end);

    const newValue = beforeText + before + selectedText + after + afterText;
    onInsert(newValue);

    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + before.length + selectedText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const handleFormatClick = (action) => {
    const now = Date.now();
    if (now - lastClickTime < CLICK_DEBOUNCE_MS) return;
    setLastClickTime(now);
    action();
  };

  const formatOptions = [
    { label: 'Bold', title: 'Make text bold', icon: '𝐁', action: () => insertMarkdown('**', '**'), shortcut: 'Ctrl+B' },
    { label: 'Italic', title: 'Make text italic', icon: '𝐈', action: () => insertMarkdown('*', '*'), shortcut: 'Ctrl+I' },
    { label: 'Underline', title: 'Underline text', icon: 'U', action: () => insertMarkdown('__', '__'), shortcut: 'Ctrl+U' },
    { label: 'Strike', title: 'Strikethrough text', icon: 'S', action: () => insertMarkdown('~~', '~~'), shortcut: 'Ctrl+S' },
    { label: 'Highlight', title: 'Highlight text', icon: '✎', action: () => insertMarkdown('[#', ']'), shortcut: 'Ctrl+H' },
    { label: 'Link', title: 'Insert link', icon: '🔗', action: () => insertMarkdown('[link text](', ')'), shortcut: 'Ctrl+K' },
    { label: 'Center', title: 'Center text', icon: '◆', action: () => insertMarkdown('{', '}'), shortcut: 'Ctrl+E' }
  ];

  return (
    <Box className="markdown-toolbar" sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Box className="toolbar-group" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="body2" sx={{ mr: 1 }}>Formatting:</Typography>
        {formatOptions.map((option, idx) => (
          <Tooltip key={idx} title={`${option.title} (${option.shortcut})`}>
            <IconButton size="small" onClick={() => handleFormatClick(option.action)} aria-label={option.label}>
              <span className="format-icon">{option.icon}</span>
            </IconButton>
          </Tooltip>
        ))}
      </Box>

      <Box className="toolbar-legend">
        <Typography variant="caption">
          <strong>**bold**</strong> • <em>*italic*</em> • <u>__underline__</u> • <del>~~strike~~</del> • [#highlight] • [text](url) • {'{center}'}
        </Typography>
      </Box>
    </Box>
  );
};

export default MarkdownToolbar;
