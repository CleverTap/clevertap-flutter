#import <Flutter/Flutter.h>

static NSString *const kCleverTapProfileDidInitialize       = @"profileDidInitialize";
static NSString *const kCleverTapProfileSync                = @"profileDataUpdated";
static NSString *const kCleverTapInAppNotificationDismissed = @"inAppNotificationDismissed";
static NSString *const kCleverTapInboxDidInitialize         = @"inboxDidInitialize";
static NSString *const kCleverTapInboxMessagesDidUpdate     = @"inboxMessagesDidUpdate";
static NSString *const kCleverTapExperimentsDidUpdate       = @"CTExperimentsUpdated";
static NSString *const kCleverTapDisplayUnitsLoaded         = @"onDisplayUnitsLoaded";
static NSString *const kCleverTapInAppButtonCLicked         = @"onInAppButtonClick";
static NSString *const kCleverTapInboxButtonCLicked         = @"onInboxButtonClick";

@interface CleverTapPlugin : NSObject<FlutterPlugin>
+ (instancetype)sharedInstance;

- (void)applicationDidLaunchWithOptions:(NSDictionary *)options;

@property NSString *launchDeepLink;

@end
