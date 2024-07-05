import { getInputFile, getTestFile, testSolution } from "../utils";

const testFile = getTestFile(__dirname);
const inputFile = getInputFile(__dirname);

type Chunk = {
  start: number;
  end?: number;
  character: string;
};

const pairs: Record<string, string> = {
  "{": "}",
  "<": ">",
  "(": ")",
  "[": "]",
};

const points: Record<string, number> = {
  ")": 3,
  "]": 57,
  "}": 1197,
  ">": 25137,
};

const openingElements = Object.keys(pairs);

const part1 = (input: string) => {
  const lines = input.split("\n");
  const faults: { expected: string; got: string }[] = [];

  lineLoop: for (const line of lines) {
    const chunkStack: Chunk[] = [];
    for (let i = 0; i < line.length; i++) {
      const currentElement = line[i];
      if (openingElements.includes(currentElement)) {
        chunkStack.push({
          character: currentElement,
          start: i,
        });
      } else {
        const lastOpener = chunkStack.at(-1)!;
        const correspondingClose = pairs[lastOpener.character];
        if (currentElement !== correspondingClose) {
          faults.push({ expected: correspondingClose, got: currentElement });
          continue lineLoop;
        } else {
          chunkStack.pop();
        }
      }
    }
  }

  return faults.reduce((acc, curr) => acc + points[curr.got], 0);
};

const autocompletePoints: Record<string, number> = {
  ")": 1,
  "]": 2,
  "}": 3,
  ">": 4,
};

const part2 = (input: string) => {
  const lines = input.split("\n");
  const remainders: Chunk[][] = [];

  lineLoop: for (const line of lines) {
    const chunkStack: Chunk[] = [];
    for (let i = 0; i < line.length; i++) {
      const currentElement = line[i];
      if (openingElements.includes(currentElement)) {
        chunkStack.push({
          character: currentElement,
          start: i,
        });
      } else {
        const lastOpener = chunkStack.at(-1)!;
        const correspondingClose = pairs[lastOpener.character];
        if (currentElement !== correspondingClose) {
          continue lineLoop;
        } else {
          chunkStack.pop();
        }
      }
    }
    if (chunkStack.length) remainders.push(chunkStack);
  }

  const results: number[] = remainders.map((remainder) => {
    const chars = remainder.reverse().map((chunk) => pairs[chunk.character]);
    const result = chars.reduce((acc, curr) => {
      return acc * 5 + autocompletePoints[curr];
    }, 0);
    return result;
  });

  const sorted = results.sort((a, b) => b - a);
  return sorted[Math.floor(results.length / 2)];
};

testSolution("26397", part1, testFile);
testSolution("341823", part1, inputFile);

testSolution("288957", part2, testFile);
testSolution("2801302861", part2, inputFile);
