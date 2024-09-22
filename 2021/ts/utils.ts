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

export const stringifyGrid = (arr: number[][]) =>
  arr.map((l) => l.join("")).join("\n");

export const printGrid = (arr: number[][]) => console.log(stringifyGrid(arr));

type PriorityQueueItem<T> = {
  element: T;
  priority: number;
};

export class PriorityQueue<T> {
  constructor(public items: PriorityQueueItem<T>[] = []) {}

  enqueue(element: T, priority: number) {
    this.items.push({ element, priority });
    this.items.sort((a, b) => a.priority - b.priority);
  }

  dequeue() {
    return this.items.shift();
  }

  isEmpty() {
    return this.items.length === 0;
  }

  peek() {
    return this.items[0];
  }
}

export const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);
