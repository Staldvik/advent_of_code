import fs from "fs";

const text = fs.readFileSync(new URL("./input.txt", import.meta.url), "utf8");

const buildGraph = (text) => {
  const root = {
    name: "root",
    children: [],
  };
  const graph = { root };
  const lines = text
    .split("$ ")
    .map((line) => line.split("\n").filter(Boolean))
    .filter(Boolean);

  let stack = [];
  lines.forEach((line) => {
    if (!line.length) return;
    let pointer = stack.at(-1);
    const [commandArr, ...rest] = line;
    const [command, arg] = commandArr.split(" ");
    if (command === "cd") {
      if (arg === "/") {
        stack = [root];
      } else if (arg === "..") {
        stack.pop();
      } else {
        let node = pointer.children.find((item) => item.name === arg);
        if (!node) {
          node = {
            name: arg,
            children: [],
          };
          pointer.children.push(node);
        }
        stack.push(node);
      }
    } else if (command === "ls") {
      rest.forEach((item) => {
        const [typeOrSize, name] = item.split(" ");
        const node = {
          name,
          children: typeOrSize === "dir" ? [] : undefined,
          size: typeOrSize === "dir" ? undefined : Number(typeOrSize),
        };
        pointer.children.push(node);
      });
    }
  });
  return graph;
};

const task1 = () => {
  const MAX_SIZE = 100000;
  const graph = buildGraph(text);
  let sum = 0;
  const dfs = (node) => {
    if (node.children) {
      let childrenSize = 0;
      node.children.forEach((child) => {
        childrenSize += dfs(child);
      });
      if (childrenSize <= MAX_SIZE) sum += childrenSize;
      return childrenSize;
    }
    if (node.size) return node.size;
  };
  dfs(graph.root);
  return sum;
};

const task2 = () => {
  const TOTAL_SIZE = 70000000;
  const REQUIRED_SIZE = 30000000;
  const graph = buildGraph(text);

  const dfs = (node) => {
    if (node.children) {
      let childrenSize = 0;
      node.children.forEach((child) => {
        childrenSize += dfs(child);
      });
      node.childrenSize = childrenSize;
      return childrenSize;
    }
    if (node.size) return node.size;
  };
  dfs(graph.root);

  const currentAvailable = TOTAL_SIZE - graph.root.childrenSize;
  const deleteSize = REQUIRED_SIZE - currentAvailable;

  let smallest = graph.root;
  const stack = [];
  const visited = new Map();
  stack.push(graph.root);
  visited.set(graph.root, true);
  while (stack.length) {
    const current = stack.pop();
    if (current.children) {
      current.children.forEach((child) => {
        if (!visited.has(child)) {
          visited.set(child, true);
          stack.push(child);
          if (
            child.childrenSize >= deleteSize &&
            child.childrenSize < (smallest.childrenSize || Infinity)
          )
            smallest = child;
        }
      });
    }
  }
  return smallest.childrenSize;
};

console.log("Task1    :", task1());
console.log("Task2    :", task2());
