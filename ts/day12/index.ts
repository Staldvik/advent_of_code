const text = await Deno.readTextFile(new URL("./input.txt", import.meta.url));
const ex = await Deno.readTextFile(new URL("./ex.txt", import.meta.url));

const lowerCaseAlphabet = "abcdefghijklmnopqrstuvwxyz";
const getElevation = (char: string) => {
  const indexOf = lowerCaseAlphabet.indexOf(char);
  if (indexOf === -1) throw new Error(`NOT FOUND: ${char}`);
  return indexOf;
};

const parseInput = (input: string) => {
  let startPos = { x: 0, y: 0 };
  let goalPos = { x: 0, y: 0 };
  const map = input.split("\n").map((line, i) => {
    if (line.indexOf("S") !== -1) {
      startPos = { x: line.indexOf("S"), y: i };
      line = line.replace("S", "a");
    }
    if (line.indexOf("E") !== -1) {
      goalPos = { x: line.indexOf("E"), y: i };
      line = line.replace("E", "z");
    }
    return line.split("");
  });
  return { map, startPos, goalPos };
};

class Graph {
  nodes: Node[] = [];
  constructor() {}
  addNode(node: Node) {
    this.nodes.push(node);
  }
}

class Node {
  id: string;
  children: Node[] = [];
  distanceToGoal = Infinity;
  constructor(public char: string, public x: number, public y: number) {
    this.id = `${y},${x}`;
  }
}

const createGraph = (input: string) => {
  const { map, startPos, goalPos } = parseInput(input);
  const graph = new Graph();

  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[0].length; x++) {
      const node = new Node(map[y][x], x, y);
      graph.addNode(node);
    }
  }

  const goalNode = graph.nodes.find(
    (node) => node.y === goalPos.y && node.x === goalPos.x
  )!;
  const startNode = graph.nodes.find(
    (node) => node.y === startPos.y && node.x === startPos.x
  )!;

  const traverseFromGoal = () => {
    goalNode.distanceToGoal = 0;
    const queue = [goalNode];
    while (queue.length) {
      const node = queue.shift()!;
      const { y, x } = node;
      const neighbours = [
        { x, y: y - 1 },
        { x, y: y + 1 },
        { x: x - 1, y },
        { x: x + 1, y },
      ].filter((move) => {
        if (move.x < 0 || move.y < 0) return false;
        if (move.x >= map[0].length || move.y >= map.length) return false;
        const elevationChange =
          getElevation(map[y][x]) - getElevation(map[move.y][move.x]);
        return elevationChange <= 1;
      });

      for (const neighbour of neighbours) {
        const neighbourNode = graph.nodes.find(
          (node) => node.id === `${neighbour.y},${neighbour.x}`
        )!;

        if (neighbourNode.distanceToGoal > node.distanceToGoal + 1) {
          neighbourNode.distanceToGoal = node.distanceToGoal + 1;
          queue.push(neighbourNode);
        }
      }
    }
  };

  traverseFromGoal();

  return { graph, startNode, goalNode };
};

const task1 = (input: string) => {
  const { startNode } = createGraph(input);
  return startNode.distanceToGoal;
};

const task2 = (input: string) => {
  const { graph } = createGraph(input);
  const aNodes = graph.nodes
    .filter((node) => node.char === "a")
    .map((n) => n.distanceToGoal);

  return Math.min(...aNodes);
};

console.log("Ex1: ", task1(ex));
console.log("Task1: ", task1(text));

console.log("Ex2: ", task2(ex));
console.log("Task2: ", task2(text));
