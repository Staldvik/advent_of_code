import { clearLine } from "readline";
import { getInputFile, getTestFile, testSolution } from "../utils";

const testFile = getTestFile(__dirname);
const inputFile = getInputFile(__dirname);

const parseLine = (line: string) => {
  const [start, end] = line
    .split(" -> ")
    .map((l) => l.split(",").map((n) => parseInt(n, 10)));
  return [start, end] as [[number, number], [number, number]];
};

const startX = (line: [[number, number], [number, number]]) => line[0][0];
const endX = (line: [[number, number], [number, number]]) => line[1][0];
const startY = (line: [[number, number], [number, number]]) => line[0][1];
const endY = (line: [[number, number], [number, number]]) => line[1][1];

const part1 = (input: string) => {
  const lines = input.split("\n").map(parseLine);
  const seen = new Map<string, number>();

  lines.forEach((line) => {
    const isVertical = line[0][0] === line[1][0];
    const isHorizontal = line[0][1] === line[1][1];
    if (!isVertical && !isHorizontal) return;

    if (isVertical) {
      const x = line[0][0];
      const startY = Math.min(line[0][1], line[1][1]);
      const endY = Math.max(line[0][1], line[1][1]);
      for (let y = startY; y <= endY; y++) {
        const xy = `${x}.${y}`;
        seen.set(xy, (seen.get(xy) ?? 0) + 1);
      }
    }

    if (isHorizontal) {
      const y = line[0][1];
      const startX = Math.min(line[0][0], line[1][0]);
      const endX = Math.max(line[0][0], line[1][0]);
      for (let x = startX; x <= endX; x++) {
        const xy = `${x}.${y}`;
        seen.set(xy, (seen.get(xy) ?? 0) + 1);
      }
    }
  });

  let sum = 0;
  for (let value of seen.values()) {
    if (value < 2) continue;
    sum++;
  }
  return sum;
};

const part2 = (input: string) => {
  const lines = input.split("\n").map(parseLine);
  const seen = new Map<string, number>();

  lines.forEach((line) => {
    let x = startX(line);
    let y = startY(line);
    while (x !== endX(line) || y !== endY(line)) {
      const xy = `${x}.${y}`;
      seen.set(xy, (seen.get(xy) ?? 0) + 1);

      if (startX(line) < endX(line)) x++;
      else if (startX(line) > endX(line)) x--;

      if (startY(line) < endY(line)) y++;
      else if (startY(line) > endY(line)) y--;
    }

    const xy = `${x}.${y}`;
    seen.set(xy, (seen.get(xy) ?? 0) + 1);
  });

  let sum = 0;
  for (let value of seen.values()) {
    if (value < 2) continue;
    sum++;
  }
  return sum;
};

testSolution("5", part1, testFile);
testSolution("6548", part1, inputFile);

testSolution("12", part2, testFile);
testSolution("19663", part2, inputFile); // 19633 = Too low
