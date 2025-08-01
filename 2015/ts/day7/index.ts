import * as R from "remeda";
import { getInputFile, getTestFile, testSolution } from "../utils";

const testFile = getTestFile(__dirname);
const inputFile = getInputFile(__dirname);

class UInt16 {
  constructor(private value: number) {
    this.value = value & 0xffff;
  }

  and(other: UInt16) {
    return new UInt16(this.value & other.value);
  }
  or(other: UInt16) {
    return new UInt16(this.value | other.value);
  }
  not() {
    return new UInt16(~this.value);
  }
  lshift(bits: number) {
    return new UInt16(this.value << bits);
  }
  rshift(bits: number) {
    return new UInt16(this.value >> bits);
  }

  getValue() {
    return this.value;
  }

  toString() {
    return this.value.toString();
  }
}

const parseInstruction = (line: string) => {
  let match = line.match(/^(\w+) -> (\w+)$/);
  if (match) {
    return {
      action: "ASSIGN" as const,
      source: R.isNumber(parseInt(match[1]))
        ? new UInt16(parseInt(match[1]))
        : match[1],
      target: match[2],
    };
  }

  match = line.match(/^(\w+) (AND|OR) (\w+) -> (\w+)$/);
  if (match) {
    return {
      action: match[2] as "AND" | "OR",
      left: match[1],
      right: match[3],
      target: match[4],
    };
  }

  match = line.match(/^(\w+) (LSHIFT|RSHIFT) (\d+) -> (\w+)$/);
  if (match) {
    return {
      action: match[2] as "LSHIFT" | "RSHIFT",
      left: match[1],
      amount: new UInt16(parseInt(match[3])),
      target: match[4],
    };
  }

  match = line.match(/^NOT (\w+) -> (\w+)$/);
  if (match) {
    return { action: "NOT" as const, source: match[1], target: match[2] };
  }

  throw new Error(`Could not parse instruction ${line}`);
};

const solve = (wires: Wires, source: string | UInt16): UInt16 => {
  if (source instanceof UInt16) return source;

  const value = wires.has(source)
    ? wires.get(source)
    : new UInt16(parseInt(source));

  if (value === undefined)
    throw new Error(`Encountered undefined value for source ${source}`);

  if (value instanceof UInt16) return value;

  if (value.action === "ASSIGN") {
    const result = solve(wires, value.source);
    wires.set(value.target, result);
    return result;
  }

  if (value.action === "OR" || value.action === "AND") {
    const leftValue = solve(wires, value.left);
    const rightValue = solve(wires, value.right);

    const result =
      value.action === "OR"
        ? leftValue.or(rightValue)
        : leftValue.and(rightValue);

    wires.set(value.target, result);
    return result;
  }

  if (value.action === "LSHIFT" || value.action === "RSHIFT") {
    const leftValue = solve(wires, value.left);
    const amount = value.amount;

    const result =
      value.action === "LSHIFT"
        ? leftValue.lshift(amount.getValue())
        : leftValue.rshift(amount.getValue());

    wires.set(value.target, result);
    return result;
  }

  if (value.action === "NOT") {
    const source = solve(wires, value.source);
    const result = source.not();

    wires.set(value.target, result);
    return result;
  }

  throw new Error("Unknown error reached");
};

type Instruction = ReturnType<typeof parseInstruction>;
type Wires = Map<string, UInt16 | Instruction>;

const part1 = (input: string) => {
  const instructions = input.split("\n").map(parseInstruction);
  const wires: Wires = new Map();

  for (const instruction of instructions) {
    wires.set(instruction.target, instruction);
  }

  for (const [wire, instruction] of wires) {
    solve(wires, wire);
  }

  return wires.get("a");
};

const part2 = (input: string) => {
  const wireAFromPart1 = part1(input);
  if (!(wireAFromPart1 instanceof UInt16))
    throw new Error("Error in part1, 'a' is not a UInt16");

  const instructions = input.split("\n").map(parseInstruction);
  const wires: Wires = new Map();

  for (const instruction of instructions) {
    wires.set(instruction.target, instruction);
  }

  wires.set("b", wireAFromPart1);

  for (const [wire, instruction] of wires) {
    solve(wires, wire);
  }

  return wires.get("a");
};

testSolution("", part1, testFile);
// testSolution("", part2, testFile);

console.log("Part 1:", part1(inputFile));
console.log("Part 2:", part2(inputFile));
