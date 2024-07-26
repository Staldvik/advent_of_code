import { getInputFile, getTestFile, testSolution } from "../utils";

const testFile = getTestFile(__dirname);
const inputFile = getInputFile(__dirname);

type Paper = boolean[][];
type Fold = (paper: Paper) => Paper;

const createPaper = (dots: string[]): Paper => {
  let maxX = 0;
  let maxY = 0;

  for (const dot of dots) {
    const [x, y] = dot.split(",").map((char) => parseInt(char, 10));
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  }

  const paper: Paper = [];
  for (let y = 0; y < maxY + 1; y++) {
    paper.push(new Array(maxX + 1).fill(false));
  }

  for (const dot of dots) {
    const [x, y] = dot.split(",").map((char) => parseInt(char, 10));
    paper[y][x] = true;
  }

  return paper;
};

const printPaper = (paper: Paper) => {
  console.log(
    paper.map((l) => l.map((b) => (b ? "#" : " ")).join("")).join("\n")
  );
};

const countDots = (paper: Paper) => {
  let sum = 0;
  for (const dot of paper.flat()) {
    if (dot) sum++;
  }
  return sum;
};

const createFolds = (foldLines: string[]) => {
  return foldLines.map((l): Fold => {
    const line = l.split(" ").at(-1)!;
    const [dir, num] = line.split("=");
    if (dir === "y") return (paper: Paper) => foldUp(paper, Number(num));
    if (dir === "x") return (paper: Paper) => foldLeft(paper, Number(num));
    throw new Error(`Unknown dir: ${dir}`);
  });
};

const foldUp = (paper: Paper, foldLine: number) => {
  const result: Paper = [];
  const line = Math.floor(Math.abs(paper.length / 2 - foldLine));
  console.log("🚀 ~ foldUp ~ line:", line);

  for (let y = 0; y < foldLine; y++) {
    if (y < line) {
      result.push(paper[y].slice());
    } else {
      result.push(mergeHorizontalLine(paper[y], paper[paper.length - 1 - y]));
    }
  }

  return result;
};

const foldLeft = (paper: Paper, foldLine: number): Paper => {
  const result: Paper = [];

  for (let y = 0; y < paper.length; y++) {
    if (!result[y]) result[y] = [];
    for (let x = 0; x < foldLine; x++) {
      const oppositeElement = paper[y][paper[y].length - 1 - x];
      if (oppositeElement === undefined) {
        throw new Error(`Couldn't find opposite element to ${x},${y}`);
      }
      result[y][x] = paper[y][x] || oppositeElement;
    }
  }

  return result;
};

const mergeHorizontalLine = (a: boolean[], b: boolean[]) => {
  const result: boolean[] = [];
  for (let x = 0; x < a.length; x++) {
    result.push(a[x] || b[x]);
  }
  return result;
};

const part1 = (input: string) => {
  const [dots, foldLines] = input.split("\n\n").map((l) => l.split("\n"));
  const folds = createFolds(foldLines);

  let paper = createPaper(dots);
  for (const fold of folds.slice(0, 1)) {
    paper = fold(paper);
  }

  return countDots(paper);
};

const part2 = (input: string) => {
  const [dots, foldLines] = input.split("\n\n").map((l) => l.split("\n"));
  const folds = createFolds(foldLines);

  let paper = createPaper(dots);
  for (const fold of folds) {
    paper = fold(paper);
  }

  printPaper(paper);
  return "See above";
};

testSolution("17", part1, testFile);
testSolution("661", part1, inputFile); // 782 too high, 635 too low

testSolution("?", part2, testFile);
testSolution("?", part2, inputFile); // Not PYKLKOPP, Not PKKEKBER, Not RKKEKBER
