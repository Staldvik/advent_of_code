import { getInputFile, getTestFile, testSolution } from "../utils";

const testFile = getTestFile(__dirname);
const inputFile = getInputFile(__dirname);

class Probe {
  constructor(public pos: XY, public vel: XY) {}

  tick() {
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;

    this.vel.x -= Math.sign(this.vel.x);
    this.vel.y -= 1;
  }

  isWithin(target: Target) {
    const withinX = this.pos.x >= target.x[0] && this.pos.x <= target.x[1];
    const withinY = this.pos.y >= target.y[0] && this.pos.y <= target.y[1];
    return withinX && withinY;
  }

  hasMissed(target: Target) {
    if (this.pos.y < target.y[0] && this.vel.y <= 0) return true;
    if (this.pos.x < target.x[0] && this.vel.x <= 0) return true;
    if (this.pos.x > target.x[1] && this.vel.x >= 0) return true;
    return false;
  }
}

const parseInput = (input: string) => {
  const area = input.split(": ")[1];
  const [x, y] = area.split(", ").map(
    (part) =>
      part
        .split("=")[1]
        .split("..")
        .map((str) => parseInt(str, 10)) as [number, number]
  );

  return { x, y };
};

type XY = {
  x: number;
  y: number;
};

type Target = {
  x: [number, number];
  y: [number, number];
};

const part1 = (input: string) => {
  const target = parseInput(input);
  const maxXVel = target.x[1];

  let totalHighestY = 0;

  for (let y = 0; y < 1_000; y++) {
    for (let x = 0; x < maxXVel; x++) {
      let probeHighestY = 0;
      const probe = new Probe({ x: 0, y: 0 }, { x, y });
      while (!probe.hasMissed(target)) {
        probe.tick();
        probeHighestY = Math.max(probeHighestY, probe.pos.y);
        if (probe.isWithin(target)) {
          totalHighestY = Math.max(totalHighestY, probeHighestY);
          break;
        }
      }
    }
  }

  return totalHighestY;
};

const part2 = (input: string) => {
  const target = parseInput(input);
  const maxXVel = target.x[1];

  let hits = 0;

  for (let y = -1_000; y < 1_000; y++) {
    for (let x = -100; x < maxXVel + 1; x++) {
      const probe = new Probe({ x: 0, y: 0 }, { x, y });
      while (!probe.hasMissed(target)) {
        probe.tick();
        if (probe.isWithin(target)) {
          hits++;
          break;
        }
      }
    }
  }

  return hits;
};

testSolution("45", part1, testFile);
testSolution("8646", part1, inputFile);

testSolution("112", part2, testFile);
testSolution("5945", part2, inputFile);
