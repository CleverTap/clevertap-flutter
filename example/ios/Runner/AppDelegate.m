#import "AppDelegate.h"
#import "GeneratedPluginRegistrant.h"
#import <UserNotifications/UserNotifications.h>

#if __has_include(<CleverTapSDK/CleverTap.h>)
#import <CleverTapSDK/CleverTap.h>
#else
#import "CleverTap.h"
#endif
#if __has_include(<clevertap_plugin/CleverTapPlugin.h>)
#import <clevertap_plugin/CleverTapPlugin.h>
#import <clevertap_plugin/CleverTapPluginCustomTemplates.h>
#else
#import "CleverTapPlugin.h"
#import "CleverTapPluginCustomTemplates.h"
#endif

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    [CleverTapPluginCustomTemplates registerCustomTemplates:@"templates", nil];
    [GeneratedPluginRegistrant registerWithRegistry:self];
    UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
    center.delegate = self;
    // Override point for customization after application launch.
    [[CleverTapPlugin sharedInstance] applicationDidLaunchWithOptions:launchOptions];
    [CleverTap autoIntegrate]; // integrate CleverTap SDK using the autoIntegrate option
    return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (void)userNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions options))completionHandler{
    completionHandler(UNAuthorizationOptionSound | UNAuthorizationOptionAlert | UNAuthorizationOptionBadge);
}

@end
