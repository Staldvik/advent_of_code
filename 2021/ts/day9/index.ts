import { clearLine } from "readline";
import { getInputFile, getTestFile, testSolution } from "../utils";

const testFile = getTestFile(__dirname);
const inputFile = getInputFile(__dirname);

type Area = number[][];

const parseInput = (input: string): Area => {
  const lines = input.split("\n");
  return lines.map((l) => l.split("").map((char) => parseInt(char, 10)));
};

const DIRS = [
  [-1, 0],
  [0, 1],
  [1, 0],
  [0, -1],
];

const findLowPoints = (area: Area) => {
  const lowPoints: Point[] = [];
  for (let y = 0; y < area.length; y++) {
    for (let x = 0; x < area[y].length; x++) {
      const element = area[y][x];
      const allHigher = DIRS.every(([dy, dx]) => {
        const compareEl = area[y + dy]?.[x + dx];
        if (compareEl === undefined) return true;
        return compareEl > element;
      });
      if (allHigher) lowPoints.push([y, x]);
    }
  }
  return lowPoints;
};

const getPointValue = (area: Area, point: Point) => area[point[0]][point[1]];

const part1 = (input: string) => {
  const area = parseInput(input);
  const lowPointValues = findLowPoints(area).map((point) =>
    getPointValue(area, point)
  );
  return lowPointValues.reduce((acc, curr) => acc + curr + 1, 0);
};

type Point = [number, number];

const part2 = (input: string) => {
  const area = parseInput(input);
  const lowPoints = findLowPoints(area);
  const basins: Point[][] = [];

  const seen: Point[] = [];
  const isSeen = (point: Point) =>
    seen.some(([y, x]) => point[0] === y && point[1] === x);
  for (const lowPoint of lowPoints) {
    const currentBasin: Point[] = [];
    // flow outward until no more reachable
    const queue: Point[] = [lowPoint];
    while (queue.length) {
      const point = queue.pop()!;
      if (getPointValue(area, point) === 9 || isSeen(point)) continue;

      DIRS.forEach(([dy, dx]) => {
        const y = point[0] + dy;
        const x = point[1] + dx;
        const element = area[y]?.[x];
        if (!element || element === 9 || isSeen([y, x])) return;
        queue.push([y, x]);
      });

      seen.push(point);
      currentBasin.push(point);
    }

    basins.push(currentBasin);
  }

  const [first, second, third] = basins
    .map((b) => b.length)
    .sort((a, b) => b - a);

  return first * second * third;
};

testSolution("15", part1, testFile);
testSolution("436", part1, inputFile);

testSolution("1134", part2, testFile);
testSolution("1317792", part2, inputFile);
