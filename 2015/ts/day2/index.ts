import { getInputFile, getTestFile, testSolution } from "../utils";
import * as R from "remeda";

const testFile = getTestFile(__dirname);
const inputFile = getInputFile(__dirname);

const calculatePaperRequirement = (dimensions: string) => {
  const [l, w, h] = dimensions.split("x").map((n) => +n);

  const areas = [l * w, w * h, h * l];
  const smallest = Math.min(...areas);

  const summed = areas.reduce((acc, curr) => 2 * curr + acc, 0);
  return summed + smallest;
};

const calculateRibbonRequirement = (dimensions: string) => {
  const [l, w, h] = dimensions.split("x").map((n) => +n);

  const faces = [l, w, h].toSorted((a, b) => a - b);
  const bow = l * w * h;

  const summed = faces.slice(0, 2).reduce((acc, curr) => 2 * curr + acc, 0);
  return summed + bow;
};

const part1 = (input: string) => {
  const lines = input.split("\n");

  return R.sumBy(lines, calculatePaperRequirement);
};

const part2 = (input: string) => {
  const lines = input.split("\n");

  return R.sumBy(lines, calculateRibbonRequirement);
};

testSolution("58", part1, testFile);
testSolution("34", part2, testFile);

console.log("Part 1:", part1(inputFile));
console.log("Part 2:", part2(inputFile));
