import { getInputFile, getTestFile, readFile, testSolution } from "../utils";

const testFile = getTestFile(__dirname);
const testFile2 = readFile(__dirname)("test2.txt");
console.log("🚀 ~ file: index.ts:5 ~ testFile2:", testFile2);
const inputFile = getInputFile(__dirname);

type Pulse = "high" | "low";

class Counter {
  constructor(public low: number, public high: number) {}
  public count(pulse: Pulse) {
    if (pulse === "low") {
      this.low++;
    }
    if (pulse === "high") {
      this.high++;
    }
  }
}

type PulseEvent = {
  pulse: Pulse;
  sender: Node;
  target: Node;
};

class Orchestrator {
  queue: PulseEvent[] = [];
  public tick(): PulseEvent | undefined {
    return this.queue.shift();
  }
  public queuePulse(event: PulseEvent) {
    this.queue.push(event);
  }
}

const counter = new Counter(0, 0);
const orchestrator = new Orchestrator();

class Node {
  constructor(public name: string) {}
  public listeners: Node[] = [];
  public addListener(node: Node) {
    this.listeners.push(node);
  }
  public receive(pulse: Pulse, sender: Node) {}
  public send(pulse: Pulse) {
    for (const listener of this.listeners) {
      orchestrator.queuePulse({ pulse, sender: this, target: listener });
    }
  }
}

class FlipFlop extends Node {
  state = false;

  public receive(pulse: Pulse, sender: Node) {
    if (pulse === "low") {
      this.state = !this.state;
      super.send(this.state ? "high" : "low");
    }
  }

  toString() {
    return this.state ? "1" : "0";
  }
}

class Conjunction extends Node {
  private inputValues = new Map<Node, Pulse>();

  public addInput(input: Node) {
    this.inputValues.set(input, "low");
  }

  public receive(pulse: Pulse, sender: Node) {
    this.inputValues.set(sender, pulse);
    if (
      Array.from(this.inputValues.values()).every((value) => value === "high")
    ) {
      super.send("low");
    } else {
      super.send("high");
    }
  }

  toString() {
    return Array.from(this.inputValues.values()).join("");
  }
}

class Broadcaster extends Node {
  public receive(pulse: Pulse, sender: Node) {
    super.send(pulse);
  }
}

const parse = (name: string) => {
  console.log("🚀 ~ file: index.ts:100 ~ parse ~ name:", name);
  if (name === "broadcaster") {
    return new Broadcaster(name);
  }

  if (name === "output") {
    return new Node(name);
  }

  const type = name[0];
  if (type === "%") {
    return new FlipFlop(name.slice(1));
  }
  if (type === "&") {
    return new Conjunction(name.slice(1));
  }

  throw new Error(`Unknown node type ${name}`);
};

const getNodeStates = (nodes: Node[]) => {
  let result = "";
  for (const node of nodes) {
    if (node instanceof Conjunction) {
      result += node.toString();
    }

    if (node instanceof FlipFlop) {
      result += node.toString();
    }
  }
  return result;
};

const part1 = (input: string) => {
  const lines = input.split("\n");
  const nodes = new Map<string, Node>();

  for (const line of lines) {
    let [name, listeners] = line.split(" -> ");
    const node = parse(name);
    name =
      name === "broadcaster"
        ? "broadcaster"
        : name === "output"
        ? "output"
        : name.slice(1);
    nodes.set(name, node);
  }

  for (const line of lines) {
    let [name, listeners] = line.split(" -> ");
    name =
      name === "broadcaster"
        ? "broadcaster"
        : name === "output"
        ? "output"
        : name.slice(1);
    const node = nodes.get(name)!;
    const listenerNames = listeners.split(", ");
    for (const listenerName of listenerNames) {
      const listener = nodes.get(listenerName) ?? parse(listenerName);
      if (listener instanceof Conjunction) {
        listener.addInput(node);
      }
      node.addListener(listener);
    }
  }

  const broadcaster = nodes.get("broadcaster")!;

  let buttonHits = 0;

  const hitButton = () => {
    console.log("Hit button");
    buttonHits++;
    counter.count("low");
    broadcaster.receive("low", { name: "button" } as any);
  };

  const nodeStates = new Set<string>();
  while (buttonHits < 100) {
    hitButton();

    const prev = getNodeStates(Array.from(nodes.values()));

    while (true) {
      const event = orchestrator.tick();
      if (!event) break;
      counter.count(event.pulse);
      event.target.receive(event.pulse, event.sender);
    }

    const nodeState = getNodeStates(Array.from(nodes.values()));
    if (nodeStates.has(nodeState) || prev === nodeState) break;
    nodeStates.add(nodeState);
  }

  const actualHits = buttonHits * (1000 / buttonHits);
  return counter.low * actualHits * counter.high * actualHits;
};

const part2 = (input: string) => {};

testSolution("32000000", part1, testFile);
testSolution("11687500", part1, testFile2);
// testSolution("167409079868000", part2, testFile);

// console.log("Part 1:", part1(inputFile));
// console.log("Part 2:", part2(inputFile));
