import { getInputFile, getTestFile, testSolution } from "../utils";

const testFile = getTestFile(__dirname);
const inputFile = getInputFile(__dirname);

type Pos = [number, number];

class Grid {
  constructor(public grid: string[][]) {}

  public get(x: number, y: number) {
    return this.grid[y]?.[x];
  }

  public set(x: number, y: number, value: string) {
    this.grid[y][x] = value;
  }

  public getAdjacent(x: number, y: number) {
    const adjacent = [
      [x - 1, y - 1],
      [x + 1, y - 1],
      [x - 1, y + 1],
      [x + 1, y + 1],
    ] as Pos[];
    return adjacent.filter((n) => {
      const cell = this.get(n[0], n[1]);
      return cell !== undefined && cell !== "#";
    });
  }

  public getStart(startChar = "S") {
    for (let y = 0; y < this.grid.length; y++) {
      for (let x = 0; x < this.grid[0].length; x++) {
        if (this.get(x, y) === startChar) return [x, y] as Pos;
      }
    }
  }

  public print() {
    console.log(this.grid.map((row) => row.join("")).join("\n"));
  }
}

const part1 = (input: string) => {
  const grid = new Grid(input.split("\n").map((line) => line.split("")));
  grid.print();

  let currentPos: Pos;
  let steps = 0;
  const seen: Pos[] = [];

  const walk = (pos: Pos) => {
    currentPos = pos;
    steps++;
    seen.push(currentPos);
    const neighbors = grid.getAdjacent(pos[0], pos[1]);
    for (const neighbor of neighbors) {
      if (
        !seen.some((pos) => pos[0] === neighbor[0] && pos[1] === neighbor[1])
      ) {
        walk(neighbor);
      }
    }
  };
  walk(grid.getStart()!);
  console.log("🚀 ~ file: index.ts:55 ~ walk ~ steps:", steps);
};

const part2 = (input: string) => {};

testSolution("19114", part1, testFile);
// testSolution("167409079868000", part2, testFile);

// console.log("Part 1:", part1(inputFile));
// console.log("Part 2:", part2(inputFile));
