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

const part2 = (input: string) => {
  const [template, insertionsString] = input.split("\n\n");

  const insertions: Insertion[] = insertionsString.split("\n").map((l) => {
    const [pair, result] = l.split(" -> ");
    return {
      pair,
      result,
    };
  });

  const letterCount: Record<string, number> = {};
  for (const letter of template) {
    if (!letterCount[letter]) letterCount[letter] = 0;
    letterCount[letter] += 1;
  }

  let pairs: Record<string, number> = {};
  for (let i = 1; i < template.length; i++) {
    const pair = template[i - 1] + template[i];
    if (!pairs[pair]) pairs[pair] = 0;
    pairs[pair] += 1;
  }

  for (let step = 0; step < 40; step++) {
    const currentPairs: typeof pairs = {};

    Object.entries(pairs).forEach(([pair, count]) => {
      const match = insertions.find((i) => i.pair === pair);
      if (match) {
        const newPair1 = `${pair[0]}${match.result}`;
        const newPair2 = `${match.result}${pair[1]}`;
        if (!currentPairs[newPair1]) currentPairs[newPair1] = 0;
        if (!currentPairs[newPair2]) currentPairs[newPair2] = 0;
        if (!letterCount[match.result]) letterCount[match.result] = 0;
        currentPairs[newPair1] += count;
        currentPairs[newPair2] += count;
        letterCount[match.result] += count;
      }
    });

    pairs = currentPairs;
  }

  return (
    Math.max(...Object.values(letterCount)) -
    Math.min(...Object.values(letterCount))
  );
};

testSolution("1588", part1, testFile);
testSolution("3095", part1, inputFile);

testSolution("2188189693529", part2, testFile);
testSolution("?", part2, inputFile);
