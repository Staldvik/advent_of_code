package day15

import utils.Dir
import utils.Grid
import utils.Pos
import utils.println
import utils.readInput


fun main() {
    val part1Expected = 10092
    val part2Expected = 1

    fun doMove(pos: Pos, dir: Dir, grid: Grid): Boolean {
        val nextPos = pos.moveDir(dir)
        return when (grid.atPos(nextPos)) {
            '#' -> false

            '.' -> {
                grid.movePos(pos, dir)
                true
            }

            'O' -> {
                val isPossible = doMove(nextPos, dir, grid)
                if (!isPossible) {
                    return false
                } else {
                    doMove(pos, dir, grid)
                    return true
                }
            }

            else -> throw IllegalStateException("Unknown nextPos char ${grid.atPos(nextPos)}")
        }
    }


    fun getDirFromInstruction(instruction: Char) = when (instruction) {
        '<' -> Dir.LEFT
        '>' -> Dir.RIGHT
        '^' -> Dir.UP
        'v' -> Dir.DOWN
        else -> throw IllegalArgumentException("Unknown instruction $instruction")
    }

    fun part1(input: String): Int {
        val (mapString, instructions) = input.split("\n\n")
        val map = Grid.fromInput(mapString.split("\n"))

        instructions.replace("\n", "").toCharArray().forEach { instruction ->
            val dir = getDirFromInstruction(instruction)
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

    fun doBigMove(pos: Pair<Pos, Pos>, dir: Dir, grid: Grid): Boolean {
        val nextPos = Pair(pos.first.moveDir(dir), pos.second.moveDir(dir))
        val nextChars = Pair(grid.atPos(nextPos.first), nextPos.second.let { grid.atPos(it) })

        if (dir == Dir.UP || dir == Dir.DOWN) {
            return when (nextChars) {
                Pair('[', ']') -> {
                    true
                }

                Pair(']', '[') -> {
                    true
                }

                Pair(']', '.') -> {
                    true
                }

                Pair('.', '[') -> {
                    true
                }

                else -> {
                    throw IllegalArgumentException("$nextChars")
                }
            }
        }

        if (dir == Dir.LEFT) {
            return when (nextChars) {
                Pair('[', ']') -> {
                    true
                }

                Pair(']', '[') -> {
                    true
                }

                Pair(']', '.') -> {
                    true
                }

                Pair('.', '[') -> {
                    true
                }

                else -> {
                    throw IllegalArgumentException("$nextChars")
                }
            }
        }

        if (dir == Dir.RIGHT) {
            return when (nextChars) {
                Pair('[', ']') -> {
                    true
                }

                Pair(']', '[') -> {
                    true
                }

                Pair(']', '.') -> {
                    true
                }

                Pair('.', '[') -> {
                    true
                }

                else -> {
                    throw IllegalArgumentException("$nextChars")
                }
            }
        }

        return true
    }

    fun part2(input: String): Int {
        val (mapString, instructions) = input.split("\n\n")
        val adjustedMap = mapString.split("\n").map { line ->
            line.toCharArray().flatMap {
                when (it) {
                    '#' -> listOf("#", "#")
                    'O' -> listOf("[", "]")
                    '@' -> listOf("@", ".")
                    '.' -> listOf(".", ".")
                    else -> throw IllegalArgumentException("Don't know how to handle '$it'")
                }
            }.joinToString("")
        }
        val map = Grid.fromInput(adjustedMap)
        map.print()

        instructions.replace("\n", "").toCharArray().forEach { instruction ->
            instruction.println("Doing instruction")
            val dir = getDirFromInstruction(instruction)
            val robots = map.findAll('@')

            robots.forEach {
                doBigMove(Pair(it, it.moveDir(Dir.RIGHT)), dir, map)
            }
            map.print()
        }

        map.print()

        val blocks = map.findAll('[')

        return blocks.sumOf {
            100 * it.y + it.x
        }
    }

    check(part1(readInput("small-test")) == 2028) { "small-test incorrect" }

    // Or read a large test input from the `src/Day01_test.txt` file:
    val testInput = readInput("test")
    val part1Result = part1(testInput)
    check(part1Result == part1Expected) { "expected $part1Expected, got $part1Result" }
    // Read the input from the `src/Day01.txt` file.
    val input = readInput("input")
    part1(input).println("part1")

    check(part2(readInput("small-test-2")) == 2028) { "small-test incorrect" }

    val part2Result = part2(testInput)
    check(part2Result == part2Expected) { "expected $part2Expected, got $part2Result" }


    part2(input).println("part2")
}
