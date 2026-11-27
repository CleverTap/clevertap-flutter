#import <Foundation/Foundation.h>

#if __has_include(<CleverTapSDK/CleverTap.h>)
#import <CleverTapSDK/CleverTap.h>
#else
#import "CleverTap.h"
#endif

NS_ASSUME_NONNULL_BEGIN

/**
 * One account's SDK delegate. It posts the same notifications the plugin posted before, with the
 * account ID as the notification's `object`, so the event reaches Dart tagged with its account.
 *
 * Example: account B's profileDidInitialize posts kCleverTapProfileDidInitialize with
 * object @"B"; Dart receives {__ctEnvelope: true, accountId: "B", isDefault: false, payload: ...}.
 *
 * ⚠️ The SDK holds every delegate weakly (CleverTap.m 7.9.0:186, 264-280). The plugin keeps each
 * account's delegate in a dictionary for the app's lifetime; without that, ARC would free it and
 * the account's callbacks would stop silently.
 */
@interface CleverTapPluginInstanceDelegate : NSObject

@property (nonatomic, copy, readonly) NSString *accountId;

- (instancetype)initWithAccountId:(NSString *)accountId NS_DESIGNATED_INITIALIZER;
- (instancetype)init NS_UNAVAILABLE;

/// Sets this object as every SDK delegate of `instance`. Main thread (the plugin's wiring step).
- (void)attachToInstance:(CleverTap *)instance;

@end

NS_ASSUME_NONNULL_END
