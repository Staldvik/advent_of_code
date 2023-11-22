const text = await Deno.readTextFile(new URL("./input.txt", import.meta.url));

class Dir {
  constructor(public name: string, public children: Node[], public size = 0) {}
}
class File {
  constructor(public name: string, public size: number) {}
}
type Node = Dir | File;
const root = new Dir("/", []);

const lines = text
  .split("$ ")
  .map((line) => line.split("\n").filter(Boolean))
  .filter(Boolean);

let stack: Dir[] = [root];
for (const line of lines) {
  if (!line?.length) continue;
  const pointer = stack.at(-1)!;
  if (pointer instanceof File)
    throw new Error("Invalid state, currently pointing at a file");

  const [commands, ...rest] = line;
  const [command, arg] = commands.split(" ");
  if (command === "cd") {
    if (arg === "/") {
      stack = [root];
    } else if (arg === "..") {
      stack.pop();
    } else {
      const child = pointer.children.find((child) => child.name === arg);
      if (child instanceof File) throw new Error("cd target not a directory");
      const node = child ?? new Dir(arg, []);
      if (!child) pointer.children.push(node);
      stack.push(node);
    }
  } else if (command === "ls") {
    for (const item of rest) {
      const [typeOrSize, name] = item.split(" ");
      if (pointer.children.some((child) => child.name === name)) continue;
      const node =
        typeOrSize === "dir"
          ? new Dir(name, [])
          : new File(name, Number(typeOrSize));
      pointer.children.push(node);
    }
  }
}

const getSize = (node: Node) => {
  if (node instanceof Dir) {
    let childrenSize = 0;
    for (const child of node.children) {
      childrenSize += getSize(child);
    }
    node.size += childrenSize;
    return childrenSize;
  }
  return node.size;
};
getSize(root);

const task1 = () => {
  const MAX_SIZE = 100000;
  let sum = 0;
  const traverse = (node: Node) => {
    if (node instanceof Dir) {
      if (node.size < MAX_SIZE) sum += node.size;
      node.children.forEach((child) => traverse(child));
    }
  };
  traverse(root);
  return sum;
};

const task2 = () => {
  const TOTAL_SIZE = 70000000;
  const REQUIRED_SIZE = 30000000;
  const currentAvailable = TOTAL_SIZE - root.size;
  const deleteSize = REQUIRED_SIZE - currentAvailable;

  let smallest = Infinity;
  const traverse = (node: Node) => {
    if (node instanceof Dir) {
      if (node.size > deleteSize && node.size < smallest) smallest = node.size;
      node.children.forEach((child) => traverse(child));
    } else {
      return node.size;
    }
  };
  traverse(root);
  return smallest;
};

console.log("Task1:", task1());
console.log("Task1:", task2());
