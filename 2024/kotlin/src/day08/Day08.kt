package day08

import utils.Dir
import utils.Grid
import utils.parseInput
import utils.println


fun main() {
    val part1Expected = 14
    val part2Expected = 34


    fun part1(input: List<String>): Int {
        var map = Grid.fromInput(input)
        val frequencyAntennas = map.getChars()
        frequencyAntennas.remove('.')

        val antiNodes = frequencyAntennas.values.flatMap { antennas ->
            antennas.flatMap {
                val otherAntennas = antennas.filterNot { other -> it == other }
                val dirs = otherAntennas.map { other -> Dir(other.y - it.y, other.x - it.x) }
                dirs.map { dir -> it.moveDir(dir, 2) }.filter { it.isWithin(map) }
            }
        }.toSet()

        antiNodes.filter { map.atPos(it) == '.' }.forEach { map = map.newWithPosChar(it, '#') }

        map.print()

        return antiNodes.count()
    }

    fun part2(input: List<String>): Int {
        var map = Grid.fromInput(input)
        val frequencyAntennas = map.getChars()
        frequencyAntennas.remove('.')

        val antiNodes = frequencyAntennas.values.flatMap { antennas ->
            antennas.flatMap {
                val otherAntennas = antennas.filterNot { other -> it == other }
                val dirs = otherAntennas.map { other -> Dir(other.y - it.y, other.x - it.x) }
                dirs.flatMap { dir -> it.moveDirSequence(dir).takeWhile { antiNode -> antiNode.isWithin(map) } }
            }
        }.toSet()

        antiNodes.filter { map.atPos(it) == '.' }.forEach { map = map.newWithPosChar(it, '#') }

        map.print()

        return antiNodes.count()
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
