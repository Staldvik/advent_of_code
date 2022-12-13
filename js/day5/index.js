import fs from "fs";

const text = fs.readFileSync(new URL("./input.txt", import.meta.url), "utf8");

/**
 * @param {string} input
 * @returns {[string[][], {amount: number, from: number, to: number}[]]}
 */
const parseInput = (input) => {
  const [arrangement, instructions] = input.split("\n\n");
  const arrangementRows = arrangement.split("\n");
  // Remove number row
  arrangementRows.pop();

  const arrangementArray = [];
  for (const row of arrangementRows) {
    const rowArray = [];
    for (let i = 0; i < row.length; i += 4) {
      const crateContent = row
        .substring(i, i + 4)
        .trim()
        .replace("[", "")
        .replace("]", "");
      rowArray.push(crateContent);
    }
    arrangementArray.push(rowArray);
  }

  const stacks = [];
  for (const row of arrangementArray.reverse()) {
    for (const [index, crate] of row.entries()) {
      if (!crate) continue;
      const stack = stacks[index];
      if (stack) {
        stack.push(crate);
      } else {
        stacks[index] = [crate];
      }
    }
  }

  const instructionArray = instructions
    .split("\n")
    .map((row) =>
      row
        .split(" ")
        .map((word) => Number(word))
        .filter(Boolean)
    )
    .map(([amount, from, to]) => ({ amount, from, to }));

  return [stacks, instructionArray];
};

const task1 = () => {
  const [stacks, instructions] = parseInput(text);

  for (const { amount, from, to } of instructions) {
    const stack = stacks[from - 1];
    const removed = stack.splice(stack.length - amount);
    stacks[to - 1].push(...removed.reverse());
  }

  const result = stacks.map((stack) => stack.at(-1)).join("");
  return result;
};

const task2 = () => {
  const [stacks, instructions] = parseInput(text);

  for (const { amount, from, to } of instructions) {
    const stack = stacks[from - 1];
    const removed = stack.splice(stack.length - amount);
    stacks[to - 1].push(...removed);
  }

  const result = stacks.map((stack) => stack.at(-1)).join("");
  return result;
};

console.log("Task1:", task1());
console.log("Task2:", task2());
