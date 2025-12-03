package day01

import utils.parseInput
import utils.println
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
        }
        val rightNumbers = input.map {
            it.split("   ").last().toInt()
        }

        return leftNumbers.sumOf {
            val appearances = rightNumbers.count { right -> it == right }
            it * appearances
        }
    }

    val testInput = parseInput("example1")
    check(part1(testInput) == part1Expected)
    check(part2(testInput) == part2Expected)

    val input = parseInput("input")
    part1(input).println("part1")
    part2(input).println("part2")
}
