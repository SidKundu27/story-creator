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
    const depths = new Array(nodes.length).fill(0);
    const visited = new Set(['start']);
    const queue = [0]; // Start with node 0 (start node)
    
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

    // Get max depth for column positioning
    const maxDepth = Math.max(...depths);
    
    // Count nodes at each depth level
    const nodesPerDepth = {};
    for (let i = 0; i < depths.length; i++) {
      const depth = depths[i];
      nodesPerDepth[depth] = (nodesPerDepth[depth] || 0) + 1;
    }
    
    // Position nodes in columns
    const nodeCountAtDepth = {};
    const padding = 60;
    const columnWidth = (width - padding * 2) / (maxDepth + 1);
    
    for (let i = 0; i < nodes.length; i++) {
      const depth = depths[i];
      const countAtDepth = nodesPerDepth[depth];
      const indexAtDepth = (nodeCountAtDepth[depth] || 0);
      nodeCountAtDepth[depth] = indexAtDepth + 1;
      
      const x = padding + columnWidth * (depth + 0.5);
      const rowHeight = (height - padding * 2) / Math.max(countAtDepth, 1);
      const y = padding + rowHeight * (indexAtDepth + 0.5);
      
      positions[i] = { x, y };
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
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      let label;
      if (isStart) {
        label = 'Start';
      } else if (isEnding) {
        label = 'End';
      } else {
        // Truncate long names to fit in circle
        const sceneName = node.name || 'Scene';
        label = sceneName.length > 10 ? sceneName.substring(0, 10) + '...' : sceneName;
      }
      
      ctx.fillText(label, pos.x, pos.y);
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
