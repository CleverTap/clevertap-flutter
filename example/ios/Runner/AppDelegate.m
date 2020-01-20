#import "AppDelegate.h"
#import "GeneratedPluginRegistrant.h"
#import "CleverTap.h"
#import "CleverTapPlugin.h"

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    [GeneratedPluginRegistrant registerWithRegistry:self];
    // Override point for customization after application launch.
    [CleverTap autoIntegrate]; // integrate CleverTap SDK using the autoIntegrate option
    [[CleverTapPlugin sharedInstance] applicationDidLaunchWithOptions:launchOptions];
    return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

@end
