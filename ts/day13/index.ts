import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";

const input = await Deno.readTextFile(new URL("./input.txt", import.meta.url));
const ex = await Deno.readTextFile(new URL("./ex.txt", import.meta.url));

const parseInput = (input: string) => {
  const pairs = input
    .split("\n\n")
    .map((line) => line.split("\n").map((l) => eval(l)));
  return pairs;
};

const compare = (
  left: number | number[],
  right: number | number[]
): boolean | "undecided" => {
  if (left === undefined && right !== undefined) return true;
  if (left !== undefined && right === undefined) return false;
  if (left === right) return "undecided";
  if (!Array.isArray(left) && !Array.isArray(right)) return left < right;

  if (Array.isArray(left) && Array.isArray(right)) {
    for (let i = 0; i < left.length; i++) {
      const isCorrect = compare(left[i], right[i]);
      if (isCorrect !== "undecided") return isCorrect;
    }
    if (left.length < right.length) return true;
  }

  if (Array.isArray(left) && !Array.isArray(right)) {
    return compare(left, [right]);
  }

  if (!Array.isArray(left) && Array.isArray(right)) {
    return compare([left], right);
  }

  return "undecided";
};

const task1 = (input: string) => {
  const pairs = parseInput(input);

  const inOrder = pairs.map((pair, index) => {
    if (compare(pair[0], pair[1])) return index + 1;
    return 0;
  });
  let amountInOrder = 0;
  for (const inOrderIndex of inOrder) {
    amountInOrder += inOrderIndex;
  }

  return amountInOrder;
};

const task2 = (input: string) => {
  const pairs = parseInput(input);

  const divider1 = [[2]];
  const divider2 = [[6]];
  const flattened = pairs.flat(1);
  flattened.push(divider1);
  flattened.push(divider2);
  const sorted = flattened.sort((a, b) => (compare(a, b) ? -1 : 1));

  const divider1Index = sorted.findIndex((s) => s === divider1) + 1;
  const divider2Index = sorted.findIndex((s) => s === divider2) + 1;

  return divider1Index * divider2Index;
};

Deno.test("Task 1", () => {
  const task1Ex = task1(ex);
  assertEquals(task1Ex, 13);
  const task1Input = task1(input);
  assertEquals(task1Input, 5580);
});

Deno.test("Task 2", () => {
  const task2Ex = task2(ex);
  assertEquals(task2Ex, 140);
  const task2Input = task2(input);
  assertEquals(task2Input, 26200);
});
