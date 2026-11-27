#import "CleverTapPluginInstanceDelegate.h"
#import "CleverTapPlugin.h"
#import "CleverTapPlugin+Internal.h"

#if __has_include(<CleverTapSDK/CleverTapSyncDelegate.h>)
#import <CleverTapSDK/CleverTapSyncDelegate.h>
#else
#import "CleverTapSyncDelegate.h"
#endif

#if __has_include(<CleverTapSDK/CleverTap+DisplayUnit.h>)
#import <CleverTapSDK/CleverTap+DisplayUnit.h>
#else
#import "CleverTap+DisplayUnit.h"
#endif

#if __has_include(<CleverTapSDK/CleverTap+FeatureFlags.h>)
#import <CleverTapSDK/CleverTap+FeatureFlags.h>
#else
#import "CleverTap+FeatureFlags.h"
#endif

#if __has_include(<CleverTapSDK/CleverTap+ProductConfig.h>)
#import <CleverTapSDK/CleverTap+ProductConfig.h>
#else
#import "CleverTap+ProductConfig.h"
#endif

#if __has_include(<CleverTapSDK/CleverTapPushNotificationDelegate.h>)
#import <CleverTapSDK/CleverTapPushNotificationDelegate.h>
#else
#import "CleverTapPushNotificationDelegate.h"
#endif

#if __has_include(<CleverTapSDK/CleverTapInAppNotificationDelegate.h>)
#import <CleverTapSDK/CleverTapInAppNotificationDelegate.h>
#else
#import "CleverTapInAppNotificationDelegate.h"
#endif

#if __has_include(<CleverTapSDK/CleverTap+Inbox.h>)
#import <CleverTapSDK/CleverTap+Inbox.h>
#else
#import "CleverTap+Inbox.h"
#endif

#if __has_include(<CleverTapSDK/CleverTap+PushPermission.h>)
#import <CleverTapSDK/CleverTap+PushPermission.h>
#else
#import "CleverTap+PushPermission.h"
#endif

@interface CleverTapPluginInstanceDelegate () <CleverTapSyncDelegate, CleverTapInAppNotificationDelegate, CleverTapDisplayUnitDelegate, CleverTapProductConfigDelegate, CleverTapFeatureFlagsDelegate, CleverTapPushNotificationDelegate, CleverTapPushPermissionDelegate, CleverTapInboxViewControllerDelegate>
@end

@implementation CleverTapPluginInstanceDelegate

- (instancetype)initWithAccountId:(NSString *)accountId {
    self = [super init];
    if (self) {
        _accountId = [accountId copy];
    }
    return self;
}

- (void)attachToInstance:(CleverTap *)instance {
    [instance setSyncDelegate:self];
    [instance setInAppNotificationDelegate:self];
    [instance setDisplayUnitDelegate:self];
    [[instance productConfig] setDelegate:self];
    [[instance featureFlags] setDelegate:self];
    [instance setPushNotificationDelegate:self];
    [instance setPushPermissionDelegate:self];
}

/// Every callback posts through here, tagged with this account.
- (void)post:(NSString *)name body:(nullable NSDictionary *)body {
    [[CleverTapPlugin sharedInstance] postNotificationWithName:name andBody:body accountId:self.accountId];
}

#pragma mark CleverTapInboxViewControllerDelegate

// showInbox gives each inbox screen its own account's delegate, so a tap is tagged with the
// account of the inbox it happened in. Example: A's inbox is open and b.showInbox() is refused by
// UIKit ("already presenting"); a tap in A's inbox still reaches A, not B. The bodies are the ones
// the plugin sent before.

- (void)messageButtonTappedWithCustomExtras:(NSDictionary *_Nullable)customExtras {
    NSMutableDictionary *body = [NSMutableDictionary new];
    if (customExtras != nil) {
        body = [NSMutableDictionary dictionaryWithDictionary:customExtras];
    }
    [self post:kCleverTapInboxMessageButtonTapped body:body];
}

- (void)messageDidSelect:(CleverTapInboxMessage *_Nonnull)message atIndex:(int)index withButtonIndex:(int)buttonIndex {
    NSMutableDictionary *body = [NSMutableDictionary new];
    if ([message json] != nil) {
        body[@"data"] = [NSMutableDictionary dictionaryWithDictionary:[message json]];
    } else {
        body[@"data"] = [NSMutableDictionary new];
    }
    body[@"contentPageIndex"] = @(index);
    body[@"buttonIndex"] = @(buttonIndex);
    [self post:kCleverTapInboxMessageTapped body:body];
}

#pragma mark CleverTapSyncDelegate

- (void)profileDidInitialize:(NSString *)cleverTapID {
    if (!cleverTapID) {
        return;
    }
    [self post:kCleverTapProfileDidInitialize body:@{@"CleverTapID": cleverTapID}];
}

- (void)profileDataUpdated:(NSDictionary *)updates {
    if (!updates) {
        return;
    }
    [self post:kCleverTapProfileSync body:@{@"updates": updates}];
}

#pragma mark CleverTapInAppNotificationDelegate

- (void)inAppNotificationDismissedWithExtras:(NSDictionary *)extras andActionExtras:(NSDictionary *)actionExtras {
    NSMutableDictionary *body = [NSMutableDictionary new];
    body[@"extras"] = (extras != nil) ? extras : [NSMutableDictionary new];
    body[@"actionExtras"] = (actionExtras != nil) ? actionExtras : [NSMutableDictionary new];
    [self post:kCleverTapInAppNotificationDismissed body:body];
}

- (void)inAppNotificationDidShow:(NSDictionary *)notification {
    // The in-app's JSON, sent directly like Android's onShow (jsonDescription). Called by the SDK for
    // every in-app it displays, local ones included (iOS SDK 7.1.0+, CTInAppDisplayManager.m).
    NSMutableDictionary *body = [NSMutableDictionary new];
    if (notification != nil) {
        body = [NSMutableDictionary dictionaryWithDictionary:notification];
    }
    [self post:kCleverTapInAppNotificationShow body:body];
}

- (void)inAppNotificationButtonTappedWithCustomExtras:(NSDictionary *)customExtras {
    // Sends customExtras itself, as the plugin did before (the body map it built was unused).
    [self post:kCleverTapInAppNotificationButtonTapped body:customExtras];
}

#pragma mark CleverTapDisplayUnitDelegate

- (void)displayUnitsUpdated:(NSArray<CleverTapDisplayUnit *> *)displayUnits {
    NSMutableDictionary *body = [NSMutableDictionary new];
    [body setValue:[[CleverTapPlugin sharedInstance] _cleverTapDisplayUnitToArray:displayUnits] forKey:@"adUnits"];
    [self post:kCleverTapDisplayUnitsLoaded body:body];
}

#pragma mark CleverTapProductConfigDelegate

- (void)ctProductConfigFetched {
    [self post:kCleverTapProductConfigFetched body:nil];
}

- (void)ctProductConfigActivated {
    [self post:kCleverTapProductConfigActivated body:nil];
}

- (void)ctProductConfigInitialized {
    [self post:kCleverTapProductConfigInitialized body:nil];
}

#pragma mark CleverTapFeatureFlagsDelegate

- (void)ctFeatureFlagsUpdated {
    [self post:kCleverTapFeatureFlagsUpdated body:nil];
}

#pragma mark CleverTapPushNotificationDelegate

- (void)pushNotificationTappedWithCustomExtras:(NSDictionary *)customExtras {
    NSMutableDictionary *extras = [NSMutableDictionary new];
    if (customExtras != nil) {
        extras = [NSMutableDictionary dictionaryWithDictionary:customExtras];
    }
    [self post:kCleverTapPushNotificationClicked body:extras];
}

#pragma mark CleverTapPushPermissionDelegate

- (void)onPushPermissionResponse:(BOOL)accepted {
    NSMutableDictionary *body = [NSMutableDictionary new];
    body[@"accepted"] = [NSNumber numberWithBool:accepted];
    [self post:kCleverTapPushPermissionResponseReceived body:body];
}

@end
