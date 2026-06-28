import { useEffect, useMemo, useRef, useState } from 'react';

import { EFFECT_COLORS } from '../../effectColors';

type CellState = {
  color: string;
  intensity: number;
};

type TrailState = {
  agentIndex: number;
  unresolved: boolean[];
  completed: number[];
};

const GRID_COLUMNS = 18;
const GRID_ROWS = 12;
const GRID_CELLS = GRID_COLUMNS * GRID_ROWS;
const TRAIL_DECAY = 0.82;
const DOT_SIZE = 10;
const DOT_GAP = 4;
const DOT_PITCH = DOT_SIZE + DOT_GAP;
const DOT_PADDING = 24;

function colorAt(index: number) {
  return EFFECT_COLORS[index % EFFECT_COLORS.length];
}

function makeMemoryCells(activeIndex: number | null): CellState[] {
  return Array.from({ length: GRID_CELLS }, (_, index) => {
    if (activeIndex === null) {
      return { color: 'transparent', intensity: 0 };
    }

    const activeX = activeIndex % GRID_COLUMNS;
    const activeY = Math.floor(activeIndex / GRID_COLUMNS);
    const x = index % GRID_COLUMNS;
    const y = Math.floor(index / GRID_COLUMNS);
    const distance = Math.hypot(activeX - x, activeY - y);
    const intensity = Math.max(0, 1 - distance / 4.2);

    return {
      color: colorAt(activeX + activeY + index),
      intensity,
    };
  });
}

function makeProbabilityCells(activeIndex: number | null) {
  return Array.from({ length: GRID_CELLS }, (_, index) => {
    const x = index % GRID_COLUMNS;
    const y = Math.floor(index / GRID_COLUMNS);
    const base = (Math.sin(x * 0.9 + y * 1.7) + Math.cos(x * 1.6 - y * 0.75) + 2) / 4;
    const activeBoost =
      activeIndex === null
        ? 0
        : Math.max(
            0,
            1 -
              Math.hypot(
                (activeIndex % GRID_COLUMNS) - x,
                Math.floor(activeIndex / GRID_COLUMNS) - y,
              ) /
                5,
          );

    return {
      color: colorAt(Math.round(base * 10) + x + y),
      opacity: Math.min(0.9, 0.08 + base * 0.28 + activeBoost * 0.55),
      scale: 0.72 + base * 0.18 + activeBoost * 0.22,
    };
  });
}

function makeInitialTrailState(columns: number, rows: number): TrailState {
  const cells = columns * rows;

  return {
    agentIndex: Math.floor(cells / 2),
    unresolved: Array.from({ length: cells }, () => Math.random() > 0.94),
    completed: Array(cells).fill(0),
  };
}

function stepTowardTarget(
  currentIndex: number,
  targetIndex: number,
  columns: number,
) {
  const currentX = currentIndex % columns;
  const currentY = Math.floor(currentIndex / columns);
  const targetX = targetIndex % columns;
  const targetY = Math.floor(targetIndex / columns);
  const nextX =
    currentX === targetX ? currentX : currentX + Math.sign(targetX - currentX);
  const nextY =
    currentY === targetY ? currentY : currentY + Math.sign(targetY - currentY);

  return nextY * columns + nextX;
}

function closestUnresolvedIndex(
  agentIndex: number,
  unresolved: boolean[],
  columns: number,
) {
  let closestIndex: number | null = null;
  let closestDistance = Number.POSITIVE_INFINITY;
  const agentX = agentIndex % columns;
  const agentY = Math.floor(agentIndex / columns);

  unresolved.forEach((isUnresolved, index) => {
    if (!isUnresolved) {
      return;
    }

    const x = index % columns;
    const y = Math.floor(index / columns);
    const distance = Math.abs(agentX - x) + Math.abs(agentY - y);

    if (distance < closestDistance) {
      closestDistance = distance;
      closestIndex = index;
    }
  });

  return closestIndex;
}

function stepTrailState(
  state: TrailState,
  columns: number,
  rows: number,
): TrailState {
  const cells = columns * rows;
  const targetIndex = closestUnresolvedIndex(
    state.agentIndex,
    state.unresolved,
    columns,
  );
  const agentIndex =
    targetIndex === null
      ? (state.agentIndex + 1) % cells
      : stepTowardTarget(state.agentIndex, targetIndex, columns);
  const unresolved = [...state.unresolved];
  const completed = state.completed.map((value) => value * TRAIL_DECAY);

  completed[state.agentIndex] = 1;
  completed[agentIndex] = 1;

  if (unresolved[agentIndex]) {
    unresolved[agentIndex] = false;
    completed[agentIndex] = 1;
  }

  return { agentIndex, unresolved, completed };
}

function addLooseEnd(
  state: TrailState,
  index: number,
  columns: number,
  rows: number,
): TrailState {
  const unresolved = [...state.unresolved];
  const completed = [...state.completed];
  const x = index % columns;
  const y = Math.floor(index / columns);
  const pattern = [
    [0, 0],
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -1],
  ];

  for (const [xOffset, yOffset] of pattern) {
    const nextX = x + xOffset;
    const nextY = y + yOffset;

    if (nextX >= 0 && nextX < columns && nextY >= 0 && nextY < rows) {
      const nextIndex = nextY * columns + nextX;
      unresolved[nextIndex] = true;
      completed[nextIndex] = Math.max(completed[nextIndex], 0.35);
    }
  }

  return { ...state, unresolved, completed };
}


export function ColorMemoryGrid() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const cells = useMemo(() => makeMemoryCells(activeIndex), [activeIndex]);

  return (
    <div className="relative min-h-[32rem] overflow-hidden bg-white p-8" onMouseLeave={() => setActiveIndex(null)}>
      <div className="grid h-full min-h-[28rem] grid-cols-[repeat(18,minmax(0,1fr))] gap-1.5">
        {cells.map((cell, index) => (
          <button
            key={index}
            type="button"
            aria-label="Activate color memory cell"
            className="aspect-square border border-neutral-200 bg-white transition-[background-color,border-color,transform,opacity] duration-500 ease-out hover:scale-110 focus:outline-none focus:ring-2 focus:ring-neutral-950/20"
            style={{
              backgroundColor: cell.color,
              borderColor: cell.intensity > 0 ? cell.color : undefined,
              opacity: cell.intensity > 0 ? 0.18 + cell.intensity * 0.82 : 1,
            }}
            onMouseEnter={() => setActiveIndex(index)}
            onFocus={() => setActiveIndex(index)}
          />
        ))}
      </div>
    </div>
  );
}

export function ProbabilityField() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const cells = useMemo(() => makeProbabilityCells(activeIndex), [activeIndex]);

  return (
    <div className="relative min-h-[32rem] overflow-hidden bg-white p-8" onMouseLeave={() => setActiveIndex(null)}>
      <div className="grid h-full min-h-[28rem] grid-cols-[repeat(18,minmax(0,1fr))] gap-2">
        {cells.map((cell, index) => (
          <button
            key={index}
            type="button"
            aria-label="Sample probability field cell"
            className="aspect-square rounded-full border border-neutral-200 transition-[background-color,opacity,transform] duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-neutral-950/20"
            style={{
              backgroundColor: cell.color,
              opacity: cell.opacity,
              transform: `scale(${cell.scale})`,
            }}
            onMouseEnter={() => setActiveIndex(index)}
            onFocus={() => setActiveIndex(index)}
          />
        ))}
      </div>
    </div>
  );
}

export function CellularAutomaton() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dims, setDims] = useState({ columns: 24, rows: 14 });
  const [trailState, setTrailState] = useState<TrailState>(() =>
    makeInitialTrailState(24, 14),
  );

  useEffect(() => {
    const element = containerRef.current;
    if (!element) {
      return;
    }

    const measure = () => {
      const innerWidth = element.clientWidth - DOT_PADDING * 2;
      const innerHeight = element.clientHeight - DOT_PADDING * 2;
      const columns = Math.max(1, Math.floor((innerWidth + DOT_GAP) / DOT_PITCH));
      const rows = Math.max(1, Math.floor((innerHeight + DOT_GAP) / DOT_PITCH));

      setDims((current) =>
        current.columns === columns && current.rows === rows
          ? current
          : { columns, rows },
      );
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setTrailState(makeInitialTrailState(dims.columns, dims.rows));
  }, [dims.columns, dims.rows]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setTrailState((currentState) =>
        stepTrailState(currentState, dims.columns, dims.rows),
      );
    }, 120);

    return () => window.clearInterval(interval);
  }, [dims.columns, dims.rows]);

  const seedCell = (index: number) => {
    setTrailState((currentState) =>
      addLooseEnd(currentState, index, dims.columns, dims.rows),
    );
  };

  return (
    <div
      ref={containerRef}
      className="relative h-[32rem] w-full overflow-hidden bg-white"
    >
      <div
        className="absolute inset-0 grid content-center justify-center overflow-hidden"
        style={{
          padding: DOT_PADDING,
          gap: DOT_GAP,
          gridTemplateColumns: `repeat(${dims.columns}, ${DOT_SIZE}px)`,
        }}
      >
        {trailState.completed.map((completedValue, index) => {
          const isAgent = index === trailState.agentIndex;
          const isUnresolved = trailState.unresolved[index];
          const isCompleted = completedValue > 0.06;
          const cellColor = colorAt(index);

          return (
            <button
              key={index}
              type="button"
              aria-label="Add loose end for agent trail"
              className="bg-white transition-[background-color,box-shadow,opacity] duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-neutral-950/20"
              style={{
                width: DOT_SIZE,
                height: DOT_SIZE,
                backgroundColor:
                  isAgent || isUnresolved || isCompleted ? cellColor : 'white',
                boxShadow: isAgent ? '0 0 0 2px #171717' : undefined,
                opacity: isAgent
                  ? 1
                  : isUnresolved
                    ? 0.72
                    : isCompleted
                      ? 0.1 + completedValue * 0.34
                      : 1,
              }}
              onMouseEnter={() => seedCell(index)}
              onFocus={() => seedCell(index)}
            />
          );
        })}
      </div>
    </div>
  );
}
