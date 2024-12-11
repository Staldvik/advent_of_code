package day11

import kotlinx.coroutines.*
import println
import readInput
import java.util.*
import kotlin.time.TimeSource

fun main() {
    val part1Expected = 55312
    val part2Expected = 55312L

    fun applyRule(stone: Long): List<Long> {
        return when {
            stone == 0L -> listOf(1)
            stone.toString().count() % 2 == 0 -> {
                val stoneString = stone.toString()
                val split = stoneString.chunked(stoneString.count() / 2).map { it.toLong() }
                split
            }

            else -> listOf(stone * 2024L)
        }
    }

    fun part1(input: List<String>): Int {
        var stones = input.first().split(" ").map { it.toLong() }

        for (blinkI in 1..25) {
            stones = stones.flatMap { applyRule(it) }
        }

        return stones.count()
    }

    /**
     * Plan: Do one and one stone. Find how many stones that results in before going to next stone
     * Optimalization could be to check for existing stone results, but that requires recursion and I don't want to unless I have to
     *
     * Fail 1 - Takes too much space, possibly all the copying going on
     *
     * What if I do a LinkedList and just add onto it?
     *
     * Fail 2 - Way too slow, even for part 1
     *
     * I think I need to do some DP or something?
     * Start with simple recursion on one stone, 75 depth can't be that bad? This will almost be some kind of DFS then I guess
     */

    val stoneAmountFromDepth = Collections.synchronizedMap(mutableMapOf<Pair<Long, Int>, Long>())

    suspend fun look(stone: Long, depth: Int): Long {
        if (depth == 0) return 1
        val storedResult = stoneAmountFromDepth[Pair(stone, depth)]
        if (storedResult != null) return storedResult

        val newStones = applyRule(stone)

        return coroutineScope {
            val dispatcher = Dispatchers.Default.limitedParallelism(20)

            newStones.map { newStone ->
                async(dispatcher) {
                    val result = look(newStone, depth - 1)
                    stoneAmountFromDepth.putIfAbsent(Pair(newStone, depth - 1), result)
                    result
                }
            }.awaitAll().sum()
        }
    }

    suspend fun part2(input: List<String>): Long {
        val stones = LinkedList(input.first().split(" ").map { it.toLong() })

        return stones.sumOf { look(it, 75) }
    }

    // Or read a large test input from the `src/Day01_test.txt` file:
    val testInput = readInput("test")
    val part1Result = part1(testInput)
    check(part1Result == part1Expected) { "expected $part1Expected, got $part1Result" }
    val mark = TimeSource.Monotonic.markNow()
    val part2Result = runBlocking {
        part2(testInput)
    }
    println("Execution time: ${mark.elapsedNow()}")
    //check(part2Result == part2Expected) { "expected $part2Expected, got $part2Result" }


    // Read the input from the `src/Day01.txt` file.
    val input = readInput("input")
    part1(input).println("part1")
    val part2RealResult = runBlocking {
        part2(input)
    }
    part2RealResult.println("part2")
}
