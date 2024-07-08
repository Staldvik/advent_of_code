import { getInputFile, getTestFile, testSolution } from "../utils";

const testFile = getTestFile(__dirname);
const inputFile = getInputFile(__dirname);

type Grid = Octopus[][];
type Pos = [number, number];

class Octopus {
  constructor(public pos: Pos, public value: number, public flashed = false) {}
}

const parseGrid = (input: string): Grid => {
  return input
    .split("\n")
    .map((row, y) =>
      row.split("").map((cell, x) => new Octopus([y, x], parseInt(cell, 10)))
    );
};

const DIRS = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, 1],
  [0, -1],
  [1, -1],
  [1, 0],
  [1, 1],
] as const;

const printGrid = (grid: Grid) => {
  const stringifiedGrid = grid
    .map((l) => l.map((o) => o.value).join(""))
    .join("\n");
  console.log();
  console.log(stringifiedGrid);
  console.log();
};

const part1 = (input: string) => {
  const grid = parseGrid(input);

  let step = 0;
  let flashes = 0;
  while (step < 100) {
    const flashedThisStep: Octopus[] = [];
    const flashQueue: Octopus[] = [];

    // Increase ALL octi
    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[y]!.length; x++) {
        const octopus = grid[y]![x]!;
        octopus.value++;

        // If increase causes octopus to cross 10, mark it as flashing
        if (octopus.value >= 10) {
          flashQueue.push(octopus);
        }
      }
    }

    while (flashQueue.length) {
      const octopus = flashQueue.pop()!;
      if (octopus.flashed) continue;

      for (const [dy, dx] of DIRS) {
        const adjacentPos: Pos = [octopus.pos[0] + dy, octopus.pos[1] + dx];
        const adjacentOctopus = grid[adjacentPos[0]]?.[adjacentPos[1]];
        if (!adjacentOctopus || adjacentOctopus.flashed) continue;

        adjacentOctopus.value++;
        if (adjacentOctopus.value >= 10) {
          flashQueue.push(adjacentOctopus);
        }
      }

      flashes++;
      octopus.flashed = true;
      flashedThisStep.push(octopus);
    }

    flashedThisStep.forEach((oct) => {
      oct.flashed = false;
      oct.value = 0;
    });

    step++;
  }

  return flashes;
};

const part2 = (input: string) => {
  const grid = parseGrid(input);

  let step = 0;
  while (step < 1000) {
    const flashedThisStep: Octopus[] = [];
    const flashQueue: Octopus[] = [];

    // Increase ALL octi
    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[y]!.length; x++) {
        const octopus = grid[y]![x]!;
        octopus.value++;

        // If increase causes octopus to cross 10, mark it as flashing
        if (octopus.value >= 10) {
          flashQueue.push(octopus);
        }
      }
    }

    while (flashQueue.length) {
      const octopus = flashQueue.pop()!;
      if (octopus.flashed) continue;

      for (const [dy, dx] of DIRS) {
        const adjacentPos: Pos = [octopus.pos[0] + dy, octopus.pos[1] + dx];
        const adjacentOctopus = grid[adjacentPos[0]]?.[adjacentPos[1]];
        if (!adjacentOctopus || adjacentOctopus.flashed) continue;

        adjacentOctopus.value++;
        if (adjacentOctopus.value >= 10) {
          flashQueue.push(adjacentOctopus);
        }
      }

      octopus.flashed = true;
      flashedThisStep.push(octopus);
    }

    if (flashedThisStep.length === grid.length * grid[0].length) {
      return step + 1;
    }

    flashedThisStep.forEach((oct) => {
      oct.flashed = false;
      oct.value = 0;
    });

    step++;
  }
};

testSolution("1656", part1, testFile);
testSolution("1717", part1, inputFile);

testSolution("195", part2, testFile);
testSolution("476", part2, inputFile);
