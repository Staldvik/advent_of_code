import { readFileSync } from "fs";
import path from "path";

const readFile = (dirname: string) => (fileName: string) =>
  readFileSync(path.join(dirname, fileName), "utf-8");

export const getTestFile = (dirname: string) => readFile(dirname)("./test.txt");

export const getInputFile = (dirname: string) =>
  readFile(dirname)("./input.txt");

export const testSolution = (
  answer: string,
  solutionFn: Function,
  input: string
) => {
  const result = solutionFn(input);
  if (result != answer) {
    console.error(`Expected ${answer}, got ${result}`);
  } else {
    console.log("Success! Expected and got", result);
  }
};
