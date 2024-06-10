import { clearLine } from "readline";
import { getInputFile, getTestFile, testSolution } from "../utils";

const testFile = getTestFile(__dirname);
const inputFile = getInputFile(__dirname);

const part1 = (input: string) => {
  const crabs = input.split(",").map((n) => parseInt(n, 10));
  const minPosition = Math.min(...crabs);
  const maxPosition = Math.max(...crabs);

  let minFuel = Infinity;
  for (let i = minPosition; i < maxPosition; i++) {
    const totalFuel = crabs.reduce((acc, curr) => acc + Math.abs(curr - i), 0);
    minFuel = Math.min(minFuel, totalFuel);
  }

  return minFuel;
};

const part2 = (input: string) => {
  const crabs = input.split(",").map((n) => parseInt(n, 10));
  const minPosition = Math.min(...crabs);
  const maxPosition = Math.max(...crabs);

  let minFuel = Infinity;
  for (let i = minPosition; i < maxPosition; i++) {
    const totalFuel = crabs.reduce((acc, curr) => {
      const distance = Math.abs(curr - i);
      return acc + (distance * (distance + 1)) / 2;
    }, 0);
    minFuel = Math.min(minFuel, totalFuel);
  }

  return minFuel;
};

testSolution("5", part1, testFile);
testSolution("348664", part1, inputFile);

testSolution("168", part2, testFile);
testSolution("100220525", part2, inputFile);
