import { getInputFile, getTestFile, testSolution } from "../utils";

const testFile = getTestFile(__dirname);
const inputFile = getInputFile(__dirname);

type Paper = boolean[][];
type Fold = {
  line: number;
  type: "up" | "left";
};

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
    paper.map((l) => l.map((b) => (b ? "#" : ".")).join("")).join("\n")
  );
};

const countDots = (paper: Paper) => {
  let sum = 0;
  for (const dot of paper.flat()) {
    if (dot) sum++;
  }
  return sum;
};

const part1 = (input: string) => {
  const [dots, foldLines] = input.split("\n\n").map((l) => l.split("\n"));
  const folds = foldLines.map((l): Fold => {
    const line = l.split(" ").at(-1)!;
    const [dir, num] = line.split("=");
    return {
      line: Number(num),
      type: dir === "y" ? "up" : "left",
    };
  });

  let paper = createPaper(dots);
  printPaper(paper);
  console.log("");
  for (const fold of folds.slice(0, 2)) {
    const foldOperation = fold.type === "up" ? foldUp : foldLeft;
    paper = foldOperation(paper, fold.line);
    printPaper(paper);
  }

  return countDots(paper);
};

const foldUp = (paper: Paper, foldLine: number) => {
  const result: Paper = [];

  const halfWay = paper.length / 2;
  console.log("🚀 ~ foldUp ~ halfWay:", halfWay);
  console.log("🚀 ~ foldUp ~ foldLine:", foldLine);

  // Bottom of fold will become new top
  if (foldLine <= halfWay) {
    const mergeLineBottom = foldLine * 2;

    for (let y = paper.length - 1; y > foldLine; y--) {
      const row = paper[y];
      if (y > mergeLineBottom) {
        result.push(row.slice());
      } else {
        const dist = Math.abs(y - foldLine);
        const oppositeRow = paper[foldLine - dist];
        result.push(mergeHorizontalLine(row, oppositeRow));
      }
    }
  } else {
    console.log("HIT");

    const mergelineTop = foldLine - (paper.length - foldLine);
    for (let y = 0; y < foldLine; y++) {
      const row = paper[y];
      if (y < mergelineTop) {
        result.push(row.slice());
      } else {
        const dist = Math.abs(y - foldLine);
        const oppositeRow = paper[foldLine + dist - 1];
        result.push(mergeHorizontalLine(row, oppositeRow));
      }
    }
  }

  return result;
};

const foldLeft = (paper: Paper, foldLine: number): Paper => {
  const result: Paper = [];

  const halfWay = paper[0].length / 2;
  console.log("🚀 ~ foldLeft ~ halfWay:", halfWay);
  const mergeLength = Math.min(Math.abs(foldLine - paper[0].length), foldLine);
  const mergelineLeft = foldLine - mergeLength;

  for (let y = 0; y < paper.length; y++) {
    if (!result[y]?.length) result[y] = [];
    if (foldLine <= halfWay) {
      const overshoot = Math.ceil(halfWay) - foldLine - 1;
      for (let x = 0; x < foldLine; x++) {
        if (x === foldLine) continue;
        const oppositeElement = paper[y].at(-1 - x)!;
        if (x < overshoot) {
          result[y][x] = oppositeElement;
        } else {
          result[y][x] = paper[y][x] || oppositeElement;
        }
      }
    } else {
      console.log("HIT");
      for (let x = 0; x < foldLine; x++) {
        if (x === foldLine) continue;
        if (x < mergelineLeft) {
          result[y][x] = paper[y][x];
        } else {
          const oppositeElement = paper[y].at(-1 - x)!;
          result[y][x] = paper[y][x] || oppositeElement;
        }
      }
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

const part2 = (input: string) => {
  const [dots, foldLines] = input.split("\n\n").map((l) => l.split("\n"));
  const folds = foldLines.map((l): Fold => {
    const line = l.split(" ").at(-1)!;
    const [dir, num] = line.split("=");
    return {
      line: Number(num),
      type: dir === "y" ? "up" : "left",
    };
  });

  let paper = createPaper(dots);
  for (const fold of folds) {
    console.log("🚀 ~ part2 ~ fold:", fold);
    const foldOperation = fold.type === "up" ? foldUp : foldLeft;
    paper = foldOperation(paper, fold.line);
  }

  printPaper(paper);
};

// testSolution("17", part1, testFile);
// testSolution("661", part1, inputFile); // 782 too high, 635 too low

// testSolution("?", part2, testFile);
testSolution("?", part2, inputFile); // Not PYKLKOPP
