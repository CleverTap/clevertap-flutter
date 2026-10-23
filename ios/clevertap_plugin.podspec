#
# To learn more about a Podspec see http://guides.cocoapods.org/syntax/podspec.html
#
Pod::Spec.new do |s|
  s.name                     = 'clevertap_plugin'
  s.version                  = '4.3.0'
  s.summary                  = 'CleverTap Flutter plugin.'
  s.description              = <<-DESC
                               The CleverTap iOS SDK for App Analytics and Engagement.

                               NOTICE: CocoaPods trunk becomes read-only on December 2, 2026. Flutter apps must
                               add these lines to the top of their ios/Podfile to keep receiving CleverTap updates:
                                 source 'https://github.com/CleverTap/podspecs.git'
                                 source 'https://cdn.cocoapods.org/'
                               Existing installs are unaffected. See the README.
                               DESC
  s.homepage                 = 'https://github.com/CleverTap/clevertap-ios-sdk'
  s.license                  = { :file => '../LICENSE' }
  s.author                   = { "CleverTap" => "http://www.clevertap.com" }
  s.source                   = { :path => '.' }
  s.source_files             = 'clevertap_plugin/Sources/clevertap_plugin/**/*.{h,m}'
  s.public_header_files      = 'clevertap_plugin/Sources/clevertap_plugin/include/clevertap_plugin/*.h'
  s.dependency               'Flutter'
  s.dependency               'CleverTap-iOS-SDK', '7.9.0'
  s.ios.deployment_target    = '9.0'
end

