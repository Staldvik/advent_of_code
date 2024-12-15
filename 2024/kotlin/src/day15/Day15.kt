package day15

import Dir
import Grid
import Pos
import println
import readInput


fun main() {
    val part1Expected = 10092
    val part2Expected = 1

    fun parseInput(input: String) {

    }

    fun doMove(pos: Pos, dir: Dir, grid: Grid): Boolean {
        val nextPos = pos.moveDir(dir)
        return when (grid.atPos(nextPos)) {
            '@' -> false
            '#' -> false

            '.' -> {
                grid.movePos(pos, dir)
                true
            }

            'O' -> {
                val isPossible = doMove(nextPos, dir, grid)
                if (!isPossible) return false
                else doMove(pos, dir, grid)
                true
            }

            else -> throw IllegalStateException("Unknown nextPos char ${grid.atPos(nextPos)}")
        }
    }


    fun part1(input: String): Int {
        val (mapString, instructions) = input.split("\n\n")
        val map = Grid.fromInput(mapString.split("\n"))

        instructions.toCharArray().forEach { instruction ->
            instruction.println("Doing instruction")

            val dir = when (instruction) {
                '<' -> Dir.LEFT
                '>' -> Dir.RIGHT
                '^' -> Dir.UP
                'v' -> Dir.DOWN
                '\n' -> return@forEach
                else -> throw IllegalArgumentException("Unknown instruction $instruction")
            }

            val robots = map.findAll('@')

            robots.forEach {
                doMove(it, dir, map)
            }
        }

        val blocks = map.findAll('O')
        return blocks.sumOf {
            100 * it.y + it.x
        }
    }

    fun part2(input: String): Int {
        return 2
    }

    check(part1(readInput("small-test")) == 2028) { "small-test incorrect" }

    // Or read a large test input from the `src/Day01_test.txt` file:
    val testInput = readInput("test")
    val part1Result = part1(testInput)
    check(part1Result == part1Expected) { "expected $part1Expected, got $part1Result" }
    val part2Result = part2(testInput)
    check(part2Result == part2Expected) { "expected $part2Expected, got $part2Result" }

    // Read the input from the `src/Day01.txt` file.
    val input = readInput("input")
    part1(input).println("part1")
    part2(input).println("part2")
}
