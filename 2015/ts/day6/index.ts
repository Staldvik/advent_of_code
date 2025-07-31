import * as R from "remeda";
import { getInputFile, getTestFile, testSolution } from "../utils";

const testFile = getTestFile(__dirname);
const inputFile = getInputFile(__dirname);

const createGrid = () => {
  const grid: number[][] = [];
  for (let y = 0; y < 1000; y++) {
    grid[y] = [];
    for (let x = 0; x < 1000; x++) {
      grid[y][x] = 0;
    }
  }
  return grid;
};

enum Action {
  Toggle,
  On,
  Off,
}
type Instruction = {
  action: Action;
  from: number[];
  to: number[];
};
const parseInstruction = (instruction: string) => {
  const match = instruction.match(
    /(turn on|turn off|toggle) (\d+),(\d+) through (\d+),(\d+)/
  );

  if (!match) throw new Error(`Could not parse instruction ${instruction}`);
  const [, action, x1, y1, x2, y2] = match;

  return {
    action: getAction(action),
    from: [parseInt(x1), parseInt(y1)],
    to: [parseInt(x2), parseInt(y2)],
  } as Instruction;
};

const getAction = (input: string) => {
  switch (input) {
    case "toggle":
      return Action.Toggle;
    case "turn on":
      return Action.On;
    case "turn off":
      return Action.Off;
    default:
      throw new Error(`Unknown action ${input}`);
  }
};

const part1 = (input: string) => {
  const grid = createGrid();
  const instructions = input.split("\n").map(parseInstruction);

  for (const { action, from, to } of instructions) {
    for (let y = from[1]; y <= to[1]; y++) {
      for (let x = from[0]; x <= to[0]; x++) {
        if (action === Action.Off) {
          grid[y][x] = 0;
        } else if (action === Action.On) {
          grid[y][x] = 1;
        } else if (action === Action.Toggle) {
          grid[y][x] ^= 1; // XOR with 1 (flip the bit). I guess this whole exercise should be done with some XOR magic, but here's a small sprinkle at least :')
        } else {
          throw new Error(`Don't know how to perform action ${action}`);
        }
      }
    }
  }

  return R.sum(grid.flat());
};

const part2 = (input: string) => {
  const grid = createGrid();
  const instructions = input.split("\n").map(parseInstruction);

  for (const { action, from, to } of instructions) {
    for (let y = from[1]; y <= to[1]; y++) {
      for (let x = from[0]; x <= to[0]; x++) {
        if (action === Action.On) {
          grid[y][x] += 1;
        } else if (action === Action.Off) {
          grid[y][x] = grid[y][x] > 0 ? grid[y][x] - 1 : 0;
        } else if (action === Action.Toggle) {
          grid[y][x] += 2;
        } else {
          throw new Error(`Don't know how to perform action ${action}`);
        }
      }
    }
  }

  return R.sum(grid.flat());
};

testSolution("1000000", part1, testFile);
// testSolution("", part2, testFile);

console.log("Part 1:", part1(inputFile)); // 542387 too low
console.log("Part 2:", part2(inputFile)); // 14988957 too high
