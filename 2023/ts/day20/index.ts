import { getInputFile, getTestFile, readFile, testSolution } from "../utils";

const testFile = getTestFile(__dirname);
const testFile2 = readFile(__dirname)("test2.txt");
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

let counter = new Counter(0, 0);
let orchestrator = new Orchestrator();

class Node {
  constructor(public name: string, public listeners: Node[] = []) {}
  public addListener(node: Node) {
    this.listeners.push(node);
  }
  public receive(pulse: Pulse, sender?: Node) {}
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
}

class Conjunction extends Node {
  private inputValues = new Map<Node, Pulse>();

  public addInput(input: Node) {
    this.inputValues.set(input, "low");
  }

  public receive(pulse: Pulse, sender: Node) {
    this.inputValues.set(sender, pulse);
    this.everyInputIsHigh() ? super.send("low") : super.send("high");
  }

  private everyInputIsHigh() {
    let allHigh = true;
    this.inputValues.forEach((value) => {
      if (value === "low") allHigh = false;
    });
    return allHigh;
  }
}

class Broadcaster extends Node {
  public receive(pulse: Pulse, sender: Node) {
    super.send(pulse);
  }
}

const getName = (name: string) => {
  if (name[0] === "%" || name[0] === "&") {
    return name.slice(1);
  }
  return name;
};

const parse = (name: string) => {
  if (name === "broadcaster") {
    return new Broadcaster(name);
  }

  const type = name[0];
  if (type === "%") {
    return new FlipFlop(getName(name));
  }
  if (type === "&") {
    return new Conjunction(getName(name));
  }

  return new Node(name);
};

const part1 = (input: string) => {
  counter = new Counter(0, 0);
  orchestrator = new Orchestrator();
  const lines = input.split("\n").map((line) => line.split(" -> "));
  const nodes = new Map<string, Node>();

  for (const [name] of lines) {
    const nodeName = getName(name);
    nodes.set(nodeName, parse(name));
  }

  for (const [name, listeners] of lines) {
    const node = nodes.get(getName(name))!;

    for (const listener of listeners.split(", ")) {
      const listenerName = getName(listener);
      if (!nodes.has(listenerName)) {
        nodes.set(listenerName, parse(listener));
      }
      const listenerNode = nodes.get(listenerName)!;
      if (listenerNode instanceof Conjunction) {
        listenerNode.addInput(node);
      }
      node.addListener(listenerNode);
    }
  }

  const broadcaster = nodes.get("broadcaster")!;

  let buttonHits = 0;

  const hitButton = () => {
    buttonHits++;
    counter.count("low");
    broadcaster.receive("low");
  };

  const BUTTON_HITS = 1000;
  while (buttonHits < BUTTON_HITS) {
    hitButton();

    let event = orchestrator.tick();
    while (event) {
      counter.count(event.pulse);
      event.target.receive(event.pulse, event.sender);
      event = orchestrator.tick();
    }
  }

  return counter.low * counter.high;
};

const part2 = (input: string) => {};

testSolution("32000000", part1, testFile);
testSolution("11687500", part1, testFile2);

testSolution("1020211150", part1, inputFile);
// console.log("Part 2:", part2(inputFile));
