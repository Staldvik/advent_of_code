package day01

import println
import readInput
import kotlin.math.abs


fun main() {
    val part1Expected = 11
    val part2Expected = 31

    fun part1(input: List<String>): Int {
        val leftNumbers = input.map {
            it.split("   ").first().toInt()
        }.sorted()
        val rightNumbers = input.map {
            it.split("   ").last().toInt()
        }.sorted()

        val pairs = leftNumbers.zip(rightNumbers)

        return pairs.sumOf {
            abs(it.first - it.second)
        }
    }

    fun part2(input: List<String>): Int {
        val leftNumbers = input.map {
            it.split("   ").first().toInt()
        }.sorted()
        val rightNumbers = input.map {
            it.split("   ").last().toInt()
        }.sorted()

        val pairs = leftNumbers.zip(rightNumbers)

        return pairs.sumOf {
            val appearances = rightNumbers.count { right -> it.first == right }
            it.first * appearances
        }
    }

    // Or read a large test input from the `src/Day01_test.txt` file:
    val testInput = readInput("test")
    check(part1(testInput) == part1Expected)
    check(part2(testInput) == part2Expected)

    // Read the input from the `src/Day01.txt` file.
    val input = readInput("input")
    part1(input).println("part1")
    part2(input).println("part2")
}
