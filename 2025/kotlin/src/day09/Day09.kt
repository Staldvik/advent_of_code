package day09

import utils.Pos
import utils.parseInput
import utils.println
import kotlin.math.abs

fun Pair<Pos,Pos>.rectangleSize(): Long {
    val (a, b) = this;
    return (abs(a.x - b.x) + 1).toLong() * (abs(a.y - b.y) + 1).toLong()
}

fun main() {
    val part1Expected = 50L
    val part2Expected = 8

    fun part1(input: List<String>): Long {
        val positions = input.map { line ->
            val (x, y) = line.split(",").map { it.toInt() }
            Pos(y,x)
        }
        positions.println("Positions")

        val allPairs = positions.flatMapIndexed { index, pos ->
            positions.drop(index + 1).map { Pair(it, pos) }
        }

        allPairs.println("Pairs")

        val bestPair = allPairs.maxBy { it.rectangleSize() }
        bestPair.println("BestPair")
        return bestPair.rectangleSize()
    }

    fun part2(input: List<String>): Long {
        return 2;
    }

    fun testSolution(solver: (List<String>) -> Long, input: List<String>, expected: Long) {
        val result = solver(input)
        check(result == expected) { "Expected $expected but got $result" }
    }

    // Or read a large test input from the `src/Day01_test.txt` file:
    val testInput = parseInput("example1")
    testSolution(::part1, testInput, part1Expected)
    //testSolution(::part2, testInput, part2Expected)

    // Read the input from the `src/Day01.txt` file.
    val input = parseInput("input")
    testSolution(::part1, input, 4737096935L) // 2147429388 too low (needed Long)
    testSolution(::part2, input, 1)
}
