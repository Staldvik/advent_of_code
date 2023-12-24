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
          this.cells[y][x] = ".";
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
    return this.rocks
      .toSorted((a, b) => a.id - b.id)
      .map((rock) => rock.toString())
      .join();
  }

  print() {
    console.log(
      this.cells
        .map((row, y) =>
          row
            .map((cell, x) => {
              const rock = this.rocks.find((r) => r.x === x && r.y === y);
              if (rock) return "O";
              return cell;
            })
            .join("")
        )
        .join("\n")
    );
  }
}

let rockId = 0;
class Rock {
  id: number;
  constructor(public x: number, public y: number) {
    this.id = rockId++;
  }
  toString() {
    return `#${this.id}(${this.x},${this.y})`;
  }
}

type Direction = "north" | "east" | "south" | "west";

const tiltGrid = (grid: Grid, tiltDirection: Direction = "north") => {
  // Sort rocks by distance to the tilt edge
  grid.rocks.sort((a, b) => {
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

  const dir = {
    north: { x: 0, y: -1 },
    east: { x: 1, y: 0 },
    south: { x: 0, y: 1 },
    west: { x: -1, y: 0 },
  };

  for (const rock of grid.rocks) {
    let nextChar = grid.get(
      rock.x + dir[tiltDirection].x,
      rock.y + dir[tiltDirection].y
    );
    while (
      nextChar &&
      nextChar !== "#" &&
      !grid.rocks.some(
        (r) =>
          r.x === rock.x + dir[tiltDirection].x &&
          r.y === rock.y + dir[tiltDirection].y
      )
    ) {
      rock.x += dir[tiltDirection].x;
      rock.y += dir[tiltDirection].y;

      nextChar = grid.get(
        rock.x + dir[tiltDirection].x,
        rock.y + dir[tiltDirection].y
      );
    }
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
      return cycle;
    }
    seenStates.add(state);
  }
};

const part2 = (input: string) => {
  let grid = new Grid(input);
  const cycle = findCycle(grid);
  console.log("🚀 ~ file: index.ts:153 ~ part2 ~ cycle:", cycle);
  grid = new Grid(input);

  for (let i = 0; i <= 1_000_000_000 % cycle; i++) {
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
console.log("Part 2:", part2(inputFile));
