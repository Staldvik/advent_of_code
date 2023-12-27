import Deque from "double-ended-queue";
import { getInputFile, getTestFile, readFile, testSolution } from "../utils";

const testFile = getTestFile(__dirname);
const testFile2 = readFile(__dirname)("./test2.txt");
const inputFile = getInputFile(__dirname);

type Pos = { x: number; y: number };

const findStart = (grid: string[][]): Pos => {
  for (let y = 0; y < grid.length; y++) {
    const line = grid[y];
    for (let x = 0; x < line.length; x++) {
      const char = line[x];
      if (char === "S") {
        return { x, y };
      }
    }
  }
  throw new Error("No start found");
};

const notSeen = (pos: Pos, seen: Pos[]) => {
  return !seen.some((p) => p.x === pos.x && p.y === pos.y);
};

const part1 = (input: string) => {
  const grid = input.split("\n").map((line) => line.split(""));
  const start = findStart(grid);

  const seen: Pos[] = [start];
  const queue = new Deque<Pos>();
  queue.enqueue(start);

  while (queue.length) {
    const currPos = queue.shift()!;
    const currChar = grid[currPos.y][currPos.x];

    // Check up
    if (currPos.y > 0 && "SL|J".includes(currChar)) {
      const upPos = { x: currPos.x, y: currPos.y - 1 };
      const upChar = grid[upPos.y][upPos.x];
      if ("F|7".includes(upChar) && notSeen(upPos, seen)) {
        seen.push(upPos);
        queue.enqueue(upPos);
      }
    }

    // Check right
    if (currPos.x < grid[0].length - 1 && "S-FL".includes(currChar)) {
      const rightPos = { x: currPos.x + 1, y: currPos.y };
      const rightChar = grid[rightPos.y][rightPos.x];
      if ("-J7".includes(rightChar) && notSeen(rightPos, seen)) {
        seen.push(rightPos);
        queue.enqueue(rightPos);
      }
    }

    // Check down
    if (currPos.y < grid.length - 1 && "SF|7".includes(currChar)) {
      const downPos = { x: currPos.x, y: currPos.y + 1 };
      const downChar = grid[downPos.y][downPos.x];
      if ("L|J".includes(downChar) && notSeen(downPos, seen)) {
        seen.push(downPos);
        queue.enqueue(downPos);
      }
    }

    // Check left
    if (currPos.x > 0 && "S-J7".includes(currChar)) {
      const leftPos = { x: currPos.x - 1, y: currPos.y };
      const leftChar = grid[leftPos.y][leftPos.x];
      if ("-FL".includes(leftChar) && notSeen(leftPos, seen)) {
        seen.push(leftPos);
        queue.enqueue(leftPos);
      }
    }
  }

  return seen.length / 2;
};

const part2 = (input: string) => {};

testSolution("4", part1, testFile);
testSolution("8", part1, testFile2);

// console.log("Part 1:", part1(inputFile));
// console.log("Part 2:", part2(inputFile));
