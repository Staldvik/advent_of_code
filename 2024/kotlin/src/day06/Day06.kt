package day06

import utils.Dir
import utils.Grid
import utils.Pos
import utils.parseInput
import utils.println

fun main() {
    val part1Expected = 41
    val part2Expected = 6

    fun getGuardRoute(room: Grid): Set<Pos> {
        val startPos = room.getCharPos('^')

        var guardPos = startPos
        var guardDir = Dir(-1, 0)
        val seenPos = mutableSetOf<Pos>()
        while (guardPos.isWithin(room)) {
            seenPos.add(guardPos)
            val nextPos = guardPos.moveDir(guardDir)
            val nextChar = room.atPos(nextPos)
            if (nextChar == '#') {
                guardDir = guardDir.rotateRight()
            } else {
                guardPos = nextPos
            }
        }

        return seenPos
    }

    fun part1(input: List<String>): Int {
        val room = Grid.fromInput(input)
        return getGuardRoute(room).count()
    }

    fun part2(input: List<String>): Int {
        val room = Grid.fromInput(input)
        val guardRoute = getGuardRoute(room)

        val causesLoop = guardRoute.filter { testIntersection ->
            val testRoom = room.newWithPosChar(testIntersection, '#')

            var guardPos = room.getCharPos('^')
            var guardDir = Dir(-1, 0)
            val seenPos = mutableMapOf<Pos, MutableSet<Dir>>()
            while (guardPos.isWithin(testRoom)) {
                if (seenPos[guardPos]?.contains(guardDir) == true) {
                    return@filter true
                }
                seenPos.getOrPut(guardPos) { mutableSetOf() }.add(guardDir)

                val nextPos = guardPos.moveDir(guardDir)
                val nextChar = testRoom.atPos(nextPos)
                if (nextChar == '#') {
                    guardDir = guardDir.rotateRight()
                } else {
                    guardPos = nextPos
                }
            }

            return@filter false
        }

        return causesLoop.count()
    }

    // Or read a large test input from the `src/Day01_test.txt` file:
    val testInput = parseInput("example1")
    check(part1(testInput) == part1Expected)
    check(part2(testInput) == part2Expected)

    // Read the input from the `src/Day01.txt` file.
    val input = parseInput("input")
    part1(input).println("part1")
    part2(input).println("part2")
}
