import java.io.File
import java.net.URI
import java.net.http.HttpClient
import java.net.http.HttpRequest
import java.net.http.HttpResponse
import java.time.Duration
import java.time.LocalDate

val BASE_URL = "https://adventofcode.com"
val USER_AGENT = "github.com/Staldvik/aoc-downloader-script-kotlin"
val client = HttpClient.newHttpClient()

fun main() {
    print("Please enter year: ")
    val year = readln().toIntOrNull()
    if (year == null || year !in 2015..LocalDate.now().year) {
        println("Please enter a proper year")
        return
    }

    var sessionCookie = System.getenv("AOC_SESSION_TOKEN")
    if (sessionCookie.isNullOrBlank()) {
        print("AOC_SESSION_TOKEN not set, please enter: ")
        sessionCookie = readlnOrNull() ?: throw Exception("None provided, exiting")
    }

    for (day in 1..25) {
        println("Fetching day $year/$day...")

        // Create directory for the day
        val dayDir = File("${year}/files/day%02d".format(day))
        if (dayDir.exists()) {
            println("Day $dayDir already exists")
            continue
        }
        if (!dayDir.mkdirs()) {
            println("Error creating directory ${dayDir.path}")
            continue
        }

        downloadInput(year, day, sessionCookie, dayDir)
        downloadAndExtractExamples(year, day, sessionCookie, dayDir)
    }
    println("Done!")
}

fun downloadInput(year: Int, day: Int, sessionCookie: String, dir: File) {
    val url = "$BASE_URL/$year/day/$day/input"
    val request = HttpRequest.newBuilder()
        .uri(URI.create(url))
        .header("Cookie", "session=$sessionCookie")
        .header("User-Agent", USER_AGENT)
        .timeout(Duration.ofSeconds(10))
        .build()

    val response = client.send(request, HttpResponse.BodyHandlers.ofString())

    if (response.statusCode() != 200) {
        throw Exception("Failed to fetch input: status code ${response.statusCode()}")
    }

    val inputFile = File(dir, "input.txt")
    inputFile.writeText(response.body())
}

fun downloadAndExtractExamples(year: Int, day: Int, sessionCookie: String, dir: File) {
    val url = "$BASE_URL/$year/day/$day"
    val request = HttpRequest.newBuilder()
        .uri(URI.create(url))
        .header("Cookie", "session=$sessionCookie")
        .header("User-Agent", USER_AGENT)
        .timeout(Duration.ofSeconds(10))
        .build()

    val response = client.send(request, HttpResponse.BodyHandlers.ofString())

    if (response.statusCode() != 200) {
        throw Exception("Failed to fetch page: status code ${response.statusCode()}")
    }

    // Find examples in <pre><code> tags using Regex
    val regex = """(?s)<pre><code>(.*?)</code></pre>""".toRegex()
    val matches = regex.findAll(response.body())

    matches.forEachIndexed { i, matchResult ->
        var example = matchResult.groupValues[1]
        // Basic HTML unescaping
        example = example.replace("&lt;", "<")
            .replace("&gt;", ">")
            .replace("&amp;", "&")

        val fileName = "example${i + 1}.txt"
        val exampleFile = File(dir, fileName)
        exampleFile.writeText(example.trim())
    }
}

main()