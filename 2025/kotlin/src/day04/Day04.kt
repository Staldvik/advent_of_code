package day04

import utils.Dir
import utils.Grid
import utils.Pos
import utils.parseInput
import utils.println

fun main() {
    val part1Expected = 13
    val part2Expected = 43

    fun part1(input: List<String>): Int {
        return input.withIndex().sumOf { (y, line) ->
            line.withIndex().count { (x, char) ->
                if (char != '@') return@count false
                val adjacentPaperRolls = Dir.allDirs.count { dir ->
                    val adjacentPosition = input.getOrNull(y + dir.dy)?.getOrNull(x + dir.dx) ?: 'a'
                    return@count adjacentPosition == '@'
                }
                adjacentPaperRolls < 4
            }
        }
    }

    fun getRemovable(grid: Grid): MutableSet<Pos> {
        val removable = mutableSetOf<Pos>()
        grid.grid.withIndex().forEach { (y, line) ->
            line.withIndex().forEach { (x, char) ->
                if (char != '@') return@forEach;
                val adjacentPaperRolls = Dir.allDirs.count { dir ->
                    val adjacentPosition = grid.grid.getOrNull(y + dir.dy)?.getOrNull(x + dir.dx) ?: '.'
                    return@count adjacentPosition == '@'
                }
                if (adjacentPaperRolls < 4) {
                    removable.add(Pos(y, x))
                }
            }
        }
        return removable
    }

    fun part2(input: List<String>): Int {
        val grid = Grid.fromInput(input)
        var count = 0;

        while(true) {
            val removable = getRemovable(grid)
            if (removable.isEmpty()) break;
            count += removable.size
            removable.forEach { pos -> grid.setAtPos(pos, '.') }
        }

        return count
    }

    fun testSolution(solver: (List<String>) -> Int, input: List<String>, expected: Int) {
        val result = solver(input)
        check(result == expected) { "Expected $expected but got $result" }
    }

    // Or read a large test input from the `src/Day01_test.txt` file:
    val testInput = parseInput("example1")
    testSolution(::part1, testInput, part1Expected)
    testSolution(::part2, testInput, part2Expected)

    // Read the input from the `src/Day01.txt` file.
    val input = parseInput("input")
    testSolution(::part1, input, 1344) // 9737 too low
    testSolution(::part2, input, 8112)
}
