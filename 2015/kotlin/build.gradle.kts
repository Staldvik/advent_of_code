plugins {
    kotlin("jvm") version "2.1.0"
    java
}

dependencies {
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.9.0")
}

sourceSets {
    main {
        kotlin.srcDir("src")
        java.srcDir("src")
    }
}

tasks {
    wrapper {
        gradleVersion = "8.11"
    }
}
