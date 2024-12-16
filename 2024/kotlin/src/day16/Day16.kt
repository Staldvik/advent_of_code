package day16

import Dir
import Grid
import Pos
import parseInput
import println
import java.util.*


fun main() {
    val part1Expected = 7036
    val part2Expected = 45

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
    fun aStar(start: Pos, goal: Pos, maze: Grid): List<Pair<Int, List<Pos>>> {
        val result = mutableListOf<Pair<Int, List<Pos>>>()

        /** Discovered nodes that may need to be checked out */
        val openSet = mutableSetOf<Pair<Pos, Dir>>()
        openSet.add(Pair(start, Dir.RIGHT))

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
            val current = openSet.minBy { fScore.getOrDefault(it.first, Int.MAX_VALUE) }
            val (currentPos, currentDir) = current
            if (currentPos == goal) result.add(Pair(gScore[goal]!!, reconstructPath(cameFrom, goal)))

            openSet.remove(current)
            Dir.cardinalDirs.forEach { newDir ->
                if (maze.atPos(currentPos.moveDir(newDir)) == '#') return@forEach

                val neighbor = currentPos.moveDir(newDir)
                val costToNode = if (newDir == currentDir) 1 else 1001
                val tentativeScore = gScore.getOrDefault(currentPos, Int.MAX_VALUE) + costToNode

                if (tentativeScore <= gScore.getOrDefault(neighbor, Int.MAX_VALUE)) {
                    // This path to neighbor is better or equal to previous one. Record it
                    cameFrom[neighbor] = currentPos
                    gScore[neighbor] = tentativeScore
                    fScore[neighbor] = tentativeScore + h(neighbor, goal)

                    if (!openSet.contains(Pair(neighbor, newDir))) {
                        openSet.add(Pair(neighbor, newDir))
                    }
                }
            }
        }

        return result
    }

    fun part1(input: List<String>): Int {
        val maze = Grid.fromInput(input)

        val start = maze.getCharPos('S')
        val goal = maze.getCharPos('E')

        val (cost, path) = aStar(start, goal, maze).first()
        path.println("Path with cost $cost")
        maze.printWith(path, '$')

        return cost
    }

    fun part2(input: List<String>): Int {
        val maze = Grid.fromInput(input)

        val start = maze.getCharPos('S')
        val goal = maze.getCharPos('E')

        val result = aStar(start, goal, maze)

        for ((cost, path) in result) {
            println("Path with cost $cost")
            maze.printWith(path, 'Å')
        }


        result.println("Result")
        return result.flatMap { it.second.toSet() }.toSet().count()
    }

    // Or read a large test input from the `src/Day01_test.txt` file:
    val testInput = parseInput("test")
    val part1Result = part1(testInput)
    check(part1Result == part1Expected) { "expected $part1Expected, got $part1Result" }

    check(part1(parseInput("test-2")) == 11048) { "expected 11048" }


    // Read the input from the `src/Day01.txt` file.
    val input = parseInput("input")
    part1(input).println("part1")

    val part2Result = part2(testInput)
    check(part2Result == part2Expected) { "expected $part2Expected, got $part2Result" }

    part2(input).println("part2")
}
