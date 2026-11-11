#import "SceneDelegate.h"

#if __has_include(<clevertap_plugin/CleverTapPlugin.h>)
#import <clevertap_plugin/CleverTapPlugin.h>
#else
#import "CleverTapPlugin.h"
#endif

@implementation SceneDelegate

- (void)scene:(UIScene *)scene
    willConnectToSession:(UISceneSession *)session
                 options:(UISceneConnectionOptions *)connectionOptions {
    [super scene:scene willConnectToSession:session options:connectionOptions];
    // Cold-launch push payloads arrive here, not in didFinishLaunchingWithOptions,
    // so getInitialUrl() would otherwise miss the deep link.
    [[CleverTapPlugin sharedInstance] sceneWillConnectWithOptions:connectionOptions];
}

@end
