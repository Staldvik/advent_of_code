package day06

import println
import readInput

data class Dir(val dy: Int, val dx: Int)
data class Coord(val y: Int, val x: Int) {
    fun fromDir(dir: Dir): Coord {
        return Coord(
            y + dir.dy, x + dir.dx
        )
    }
}


class Grid(val grid: List<MutableList<Char>>) {
    companion object {
        fun fromInput(input: List<String>) = Grid(input.map { it.toCharArray().toMutableList() })
    }

    fun atCoord(coord: Coord) = this.grid.getOrNull(coord.y)?.getOrNull(coord.x)

    fun setAtCoord(coord: Coord, char: Char): Grid {
        val newGrid = grid.map { it.toMutableList() }.toMutableList()
        newGrid[coord.y][coord.x] = char
        return Grid(newGrid)
    }

    fun findAll(char: Char): MutableSet<Coord> {
        val result = mutableSetOf<Coord>()
        for (y in 0..<grid.count()) {
            for (x in 0..<grid[y].count()) {
                val testCoord = Coord(y, x)
                if (atCoord(testCoord) == char) result.add(testCoord)
            }
        }
        return result
    }

    fun findFirstPos(char: Char): Coord? {
        for (y in 0..<grid.count()) {
            for (x in 0..<grid[y].count()) {
                val testCoord = Coord(y, x)
                if (atCoord(testCoord) == char) return testCoord
            }
        }
        return null
    }
}

fun main() {
    val part1Expected = 41
    val part2Expected = 6

    fun getNextDir(dir: Dir) = when (dir) {
        Dir(-1, 0) -> Dir(0, 1)
        Dir(0, 1) -> Dir(1, 0)
        Dir(1, 0) -> Dir(0, -1)
        Dir(0, -1) -> Dir(-1, 0)
        else -> error("unexpected direction $dir")
    }

    fun part1(input: List<String>): Int {
        val room = Grid.fromInput(input)
        val startPos = room.findFirstPos('^')
        startPos.println("Start Pos")

        var guardPos = startPos
        var guardDir = Dir(-1, 0)
        val seenPos = mutableSetOf(startPos)
        while (guardPos != null && room.atCoord(guardPos) != null) {
            val nextPos = guardPos.fromDir(guardDir)
            val nextChar = room.atCoord(nextPos)
            if (nextChar == '#') {
                guardDir = getNextDir(guardDir)
            } else {
                guardPos = nextPos
                if (nextChar != null) {
                    seenPos.add(guardPos)
                }
            }
        }

        return seenPos.count()
    }

    // Plan:
    // All the positions must be on either side of a line drawn from any of the existing obstacles
    // Test all positions then?
    // Run until some position is passed many times?
    fun part2(input: List<String>): Int {
        val room = Grid.fromInput(input)

        val currentBlockers = room.findAll('#')
        // Find all possible positions
        // Get all Y lines on each side of #'s
        // Get all X lines on each side of #'s
        val yLines = mutableSetOf<Int>()
        val xLines = mutableSetOf<Int>()
        for (blocker in currentBlockers) {
            val above = blocker.y - 1
            if (above >= 0) yLines.add(above)
            val below = blocker.y + 1
            if (below < room.grid.count()) yLines.add(below)

            val left = blocker.x - 1
            if (left >= 0) xLines.add(left)
            val right = blocker.x + 1
            if (right < room.grid[0].count()) xLines.add(right)
        }

        yLines.println("yLines")
        xLines.println("xLines")

        val intersections = yLines.flatMap { y ->
            xLines.map { Coord(y, it) }
        }.filter { coord -> room.atCoord(coord) != '#' }

        val startPos = room.findFirstPos('^')
        startPos.println("Start Pos")

        var testRoom: Grid
        val loops = intersections.filter { testIntersection ->
            testRoom = room.setAtCoord(testIntersection, '#')

            var guardPos = startPos
            var guardDir = Dir(-1, 0)
            val seenPos = mutableMapOf<Coord, Int>()
            while (guardPos != null && testRoom.atCoord(guardPos!!) != null) {
                val nextPos = guardPos!!.fromDir(guardDir)
                val nextChar = testRoom.atCoord(nextPos)
                if (nextChar == '#') {
                    guardDir = getNextDir(guardDir)
                } else {
                    guardPos = nextPos
                    if (nextChar != null) {
                        seenPos[nextPos] = seenPos.getOrPut(nextPos) { 0 } + 1
                        if (seenPos[nextPos]!! > 4) return@filter true
                    }
                }
            }
            false
        }

        loops.println("loops")

        return loops.count()
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
