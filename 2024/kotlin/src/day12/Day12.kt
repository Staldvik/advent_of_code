package day12

import Dir
import Grid
import Pos
import println
import readInput
import java.util.*
import kotlin.math.abs

fun main() {
    val part1Expected = 1930
    val part2Expected = 1206

    fun flood(origin: Pos, map: Grid): Set<Pos> {
        val result = mutableSetOf<Pos>()

        val region = map.atPos(origin)
        val queue: Queue<Pos> = LinkedList()
        queue.add(origin)

        while (queue.isNotEmpty()) {
            val pos = queue.remove()
            if (map.atPos(pos) != region) continue
            if (result.contains(pos)) continue
            for (dir in Dir.cardinalDirs) {
                queue.add(pos.moveDir(dir))
            }
            result.add(pos)
        }

        return result
    }

    fun findRegions(map: Grid): MutableMap<Char, MutableList<Set<Pos>>> {
        val regionTypes = map.getChars()
        // Top-left is the region start, for every pos check if you can reach an existing region through only region chars

        val regions = mutableMapOf<Char, MutableList<Set<Pos>>>()

        regionTypes.forEach { (regionChar, positions) ->
            regions[regionChar] = mutableListOf()
            positions.forEach positionLoop@{ pos ->
                val isRegionStart = regions[regionChar]!!.none { it.contains(pos) }
                if (isRegionStart) {
                    regions[regionChar]!!.add(flood(pos, map))
                }
            }
        }

        return regions
    }


    fun part1(input: List<String>): Int {
        val map = Grid.fromInput(input)
        val charRegions = findRegions(map)

        fun countPerimeterEdges(pos: Pos) = Dir.cardinalDirs.count { map.atPos(pos.moveDir(it)) != map.atPos(pos) }

        return charRegions.entries.sumOf { (char, regions) ->
            regions.println(char.toString())
            val charRegionResult = regions.sumOf { region ->
                val perimeterEdges = region.sumOf { countPerimeterEdges(it) }
                println("$char: ${region.count()} * $perimeterEdges")
                perimeterEdges * region.count()
            }
            charRegionResult
        }
    }

    /**
     * New Plan
     *
     * Find all edges, try to combine edges
     * For each edge look along edge and try to connect
     *
     */

    fun part2(input: List<String>): Int {
        val map = Grid.fromInput(input)
        val charRegions = findRegions(map)

        fun countRegionSides(region: Set<Pos>): Int {
            var sides = 0;

            val allPosWithEdges =
                region.flatMap { pos ->
                    val posEdges = Dir.cardinalDirs.filterNot { region.contains(pos.moveDir(it)) }
                    posEdges.map { Pair(pos, it) }
                }

            map.printWith(allPosWithEdges.map { it.first })

            val seenY: MutableSet<Pair<Int, Dir>> = mutableSetOf()
            val seenX: MutableSet<Pair<Int, Dir>> = mutableSetOf()

            allPosWithEdges.forEach { (pos, edge) ->
                /** Left or right */
                val isHorizontalEdge = Dir.horizontalDirs.contains(edge)

                /** Up or down */
                val isVerticalEdge = Dir.verticalDirs.contains(edge)

                if (isHorizontalEdge && seenX.contains(Pair(pos.x, edge))) return@forEach
                if (isVerticalEdge && seenY.contains(Pair(pos.y, edge))) return@forEach

                // Find all pos that share edge. Todo: could be a fun when statement
                val sameLine = allPosWithEdges.filter {
                    when {
                        edge != it.second -> false
                        isHorizontalEdge -> pos.x == it.first.x
                        isVerticalEdge -> pos.y == it.first.y
                        else -> false
                    }
                }.map { it.first }.sortedBy { if (isVerticalEdge) it.y else it.x }


                // Find a way to filter out the ones that are contiguous
                var previousPos: Pos? = null
                val separateEdges = sameLine.withIndex().count { (idx, pos) ->
                    if (isHorizontalEdge) {
                        if (idx == 0) {
                            previousPos = pos
                            return@count true
                        }
                        if (abs(pos.y - previousPos!!.y) > 1) {
                            previousPos = pos
                            return@count true
                        }
                        previousPos = pos
                        return@count false
                    }

                    if (isVerticalEdge) {
                        if (idx == 0) {
                            previousPos = pos
                            return@count true
                        }
                        if (abs(pos.x - previousPos!!.x) > 1) {
                            previousPos = pos
                            return@count true
                        }
                        previousPos = pos
                        return@count false
                    }

                    error("Should not be reachable")
                }

                sameLine.println("$pos $edge same line as")
                separateEdges.println("giving")

                sides += separateEdges

                // When we reach this point, assume we have handled this entire line
                if (isHorizontalEdge) seenX.add(Pair(pos.x, edge))
                if (isVerticalEdge) seenY.add(Pair(pos.y, edge))
            }


            return sides
        }

        return charRegions.entries.sumOf { (char, regions) ->
            val charRegionResult = regions.sumOf { region ->
                val regionSides = countRegionSides(region)
                regionSides.println(char.toString())
                println("${region.count()} * $regionSides")
                regionSides * region.count()
            }
            charRegionResult
        }
    }

    // Or read a large test input from the `src/Day01_test.txt` file:
    val testInput = readInput("test2")
//    val part1Result = part1(testInput)
//    part1Result.println("test1")
//    check(part1Result == part1Expected) { "expected $part1Expected, got $part1Result" }

    val part2Result = part2(readInput("test2"))
    check(part2Result == part2Expected) { "expected $part2Expected, got $part2Result" }

    // Read the input from the `src/Day01.txt` file.
    val input = readInput("input")
    part1(input).println("part1")
    part2(input).println("part2") // 1007634 too high
}
