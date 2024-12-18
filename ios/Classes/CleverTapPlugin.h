#import <Flutter/Flutter.h>

static NSString *const kCleverTapProfileDidInitialize                      = @"profileDidInitialize";
static NSString *const kCleverTapProfileSync                               = @"profileDataUpdated";
static NSString *const kCleverTapInAppNotificationDismissed                = @"inAppNotificationDismissed";
static NSString *const kCleverTapInboxDidInitialize                        = @"inboxDidInitialize";
static NSString *const kCleverTapInboxMessagesDidUpdate                    = @"inboxMessagesDidUpdate";
static NSString *const kCleverTapDisplayUnitsLoaded                        = @"onDisplayUnitsLoaded";
static NSString *const kCleverTapInAppNotificationButtonTapped             = @"onInAppButtonClick";
static NSString *const kCleverTapInboxMessageButtonTapped                  = @"onInboxButtonClick";
static NSString *const kCleverTapInboxMessageTapped                        = @"onInboxMessageClick";
static NSString *const kCleverTapProductConfigFetched                      = @"productConfigFetched";
static NSString *const kCleverTapProductConfigActivated                    = @"productConfigActivated";
static NSString *const kCleverTapProductConfigInitialized                  = @"productConfigInitialized";
static NSString *const kCleverTapFeatureFlagsUpdated                       = @"featureFlagsUpdated";
static NSString *const kCleverTapPushNotificationClicked                   = @"pushClickedPayloadReceived";
static NSString *const kCleverTapPushPermissionResponseReceived            = @"pushPermissionResponseReceived";
static NSString *const kCleverTapOnVariablesChanged                        = @"onVariablesChanged";
static NSString *const kCleverTapOnOneTimeVariablesChanged                 = @"onOneTimeVariablesChanged";
static NSString *const kCleverTapOnValueChanged                            = @"onValueChanged";
static NSString *const kCleverTapOnVariablesChangedAndNoDownloadsPending   = @"onVariablesChangedAndNoDownloadsPending";
static NSString *const kCleverTapOnceVariablesChangedAndNoDownloadsPending = @"onceVariablesChangedAndNoDownloadsPending";
static NSString *const kCleverTapOnFileValueChanged                        = @"onFileValueChanged";
static NSString *const kCleverTapCustomTemplatePresent                     = @"customTemplatePresent";
static NSString *const kCleverTapCustomFunctionPresent                     = @"customFunctionPresent";
static NSString *const kCleverTapCustomTemplateClose                       = @"customTemplateClose";



@interface CleverTapPlugin : NSObject <FlutterPlugin>

+ (instancetype)sharedInstance;

- (void)applicationDidLaunchWithOptions:(NSDictionary *)options;
- (void)postNotificationWithName:(NSString *)name andBody:(NSDictionary *)body;

@property NSString *launchDeepLink;

@end
