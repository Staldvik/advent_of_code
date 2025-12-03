package day20

import utils.Dir
import utils.Grid
import utils.Pos
import utils.parseInput
import utils.println

data class DjikstraResult(val distanceFromStart: Map<Pos, Int>, val previousPos: Map<Pos, Pos>)


fun main() {
    val part1Expected = 0
    val part2Expected = 1

    fun djikstra(start: Pos, grid: Grid): DjikstraResult {
        val unvisited = mutableSetOf(start)

        val distanceFromStart = mutableMapOf<Pos, Int>().withDefault { Int.MAX_VALUE }
        distanceFromStart[start] = 0;

        val previous = mutableMapOf<Pos, Pos>()

        while (unvisited.isNotEmpty()) {
            val currentNode = unvisited.minBy { distanceFromStart.getValue(it) }
            unvisited.remove(currentNode)

            for (dir in Dir.cardinalDirs) {
                val nextNode = currentNode.moveDir(dir)
                if (!nextNode.isWithin(grid)) continue
                if ((grid.atPos(nextNode) ?: '#') == '#') continue
                val newDist = distanceFromStart.getValue(currentNode) + 1
                if (newDist < distanceFromStart.getValue(nextNode)) {
                    previous[nextNode] = currentNode
                    distanceFromStart[nextNode] = newDist
                    unvisited.add(nextNode)
                }
            }
        }

        return DjikstraResult(distanceFromStart, previous)
    }

    fun findPath(target: Pos, previous: Map<Pos, Pos>): Set<Pos> {
        val path = mutableListOf<Pos>()
        var current: Pos? = target;
        while (current != null) {
            path.add(current)
            current = previous[current]
        }
        return path.reversed().toSet()
    }

    fun part1(input: List<String>): Int {
        val raceTrack = Grid.fromInput(input)
        raceTrack.print()

        val start = raceTrack.getCharPos('S')
        val goal = raceTrack.getCharPos('E')

        val djikstraResult = djikstra(goal, raceTrack)

        djikstraResult.distanceFromStart[start].println("Shortest path to start is")

        val path = findPath(start, djikstraResult.previousPos)
        path.println("Shortest path is")

        val cheats = mutableSetOf<Pair<Pos, Pos>>()
        // Plan, for every pos in path, is it possible to reach a pos with shorter distance to goal
        for (cheatPos in path) {
            for (cheatDir in Dir.cardinalDirs) {
                val currentBest =
                    djikstraResult.distanceFromStart.getValue(cheatPos) - 2 // Subtract 2 normal steps to equal
                val newPos = cheatPos.moveDir(cheatDir, 2)
                if (!djikstraResult.distanceFromStart.contains(newPos)) continue
                val distSaved =
                    if (newPos == goal) currentBest else currentBest - djikstraResult.distanceFromStart.getValue(newPos)
                if (distSaved >= 100) cheats.add(Pair(cheatPos, newPos))
            }
        }

        return cheats.count()
    }

    fun part2(input: List<String>): Int {
        // Run Djikstra, for all positions try to do cheat
        // Cheat: New djikstra from Pos where 20 first steps are wallhack steps,
        // for all track tiles hit, check if it's better than original djikstra result
        // add start-end pairs to set and voila

        val raceTrack = Grid.fromInput(input)
        raceTrack.print()

        val start = raceTrack.getCharPos('S')
        val goal = raceTrack.getCharPos('E')

        val djikstraResult = djikstra(goal, raceTrack)
        val allPositions = djikstraResult.distanceFromStart

        djikstraResult.distanceFromStart[start].println("Shortest path to start is")

        val path = findPath(start, djikstraResult.previousPos)
        path.println("Shortest path is")

        val cheats = mutableSetOf<Pair<Pos, Pos>>()
        // Plan, for every pos in path, is it possible to reach a pos with shorter distance to goal
        for (cheatPos in path) {
            for (cheatDir in Dir.cardinalDirs) {
                val currentBest =
                    djikstraResult.distanceFromStart.getValue(cheatPos) - 2 // Subtract 2 normal steps to equal
                val newPos = cheatPos.moveDir(cheatDir, 2)
                if (!djikstraResult.distanceFromStart.contains(newPos)) continue
                val distSaved =
                    if (newPos == goal) currentBest else currentBest - djikstraResult.distanceFromStart.getValue(newPos)
                if (distSaved >= 100) cheats.add(Pair(cheatPos, newPos))
            }
        }

        return cheats.count()
    }

    // Or read a large test input from the `src/Day01_test.txt` file:
    val testInput = parseInput("example1")
    val part1Result = part1(testInput)
    check(part1Result == part1Expected) { "expected $part1Expected, got $part1Result" }

    // Read the input from the `src/Day01.txt` file.
    val input = parseInput("input")
    part1(input).println("part1") // 1166 and 1172 is too low

    val part2Result = part2(testInput)
    check(part2Result == 0) { "expected 0, got $part2Result" }

    part2(input).println("part2")
}
