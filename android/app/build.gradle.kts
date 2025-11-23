import java.util.Properties
import java.io.FileInputStream

plugins {
    id("com.android.application")
    id("kotlin-android")
    id("dev.flutter.flutter-gradle-plugin")
    id("com.google.gms.google-services") // Firebase services
    // id("com.google.firebase.crashlytics") // Optional: enable later for production
}

android {
    namespace = "com.example.muktiya_new"
    compileSdk = 36
    ndkVersion = flutter.ndkVersion

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_11
        targetCompatibility = JavaVersion.VERSION_11
    }

    kotlinOptions {
        jvmTarget = JavaVersion.VERSION_11.toString()
    }

    defaultConfig {
        applicationId = "com.example.muktiya_new"
        minSdk = flutter.minSdkVersion
        targetSdk = 34
        versionCode = flutter.versionCode
        versionName = flutter.versionName
    }

    // 🔐 Load keystore configuration from key.properties
    val keystorePropertiesFile = rootProject.file("key.properties")
    val keystoreProperties = Properties()

    if (keystorePropertiesFile.exists()) {
        keystoreProperties.load(FileInputStream(keystorePropertiesFile))
    } else {
        println("⚠️ Warning: key.properties file not found. Using debug signing config.")
    }

    signingConfigs {
        create("release") {
            if (keystorePropertiesFile.exists()) {
                storeFile = file(keystoreProperties["storeFile"] as String)
                storePassword = keystoreProperties["storePassword"] as String
                keyAlias = keystoreProperties["keyAlias"] as String
                keyPassword = keystoreProperties["keyPassword"] as String
            } else {
                // fallback to debug keystore for local testing
                storeFile = file("/home/dhruv/.android/debug.keystore")
                storePassword = "android"
                keyAlias = "androiddebugkey"
                keyPassword = "android"
            }
        }
    }

    buildTypes {
        debug {
            signingConfig = signingConfigs.getByName("release") // reuse for consistency
            isDebuggable = true
        }
        release {
            signingConfig = signingConfigs.getByName("release")
            isMinifyEnabled = true
            isShrinkResources = true
            isDebuggable = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
}

// Copy APKs to project root (optional utility task)
tasks.register<Copy>("copyApk") {
    dependsOn("assembleDebug", "assembleRelease")
    from(layout.buildDirectory.dir("outputs/apk/debug/app-debug.apk"))
    from(layout.buildDirectory.dir("outputs/apk/release/app-release.apk"))
    into(rootProject.projectDir)
}

dependencies {
    // Firebase BOM
    implementation(platform("com.google.firebase:firebase-bom:33.16.0"))

    // Firebase Analytics
    implementation("com.google.firebase:firebase-analytics")

    // Add optional Firebase features here:
    // implementation("com.google.firebase:firebase-auth")
    // implementation("com.google.firebase:firebase-firestore")
}

flutter {
    source = "../.."
}
