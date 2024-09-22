import {
  getInputFile,
  getTestFile,
  PriorityQueue,
  sum,
  testSolution,
} from "../utils";

const testFile = getTestFile(__dirname);
const inputFile = getInputFile(__dirname);

type Pos = [number, number];
type Prev = {
  pos: Pos;
  cost: number;
};
const x = (pos: Pos | number[]) => pos[0];
const y = (pos: Pos | number[]) => pos[1];
const neighbours = (pos: Pos, grid: number[][]) =>
  [
    [x(pos) + 1, y(pos)],
    [x(pos) - 1, y(pos)],
    [x(pos), y(pos) + 1],
    [x(pos), y(pos) - 1],
  ].filter(
    (p) => x(p) >= 0 && x(p) < grid[0].length && y(p) >= 0 && y(p) < grid.length
  ) as Pos[];

const posValue = (arr: number[][], pos: Pos) => arr[y(pos)]?.[x(pos)];

const part1 = (input: string) => {
  const grid = input
    .split("\n")
    .map((l) => l.split("").map((char) => parseInt(char, 10)));

  const queue: Prev[] = [{ cost: 0, pos: [0, 0] }];
  const lowestRiskSeen: number[][] = [];
  while (queue.length) {
    const curr = queue.pop()!;

    for (const neighbour of neighbours(curr.pos, grid)) {
      const costWithVisit = curr.cost + posValue(grid, neighbour);
      const currNeighbourCost = posValue(lowestRiskSeen, neighbour);
      if (
        currNeighbourCost === undefined ||
        costWithVisit < currNeighbourCost
      ) {
        queue.push({ cost: costWithVisit, pos: neighbour });
        if (!lowestRiskSeen[y(neighbour)]) lowestRiskSeen[y(neighbour)] = [];
        lowestRiskSeen[y(neighbour)][x(neighbour)] = costWithVisit;
      }
    }
  }

  return lowestRiskSeen.at(-1)?.at(-1);
};

const expandRight = (grid: number[][], width: number) => {
  const result: number[][] = structuredClone(grid);
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < width; x++) {
      const corresponding = result[y][grid[0].length - width + x];
      if (corresponding < 9) result[y].push(corresponding + 1);
      else result[y].push(1);
    }
  }
  return result;
};

const expandDown = (grid: number[][], height: number) => {
  const result: number[][] = structuredClone(grid);
  for (let y = grid.length - height; y < grid.length; y++) {
    result.push(grid[y].map((cell) => (cell < 9 ? cell + 1 : 1)));
  }
  return result;
};

const part2 = (input: string) => {
  let grid: number[][] = input
    .split("\n")
    .map((l) => l.split("").map((char) => parseInt(char, 10)));

  const originalWidth = grid[0].length;
  const originalHeight = grid.length;

  for (let x = 0; x < 4; x++) {
    grid = expandRight(grid, originalWidth);
  }

  for (let y = 0; y < 4; y++) {
    grid = expandDown(grid, originalHeight);
  }

  const manhattanDistance = (n: Pos) =>
    Math.abs(x(n) - grid[0].length) + Math.abs(y(n) - grid.length);

  const path = aStar(
    [0, 0],
    [grid[0].length - 1, grid.length - 1],
    manhattanDistance,
    grid
  );

  return sum(path.slice(1).map((p) => posValue(grid, p)));
};

const key = (pos: Pos): StringifiedPos => `${x(pos)},${y(pos)}`;
type StringifiedPos = string;

const reconstructPath = (cameFrom: Map<StringifiedPos, Pos>, current: Pos) => {
  const totalPath = [current];
  while (cameFrom.has(key(current))) {
    current = cameFrom.get(key(current))!;
    totalPath.unshift(current);
  }
  return totalPath;
};

const aStar = (
  start: Pos,
  goal: Pos,
  h: (n: Pos) => number,
  grid: number[][]
) => {
  // min-heap or priority queue
  const openSet = new PriorityQueue<Pos>();
  openSet.enqueue(start, h(start));

  const cameFrom = new Map<StringifiedPos, Pos>();

  const bestScore = new Map<StringifiedPos, number>();
  bestScore.set(key(start), 0);

  const bestGuess = new Map<StringifiedPos, number>();
  bestGuess.set(key(start), h(start));

  while (!openSet.isEmpty()) {
    const current = openSet.dequeue()!.element;
    if (key(current) === key(goal)) {
      return reconstructPath(cameFrom, current);
    }

    for (const neighbour of neighbours(current, grid)) {
      const neighbourBestScore = bestScore.get(key(neighbour)) ?? Infinity;
      const tentativeScore =
        bestScore.get(key(current))! + posValue(grid, neighbour);
      if (tentativeScore < neighbourBestScore) {
        cameFrom.set(key(neighbour), current);
        bestScore.set(key(neighbour), tentativeScore);
        bestGuess.set(key(neighbour), tentativeScore + h(neighbour));
        openSet.enqueue(neighbour, tentativeScore + h(neighbour));
      }
    }
  }

  throw new Error("No path found");
};

testSolution("40", part1, testFile);
testSolution("702", part1, inputFile);

testSolution("315", part2, testFile);
testSolution("2955", part2, inputFile);
