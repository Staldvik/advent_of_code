const ex = await Deno.readTextFile(new URL("./ex.txt", import.meta.url));
const input = await Deno.readTextFile(new URL("./input.txt", import.meta.url));

const task1 = (input: string) => {
  const lines = input.split("\n");

  const monkeys = new Map<string, string | number>();

  const checkYells = () => {
    monkeys.forEach((yell, monkeyName) => {
      if (typeof yell !== "number") {
        const firstMonkey = yell.split(" ")[0];
        const lastMonkey = yell.split(" ").at(-1)!;
        const first = monkeys.get(firstMonkey);
        const last = monkeys.get(lastMonkey);
        const firstIsNumber = !isNaN(Number(first));
        const lastIsNumber = !isNaN(Number(last));

        if (firstIsNumber && lastIsNumber) {
          const result = eval(
            yell
              .replace(firstMonkey, String(first))
              .replace(lastMonkey, String(last))
          );
          monkeys.set(monkeyName, result);
        }
      }
    });
  };

  for (const line of lines) {
    const [monkeyName, yell] = line.split(": ");

    const yellIsNumber = !isNaN(Number(yell));
    if (yellIsNumber) {
      monkeys.set(monkeyName, Number(yell));
    } else {
      monkeys.set(monkeyName, yell);
    }

    checkYells();
  }

  while (typeof monkeys.get("root") !== "number") {
    checkYells();
  }

  return monkeys.get("root");
};

const task2 = (input: string) => {};

console.log("Task1(ex): ", task1(ex));
console.log("Task1(input): ", task1(input));

// console.log("Task2(ex): ", task2(ex));
// console.log("Task2(input): ", task2(input));
