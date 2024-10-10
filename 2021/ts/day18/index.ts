import { getInputFile, getTestFile, testSolution } from "../utils";

const testFile = getTestFile(__dirname);
const inputFile = getInputFile(__dirname);

function updateRight(
  pair: SnailFishPair | null,
  value: number,
  prev?: SnailFishPair
): void {
  if (pair === null) {
    return;
  }

  if (pair.right === prev) {
    return updateRight(pair.parent, value, pair);
  }

  if (pair.left === prev) {
    if (typeof pair.right === "object") {
      return updateLeft(pair.right, value);
    }
  }

  if (typeof pair.right === "object") {
    return updateRight(pair.right, value);
  }

  pair.right += value;
}

function updateLeft(
  pair: SnailFishPair | null,
  value: number,
  prev?: SnailFishPair
): void {
  if (pair === null) {
    return;
  }

  if (pair.left === prev) {
    return updateLeft(pair.parent, value, pair);
  }

  if (pair.right === prev) {
    if (typeof pair.left === "object") {
      return updateRight(pair.left, value);
    }
  }

  if (typeof pair.left === "object") {
    return updateLeft(pair.left, value);
  }

  pair.left += value;
}

class SnailFishPair {
  constructor(
    public parent: SnailFishPair | null,
    public left: SnailFishPair | number,
    public right: SnailFishPair | number
  ) {}

  add(input: number) {}

  handleExplodingChild(child: SnailFishPair) {
    // When a child explodes:
    // - child.left gets added to the first number on the left
    // - child.right gets added to the first number on the right
    // - child is replaced with the number 0

    console.log("HELPP exploding child", child);

    updateLeft(this, child.left as number, child);
    updateRight(this, child.right as number, child);

    if (child === this.left) this.left = 0;
    if (child === this.right) this.right = 0;
  }

  explode() {
    if (this.parent === null)
      throw new Error("Root can't explode (fix class setup soonTM?)");
    if (typeof this.left !== "number")
      throw new Error("Trying to explode and this.left is not a number");
    if (typeof this.right !== "number")
      throw new Error("Trying to explode and this.right is not a number");

    this.parent.handleExplodingChild(this);
  }

  reduce() {
    // DFS to find pairs to explode and order to do it
    const pairsToExplode: SnailFishPair[] = [];

    const stack: [SnailFishPair, number][] = [[this, 1]];
    const visited = new Set<SnailFishPair>();

    while (stack.length) {
      const [pair, depth] = stack.pop()!;

      if (!visited.has(pair)) {
        visited.add(pair);

        if (depth === 5) {
          console.log("Depth 5 hit!");
          pair.explode();
          break;
        }

        if (pair.right instanceof SnailFishPair) {
          stack.push([pair.right, depth + 1]);
        }

        if (pair.left instanceof SnailFishPair) {
          stack.push([pair.left, depth + 1]);
        }
      }
    }
  }

  toString(): string {
    const left =
      typeof this.left === "number" ? this.left : this.left.toString();
    const right =
      typeof this.right === "number" ? this.right : this.right.toString();

    return `[${left},${right}]`;
  }
}

const getSnailFish = (
  parent: SnailFishPair | null,
  input: number | number[]
): number | SnailFishPair => {
  if (typeof input === "number") return input;
  const pair = new SnailFishPair(parent, 0, 0);
  pair.left = getSnailFish(pair, input[0]);
  pair.right = getSnailFish(pair, input[1]);
  return pair;
};

// I can think of two ways to parse a line
// - eval
// - count / keep track of brackets
const parseLine = (line: string): SnailFishPair => {
  const numbers = eval(line) as any[];
  const rootSnailFishPair = getSnailFish(null, numbers);
  if (!(rootSnailFishPair instanceof SnailFishPair))
    throw new Error("Parsed line as a single number?");

  return rootSnailFishPair;
};

const part1 = (input: string) => {
  //   for (const line of input.split("\n")) {
  //     const snailFish = parseLine(line);
  //     console.log("🚀 ~ part1 ~ snailFish:", snailFish);
  //   }

  // ugh do I even want to do class based, can just do binary tree in array I guess?

  const snailFish = parseLine("[[3,[2,[8,0]]],[9,[5,[4,[3,2]]]]]");
  console.log("🚀 ~ part1 ~ snailFish:", snailFish);
  console.log("pre reduce", snailFish.toString());
  snailFish.reduce();
  console.log("post reduce", snailFish.toString());
};

const part2 = (input: string) => {};

testSolution("?", part1, testFile);
// testSolution("?", part1, inputFile);

// testSolution("?", part2, testFile);
// testSolution("?", part2, inputFile);
