const text = await Deno.readTextFile(new URL("./input.txt", import.meta.url));
const ex = await Deno.readTextFile(new URL("./ex.txt", import.meta.url));
const monkeyLines = text.split("\n\n");

const parseMonkey = (monkey: string) => {
  const [monkeyName, items, operation, test, ifTrue, ifFalse] =
    monkey.split("\n");
  const parsedMonkeyId = monkeyName.split(" ").at(-1)!.replace(":", "");
  const parsedItems = items
    .slice(18)
    .split(", ")
    .map((item) => parseInt(item));
  const parsedOperation = operation.split(" = ").at(-1)!;
  const parsedTest = test.split(" ").at(-1)!;
  const parsedIfTrueTarget = ifTrue.split(" ").at(-1)!;
  const parsedIfFalseTarget = ifFalse.split(" ").at(-1)!;

  return {
    id: parsedMonkeyId,
    items: parsedItems,
    operation: parsedOperation,
    test: parseInt(parsedTest),
    ifTrueTarget: parsedIfTrueTarget,
    ifFalseTarget: parsedIfFalseTarget,
  };
};

const task1 = () => {
  const ROUNDS = 20;
  const monkeys = monkeyLines.map(parseMonkey);
  const inspections = new Map<string, number>();
  // For each round
  for (let i = 0; i < ROUNDS; i++) {
    // For each monkey
    for (const monkey of monkeys) {
      while (monkey.items.length > 0) {
        const item = monkey.items.shift()!;
        inspections.set(monkey.id, (inspections.get(monkey.id) || 0) + 1);
        const worryLevel = item;
        let newWorryLevel = eval(
          monkey.operation.replaceAll("old", worryLevel.toString())
        ) as number;
        newWorryLevel = Math.floor(newWorryLevel / 3);
        const target =
          newWorryLevel % monkey.test === 0
            ? monkey.ifTrueTarget
            : monkey.ifFalseTarget;

        monkeys.find((m) => m.id === target)?.items.push(newWorryLevel);
      }
    }
  }

  // Get two highest inspections
  const sorted = [...inspections.entries()].sort((a, b) => b[1] - a[1]);
  return sorted[0][1] * sorted[1][1];
};

const logPoints = [1, 20, 1000];

const task2 = () => {
  const ROUNDS = 10000;
  const monkeys = monkeyLines.map(parseMonkey);
  const inspections = new Map<string, number>();

  const lcmOfTests = monkeys.reduce((acc, { test }) => {
    const gcd = (a: number, b: number): number => {
      if (b === 0) return a;
      return gcd(b, a % b);
    };
    const gcdOfAccAndTest = gcd(acc, test);
    return (acc * test) / gcdOfAccAndTest;
  }, 1);

  for (let i = 0; i < ROUNDS; i++) {
    for (const monkey of monkeys) {
      while (monkey.items.length > 0) {
        const worryLevel = BigInt(monkey.items.shift()!);
        inspections.set(monkey.id, (inspections.get(monkey.id) || 0) + 1);
        let newWorryLevel = eval(
          monkey.operation.replaceAll("old", worryLevel.toString())
        ) as number;

        newWorryLevel = newWorryLevel % lcmOfTests;
        const target =
          newWorryLevel % monkey.test === 0
            ? monkey.ifTrueTarget
            : monkey.ifFalseTarget;

        monkeys.find((m) => m.id === target)?.items.push(newWorryLevel);
      }
    }
    if (logPoints.includes(i + 1)) console.log("Round: ", i + 1, inspections);
  }

  // Get two highest inspections
  const sorted = [...inspections.entries()].sort((a, b) => b[1] - a[1]);
  return sorted[0][1] * sorted[1][1];
};

console.log("Task1: ", task1());
console.log("Task2: ", task2());
