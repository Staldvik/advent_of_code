package template

import println
import readInput


fun main() {
    val part1Expected = 1
    val part2Expected = 1

    fun part1(input: List<String>): Int {
        return 1
    }

    fun part2(input: List<String>): Int {
        return 1
    }

    // Or read a large test input from the `src/Day01_test.txt` file:
    val testInput = readInput("test")
    val part1Result = part1(testInput)
    check(part1Result == part1Expected) { "expected $part1Expected, got $part1Result" }
    val part2Result = part1(testInput)
    check(part2Result == part2Expected) { "expected $part2Expected, got $part2Result" }

    // Read the input from the `src/Day01.txt` file.
    val input = readInput("input")
    part1(input).println("part1")
    part2(input).println("part2")
}
