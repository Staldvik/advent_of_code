package day23

import parseInput
import println


fun main() {
    val part1Expected = 7
    val part2Expected = 1

    fun part1(input: List<String>): Int {
        val machines = mutableMapOf<String, MutableSet<String>>()
        input.forEach {
            val (machine, connection) = it.split("-")
            machines.getOrPut(machine) { mutableSetOf() }.add(connection)
            machines.getOrPut(connection) { mutableSetOf() }.add(machine)
        }

        val setsOfThree = mutableSetOf<Set<String>>()

        for ((machine, connections) in machines.entries) {
            val sets = connections.flatMap {
                val commonMachines =
                    machines.getValue(it).filter { other -> other != machine && connections.contains(other) }
                if (commonMachines.isNotEmpty()) {
                    commonMachines.map { common ->
                        setOf(machine, it, common)
                    }
                } else emptySet()
            }.toSet()
            setsOfThree.addAll(sets.filter { it.count() >= 3 })
        }

        return setsOfThree.count { it.any { machine -> machine.startsWith('t') } }
    }

    fun part2(input: List<String>): String {
        val machines = mutableMapOf<String, MutableSet<String>>()
        input.forEach {
            val (machine, connection) = it.split("-")
            machines.getOrPut(machine) { mutableSetOf() }.add(connection)
            machines.getOrPut(connection) { mutableSetOf() }.add(machine)
        }

        val setsOfThree = mutableSetOf<Set<String>>()

        for ((machine, connections) in machines.entries) {
            val sets = connections.flatMap {
                val commonMachines =
                    machines.getValue(it).filter { other -> other != machine && connections.contains(other) }
                if (commonMachines.isNotEmpty()) {
                    commonMachines.map { common ->
                        setOf(machine, it, common)
                    }
                } else emptySet()
            }.toSet()
            setsOfThree.addAll(sets.filter { it.count() >= 3 })
        }

        fun findCommonMachines(machine: String, connections: Set<String>): List<String> {
            val result = mutableListOf(machine)
            connections.println("Machine ($machine) is connected to")
            connections.forEach { connection ->
                val connectionMachines = machines.getValue(connection)
                connectionMachines.println("Connection ($connection) machines")

                val otherMachines = connections.filterNot { it == connection }
                otherMachines.println("Other machines in original connections")
            }
            return result
        }

        val (machine, connections) = machines.entries.maxBy { (machine, connections) ->
            val commonMachines = findCommonMachines(machine, connections)
            commonMachines.println("common machines")
            commonMachines.count()
        }

        connections.println("connections")

        val result = findCommonMachines(machine, connections)
        result.println("asd")
        return result.sorted().joinToString("")
    }

    // Or read a large test input from the `src/Day01_test.txt` file:
    val testInput = parseInput("test")
    val part1Result = part1(testInput)
    check(part1Result == part1Expected) { "expected $part1Expected, got $part1Result" }

    // Read the input from the `src/Day01.txt` file.
    val input = parseInput("input")
    part1(input).println("part1")

    val part2Result = part2(testInput)
    check(part2Result == "123") { "expected $part2Expected, got $part2Result" }

    part2(input).println("part2")
}
