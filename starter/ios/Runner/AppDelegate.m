#import "AppDelegate.h"
#import "GeneratedPluginRegistrant.h"
#import "CleverTap.h"
#import "CleverTapPlugin.h"

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application
    didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
  [GeneratedPluginRegistrant registerWithRegistry:self];
  [CleverTap setCredentialsWithAccountID:@"TEST-Z9R-486-4W5Z" andToken:@"TEST-6b4-2c1"];
  [CleverTap autoIntegrate];
  [[CleverTapPlugin sharedInstance] applicationDidLaunchWithOptions:launchOptions];
  // Override point for customization after application launch.
  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

@end
