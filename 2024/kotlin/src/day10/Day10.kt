package day10

import Dir
import Grid
import Pos
import parseInput
import println


fun main() {
    val part1Expected = 36
    val part2Expected = 81

    fun part1(input: List<String>): Int {
        val map = Grid.fromInput(input)
        val starts = map.findAll('0')
        val result = mutableListOf<Set<Pos>>()

        fun walk(pos: Pos, prevChar: Char?, path: MutableSet<Pos>): Boolean {
            val currentChar = map.atPos(pos) ?: return false
            if (prevChar != null && prevChar.digitToInt() + 1 != currentChar.digitToInt()) return false
            if (path.contains(pos)) return false

            path.add(pos)
            if (currentChar == '9') return true

            Dir.cardinalDirs.forEach { dir ->
                val hit = walk(pos.moveDir(dir), currentChar, path)
                if (hit) {
                    result.add(path.toSet())
                }
            }

            path.remove(pos)
            return false
        }

        for (start in starts) {
            walk(start, null, mutableSetOf())
        }

        return result.count()
    }


    fun part2(input: List<String>): Int {
        val map = Grid.fromInput(input)
        val starts = map.findAll('0')

        fun walk(pos: Pos, prevChar: Char?, path: MutableSet<Pos>, finishedPaths: MutableList<Set<Pos>>): Boolean {
            val currentChar = map.atPos(pos) ?: return false
            if (!currentChar.isDigit()) return false
            if (prevChar != null && prevChar.digitToInt() + 1 != currentChar.digitToInt()) return false

            path.add(pos)
            if (currentChar == '9') return true

            Dir.cardinalDirs.forEach { dir ->
                val completePath = walk(pos.moveDir(dir), currentChar, path, finishedPaths)
                if (completePath) finishedPaths.add(path.toSet())
            }

            path.remove(pos)
            return false
        }

        return starts.sumOf { start ->
            val finishedPaths = mutableListOf<Set<Pos>>()
            walk(start, null, mutableSetOf(), finishedPaths)
            finishedPaths.count()
        }
    }

    // Or read a large test input from the `src/Day01_test.txt` file:
    val testInput = parseInput("test")
    check(part1(testInput) == part1Expected)
    check(part2(testInput) == part2Expected)

    // Read the input from the `src/Day01.txt` file.
    val input = parseInput("input")
    part1(input).println("part1")
    part2(input).println("part2")
}
