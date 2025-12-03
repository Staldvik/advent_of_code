package day18

import utils.Dir
import utils.Grid
import utils.Pos
import utils.parseInput
import utils.println
import kotlin.math.min


fun main() {
    val part1Expected = 146
    val part2Expected = 1

    fun h(pos: Pos, goal: Pos): Int {
        val distToGoal = pos.getDistTo(goal)
        return distToGoal.dx + distToGoal.dy
    }

    fun reconstructPath(cameFrom: Map<Pos, Pos>, goal: Pos): List<Pos> {
        var current = goal
        var path = listOf<Pos>()
        while (current in cameFrom.keys) {
            current = cameFrom[current]!!
            path = listOf(current) + path
        }
        return path
    }

    // Shameless implementation of the wiki pseudo… Every year I have to do this 🙄
    fun aStar(start: Pos, goal: Pos, maze: Grid): List<Pos>? {
        /** Discovered nodes that may need to be checked out */
        val openSet = mutableSetOf<Pos>()
        openSet.add(start)

        /** Pos of previous node, in the cheapest path */
        val cameFrom = mutableMapOf<Pos, Pos>()

        /** Currently cheapest cost to this node */
        val gScore = mutableMapOf<Pos, Int>()
        gScore[start] = 0

        /**
         * Best guess of how cheap a path through this node could be
         * fScore[node] = gScore[node] + h(node)
         * */
        val fScore = mutableMapOf<Pos, Int>()
        fScore[start] = 0

        while (openSet.isNotEmpty()) {
            val current = openSet.minBy { fScore.getOrDefault(it, Int.MAX_VALUE) }

            if (current == goal) return reconstructPath(cameFrom, goal)

            openSet.remove(current)
            Dir.cardinalDirs.forEach { newDir ->
                val neighbor = current.moveDir(newDir)
                if (maze.atPos(neighbor) == '#') return@forEach
                if (!neighbor.isWithin(maze)) return@forEach

                val costToNode = 1
                val tentativeScore = gScore.getOrDefault(current, Int.MAX_VALUE) + costToNode

                if (tentativeScore < gScore.getOrDefault(neighbor, Int.MAX_VALUE)) {
                    // This path to neighbor is better or equal to previous one. Record it
                    cameFrom[neighbor] = current
                    gScore[neighbor] = tentativeScore
                    fScore[neighbor] = tentativeScore + h(neighbor, goal)

                    openSet.add(neighbor)
                }
            }
        }

        return null
    }

    fun part1(input: List<String>): Int {
        val positions =
            input.subList(0, min(input.count(), 1024)).map { coordString ->
                coordString.split(",").map { char -> char.toInt() }.let { Pos(it[1], it[0]) }
            }

        val maze = Grid.ofSize(71, 71)
        positions.forEach { if (it.isWithin(maze)) maze.setAtPos(it, '#') }
        maze.print()

        val steps = aStar(Pos(0, 0), Pos(70, 70), maze)
            ?: return 0

        steps.println("Steps")

        return steps.count()
    }

    fun part2(input: List<String>): String {
        val bytes = input.map { coordString ->
            coordString.split(",").map { char -> char.toInt() }.let { Pos(it[1], it[0]) }
        }

        val maze = Grid.ofSize(71, 71)
        bytes.subList(0, min(input.count(), 1024)).forEach { if (it.isWithin(maze)) maze.setAtPos(it, '#') }
        maze.print()

        val restOfBytes = bytes.subList(min(input.count(), 1024), input.count()).iterator()
        while (restOfBytes.hasNext()) {
            val newByte = restOfBytes.next()
            val steps = aStar(Pos(0, 0), Pos(70, 70), maze.newWithPosChar(newByte, '#'))
                ?: 0

            if (steps == 0) return "${newByte.x},${newByte.y}"
        }

        return "not found"
    }

    // Or read a large test input from the `src/Day01_test.txt` file:
    val testInput = parseInput("example1")
    val part1Result = part1(testInput)
    check(part1Result == part1Expected) { "expected $part1Expected, got $part1Result" }

    // Read the input from the `src/Day01.txt` file.
    val input = parseInput("input")
    part1(input).println("part1")

    part2(input).println("part2")
}
