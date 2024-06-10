import { clearLine } from "readline";
import { getInputFile, getTestFile, testSolution } from "../utils";

const testFile = getTestFile(__dirname);
const inputFile = getInputFile(__dirname);

class Pool {
  constructor(public fishes: Fish[] = []) {}

  static fromString(input: string) {
    const pool = new Pool();
    input
      .split(",")
      .forEach((f) => pool.addFish(new Fish(pool, parseInt(f, 10))));
    return pool;
  }

  addFish(fish: Fish) {
    this.fishes.push(fish);
  }

  tick() {
    this.fishes.forEach((f) => f.tick());
  }
}

class Fish {
  constructor(public pool: Pool, public timer: number) {}

  tick() {
    this.timer--;
    if (this.timer < 0) {
      this.timer = 6;
      this.pool.addFish(new Fish(this.pool, 8));
    }
  }
}

const part1 = (input: string) => {
  const poolOfFish = Pool.fromString(input);

  let day = 0;
  while (day < 80) {
    poolOfFish.tick();
    day++;
  }

  return poolOfFish.fishes.length;
};

/**
 * Tanker
 *
 * * Don't simulate each fish, only keep track of amount on each stage
 */

// const part2 = (input: string) => {
//   const fishes = new Map<number, number>();
//   input.split(",").forEach((f) => {
//     const currentTick = parseInt(f, 10);
//     return fishes.set(currentTick, (fishes.get(currentTick) ?? 0) + 1);
//   });

//   let day = 0;
//   while (day < 80) {

//     day++;
//   }
// };

const part2 = (input: string) => {
  const fishes: number[] = new Array(9).fill(0);
  input.split(",").forEach((f) => {
    const currentTick = parseInt(f, 10);
    fishes[currentTick]++;
  });

  let day = 1;
  while (day <= 256) {
    const spawning = fishes.shift()!;
    fishes[8] = spawning;
    fishes[6] += spawning;
    day++;
  }

  return fishes.reduce((acc, curr) => acc + curr, 0);
};

testSolution("5934", part1, testFile);
testSolution("362346", part1, inputFile);

testSolution("26984457539", part2, testFile);
testSolution("1639643057051", part2, inputFile);
