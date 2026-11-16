#import "CleverTapPlugin.h"

NS_ASSUME_NONNULL_BEGIN

/// Plugin methods shared with the plugin's own classes. Not public API (not in include/).
@interface CleverTapPlugin (Internal)

/// Posts an event notification tagged with its account (the notification's `object`). A nil
/// accountId means "account unknown", which Dart routes to the default handlers, as before.
- (void)postNotificationWithName:(NSString *)name andBody:(nullable NSDictionary *)body accountId:(nullable NSString *)accountId;

- (NSArray *)_cleverTapDisplayUnitToArray:(NSArray *)displayUnits;

@end

NS_ASSUME_NONNULL_END
