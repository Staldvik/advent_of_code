import { getInputFile, getTestFile, testSolution } from "../utils";

const testFile = getTestFile(__dirname);
const inputFile = getInputFile(__dirname);

function invert(input: string) {
  let inverted = "";
  for (let i = 0; i < input.length; i++) {
    inverted += input[i] === "1" ? "0" : "1";
  }
  return inverted;
}

const countOccurrences = (arr: string[], i: number) => {
  const occurrences = {
    "0": 0,
    "1": 0,
  };
  for (const bits of arr) {
    if (bits[i] === "1") occurrences[1]++;
    else occurrences[0]++;
  }
  return occurrences;
};

const parseInput = (input: string) => {
  const lines = input.split("\n");
  let gamma = "";
  for (let i = 0; i < lines[0].length; i++) {
    const occurrences = countOccurrences(lines, i);
    gamma += occurrences[0] > occurrences[1] ? "0" : "1";
  }
  const epsilon = invert(gamma);

  return { gamma, epsilon };
};

const part1 = (input: string) => {
  const { gamma, epsilon } = parseInput(input);
  return parseInt(gamma, 2) * parseInt(epsilon, 2);
};

const part2 = (input: string) => {
  const lines = input.split("\n");

  let oxygenGenerator = lines.slice();
  for (let i = 0; i < lines[0].length; i++) {
    const occurrences = countOccurrences(oxygenGenerator, i);
    oxygenGenerator = oxygenGenerator.filter((m) => {
      if (occurrences[0] > occurrences[1] && m[i] === "0") return true;
      if (occurrences[0] < occurrences[1] && m[i] === "1") return true;
      if (occurrences[0] === occurrences[1] && m[i] === "1") return true;
      return false;
    });
    if (oxygenGenerator.length === 1) break;
  }

  let co2Scrubber = lines.slice();
  for (let i = 0; i < lines[0].length; i++) {
    const occurrences = countOccurrences(co2Scrubber, i);
    co2Scrubber = co2Scrubber.filter((m) => {
      if (occurrences[0] < occurrences[1] && m[i] === "0") return true;
      if (occurrences[0] > occurrences[1] && m[i] === "1") return true;
      if (occurrences[0] === occurrences[1] && m[i] === "0") return true;
      return false;
    });
    if (co2Scrubber.length === 1) break;
  }

  return parseInt(oxygenGenerator[0], 2) * parseInt(co2Scrubber[0], 2);
};

testSolution("198", part1, testFile);
testSolution("4001724", part1, inputFile);

testSolution("230", part2, testFile);
testSolution("587895", part2, inputFile);
