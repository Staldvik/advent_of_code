import { clearLine } from "readline";
import { getInputFile, getTestFile, testSolution } from "../utils";

const testFile = getTestFile(__dirname);
const inputFile = getInputFile(__dirname);

type Insertion = {
  pair: string;
  result: string;
};

const part1 = (input: string) => {
  const [template, insertionsString] = input.split("\n\n");
  console.log("🚀 ~ part1 ~ template:", template);
  const insertions: Insertion[] = insertionsString.split("\n").map((l) => {
    const [pair, result] = l.split(" -> ");
    return {
      pair,
      result,
    };
  });

  let previous = template;
  for (let i = 0; i < 10; i++) {
    let result = "";
    for (let x = 1; x < previous.length; x++) {
      const pair = previous[x - 1] + previous[x];
      const match = insertions.find((i) => i.pair === pair);
      if (match) {
        result += `${pair[0]}${match.result}`;
      }
    }
    result += previous.at(-1);
    previous = result;
  }

  const counts = previous.split("").reduce((acc, curr) => {
    if (!acc[curr]) acc[curr] = 0;
    acc[curr] += 1;
    return acc;
  }, {} as Record<string, number>);

  const countValues = Object.values(counts);

  return Math.max(...countValues) - Math.min(...countValues);
};

const part2 = (input: string) => {};

testSolution("1588", part1, testFile);
testSolution("3095", part1, inputFile);

// testSolution("?", part2, testFile);
// testSolution("?", part2, inputFile);
