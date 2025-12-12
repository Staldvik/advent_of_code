package day08

import utils.parseInput
import utils.println
import java.util.PriorityQueue
import kotlin.math.pow
import kotlin.math.sqrt

data class Box(val index: Int, val x: Long, val y: Long, val z: Long) {
    fun distanceTo(other: Box): Double {
        return sqrt((other.x - x).toDouble().pow(2) + (other.y - y).toDouble().pow(2) + (other.z - z).toDouble().pow(2))
    }

    companion object {
        fun fromString(index: Int, input: String): Box {
            val (x, y, z) = input.split(",").map { it.toLong() }
            return Box(index, x, y, z)
        }
    }

    override fun toString(): String {
        return "[$index,$x,$y,$z]"
    }
}

fun main() {
    val part1Expected = 0
    val part2Expected = 25272

    fun part1(input: List<String>): Int {
        val boxes = input.mapIndexed { index, string -> Box.fromString(index, string) }

        val allPairs = boxes.flatMapIndexed { index, point1 ->
            boxes.drop(index + 1).map { Pair(point1, it) }
        }.toMutableList().sortedBy { it.first.distanceTo(it.second) }

        val unionFind = UnionFind(boxes.size)
        for (pair in allPairs.take(1000)) {
            unionFind.union(pair.first.index, pair.second.index)
        }

        return unionFind.counts().sortedByDescending { it }.take(3).fold(1) { acc, i -> acc * i }
    }

    fun part2(input: List<String>): Int {
        val boxes = input.mapIndexed { index, string -> Box.fromString(index, string) }

        val allPairs = boxes.flatMapIndexed { index, point1 ->
            boxes.drop(index + 1).map { Pair(point1, it) }
        }.toMutableList().sortedBy { it.first.distanceTo(it.second) }

        val unionFind = UnionFind(boxes.size)
        for (link in allPairs) {
            unionFind.union(link.first.index, link.second.index)
            if (unionFind.isSingle()) {
                return link.first.x.toInt() * link.second.x.toInt()
            }
        }
        return 0
    }

    fun testSolution(solver: (List<String>) -> Int, input: List<String>, expected: Int) {
        val result = solver(input)
        check(result == expected) { "Expected $expected but got $result" }
    }

    // Or read a large test input from the `src/Day01_test.txt` file:
    val testInput = parseInput("example1")
    testInput.println("Read testinput")
    testSolution(::part1, testInput, part1Expected)
    testSolution(::part2, testInput, part2Expected)

    // Read the input from the `src/Day01.txt` file.
    val input = parseInput("input")
    input.println("Read input")
    testSolution(::part1, input, 54600) // 3990 too low
    testSolution(::part2, input, 107256172)
}

class UnionFind(val n: Int) {
    val parent = IntArray(n) { it }

    fun find(x: Int): Int {
        if (parent[x] != x) parent[x] = find(parent[x])
        return parent[x]
    }

    fun union(x: Int, y: Int) {
        val rootX = find(x)
        val rootY = find(y)
        if (rootX != rootY) parent[rootX] = rootY
    }

    fun counts(): IntArray {
        val count = IntArray(n)
        for (i in 0..<n) {
            count[find(i)]++
        }
        return count
    }

    fun isSingle(): Boolean {
        val found = find(0)
        return (1..<n).all { found == find(it) }
    }
}
