package day06

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
    fun isWithin(grid: Grid) = grid.grid.getOrNull(this.y)?.getOrNull(this.x) != null
}


class Grid(val grid: List<MutableList<Char>>) {
    companion object {
        fun fromInput(input: List<String>) = Grid(input.map { it.toCharArray().toMutableList() })
    }

    fun getStart(): Coord {
        grid.forEachIndexed { y, row ->
            val x = row.indexOf('^')
            if (x != -1) return Coord(y, x)
        }
        throw IllegalStateException("No start character '^' found in grid")
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
    val part1Expected = 41
    val part2Expected = 6

    fun part1(input: List<String>): Int {
        val room = Grid.fromInput(input)
        val startPos = room.getStart()

        var guardPos = startPos
        var guardDir = Dir(-1, 0)
        val seenPos = mutableSetOf<Coord>()
        while (guardPos.isWithin(room)) {
            seenPos.add(guardPos)
            val nextPos = guardPos.moveDir(guardDir)
            val nextChar = room.atCoord(nextPos)
            if (nextChar == '#') {
                guardDir = guardDir.rotateRight()
            } else {
                guardPos = nextPos
            }
        }

        return seenPos.count()
    }

    fun part2(input: List<String>): Int {
        val room = Grid.fromInput(input)

        val intersections = room.grid.flatMapIndexed { y, row ->
            List(row.size) { x -> Coord(y, x) }
        }.filter { coord -> room.atCoord(coord) != '#' }

        val startPos = room.getStart()

        val causesLoop = intersections.filter { testIntersection ->
            val testRoom = room.setAtCoord(testIntersection, '#')

            var guardPos = startPos
            var guardDir = Dir(-1, 0)
            val seenPos = mutableMapOf<Coord, MutableSet<Dir>>()
            while (guardPos.isWithin(testRoom)) {
                if (seenPos[guardPos]?.contains(guardDir) == true) return@filter true
                seenPos.getOrPut(guardPos) { mutableSetOf() }.add(guardDir)

                val nextPos = guardPos.moveDir(guardDir)
                val nextChar = testRoom.atCoord(nextPos)
                if (nextChar == '#') {
                    guardDir = guardDir.rotateRight()
                } else {
                    guardPos = nextPos
                }
            }

            false
        }

        return causesLoop.count()
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
