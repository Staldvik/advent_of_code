import { getInputFile, getTestFile, testSolution } from "../utils";

const testFile = getTestFile(__dirname);
const inputFile = getInputFile(__dirname);

class Grid {
  cells: string[][] = [];
  rocks: Rock[] = [];
  constructor(input: string) {
    this.cells = input.split("\n").map((line) => line.split(""));

    for (let y = 0; y < this.cells.length; y++) {
      const line = this.cells[y];
      for (let x = 0; x < line.length; x++) {
        const char = line[x];
        if (char === "O") {
          this.rocks.push(new Rock(x, y));
        }
      }
    }
  }

  get(x: number, y: number): string | false {
    if (y < 0 || y >= this.cells.length) return false;
    if (x < 0 || x >= this.cells[y].length) return false;
    return this.cells[y][x];
  }

  set(x: number, y: number, value: string) {
    this.cells[y][x] = value;
  }

  getRockState() {
    return (
      this.rocks
        // .toSorted((a, b) => {
        //   const yDiff = a.y - b.y;
        //   if (yDiff !== 0) return yDiff;
        //   return a.x - b.x;
        // })
        .map((rock) => `(${rock.x},${rock.y})`)
        .join()
    );
  }

  print() {
    console.log();
    console.log(this.cells.map((row) => row.join("")).join("\n"));
  }
}

class Rock {
  constructor(public x: number, public y: number) {}
}

type Direction = "north" | "east" | "south" | "west";

const dir = {
  north: { x: 0, y: -1 },
  east: { x: 1, y: 0 },
  south: { x: 0, y: 1 },
  west: { x: -1, y: 0 },
};

const tiltGrid = (grid: Grid, tiltDirection: Direction = "north") => {
  const order = grid.rocks.toSorted((a, b) => {
    switch (tiltDirection) {
      case "north":
        return a.y - b.y;
      case "east":
        return b.x - a.x;
      case "south":
        return b.y - a.y;
      case "west":
        return a.x - b.x;
    }
  });

  const checkDirection = (
    direction: Direction,
    fromX: number,
    fromY: number,
    offset: number
  ): false | number => {
    const cell = grid.get(
      fromX + dir[direction].x * offset,
      fromY + dir[direction].y * offset
    );
    if (["#", "O", false].includes(cell)) {
      return false;
    }

    const result = checkDirection(direction, fromX, fromY, offset + 1);
    if (result === false) return offset;
    return result;
  };

  for (const rock of order) {
    const { x, y } = rock;
    const offset = checkDirection(tiltDirection, x, y, 1);
    if (offset === false) continue;
    rock.x += dir[tiltDirection].x * offset;
    rock.y += dir[tiltDirection].y * offset;
    grid.set(rock.x, rock.y, "O");
    grid.set(x, y, ".");
  }
};

const part1 = (input: string) => {
  const grid = new Grid(input);

  tiltGrid(grid, "north");

  const sum = grid.rocks.reduce(
    (acc, rock) => acc + grid.cells.length - rock.y,
    0
  );
  return sum;
};

const directions: Direction[] = ["north", "west", "south", "east"];

const findCycle = (grid: Grid) => {
  const seenStates = new Set<string>();
  let cycle = 0;

  while (true) {
    for (const direction of directions) {
      tiltGrid(grid, direction);
    }
    cycle++;

    const state = grid.getRockState();
    if (seenStates.has(state)) {
      console.log("🚀 ~ file: index.ts:144 ~ findCycle ~ state:", state);
      return cycle;
    }
    seenStates.add(state);
  }
};

const part2 = (input: string) => {
  const grid = new Grid(input);
  const cycle = findCycle(grid);
  console.log("🚀 ~ file: index.ts:142 ~ part2 ~ cycle:", cycle);

  for (let i = 0; i < 1_000_000_000 % cycle; i++) {
    for (const direction of directions) {
      tiltGrid(grid, direction);
    }
  }

  const sum = grid.rocks.reduce(
    (acc, rock) => acc + grid.cells.length - rock.y,
    0
  );
  return sum;
};

testSolution("136", part1, testFile);
testSolution("64", part2, testFile);

console.log("Part 1:", part1(inputFile));
// console.log("Part 2:", part2(inputFile));
