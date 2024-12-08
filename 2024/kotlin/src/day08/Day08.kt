package day08

import println
import readInput


data class Dir(val dy: Int, val dx: Int) {
    fun rotateRight() = when (this) {
        Dir(-1, 0) -> Dir(0, 1)
        Dir(0, 1) -> Dir(1, 0)
        Dir(1, 0) -> Dir(0, -1)
        Dir(0, -1) -> Dir(-1, 0)
        else -> throw NotImplementedError("rotateRight not implemented for $this")
    }
}

data class Coord(val y: Int, val x: Int) {
    fun moveDir(dir: Dir, steps: Int = 1) = Coord(y = y + (dir.dy * steps), x = x + (dir.dx * steps))
    fun moveDirSequence(dir: Dir, steps: Int = 1) = sequence {
        var currentPoint = this@Coord
        while (true) {
            currentPoint = currentPoint.moveDir(dir, 1)
            yield(currentPoint)
        }
    }

    fun isWithin(grid: Grid) = grid.grid.getOrNull(this.y)?.getOrNull(this.x) != null
}


class Grid(val grid: List<MutableList<Char>>) {
    companion object {
        fun fromInput(input: List<String>) = Grid(input.map { it.toCharArray().toMutableList() })
    }

    fun print() {
        grid.forEach { row ->
            println(row.joinToString(""))
        }
    }

    fun getStart(): Coord {
        grid.forEachIndexed { y, row ->
            val x = row.indexOf('^')
            if (x != -1) return Coord(y, x)
        }
        throw IllegalStateException("No start character '^' found in grid")
    }

    fun getAntennas(): Map<Char, Set<Coord>> {
        val result = mutableMapOf<Char, MutableSet<Coord>>()
        grid.forEachIndexed { y, row ->
            row.forEachIndexed { x, char ->
                if (char != '.') {
                    result.getOrPut(char) { mutableSetOf() }.add((Coord(y, x)))
                }
            }
        }
        return result
    }

    fun atCoord(coord: Coord) = this.grid.getOrNull(coord.y)?.getOrNull(coord.x)

    fun setAtCoord(coord: Coord, char: Char): Grid {
        val newGrid = grid.map { it.toMutableList() }.toMutableList()
        newGrid[coord.y][coord.x] = char
        return Grid(newGrid)
    }

    fun findAll(findChar: Char): MutableSet<Coord> = grid.flatMapIndexed() { y, row ->
        row.mapIndexed() { x, char ->
            if (char == findChar) Coord(y, x) else null
        }.filterNotNull()
    }.toMutableSet()
}

fun main() {
    val part1Expected = 14
    val part2Expected = 34


    fun part1(input: List<String>): Int {
        var map = Grid.fromInput(input)
        val frequencyAntennas = map.getAntennas()

        frequencyAntennas.println("Antennas")

        val antiNodes = frequencyAntennas.values.flatMap { antennas ->
            antennas.println("Inside flatMap")
            antennas.flatMap {
                val otherAntennas = antennas.filterNot { other -> it == other }
                val dirs = otherAntennas.map { other -> Dir(other.y - it.y, other.x - it.x) }
                dirs.map { dir -> it.moveDir(dir, 2) }.filter { it.isWithin(map) }
            }
        }.toSet()

        antiNodes.forEach { map = map.setAtCoord(it, '#') }

        map.print()

        antiNodes.println("antiNodes")
        antiNodes.count().println()


        return antiNodes.count()
    }

    fun part2(input: List<String>): Int {
        var map = Grid.fromInput(input)
        val frequencyAntennas = map.getAntennas()

        frequencyAntennas.println("Antennas")

        val antiNodes = frequencyAntennas.values.flatMap { antennas ->
            antennas.println("Inside flatMap")
            antennas.flatMap {
                val otherAntennas = antennas.filterNot { other -> it == other }
                val dirs = otherAntennas.map { other -> Dir(other.y - it.y, other.x - it.x) }
                dirs.flatMap { dir -> it.moveDirSequence(dir).takeWhile { antiNode -> antiNode.isWithin(map) } }
            }
        }.toSet()

        antiNodes.forEach { map = map.setAtCoord(it, '#') }

        map.print()

        antiNodes.println("antiNodes")
        antiNodes.count().println()


        return antiNodes.count()
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
