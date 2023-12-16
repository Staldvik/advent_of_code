import { getInputFile, getTestFile, testSolution } from "../utils";

const testFile = getTestFile(__dirname);
const inputFile = getInputFile(__dirname);

const hash = (part: string) =>
  part.split("").reduce((acc, c) => {
    let current = acc;
    current += c.charCodeAt(0);
    current *= 17;
    current = current % 256;
    return current;
  }, 0);

const part1 = (input: string) => {
  const parts = input.split(",");

  let sum = 0;
  for (const part of parts) {
    const partSum = hash(part);
    sum += partSum;
  }

  return sum;
};

const part2 = (input: string) => {
  const parts = input.split(",");
  const map = new Map<number, Array<[string, number]>>();

  for (const part of parts) {
    const operation = part.includes("-") ? "sub" : "add";
    const label = operation === "sub" ? part.split("-")[0] : part.split("=")[0];
    const hashedLabel = hash(label);
    const box = map.get(hashedLabel);
    const focalLength = operation === "sub" ? null : part.split("=")[1];

    if (operation === "sub") {
      const indexOfLabel = box?.findIndex(([l]) => l === label);
      if (indexOfLabel === undefined || indexOfLabel === -1) continue;
      box?.splice(indexOfLabel, 1);
    }

    if (operation === "add") {
      if (!box) {
        map.set(hashedLabel, [[label, Number(focalLength)]]);
      } else {
        const indexOfLabel = box?.findIndex(([l]) => l === label);
        if (indexOfLabel !== -1) {
          box[indexOfLabel] = [label, Number(focalLength)];
        } else {
          box.push([label, Number(focalLength)]);
        }
      }
    }
  }

  let sum = 0;
  map.forEach((contents, boxNum) => {
    const boxSum = contents.reduce((acc, [label, focalLength], i) => {
      return acc + (boxNum + 1) * (i + 1) * focalLength;
    }, 0);

    sum += boxSum;
  });

  return sum;
};

testSolution("1320", part1, testFile);
testSolution("145", part2, testFile);

// console.log("Part 1:", part1(inputFile));
console.log("Part 2:", part2(inputFile));
