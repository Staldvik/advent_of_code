import { clearLine } from "readline";
import { getInputFile, getTestFile, testSolution } from "../utils";

const testFile = getTestFile(__dirname);
const inputFile = getInputFile(__dirname);

const segmentAmounts = {
  2: ["1"],
  3: ["7"],
  4: ["4"],
  5: ["2", "3", "5"],
  6: ["0", "6", "9"],
  7: ["8"],
};

const digitSegmentAmount = {
  0: 6,
  1: 2,
  2: 5,
  3: 5,
  4: 4,
  5: 5,
  6: 6,
  7: 3,
  8: 7,
  9: 6,
};

const part1 = (input: string) => {
  const lines = input.split("\n");

  const uniqueSegmentAmounts = Object.entries(segmentAmounts)
    .filter(([amount, digits]) => {
      if (digits.length > 1) return false;
      return true;
    })
    .map((e) => parseInt(e[0], 10));

  let sum = 0;
  for (const line of lines) {
    const [segments, displayed] = line.split(" | ").map((x) => x.split(" "));

    for (const segment of displayed) {
      if (uniqueSegmentAmounts.includes(segment.length)) {
        sum += 1;
      }
    }
  }

  return sum;
};

type Segment = "tl" | "t" | "tr" | "m" | "br" | "b" | "bl";

const mappings: Record<number, Segment[]> = {
  0: ["tl", "t", "tr", "br", "b", "bl"],
  1: ["tr", "br"],
  2: ["t", "tr", "m", "bl", "b"],
  3: ["t", "tr", "m", "br", "b"],
  4: ["tl", "m", "tr", "br"],
  5: ["t", "tl", "m", "br", "b"],
  6: ["t", "tl", "bl", "m", "br"],
  7: ["t", "tr", "br"],
  8: ["tl", "t", "tr", "m", "br", "b", "bl"],
  9: ["tl", "tr", "tr", "m", "br", "b"],
};

const part2 = (input: string) => {
  const lines = input.split("\n");

  const uniqueSegmentAmounts = Object.entries(segmentAmounts)
    .filter(([amount, digits]) => {
      if (digits.length > 1) return false;
      return true;
    })
    .map((e) => parseInt(e[0], 10));

  for (const line of lines.slice(0, 1)) {
    const [segments, displayed] = line.split(" | ").map((x) => x.split(" "));
    console.log("🚀 ~ part2 ~ segments:", segments);
    const ones = segments
      .find((s) => s.length === mappings[1].length)!
      .split("");
    console.log("🚀 ~ part2 ~ ones:", ones);
    const fours = segments
      .find((s) => s.length === mappings[4].length)!
      .split("");
    console.log("🚀 ~ part2 ~ fours:", fours);
    const sevens = segments
      .find((s) => s.length === mappings[7].length)!
      .split("");
    console.log("🚀 ~ part2 ~ sevens:", sevens);
    const eights = segments
      .find((s) => s.length === mappings[8].length)!
      .split("");
    console.log("🚀 ~ part2 ~ eights:", eights);

    const possibleChars: Record<Segment, string[]> = {
      tl: [],
      t: [],
      tr: [],
      m: [],
      br: [],
      b: [],
      bl: [],
    };

    const t = sevens.filter((s) => !ones.includes(s)).join("");
    if (t.length !== 1) throw new Error("Invalid t");
    console.log("🚀 ~ part2 ~ t:", t);
  }
};

testSolution("26", part1, testFile);
testSolution("473", part1, inputFile);

testSolution("?", part2, testFile);
// testSolution("?", part2, inputFile);
