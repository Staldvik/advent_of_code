import { getInputFile, getTestFile, testSolution } from "../utils";

const testFile = getTestFile(__dirname);
const inputFile = getInputFile(__dirname);

/** [x, y] */
type Dot = [number, number];
type Paper = { dots: Array<Dot>; width: number; height: number };
type Fold = (paper: Paper) => Paper;

const createPaper = (dots: string[]): Paper => {
  const paper: Paper = { dots: [], width: -Infinity, height: -Infinity };

  for (const dot of dots) {
    const [x, y] = dot.split(",").map((char) => parseInt(char, 10));
    paper.dots.push([x, y]);
    paper.height = Math.max(paper.height, y);
    paper.width = Math.max(paper.width, x);
  }

  return paper;
};

const hasDot = (paper: Paper, pos: [number, number]): boolean =>
  paper.dots.some((dot) => dot[0] === pos[0] && dot[1] === pos[1]);

const printPaper = (paper: Paper) => {
  let result = "";
  for (let y = 0; y < paper.height; y++) {
    let line = "";
    for (let x = 0; x < paper.width; x++) {
      line += hasDot(paper, [x, y]) ? "#" : ".";
    }
    result += "\n" + line;
  }
  console.log(result);
};

const countDots = (paper: Paper) => {
  return paper.dots.length;
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

const splitHorizontal = (paper: Paper, foldLine: number) => {
  return paper.dots.reduce<{ above: Dot[]; below: Dot[] }>(
    (acc, curr) => {
      if (curr[1] < foldLine) acc.above.push(curr);
      else if (curr[1] > foldLine) acc.below.push(curr);
      else throw new Error("Trying to fold on a dot?");
      return acc;
    },
    { above: [], below: [] }
  );
};

const splitVertical = (paper: Paper, foldLine: number) => {
  return paper.dots.reduce<{ left: Dot[]; right: Dot[] }>(
    (acc, curr) => {
      if (curr[0] < foldLine) acc.left.push(curr);
      else if (curr[0] > foldLine) acc.right.push(curr);
      else throw new Error("Trying to fold on a dot?");
      return acc;
    },
    { left: [], right: [] }
  );
};

const foldUp = (paper: Paper, foldLine: number): Paper => {
  const { below } = splitHorizontal(paper, foldLine);

  below.forEach((dot) => {
    const dist = dot[1] - foldLine;
    dot[1] = foldLine - dist;
  });

  // Filter out duplicates
  paper.dots = paper.dots.filter((dot, i) => {
    const firstIndexOfDot = paper.dots.findIndex(
      (d) => d[0] === dot[0] && d[1] === dot[1]
    );
    return i === firstIndexOfDot;
  });

  paper.height -= Math.min(paper.height - foldLine, foldLine);

  return paper;
};

const foldLeft = (paper: Paper, foldLine: number): Paper => {
  const { right } = splitVertical(paper, foldLine);

  right.forEach((dot) => {
    const dist = dot[0] - foldLine;
    dot[0] = foldLine - dist;
  });

  // Filter out duplicates
  paper.dots = paper.dots.filter((dot, i) => {
    const firstIndexOfDot = paper.dots.findIndex(
      (d) => d[0] === dot[0] && d[1] === dot[1]
    );
    return i === firstIndexOfDot;
  });

  paper.width -= Math.min(paper.width - foldLine, foldLine);

  return paper;
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
testSolution("661", part1, inputFile);

testSolution("?", part2, testFile);
testSolution("?", part2, inputFile);
