// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "clevertap_plugin",
    platforms: [
        .iOS("12.0")
    ],
    products: [
        .library(name: "clevertap-plugin", targets: ["clevertap_plugin"])
    ],
    dependencies: [
        .package(
            url: "https://github.com/CleverTap/clevertap-ios-sdk",
            exact: "7.6.0"
        )
    ],
    targets: [
        .target(
            name: "clevertap_plugin",
            dependencies: [
                .product(name: "CleverTapSDK", package: "clevertap-ios-sdk")
            ],
            path: "Classes",
            publicHeadersPath: "include",
            cSettings: [
                .headerSearchPath("include"),
                .headerSearchPath(".")
            ]
        )
    ]
)
