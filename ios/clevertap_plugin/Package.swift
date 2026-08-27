// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "clevertap_plugin",
    platforms: [
        .iOS("13.0")
    ],
    products: [
        .library(name: "clevertap-plugin", targets: ["clevertap_plugin"])
    ],
    dependencies: [
        .package(
            url: "https://github.com/CleverTap/clevertap-ios-sdk",
            exact: "7.8.1"
        )
    ],
    targets: [
        .target(
            name: "clevertap_plugin",
            dependencies: [
                .product(name: "CleverTapSDK", package: "clevertap-ios-sdk")
            ],
            cSettings: [
                .headerSearchPath("include/clevertap_plugin")
            ]
        )
    ]
)
