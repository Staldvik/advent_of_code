import java.math.BigInteger
import java.security.MessageDigest
import kotlin.io.path.Path
import kotlin.io.path.readText

/**
 * Read input as single String
 */
fun readInput(name: String): String {
    val callerClass = Thread.currentThread().stackTrace[2].className
    val packagePath = callerClass.replace('.', '/')
        .substringBeforeLast('/')
    val filePath = "src/$packagePath/$name.txt"
    return Path(filePath).readText().trim()
}

/**
 * Reads lines from the given input txt file.
 */
fun parseInput(name: String): List<String> {
    val callerClass = Thread.currentThread().stackTrace[2].className
    val packagePath = callerClass.replace('.', '/')
        .substringBeforeLast('/')
    val filePath = "src/$packagePath/$name.txt"
    return Path(filePath).readText().trim().lines()
}

/**
 * Converts string to md5 hash.
 */
fun String.md5() = BigInteger(1, MessageDigest.getInstance("MD5").digest(toByteArray()))
    .toString(16)
    .padStart(32, '0')

/**
 * The cleaner shorthand for printing output.
 */
fun Any?.println(name: String? = null) {
    name?.let { print("$name: ") }
    println(this)
}

fun String.allIndexesOf(substring: String): List<Int> {
    return this.windowed(substring.length).toList().withIndex().mapNotNull { (index, it) ->
        if (it == substring) index
        else null
    }
}

fun <T> List<T>.exceptIndex(index: Int): List<T> {
    return this.filterIndexed { i, _ -> i != index }
}