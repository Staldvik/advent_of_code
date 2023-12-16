import { getInputFile, getTestFile, testSolution } from "../utils";

const testFile = getTestFile(__dirname);
const inputFile = getInputFile(__dirname);

class Grid {
  constructor(public lines: string[]) {}

  get width() {
    return this.lines[0].length;
  }

  get height() {
    return this.lines.length;
  }

  get(x: number, y: number): string | false {
    if (x < 0 || x >= this.width) return false;
    if (y < 0 || y >= this.height) return false;
    return this.lines[y][x];
  }

  set(x: number, y: number, value: string) {
    this.lines[y] =
      this.lines[y].substring(0, x) + value + this.lines[y].substring(x + 1);
  }

  toString() {
    return this.lines.join("\n");
  }
}

class Pos {
  constructor(public x: number, public y: number) {}

  toString() {
    return `${this.x},${this.y}`;
  }
}

type Dir = "up" | "down" | "left" | "right";

let count = 0;
class Beam {
  constructor(
    public pos: Pos,
    public dir: Dir,
    public active = true,
    public name = count++
  ) {
    this.pos = new Pos(pos.x, pos.y);
  }
}

const part1 = (input: string, startingPoint: { pos: Pos; direction: Dir }) => {
  const grid = new Grid(input.split("\n"));
  const seen = new Map<string, Dir[]>();

  const beams: Beam[] = [];
  beams.push(new Beam(startingPoint.pos, startingPoint.direction));

  while (beams.some((b) => b.active)) {
    for (const beam of beams) {
      if (!beam.active) continue;
      if (seen.get(beam.pos.toString())?.includes(beam.dir)) {
        beam.active = false;
        continue;
      }
      seen.set(beam.pos.toString(), [
        ...(seen.get(beam.pos.toString()) || []),
        beam.dir,
      ]);
      switch (beam.dir) {
        case "right":
          beam.pos.x++;
          const right = grid.get(beam.pos.x, beam.pos.y);
          if (!right) {
            beam.active = false;
            break;
          }
          if (right === "/") {
            beam.dir = "up";
          } else if (right === "\\") {
            beam.dir = "down";
          } else if (right === "|") {
            beams.push(new Beam({ x: beam.pos.x, y: beam.pos.y }, "down"));
            beam.dir = "up";
          }
          break;
        case "down":
          beam.pos.y++;
          const down = grid.get(beam.pos.x, beam.pos.y);
          if (!down) {
            beam.active = false;
            break;
          }
          if (down === "/") {
            beam.dir = "left";
          } else if (down === "\\") {
            beam.dir = "right";
          } else if (down === "-") {
            beams.push(new Beam({ x: beam.pos.x, y: beam.pos.y }, "right"));
            beam.dir = "left";
          }
          break;
        case "left":
          beam.pos.x--;
          const left = grid.get(beam.pos.x, beam.pos.y);
          if (!left) {
            beam.active = false;
            break;
          }
          if (left === "/") {
            beam.dir = "down";
          } else if (left === "\\") {
            beam.dir = "up";
          } else if (left === "|") {
            beams.push(new Beam({ x: beam.pos.x, y: beam.pos.y }, "up"));
            beam.dir = "down";
          }
          break;
        case "up":
          beam.pos.y--;
          const up = grid.get(beam.pos.x, beam.pos.y);
          if (!up) {
            beam.active = false;
            break;
          }
          if (up === "/") {
            beam.dir = "right";
          } else if (up === "\\") {
            beam.dir = "left";
          } else if (up === "-") {
            beams.push(new Beam({ x: beam.pos.x, y: beam.pos.y }, "left"));
            beam.dir = "right";
          }
          break;
      }
    }
  }

  return seen.size;
};

const part2 = (input: string) => {
  const lines = input.split("\n");

  let startingPoints: { pos: Pos; direction: Dir }[] = [];

  for (let x = 0; x < lines[0].length; x++) {
    startingPoints.push({ pos: new Pos(x, 0), direction: "down" });
    startingPoints.push({ pos: new Pos(x, lines.length - 1), direction: "up" });
  }

  for (let y = 0; y < lines.length; y++) {
    startingPoints.push({ pos: new Pos(0, y), direction: "right" });
    startingPoints.push({
      pos: new Pos(lines[0].length - 1, y),
      direction: "left",
    });
  }

  let max = 0;

  for (const startingPoint of startingPoints) {
    max = Math.max(max, part1(input, startingPoint));
  }

  return max;
};

testSolution(
  "46",
  (input) => part1(input, { pos: new Pos(0, 0), direction: "right" }),
  testFile
);
testSolution("51", part2, testFile);

console.log(
  "Part 1:",
  part1(inputFile, { pos: new Pos(0, 0), direction: "right" })
);
console.log("Part 2:", part2(inputFile)); // 8184 too high
