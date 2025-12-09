package day08

import utils.parseInput
import utils.println

fun main() {
    val part1Expected = 1
    val part2Expected = 1

    fun part1(input: List<String>): Int {
        return 1
    }

    fun part2(input: List<String>): Int {
        return 1
    }

    fun testSolution(solver: (List<String>) -> Int, input: List<String>, expected: Int) {
        val result = solver(input)
        check(result == expected) { "Expected $expected but got $result" }
    }

    // Or read a large test input from the `src/Day01_test.txt` file:
    val testInput = parseInput("example1")
    testInput.println("Read testinput")
    testSolution(::part1, testInput, part1Expected)
    //testSolution(::part2, testInput, part2Expected)

    // Read the input from the `src/Day01.txt` file.
    val input = parseInput("input")
    input.println("Read input")
    //testSolution(::part1, input, 1)
    //testSolution(::part2, input, 2)
}
