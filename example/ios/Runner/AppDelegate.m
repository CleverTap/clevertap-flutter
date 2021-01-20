#import "AppDelegate.h"
#import "GeneratedPluginRegistrant.h"
#import "CleverTap.h"
#import "CleverTapPlugin.h"
#import "CleverTap+ABTesting.h"
#import <UserNotifications/UserNotifications.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    [GeneratedPluginRegistrant registerWithRegistry:self];
    UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
    center.delegate = self;
    [center requestAuthorizationWithOptions:(UNAuthorizationOptionAlert | UNAuthorizationOptionBadge | UNAuthorizationOptionSound) completionHandler:^(BOOL granted, NSError * _Nullable error) {
        NSLog(@"Granted push permission: %@", @(granted));
    }];
    // Override point for customization after application launch.
    [CleverTap setUIEditorConnectionEnabled:YES];
    [CleverTap autoIntegrate]; // integrate CleverTap SDK using the autoIntegrate option
    [[CleverTapPlugin sharedInstance] applicationDidLaunchWithOptions:launchOptions];
    return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (void)userNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions options))completionHandler{
    completionHandler(UNAuthorizationOptionSound | UNAuthorizationOptionAlert | UNAuthorizationOptionBadge);
}

- (void)userNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response withCompletionHandler:(void (^)(void))completionHandler {
    completionHandler();
}

@end
