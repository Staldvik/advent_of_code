package day01

import utils.parseInput

class Dial(var pos: Int) {
    fun turn(direction: Direction, ticks: Int) {
        pos = when (direction) {
            Direction.LEFT -> Math.floorMod(pos - ticks, 100)
            Direction.RIGHT -> Math.floorMod(pos + ticks, 100)
        }
    }

    /** Returns how many times it passed 0 (weird) */
    fun turnWithTicks(direction: Direction, ticks: Int): Int {
        val initialPos = pos;
        turn(direction, ticks)
        return when (direction) {
            Direction.LEFT -> Math.floorDiv(initialPos - 1, 100) - Math.floorDiv(initialPos - ticks - 1, 100)
            Direction.RIGHT -> Math.floorDiv(initialPos + ticks, 100) - Math.floorDiv(initialPos, 100)
        }
    }
}

enum class Direction {
    RIGHT, LEFT;

    companion object {
        fun fromString(input: String): Direction {
            return when (input) {
                "R" -> RIGHT
                "L" -> LEFT
                else -> {
                    throw Exception("Invalid direction $input")
                }
            }
        }
    }
}


fun main() {
    val part1Expected = 3
    val part2Expected = 6

    fun part1(input: List<String>): Int {
        val dial = Dial(50)
        return input.count {
            val direction = Direction.fromString(it.take(1))
            val ticks = it.drop(1).toInt()

            dial.turn(direction, ticks)
            return@count dial.pos == 0
        }
    }

    fun part2(input: List<String>): Int {
        val dial = Dial(50)
        return input.sumOf {
            val direction = Direction.fromString(it.take(1))
            val ticks = it.drop(1).toInt()

            return@sumOf dial.turnWithTicks(direction, ticks)
        }
    }

    fun testSolution(solver: (List<String>) -> Int, input: List<String>, expected: Int) {
        val result = solver(input)
        check(result == expected) { "Expected $expected but got $result" }
    }

    // Or read a large test input from the `src/Day01_test.txt` file:
    val testInput = parseInput("test")
    testSolution(::part1, testInput, part1Expected)
    testSolution(::part2, testInput, part2Expected)

    // Read the input from the `src/Day01.txt` file.
    val input = parseInput("input")
    testSolution(::part1, input, 1152)
    testSolution(::part2, input, 6671)
}
