package day21

import Grid
import parseInput
import println

class Keypad {
    val keypad = Grid.fromInput(listOf("789", "456", "123", " 0A"))
}

class DirectionalKeypad {
    val keypad = Grid.fromInput(listOf(""))
}

fun main() {
    val part1Expected = 1
    val part2Expected = 1


    fun part1(input: List<String>): Int {
        val test = Keypad()
        test.keypad.print()
        return 2
    }

    fun part2(input: List<String>): Int {
        return 1
    }

    // Or read a large test input from the `src/Day01_test.txt` file:
    val testInput = parseInput("test")
    val part1Result = part1(testInput)
    check(part1Result == part1Expected) { "expected $part1Expected, got $part1Result" }

    // Read the input from the `src/Day01.txt` file.
    val input = parseInput("input")
    part1(input).println("part1")

    val part2Result = part2(testInput)
    check(part2Result == part2Expected) { "expected $part2Expected, got $part2Result" }

    part2(input).println("part2")
}
