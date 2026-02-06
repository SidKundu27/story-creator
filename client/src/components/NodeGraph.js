import React, { useEffect, useRef } from 'react';
import './NodeGraph.css';

const NodeGraph = ({ nodes, selectedNodeIndex, onNodeSelect, startNodeId }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !nodes || nodes.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Clear canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Calculate node positions (hierarchical layout)
    const nodePositions = calculateNodePositions(nodes, canvas.width, canvas.height);

    // Draw connections
    drawConnections(ctx, nodes, nodePositions);

    // Draw nodes
    drawNodes(ctx, nodes, nodePositions, selectedNodeIndex, startNodeId);

    // Make nodes clickable
    canvas.onclick = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      nodePositions.forEach((pos, idx) => {
        const distance = Math.sqrt((x - pos.x) ** 2 + (y - pos.y) ** 2);
        if (distance <= 25) {
          onNodeSelect(idx);
        }
      });
    };

    canvas.style.cursor = 'pointer';
  }, [nodes, selectedNodeIndex, onNodeSelect, startNodeId]);

  const calculateNodePositions = (nodes, width, height) => {
    if (nodes.length === 1) {
      return [{ x: width / 2, y: height / 2 }];
    }

    const positions = new Array(nodes.length);
    
    // Use BFS to calculate depth (column position) from start node
    const depths = new Array(nodes.length).fill(-1);
    const visited = new Set(['start']);
    const queue = [0]; // Start with node 0 (start node)
    depths[0] = 0;
    
    while (queue.length > 0) {
      const currentIdx = queue.shift();
      const currentDepth = depths[currentIdx];
      
      const node = nodes[currentIdx];
      if (node.choices && node.choices.length > 0) {
        node.choices.forEach((choice) => {
          const targetIdx = nodes.findIndex(n => n.nodeId === choice.nextNodeId);
          if (targetIdx !== -1 && !visited.has(choice.nextNodeId)) {
            visited.add(choice.nextNodeId);
            depths[targetIdx] = currentDepth + 1;
            queue.push(targetIdx);
          }
        });
      }
    }

    // Separate connected and disconnected nodes
    const connectedNodes = [];
    const disconnectedNodes = [];
    for (let i = 0; i < nodes.length; i++) {
      if (depths[i] >= 0) {
        connectedNodes.push({ idx: i, depth: depths[i] });
      } else {
        disconnectedNodes.push(i);
      }
    }

    const padding = 60;
    let maxConnectedY = padding;
    let columnWidth = (width - padding * 2);
    
    if (connectedNodes.length > 0) {
      // Get max depth for column positioning
      const maxDepth = Math.max(...connectedNodes.map(n => n.depth));
      
      // Count nodes at each depth level
      const nodesPerDepth = {};
      connectedNodes.forEach(({ depth }) => {
        nodesPerDepth[depth] = (nodesPerDepth[depth] || 0) + 1;
      });
      
      // Position connected nodes in columns
      const nodeCountAtDepth = {};
      columnWidth = (width - padding * 2) / (maxDepth + 1);
      const availableHeight = disconnectedNodes.length > 0 ? height - 120 : height - padding * 2;
      
      connectedNodes.forEach(({ idx, depth }) => {
        const countAtDepth = nodesPerDepth[depth];
        const indexAtDepth = (nodeCountAtDepth[depth] || 0);
        nodeCountAtDepth[depth] = indexAtDepth + 1;
        
        const x = padding + columnWidth * (depth + 0.5);
        const rowHeight = availableHeight / Math.max(countAtDepth, 1);
        const y = padding + rowHeight * (indexAtDepth + 0.5);
        
        positions[idx] = { x, y };
        if (y > maxConnectedY) {
          maxConnectedY = y;
        }
      });
    }
    
    // Position disconnected nodes horizontally at bottom
    if (disconnectedNodes.length > 0) {
      const startColumnX = padding + columnWidth * 0.5;
      const spacing = Math.min(columnWidth, 120);
      const disconnectedY = Math.min(height - padding, maxConnectedY + 80);
      disconnectedNodes.forEach((idx, i) => {
        positions[idx] = {
          x: startColumnX + spacing * i,
          y: disconnectedY
        };
      });
    }

    return positions;
  };

  const drawConnections = (ctx, nodes, positions) => {
    ctx.strokeStyle = '#cbd5e0';
    ctx.lineWidth = 2;

    nodes.forEach((node, idx) => {
      if (node.choices && node.choices.length > 0) {
        node.choices.forEach((choice) => {
          const targetIdx = nodes.findIndex(n => n.nodeId === choice.nextNodeId);
          if (targetIdx !== -1 && positions[targetIdx]) {
            ctx.beginPath();
            ctx.moveTo(positions[idx].x, positions[idx].y);
            ctx.lineTo(positions[targetIdx].x, positions[targetIdx].y);
            ctx.stroke();

            // Draw arrow
            const angle = Math.atan2(
              positions[targetIdx].y - positions[idx].y,
              positions[targetIdx].x - positions[idx].x
            );
            const arrowSize = 10;
            ctx.fillStyle = '#cbd5e0';
            ctx.beginPath();
            ctx.moveTo(
              positions[targetIdx].x,
              positions[targetIdx].y
            );
            ctx.lineTo(
              positions[targetIdx].x - arrowSize * Math.cos(angle - Math.PI / 6),
              positions[targetIdx].y - arrowSize * Math.sin(angle - Math.PI / 6)
            );
            ctx.lineTo(
              positions[targetIdx].x - arrowSize * Math.cos(angle + Math.PI / 6),
              positions[targetIdx].y - arrowSize * Math.sin(angle + Math.PI / 6)
            );
            ctx.fill();
          }
        });
      }
    });
  };

  const drawNodes = (ctx, nodes, positions, selectedIdx, startNodeId) => {
    nodes.forEach((node, idx) => {
      const pos = positions[idx];
      const isSelected = idx === selectedIdx;
      const isStart = node.nodeId === startNodeId;
      const isEnding = node.isEnding;

      // Draw node background
      if (isSelected) {
        ctx.fillStyle = '#667eea';
        ctx.shadowColor = 'rgba(102, 126, 234, 0.4)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
      } else if (isEnding) {
        ctx.fillStyle = '#f87171';
      } else if (isStart) {
        ctx.fillStyle = '#34d399';
      } else {
        ctx.fillStyle = '#60a5fa';
      }

      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 25, 0, 2 * Math.PI);
      ctx.fill();

      // Draw border
      ctx.strokeStyle = isSelected ? '#667eea' : '#e5e7eb';
      ctx.lineWidth = isSelected ? 3 : 2;
      ctx.stroke();

      ctx.shadowColor = 'transparent';

      // Draw label - show scene name
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      let label;
      if (isStart) {
        label = 'Start';
      } else {
        const sceneName = node.name || 'Scene';
        label = sceneName.length > 14 ? `${sceneName.substring(0, 14)}…` : sceneName;
      }
      
      ctx.fillText(label, pos.x, pos.y);

      if (isSelected && !isStart) {
        const fullName = node.name || 'Scene';
        ctx.font = '600 11px sans-serif';
        const paddingX = 8;
        const textWidth = ctx.measureText(fullName).width;
        const boxWidth = Math.min(textWidth + paddingX * 2, 220);
        const boxHeight = 22;
        const boxX = Math.min(Math.max(pos.x - boxWidth / 2, 8), ctx.canvas.width - boxWidth - 8);
        const boxY = Math.min(pos.y + 35, ctx.canvas.height - boxHeight - 8);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.strokeStyle = '#d1d5db';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(boxX + 6, boxY);
        ctx.lineTo(boxX + boxWidth - 6, boxY);
        ctx.quadraticCurveTo(boxX + boxWidth, boxY, boxX + boxWidth, boxY + 6);
        ctx.lineTo(boxX + boxWidth, boxY + boxHeight - 6);
        ctx.quadraticCurveTo(boxX + boxWidth, boxY + boxHeight, boxX + boxWidth - 6, boxY + boxHeight);
        ctx.lineTo(boxX + 6, boxY + boxHeight);
        ctx.quadraticCurveTo(boxX, boxY + boxHeight, boxX, boxY + boxHeight - 6);
        ctx.lineTo(boxX, boxY + 6);
        ctx.quadraticCurveTo(boxX, boxY, boxX + 6, boxY);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#111827';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(fullName, boxX + boxWidth / 2, boxY + boxHeight / 2);
      }
    });
  };

  return (
    <div className="node-graph-container">
      <div className="graph-header">
        <h4>Story Structure</h4>
        <small>Click nodes to navigate</small>
      </div>
      <canvas ref={canvasRef} className="node-graph-canvas" />
    </div>
  );
};

export default NodeGraph;
