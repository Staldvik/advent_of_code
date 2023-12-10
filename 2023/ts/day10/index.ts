import { getInputFile, getTestFile, readFile, testSolution } from "../utils";

const testFile = getTestFile(__dirname);
const testFile2 = readFile(__dirname)("./test2.txt");
const inputFile = getInputFile(__dirname);

type Pos = {
  x: number;
  y: number;
};

const findStart = (pipes: string[][]): Pos => {
  for (let rowI = 0; rowI < pipes.length; rowI++) {
    const column = pipes[rowI];
    for (let cellI = 0; cellI < column.length; cellI++) {
      const cell = column[cellI];
      if (cell === "S") return { x: cellI, y: rowI };
    }
  }

  throw new Error(`Couldn't find start ${pipes}`);
};

const isSamePos = (a: Pos, b: Pos) => a.x === b.x && a.y === b.y;
const oppositeDir = (dir: Pos) => ({ x: -dir.x, y: -dir.y });

const dirs: Pos[] = [
  { x: 0, y: -1 },
  { x: 0, y: 1 },
  { x: 1, y: 0 },
  { x: -1, y: 0 },
];

const pipeChars = ["|", "-", "L", "J", "7", "F"];
const validNextPipe = (pipe: string, fromPipe: string, fromDir: Pos) => {
  if (!pipe || pipe === ".") return false;
  switch (pipe) {
    case "|": {
      if (fromPipe === "-") return false;
      if (fromDir.x === 1 || fromDir.x === -1) return false;
      if (["L", "J"].includes(fromPipe)) return fromDir.y === 1;
      if (["7", "F"].includes(fromPipe)) return fromDir.y === -1;
      return true;
    }
    case "-": {
      if (fromPipe === "|") return false;
      if (fromDir.y === 1 || fromDir.y === -1) return false;
      if (["7", "J"].includes(fromPipe)) return fromDir.x === 1;
      if (["F", "L"].includes(fromPipe)) return fromDir.x === -1;
      return true;
    }
    case "L": {
      if (fromDir.y === 1) return false;
      if (fromDir.x === -1) return false;
      if (fromPipe === "-") return fromDir.x === 1;
      if (fromPipe === "|") return fromDir.y === -1;
      if (fromPipe === "F") return fromDir.y === -1;
      if (fromPipe === "7") return fromDir.x === 1 || fromDir.y === -1;
      if (fromPipe === "J") return fromDir.x === 1;
      if (fromPipe === "L") return false;
      return true;
    }
    case "J": {
      if (fromDir.y === 1) return false;
      if (fromDir.x === 1) return false;
      if (fromPipe === "-") return fromDir.x === -1;
      if (fromPipe === "|") return fromDir.y === -1;
      if (fromPipe === "F") return fromDir.y === -1 || fromDir.x === -1;
      if (fromPipe === "7") return fromDir.y === -1;
      if (fromPipe === "J") return false;
      if (fromPipe === "L") return fromDir.x === -1;
      return true;
    }
    case "7": {
      if (fromDir.y === -1) return false;
      if (fromDir.x === 1) return false;
      if (fromPipe === "-") return fromDir.x === -1;
      if (fromPipe === "|") return fromDir.y === 1;
      if (fromPipe === "F") return fromDir.x === -1;
      if (fromPipe === "7") return false;
      if (fromPipe === "J") return fromDir.y === 1;
      if (fromPipe === "L") return fromDir.y === 1 || fromDir.x === -1;
      return true;
    }
    case "F": {
      if (fromDir.y === -1) return false;
      if (fromDir.x === -1) return false;
      if (fromPipe === "-") return fromDir.x === 1;
      if (fromPipe === "|") return fromDir.y === 1;
      if (fromPipe === "F") return false;
      if (fromPipe === "7") return fromDir.x === 1;
      if (fromPipe === "J") return fromDir.y === 1 || fromDir.x === 1;
      if (fromPipe === "L") return fromDir.y === 1;
      return true;
    }
    case "S":
      return true;
  }
  return false;
};

const getCharAtPos = (pipes: string[][], pos: Pos) => {
  return pipes[pos.y]?.[pos.x];
};

type Node = {
  pipe: string;
  pos: Pos;
  next: Node | null;
  prev: Node | null;
};

const getDir = ({ x, y }: Pos) => {
  if (y === -1) return "⬆️";
  if (y === 1) return "⬇️";
  if (x === 1) return "➡️";
  if (x === -1) return "⬅️";
};

const buildLinkedList = (input: string) => {
  const pipes = input.split("\n").map((line) => line.split(""));
  const start = findStart(pipes);
  const startNode: Node = { pipe: "S", pos: start, next: null, prev: null };
  let currNode: Node = startNode;
  const route: Node[] = [];
  while (true) {
    for (const dir of dirs) {
      const nextPos = {
        x: currNode.pos.x + dir.x,
        y: currNode.pos.y + dir.y,
      };
      if (currNode.prev?.pos && isSamePos(currNode.prev.pos, nextPos)) {
        continue;
      }
      const nextPipe = getCharAtPos(pipes, nextPos);

      if (validNextPipe(nextPipe, currNode.pipe, oppositeDir(dir))) {
        console.log(currNode.pipe, getDir(dir), nextPipe);

        const nextNode = {
          prev: currNode,
          next: null,
          pipe: nextPipe,
          pos: nextPos,
        };
        currNode.next = nextNode;
        currNode = nextNode;
      }
    }
    route.push(currNode);

    if (currNode.pipe === "S") break;
  }

  return startNode;
};

const part1 = (input: string) => {
  const linkedListStart = buildLinkedList(input);
  let steps = 1;
  let curr = linkedListStart.next;
  while (curr?.pipe !== "S") {
    steps += 1;
    curr = curr?.next!;
  }
  return steps / 2;
};

const part2 = (input: string) => {};

// testSolution("4", part1, testFile);
testSolution("8", part1, testFile2);

console.log("Part 1:", part1(inputFile));
// console.log("Part 2:", part2(inputFile));
