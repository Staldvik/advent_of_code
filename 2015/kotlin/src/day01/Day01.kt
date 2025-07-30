package day01

import utils.parseInput
import utils.println


fun main() {
    val part1Expected = 3
    val part2Expected = 1

    fun part1(input: List<String>): Int {
        var currentFloor = 0
        input.get(0).iterator().forEach {
            if (it == '(') currentFloor++
            if (it == ')') currentFloor--
        }
        return currentFloor
    }

    fun part2(input: List<String>): Int {
        var currentFloor = 0
        var index = 1
        input.get(0).iterator().forEach {
            if (it == '(') currentFloor++
            if (it == ')') currentFloor--
            if (currentFloor < 0) return index
            index++
        }
        return index
    }

    // Or read a large test input from the `src/Day01_test.txt` file:
    val testInput = parseInput("test")
    check(part1(testInput) == part1Expected)
    check(part2(testInput) == part2Expected) { "got ${part2(testInput)}" }

    // Read the input from the `src/Day01.txt` file.
    val input = parseInput("input")
    part1(input).println("part1")
    part2(input).println("part2")
}
