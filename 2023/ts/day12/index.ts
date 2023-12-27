import { getInputFile, getTestFile, testSolution } from "../utils";

const testFile = getTestFile(__dirname);
const inputFile = getInputFile(__dirname);

const seen: Record<string, number> = {};

const count = (str: string, nums: number[]) => {
  if (str === "") {
    if (nums.length === 0) return 1;
    return 0;
  }

  if (nums.length === 0) {
    if (str.includes("#")) return 0;
    return 1;
  }

  const key = `${str}:${nums}`;
  if (seen[key]) seen[key];
  let result = 0;

  if (".?".includes(str[0])) {
    result += count(str.slice(1), nums);
  }

  if ("#?".includes(str[0])) {
    const enoughSpringsLeft = nums[0] <= str.length;
    const allSpringsBroken = !str.slice(0, nums[0]).includes(".");
    const nextSpringOperational =
      nums[0] === str.length || str[nums[0]] !== "#";
    if (enoughSpringsLeft && allSpringsBroken && nextSpringOperational) {
      result += count(str.slice(nums[0] + 1), nums.slice(1));
    }
  }

  seen[key] = result;
  return result;
};

const part1 = (input: string) => {
  const lines = input.split("\n");

  let sum = 0;
  for (const line of lines) {
    const [str, nums] = line.split(" ");
    const numArr = nums.split(",").map(Number);
    sum += count(str, numArr);
  }

  return sum;
};

const part2 = (input: string) => {
  const lines = input.split("\n");

  let sum = 0;
  for (const line of lines) {
    const [str, nums] = line.split(" ");
    const newStr = Array(5).fill(str).join("?");
    const numArr = Array(5).fill(nums.split(",").map(Number)).flat();
    sum += count(newStr, numArr);
  }

  return sum;
};

testSolution("21", part1, testFile);
testSolution("525152", part2, testFile);

testSolution("7025", part1, inputFile);
testSolution("?", part2, inputFile);
