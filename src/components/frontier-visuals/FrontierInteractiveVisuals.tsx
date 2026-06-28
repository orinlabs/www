import { useEffect, useMemo, useRef, useState } from 'react';

import { EFFECT_COLORS } from '../../effectColors';

type CellState = {
  color: string;
  intensity: number;
};

type TrailState = {
  agents: number[];
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

function edgeFade(index: number, columns: number, rows: number) {
  const x = index % columns;
  const y = Math.floor(index / columns);
  const distance = Math.min(x, y, columns - 1 - x, rows - 1 - y);
  return Math.min(1, distance / 3);
}

function clampInterior(value: number, length: number) {
  return Math.min(length - 2, Math.max(1, value));
}

function centerIndex(columns: number, rows: number) {
  return Math.floor(rows / 2) * columns + Math.floor(columns / 2);
}

function randomInteriorIndex(columns: number, rows: number) {
  if (columns <= 2 || rows <= 2) {
    return centerIndex(columns, rows);
  }

  const x = 1 + Math.floor(Math.random() * (columns - 2));
  const y = 1 + Math.floor(Math.random() * (rows - 2));
  return y * columns + x;
}

function makeInitialTrailState(columns: number, rows: number): TrailState {
  const cells = columns * rows;
  const diamondCount = Math.max(3, Math.round(cells / 80));

  let state: TrailState = {
    agents: [agentHome(0, columns, rows), agentHome(1, columns, rows)],
    unresolved: Array(cells).fill(false),
    completed: Array(cells).fill(0),
  };

  for (let i = 0; i < diamondCount; i += 1) {
    state = addLooseEnd(
      state,
      randomInteriorIndex(columns, rows),
      columns,
      rows,
    );
  }

  return state;
}

function stepTowardTarget(
  currentIndex: number,
  targetIndex: number,
  columns: number,
  rows: number,
) {
  const currentX = currentIndex % columns;
  const currentY = Math.floor(currentIndex / columns);
  const targetX = targetIndex % columns;
  const targetY = Math.floor(targetIndex / columns);
  const nextX = clampInterior(
    currentX === targetX ? currentX : currentX + Math.sign(targetX - currentX),
    columns,
  );
  const nextY = clampInterior(
    currentY === targetY ? currentY : currentY + Math.sign(targetY - currentY),
    rows,
  );

  return nextY * columns + nextX;
}

function closestUnresolvedIndex(
  agentIndex: number,
  unresolved: boolean[],
  columns: number,
  exclude?: Set<number>,
) {
  let closestIndex: number | null = null;
  let closestDistance = Number.POSITIVE_INFINITY;
  const agentX = agentIndex % columns;
  const agentY = Math.floor(agentIndex / columns);

  unresolved.forEach((isUnresolved, index) => {
    if (!isUnresolved || exclude?.has(index)) {
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

function litFraction(state: TrailState, columns: number, rows: number) {
  const interior = Math.max(1, (columns - 2) * (rows - 2));
  let lit = 0;

  for (let index = 0; index < state.unresolved.length; index += 1) {
    if (state.unresolved[index] || state.completed[index] > 0.1) {
      lit += 1;
    }
  }

  return lit / interior;
}

function agentHome(slot: number, columns: number, rows: number) {
  const midRow = Math.floor(rows / 2);
  const fraction = (slot + 1) / 3;
  return midRow * columns + clampInterior(Math.round(columns * fraction), columns);
}

function stepTrailState(
  state: TrailState,
  columns: number,
  rows: number,
): TrailState {
  const unresolved = [...state.unresolved];
  const completed = state.completed.map((value) => value * TRAIL_DECAY);
  const takenTargets = new Set<number>();
  const occupied = new Set<number>();

  const agents = state.agents.map((agentIndex, slot) => {
    const targetIndex = closestUnresolvedIndex(
      agentIndex,
      unresolved,
      columns,
      takenTargets,
    );

    if (targetIndex !== null) {
      takenTargets.add(targetIndex);
    }

    const goal = targetIndex ?? agentHome(slot, columns, rows);
    let nextIndex = stepTowardTarget(agentIndex, goal, columns, rows);

    if (occupied.has(nextIndex)) {
      nextIndex = agentIndex;
    }

    occupied.add(nextIndex);
    completed[agentIndex] = 1;
    completed[nextIndex] = 1;

    if (unresolved[nextIndex]) {
      unresolved[nextIndex] = false;
      completed[nextIndex] = 1;
    }

    return nextIndex;
  });

  return { agents, unresolved, completed };
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

    if (nextX >= 1 && nextX < columns - 1 && nextY >= 1 && nextY < rows - 1) {
      const nextIndex = nextY * columns + nextX;
      unresolved[nextIndex] = true;
      completed[nextIndex] = Math.max(completed[nextIndex], 0.35);
    }
  }

  return { ...state, unresolved, completed };
}

function addRandomLooseEnd(
  state: TrailState,
  columns: number,
  rows: number,
): TrailState {
  return addLooseEnd(state, randomInteriorIndex(columns, rows), columns, rows);
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
  const trailRef = useRef(trailState);

  useEffect(() => {
    trailRef.current = trailState;
  }, [trailState]);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) {
      return;
    }

    const measure = () => {
      // Keep the grid square: size it to the height, clamped to the available
      // width so it never overflows the column.
      const side =
        Math.min(element.clientWidth, element.clientHeight) - DOT_PADDING * 2;
      const count = Math.max(1, Math.floor((side + DOT_GAP) / DOT_PITCH));

      setDims((current) =>
        current.columns === count && current.rows === count
          ? current
          : { columns: count, rows: count },
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

  useEffect(() => {
    let timeoutId = 0;

    const tick = () => {
      setTrailState((currentState) =>
        addRandomLooseEnd(currentState, dims.columns, dims.rows),
      );
      // Aim for ~30% of the interior lit: spawn quickly while below target,
      // then trickle once at/above it so the snakes can keep pace.
      const target = 0.3;
      const fraction = litFraction(trailRef.current, dims.columns, dims.rows);
      const delay =
        fraction >= target
          ? 1600
          : 80 + (fraction / target) * 620;
      timeoutId = window.setTimeout(tick, delay);
    };

    timeoutId = window.setTimeout(tick, 1000);
    return () => window.clearTimeout(timeoutId);
  }, [dims.columns, dims.rows]);

  const gameSize = dims.columns * DOT_PITCH - DOT_GAP + DOT_PADDING * 2;

  return (
    <div
      ref={containerRef}
      className="relative h-[32rem] w-full overflow-hidden"
    >
      <div
        className="absolute right-0 top-1/2 grid -translate-y-1/2 place-content-center overflow-hidden bg-white"
        style={{
          width: gameSize,
          height: gameSize,
          padding: DOT_PADDING,
          gap: DOT_GAP,
          gridTemplateColumns: `repeat(${dims.columns}, ${DOT_SIZE}px)`,
        }}
      >
        {trailState.completed.map((completedValue, index) => {
          const isAgent = trailState.agents.includes(index);
          const isUnresolved = trailState.unresolved[index];
          const isCompleted = completedValue > 0.06;
          const cellColor = colorAt(index);
          const baseOpacity = isAgent
            ? 1
            : isUnresolved
              ? 0.72
              : isCompleted
                ? 0.1 + completedValue * 0.34
                : 1;

          return (
            <div
              key={index}
              aria-hidden="true"
              className="bg-white transition-[background-color,box-shadow,opacity] duration-200 ease-out"
              style={{
                width: DOT_SIZE,
                height: DOT_SIZE,
                backgroundColor:
                  isAgent || isUnresolved || isCompleted ? cellColor : 'white',
                boxShadow: isAgent ? '0 0 0 2px #171717' : undefined,
                opacity: baseOpacity * edgeFade(index, dims.columns, dims.rows),
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
