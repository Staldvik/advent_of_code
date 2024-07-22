import { getInputFile, getTestFile, testSolution } from "../utils";

const testFile = getTestFile(__dirname);
const inputFile = getInputFile(__dirname);

const isSmall = (node: Node) =>
  node.character.toLowerCase() === node.character &&
  !isStart(node) &&
  !isEnd(node);
const isBig = (node: Node) => !isSmall(node);
const isStart = (n: Node) => n.character === "start";
const isEnd = (n: Node) => n.character === "end";

class Node {
  constructor(public character: string, public edges: Node[]) {}
}

class Graph {
  constructor(public nodes: Node[], public start: Node, public end: Node) {}

  public static fromString(input: string): Graph {
    const nodes: Node[] = [];
    const pairs = input.split("\n").map((l) => l.split("-"));
    for (const [from, to] of pairs) {
      let fromNode = nodes.find((n) => n.character === from);
      if (!fromNode) {
        fromNode = new Node(from, []);
        nodes.push(fromNode);
      }

      let toNode = nodes.find((n) => n.character === to);
      if (!toNode) {
        toNode = new Node(to, []);
        nodes.push(toNode);
      }

      if (!fromNode.edges.includes(toNode)) fromNode.edges.push(toNode);
      if (!toNode.edges.includes(fromNode)) toNode.edges.push(fromNode);
    }

    const start = nodes.find((n) => isStart(n));
    if (!start) throw new Error("Couldn't find start");
    const end = nodes.find((n) => isEnd(n));
    if (!end) throw new Error("Couldn't find end");

    return new Graph(nodes, start, end);
  }
}

const part1 = (input: string) => {
  const graph = Graph.fromString(input);

  const paths: Node[][] = [];
  visit(paths, [], graph.start, false);
  return paths.length;
};

const part2 = (input: string) => {
  const graph = Graph.fromString(input);

  const paths: Node[][] = [];
  visit(paths, [], graph.start, true);
  return paths.length;
};

const visit = (paths: Node[][], path: Node[], curr: Node, part2: boolean) => {
  if (path.includes(curr)) {
    if (isStart(curr)) return false;
    if (isSmall(curr) && !part2) return false;
    if (isSmall(curr) && part2) {
      const someSmallHasDoubleVisit = path.some(
        (node, i) => isSmall(node) && path.indexOf(node) !== i
      );
      if (someSmallHasDoubleVisit) return false;
    }
  }

  path.push(curr);

  if (isEnd(curr)) return true;

  for (const next of curr.edges) {
    // Create copy of path so that every solution gets its own array (avoids mutating others)
    const pathCopy = path.slice();
    const validPath = visit(paths, pathCopy, next, part2);
    if (validPath) {
      paths.push(pathCopy);
    }
  }
};

testSolution("226", part1, testFile);
testSolution("3576", part1, inputFile);

testSolution("3509", part2, testFile);
testSolution("84271", part2, inputFile);
