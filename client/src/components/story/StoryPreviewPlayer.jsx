import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { parseMarkdown } from '../../utils/markdownParser';
import './StoryPreviewPlayer.css';

const StoryPreviewPlayer = ({ story }) => {
  const [currentNodeId, setCurrentNodeId] = useState(story.startNodeId || 'start');
  const [history, setHistory] = useState([story.startNodeId || 'start']);

  const currentNode = story.nodes.find((n) => n.nodeId === currentNodeId);

  const makeChoice = (nextNodeId) => {
    setCurrentNodeId(nextNodeId);
    setHistory([...history, nextNodeId]);
  };

  const restart = () => {
    setCurrentNodeId(story.startNodeId || 'start');
    setHistory([story.startNodeId || 'start']);
  };

  if (!currentNode) {
    return <Box className="preview-error">Scene not found</Box>;
  }

  return (
    <div className="preview-player">
      <header className="preview-header">
        <Typography variant="h4" component="h2">{story.title}</Typography>
        <Typography variant="body2" className="preview-by">by {story.authorName}</Typography>
        {story.genres && story.genres.length > 0 && (
          <Stack direction="row" spacing={1} justifyContent="center" useFlexGap flexWrap="wrap" className="preview-genres">
            {story.genres.map((genre, idx) => (
              <Chip key={idx} label={genre} size="small" className="genre" />
            ))}
          </Stack>
        )}
      </header>

      <main className="preview-main">
        <div className="preview-scene">
          <h3 className="scene-title">{currentNode.name}</h3>

          <article className="scene-content">
            {currentNode.content.split('\n\n').map((paragraph, idx) => (
              <p key={idx} dangerouslySetInnerHTML={{ __html: parseMarkdown(paragraph) }} />
            ))}
          </article>

          {currentNode.isEnding ? (
            <Paper variant="outlined" className="ending-section">
              <Typography variant="h6" component="h4">The End</Typography>
              <Button onClick={restart} variant="contained">Read Again</Button>
            </Paper>
          ) : (
            <nav className="choices-nav">
              <Typography variant="caption" component="p" className="choices-prompt">What happens next?</Typography>
              <ul className="choices-buttons">
                {currentNode.choices && currentNode.choices.map((choice, idx) => (
                  <li key={idx}>
                    <Button onClick={() => makeChoice(choice.nextNodeId)} variant="outlined" className="choice-button" fullWidth>
                      {choice.text}
                    </Button>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>

        <aside className="preview-sidebar">
          <div className="progress">
            <Typography variant="overline" component="h4">Progress</Typography>
            <Typography variant="body2" className="progress-text">{history.length} / {story.nodes.length} scenes</Typography>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${(history.length / story.nodes.length) * 100}%` }}
              />
            </div>
          </div>

          {!currentNode.isEnding && (
            <Button onClick={restart} variant="outlined" size="small" fullWidth>
              Restart
            </Button>
          )}
        </aside>
      </main>
    </div>
  );
};

export default StoryPreviewPlayer;
