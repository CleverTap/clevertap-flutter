#import <Flutter/Flutter.h>

static NSString *const kCleverTapProfileDidInitialize             = @"profileDidInitialize";
static NSString *const kCleverTapProfileSync                      = @"profileDataUpdated";
static NSString *const kCleverTapInAppNotificationDismissed       = @"inAppNotificationDismissed";
static NSString *const kCleverTapInboxDidInitialize               = @"inboxDidInitialize";
static NSString *const kCleverTapInboxMessagesDidUpdate           = @"inboxMessagesDidUpdate";
static NSString *const kCleverTapDisplayUnitsLoaded               = @"onDisplayUnitsLoaded";
static NSString *const kCleverTapInAppNotificationButtonTapped    = @"onInAppButtonClick";
static NSString *const kCleverTapInboxMessageButtonTapped         = @"onInboxButtonClick";
static NSString *const kCleverTapProductConfigFetched             = @"productConfigFetched";
static NSString *const kCleverTapProductConfigActivated           = @"productConfigActivated";
static NSString *const kCleverTapProductConfigInitialized         = @"productConfigInitialized";
static NSString *const kCleverTapFeatureFlagsUpdated              = @"featureFlagsUpdated";
static NSString *const kCleverTapPushNotificationClicked          = @"pushClickedPayloadReceived";

@interface CleverTapPlugin : NSObject <FlutterPlugin>

+ (instancetype)sharedInstance;

- (void)applicationDidLaunchWithOptions:(NSDictionary *)options;

@property NSString *launchDeepLink;

@end
