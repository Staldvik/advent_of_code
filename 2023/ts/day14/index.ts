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
}

class Rock {
  constructor(public x: number, public y: number) {}
}

type Direction = "north" | "east" | "south" | "west";

const part1 = (input: string, tiltDirection: Direction = "north") => {
  const grid = new Grid(input);

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

  let sum = 0;
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

    // Settled
    switch (tiltDirection) {
      case "north":
        sum += grid.cells.length - rock.y;
        break;
      case "south":
        sum += rock.y + 1;
        break;
      case "east":
        sum += rock.x + 1;
        break;
      case "west":
        sum += grid.cells[0].length - rock.x;
        break;
    }
  }

  return sum;
};

const part2 = (input: string) => {};

testSolution("136", part1, testFile);
testSolution("64", part2, testFile);

console.log("Part 1:", part1(inputFile));
// console.log("Part 2:", part2(inputFile));
