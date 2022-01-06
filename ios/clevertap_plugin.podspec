#
# To learn more about a Podspec see http://guides.cocoapods.org/syntax/podspec.html
#
Pod::Spec.new do |s|
  s.name                     = 'clevertap_plugin'
  s.version                  = '1.4.0'
  s.summary                  = 'CleverTap Flutter plugin.'
  s.description              = 'The CleverTap iOS SDK for App Analytics and Engagement.'                   
  s.homepage                 = 'https://github.com/CleverTap/clevertap-ios-sdk'
  s.license                  = { :file => '../LICENSE' }
  s.author                   = { "CleverTap" => "http://www.clevertap.com" }
  s.source                   = { :path => '.' }
  s.source_files             = 'Classes/**/*'
  s.public_header_files      = 'Classes/**/*.h'
  s.dependency               'Flutter'
  s.dependency               'CleverTap-iOS-SDK', '3.10.0'
  s.ios.deployment_target    = '9.0'
end

