import { readFileSync } from "fs";
import path from "path";

export const readFile = (dirname: string) => (fileName: string) =>
  readFileSync(path.join(dirname, fileName), "utf-8");

export const getTestFile = (dirname: string) => readFile(dirname)("./test.txt");

export const getInputFile = (dirname: string) =>
  readFile(dirname)("./input.txt");

export const testSolution = (
  answer: string,
  solutionFn: (input: string) => unknown,
  input: string
) => {
  const result = solutionFn(input);
  if (result != answer) {
    console.error(`Expected ${answer}, got ${result}`);
  } else {
    console.log("Test Success! Expected and got", result);
  }
};

const GCD = (a: number, b: number): number => {
  while (b !== 0) {
    let t = b;
    b = a % b;
    a = t;
  }
  return a;
};

const LCM = (a: number, b: number): number => {
  return (a * b) / GCD(a, b);
};

export const findLCM = (numbers: number[]): number => {
  return numbers.reduce((a, b) => LCM(a, b));
};
