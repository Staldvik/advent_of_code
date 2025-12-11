package day11

import utils.parseInput

data class Node(val name: String, var outputs: List<Node>)

fun main() {
    val part1Expected = 5
    val part2Expected = 8

    fun part1(input: List<String>): Int {
        val graph = input.map { line ->
            val name = line.split(":").first()
            Node(name, listOf())
        }.toMutableList()

        graph.add(Node("out", emptyList()))

        input.zip(graph).forEach { (line, node) ->
            val outputs = line.split(":").last().trim().split(" ")
                .map { graph.find { node -> node.name == it } ?: throw Exception("Invalid node $line") }
            node.outputs = outputs
        }

        fun allPaths(): Sequence<List<Node>> = sequence {
            val visited = mutableSetOf<Node>()

            suspend fun SequenceScope<List<Node>>.dfs(node: Node, path: MutableList<Node>) {
                if (node.name == "out") {
                    yield(path.toList())
                }
                for (node in node.outputs) {
                    if (node in visited) continue
                    visited.add(node)
                    path.add(node)
                    dfs(node, path)
                    path.removeAt(path.lastIndex)
                    visited.remove(node)
                }
            }

            val start = graph.find { it.name == "you" } ?: throw Exception("Start not found")
            visited.add(start)
            dfs(start, mutableListOf(start))
        }

        return allPaths().count()
    }

    fun part2(input: List<String>): Int {
        return 2;
    }

    fun testSolution(solver: (List<String>) -> Int, input: List<String>, expected: Int) {
        val result = solver(input)
        check(result == expected) { "Expected $expected but got $result" }
    }

    // Or read a large test input from the `src/Day01_test.txt` file:
    val testInput = parseInput("example1")
    testSolution(::part1, testInput, part1Expected)
    val testInput2 = parseInput("example2")
    testSolution(::part2, testInput2, part2Expected)

    // Read the input from the `src/Day01.txt` file.
    val input = parseInput("input")
    testSolution(::part1, input, 599)
    testSolution(::part2, input, 1)
}
