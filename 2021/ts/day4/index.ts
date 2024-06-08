import { getInputFile, getTestFile, testSolution } from "../utils";

const testFile = getTestFile(__dirname);
const inputFile = getInputFile(__dirname);

const checkHorizontal = (y: number, marked: boolean[][]): boolean =>
  marked[y].every((n) => n);

const checkVertical = (x: number, marked: boolean[][]): boolean =>
  marked.every((r) => r[x]);

const testBoard = (board: string, numbers: string[]) => {
  const boardAsArray = board
    .split("\n")
    .map((b) => b.split(" ").filter(Boolean));

  const marked: boolean[][] = [];
  for (let i = 0; i < boardAsArray.length; i++) {
    marked.push(new Array(boardAsArray[0].length).fill(false));
  }

  let i = 0;
  for (const num of numbers) {
    i++;
    let x: number;
    const y = boardAsArray.findIndex((row) => {
      x = row.findIndex((r) => r === num);
      return x !== -1;
    });

    if (y !== -1) {
      marked[y][x!] = true;

      const winH = checkHorizontal(y, marked);
      if (winH) return { tries: i, boardAsArray, marked };

      const winV = checkVertical(x!, marked);
      if (winV) return { tries: i, boardAsArray, marked };
    }
  }

  throw new Error(`Board failed ${board}`);
};

const sumBoard = (board: string[][], matches: boolean[][]) => {
  let sum = 0;
  board.forEach((row, y) => {
    row.forEach((num, x) => {
      if (matches[y][x]) return;
      sum += parseInt(num, 10);
    });
  });
  return sum;
};

const part1 = (input: string) => {
  const [numbers, ...boards] = input.split("\n\n");
  const numberArray = numbers.split(",");
  let minWin: ReturnType<typeof testBoard> | undefined = undefined;
  for (const board of boards) {
    const win = testBoard(board, numberArray);
    if (!minWin || minWin.tries > win.tries) minWin = win;
  }
  return (
    sumBoard(minWin!.boardAsArray, minWin!.marked) *
    parseInt(numberArray[minWin!.tries - 1], 10)
  );
};

const part2 = (input: string) => {
  const [numbers, ...boards] = input.split("\n\n");
  const numberArray = numbers.split(",");
  let maxWin: ReturnType<typeof testBoard> | undefined = undefined;
  for (const board of boards) {
    const win = testBoard(board, numberArray);
    if (!maxWin || maxWin.tries < win.tries) maxWin = win;
  }
  return (
    sumBoard(maxWin!.boardAsArray, maxWin!.marked) *
    parseInt(numberArray[maxWin!.tries - 1], 10)
  );
};

testSolution("4512", part1, testFile);
testSolution("4001724", part1, inputFile);

testSolution("1924", part2, testFile);
testSolution("587895", part2, inputFile);
