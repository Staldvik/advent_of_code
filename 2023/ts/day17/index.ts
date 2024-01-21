import Deque from "double-ended-queue";
import { getInputFile, getTestFile, readFile, testSolution } from "../utils";

const testFile = getTestFile(__dirname);
const inputFile = getInputFile(__dirname);

const dirs = [
  [0, -1, "N"],
  [1, 0, "E"],
  [0, 1, "S"],
  [-1, 0, "W"],
] as const;

type Dir = "N" | "E" | "S" | "W";

const part1 = (input: string) => {
  const grid = input
    .split("\n")
    .map((line) => line.split("").map((n) => parseInt(n, 10)));

  const isOOB = (x: number, y: number) => {
    return x < 0 || x >= grid[0].length || y < 0 || y >= grid.length;
  };

  const seen: {
    x: number;
    y: number;
    entryDir: Dir;
    dirCount: number;
    sum: number;
  }[] = [{ x: 0, y: 0, entryDir: "W", dirCount: 0, sum: 0 }];

  const queue = new Deque<[number, number, number, Dir, number]>();
  queue.push([0, 0, 0, "W", 0]);
  const endHits: number[] = [];

  while (queue.length > 0) {
    const [sum, x, y, entryDir, dirCount] = queue.shift()!;

    if (x === grid[0].length - 1 && y === grid.length - 1) endHits.push(sum);

    for (const [dx, dy, dir] of dirs) {
      const nextX = x + dx;
      const nextY = y + dy;

      if (isOOB(nextX, nextY)) continue;

      const isContinueDir = dir === entryDir;
      if (isContinueDir && dirCount > 2) continue;

      const lastSeen = seen.find(
        (s) => s.x === nextX && s.y === nextY && s.dirCount === dirCount
      );
      const neighbor = grid[nextY][nextX];
      if (lastSeen && lastSeen.sum < sum + neighbor) continue;

      if (!lastSeen) {
        const nextDirCount = isContinueDir ? dirCount + 1 : 1;
        queue.push([sum + neighbor, nextX, nextY, dir, nextDirCount]);
        seen.push({
          x: nextX,
          y: nextY,
          entryDir: dir,
          dirCount: nextDirCount,
          sum: sum + neighbor,
        });
      }
    }
  }

  console.log("🚀 ~ file: index.ts:88 ~ part1 ~ endHits:", endHits);
  return Math.min(...endHits);
};

const part2 = (input: string) => {};

testSolution("102", part1, readFile(__dirname)("test2.txt"));
// testSolution("167409079868000", part2, testFile);

// console.log("Part 1:", part1(inputFile));
// console.log("Part 2:", part2(inputFile));
