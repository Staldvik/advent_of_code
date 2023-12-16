import { getInputFile, getTestFile, testSolution } from "../utils";

const testFile = getTestFile(__dirname);
const inputFile = getInputFile(__dirname);

class Grid {
  constructor(public lines: string[]) {}

  get(x: number, y: number): string | false {
    if (y < 0 || y >= this.lines.length) return false;
    if (x < 0 || x >= this.lines[y].length) return false;
    return this.lines[y][x];
  }
}

class Rock {
  constructor(public x: number, public y: number) {}
}

type Direction = "north" | "east" | "south" | "west";

const part1 = (input: string, tiltDirection: Direction = "north") => {
  const lines = input.split("\n");
  const grid = new Grid(lines);

  const rocks: Rock[] = [];
  for (let y = 0; y < lines.length; y++) {
    const line = lines[y];
    for (let x = 0; x < line.length; x++) {
      const char = line[x];
      if (char === "O") {
        rocks.push(new Rock(x, y));
      }
    }
  }

  // Sort rocks by distance to the tilt edge
  rocks.sort((a, b) => {
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
  for (const rock of rocks) {
    let nextChar = grid.get(
      rock.x + dir[tiltDirection].x,
      rock.y + dir[tiltDirection].y
    );
    while (
      nextChar &&
      nextChar !== "#" &&
      !rocks.some(
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
        sum += lines.length - rock.y;
        break;
      case "south":
        sum += rock.y + 1;
        break;
      case "east":
        sum += rock.x + 1;
        break;
      case "west":
        sum += lines[0].length - rock.x;
        break;
    }
  }

  return sum;
};

const part2 = (input: string) => {};

testSolution("136", part1, testFile);
// testSolution("51", part2, testFile);

console.log("Part 1:", part1(inputFile));
// console.log("Part 2:", part2(inputFile));
