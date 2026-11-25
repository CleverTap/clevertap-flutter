//
//  CleverTapPluginLaunchConfig.h
//  CleverTapPlugin
//

#import <Foundation/Foundation.h>
#if __has_include(<CleverTapSDK/CleverTapInstanceConfig.h>)
#import <CleverTapSDK/CleverTapInstanceConfig.h>
#else
#import "CleverTapInstanceConfig.h"
#endif

NS_ASSUME_NONNULL_BEGIN

/// An extra CleverTap account to create when the app starts, before Flutter runs. Pass a list to
/// `-[CleverTapPlugin applicationDidLaunchWithOptions:launchConfigs:]`.
///
/// Why: iOS hands a push tap to the accounts that exist when the app finishes launching. An
/// account created later from Dart misses the tap that opened the app. Dart then uses
/// `CleverTapPlugin.getInstance(accountId)`.
@interface CleverTapPluginLaunchConfig : NSObject

/// The native config, so every SDK setting is available.
@property (nonatomic, strong, readonly) CleverTapInstanceConfig *config;
/// A custom CleverTap ID; used only when `config.useCustomCleverTapId` is YES.
@property (nonatomic, copy, readonly, nullable) NSString *cleverTapID;

- (instancetype)initWithConfig:(CleverTapInstanceConfig *)config;
- (instancetype)initWithConfig:(CleverTapInstanceConfig *)config cleverTapID:(nullable NSString *)cleverTapID;
- (instancetype)init NS_UNAVAILABLE;

@end

NS_ASSUME_NONNULL_END
