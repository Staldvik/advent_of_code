const ex = await Deno.readTextFile(new URL("./ex.txt", import.meta.url));
const input = await Deno.readTextFile(new URL("./input.txt", import.meta.url));

class Pipe {
  constructor(
    public name: string,
    public flowRate: number,
    public tunnels: string[]
  ) {}
}

const parseInput = (input: string) => {
  const pipes: Pipe[] = [];
  const costMap = new Map<string, number>();
  const lines = input.split("\n");
  for (const line of lines) {
    const [valveAndFlowRate, tunnels] = line.split("; ");
    const valveName = valveAndFlowRate.substring(6, 8);
    const flowRate = +valveAndFlowRate.split("=").at(-1)?.replace(";", "")!;

    const tunnelTargets = tunnels.includes("valve ")
      ? tunnels.split("valve ").at(-1)?.split(", ")
      : tunnels.split("valves ").at(-1)?.split(", ");

    const pipe = new Pipe(valveName, flowRate, tunnelTargets!);
    pipes.push(pipe);
  }

  // For each node, calculate the cost to reach all the other nodes
  for (const pipe of pipes) {
    costMap.set(`${pipe.name}, ${pipe.name}`, 0);
    const visited = new Set<string>();
    const queue = [{ name: pipe.name, cost: 0 }];
    while (queue.length) {
      const { name, cost } = queue.shift()!;
      if (visited.has(name)) continue;
      visited.add(name);
      const currentNode = pipes.find((p) => p.name === name)!;
      for (const tunnel of currentNode.tunnels) {
        queue.push({ name: tunnel, cost: cost + 1 });
      }
      if (costMap.has(`${pipe.name}, ${currentNode.name}`)) continue;
      costMap.set(`${pipe.name}, ${currentNode.name}`, cost);
    }
  }

  return { pipes, costMap };
};

type State = {
  position: string;
  minutes: number;
  openings: Map<Pipe, number>;
};

const task1 = (input: string) => {
  const { pipes, costMap } = parseInput(input);
  const startPosition = pipes[0];
  const startingMinutes = 30;

  const finishedStates: State[] = [];
  const getValue = (state: State) => {
    finishedStates.push(state);
    const options = pipes.filter((p) => {
      if (p.name === state.position) return false;
      if (state.openings.has(p)) return false;
      if (p.flowRate === 0) return false;
      return true;
    });
    options.forEach((option) => {
      const openAtMinute =
        state.minutes - costMap.get(`${state.position}, ${option.name}`)! - 1;

      if (openAtMinute < 0) return;

      const newState = {
        position: option.name,
        minutes: openAtMinute,
        openings: new Map(state.openings),
      };
      newState.openings.set(option, openAtMinute);
      getValue(newState);
    });
  };

  getValue({
    minutes: startingMinutes,
    position: startPosition.name,
    openings: new Map(),
  });

  let maxOpenings = 0;
  finishedStates.forEach((s) => {
    let flowRate = 0;
    s.openings.forEach((minute, pipe) => {
      flowRate += pipe.flowRate * minute;
    });
    maxOpenings = Math.max(maxOpenings, flowRate);
  });

  return maxOpenings;
};

const task2 = (input: string) => {};

console.log("Task1(ex): ", task1(ex));
console.log("Task1(input): ", task1(input));

// console.log("Task2(ex): ", task2(ex));
// console.log("Task2(input): ", task2(input));
