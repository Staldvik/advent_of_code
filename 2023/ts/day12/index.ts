import { getInputFile, getTestFile, testSolution } from "../utils";

const testFile = getTestFile(__dirname);
const inputFile = getInputFile(__dirname);

function generateCombinations(
  str: string,
  n: number,
  result: string[] = [],
  combinations: string[][] = []
): string[][] {
  if (n === 1) {
    result.push(str);
    combinations.push([...result]);
    result.pop();
  } else {
    for (let i = 1; i < str.length; i++) {
      result.push(str.substring(0, i));
      generateCombinations(str.substring(i), n - 1, result, combinations);
      result.pop();
    }
  }
  return combinations;
}

function generateCombinations2(str: string): string[] {
  const combinations = [];
  if (str.includes("?")) {
    const index = str.indexOf("?");
    const replacedWithDot = str.slice(0, index) + "." + str.slice(index + 1);
    const replacedWithHash = str.slice(0, index) + "#" + str.slice(index + 1);
    combinations.push(
      ...generateCombinations2(replacedWithDot),
      ...generateCombinations2(replacedWithHash)
    );
  } else {
    combinations.push(str);
  }
  return combinations;
}

function filterCombinations(
  combinations: string[],
  counts: number[]
): string[] {
  return combinations.flatMap((combination) => {
    console.log(
      "🚀 ~ file: index.ts:56 ~ returncombinations.filter ~ combination:",
      combination
    );

    const hashGroups = combination
      .split(".")
      .filter((part) => part.includes("#"));

    if (!hashGroups.length) return [];
    if (hashGroups.every((group, index) => group.length === counts[index]))
      return [combination];
  });
}

const part1 = (input: string) => {
  const lines = input.split("\n");

  let sum = 0;
  for (const line of lines.slice(0, 1)) {
    console.log("🚀 ~ file: index.ts:63 ~ part1 ~ line:", line);
    const [springLine, recordLine] = line.split(" ");

    const springBlocks = springLine.split(".").filter(Boolean);
    const brokenBlocks = recordLine.split(",").map(Number);

    const result = generateCombinations(
      springBlocks.join(""),
      brokenBlocks.length
    )
      .filter((c) => {
        for (let i = 0; i < brokenBlocks.length; i++) {
          const blockLength = brokenBlocks[i];
          if (c[i].length < blockLength) return false;
        }
        return true;
      })
      .map((c) => {
        const allCombinations = c.map((c1) => generateCombinations2(c1));
        const validCombinations = allCombinations.map((combinations, index) => {
          return filterCombinations(combinations, [brokenBlocks[index]]);
        });

        return validCombinations;
      });
    console.log("🚀 ~ file: index.ts:88 ~ part1 ~ result:", result);

    sum += 1;
  }

  return sum;
};

testSolution("21", part1, testFile);
// testSolution("21", part2, testFile);

// console.log("Part 1:", solve(1)(inputFile));
// console.log("Part 2:", solve(1_000_000)(inputFile));
