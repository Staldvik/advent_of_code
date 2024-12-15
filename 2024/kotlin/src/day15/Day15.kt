package day15

import Dir
import Grid
import Pos
import println
import readInput


fun main() {
    val part1Expected = 10092
    val part2Expected = 1


    fun moveBlock(block: Pair<Pos, Pos>, dir: Dir, grid: Grid): Boolean {
        val nextPos = block.let { Pair(it.first.moveDir(dir), it.second.moveDir(dir)) }
        val nextChars = nextPos.let { Pair(grid.atPos(it.first)!!, grid.atPos(it.second)!!) }

        if ((dir == Dir.UP || dir == Dir.DOWN) && nextChars == Pair('.', '.')) {
            grid.movePos(block.first, dir)
            grid.movePos(block.second, dir)
            return true
        }

        if ((dir == Dir.UP || dir == Dir.DOWN) && nextChars == Pair('[', ']')) {
            val isPossible = moveBlock(nextPos, dir, grid)
            if (!isPossible) return false
            else {
                grid.movePos(block.first, dir)
                grid.movePos(block.second, dir)
                return true
            }
        }

        if ((dir == Dir.UP || dir == Dir.DOWN) && nextChars == Pair('.', '[')) {
            val isPossible = moveBlock(Pair(nextPos.second, nextPos.second.moveDir(Dir.RIGHT)), dir, grid)
            if (!isPossible) return false
            else {
                grid.movePos(block.first, dir)
                grid.movePos(block.second, dir)
                return true
            }
        }

        if ((dir == Dir.UP || dir == Dir.DOWN) && nextChars == Pair(']', '.')) {
            val isPossible = moveBlock(Pair(nextPos.first.moveDir(Dir.LEFT), nextPos.second), dir, grid)
            if (!isPossible) return false
            else {
                grid.movePos(block.first, dir)
                grid.movePos(block.second, dir)
                return true
            }
        }

        if ((dir == Dir.UP || dir == Dir.DOWN) && nextChars == Pair(']', '[')) {
            val isLeftPossible = moveBlock(Pair(nextPos.first.moveDir(Dir.LEFT), nextPos.second), dir, grid)
            val isRightPossible = moveBlock(Pair(nextPos.first.moveDir(Dir.LEFT), nextPos.second), dir, grid)
            if (!isRightPossible) {
                // Roll back left
                // Easier said than done, this could have shoved many packages
            }
            if (!isLeftPossible && !isRightPossible) return false
            else {
                grid.movePos(block.first, dir)
                grid.movePos(block.second, dir)
                return true
            }
        }


        // Right requires that nextChars.second is free
        if (dir == Dir.RIGHT && nextChars.second == '.') {
            // start with second, so that spot opens for first
            grid.movePos(block.second, dir)
            grid.movePos(block.first, dir)
            return true
        }

        if (dir == Dir.LEFT && nextChars.first == '.') {
            grid.movePos(block.first, dir)
            grid.movePos(block.second, dir)
            return true
        }

        if (dir == Dir.LEFT && nextChars.first == ']') {
            val isPossible = moveBlock(Pair(nextPos.first.moveDir(Dir.LEFT), nextPos.first), dir, grid)
            if (!isPossible) return false
            else {
                grid.movePos(block.first, dir)
                grid.movePos(block.second, dir)
                return true
            }
        }

        return false
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
                if (!isPossible) {
                    return false
                } else {
                    doMove(pos, dir, grid)
                    return true
                }
            }

            '[' -> {
                val sibling = nextPos.moveDir(Dir.RIGHT)
                val isPossible = moveBlock(Pair(nextPos, sibling), dir, grid)
                if (!isPossible) {
                    return false
                } else {
                    doMove(pos, dir, grid)
                    return true
                }
            }

            ']' -> {
                val sibling = nextPos.moveDir(Dir.LEFT)
                val isPossible = moveBlock(Pair(sibling, nextPos), dir, grid)
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
                doMove(it, dir, map)
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


    check(part2(readInput("small-test-2")) == 2028) { "small-test incorrect" }

    val part2Result = part2(testInput)
    check(part2Result == part2Expected) { "expected $part2Expected, got $part2Result" }

    // Read the input from the `src/Day01.txt` file.
    val input = readInput("input")
    part1(input).println("part1")
    part2(input).println("part2")
}
