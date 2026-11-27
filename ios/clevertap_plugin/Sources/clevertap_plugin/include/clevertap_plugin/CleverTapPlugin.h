#import <Flutter/Flutter.h>

static NSString *const kCleverTapProfileDidInitialize                      = @"profileDidInitialize";
static NSString *const kCleverTapProfileSync                               = @"profileDataUpdated";
static NSString *const kCleverTapInAppNotificationDismissed                = @"inAppNotificationDismissed";
static NSString *const kCleverTapInAppNotificationShow                     = @"inAppNotificationShow";
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



@class CleverTapPluginLaunchConfig;

@interface CleverTapPlugin : NSObject <FlutterPlugin>

+ (instancetype)sharedInstance;

- (void)applicationDidLaunchWithOptions:(NSDictionary *)options;

/// The same as `applicationDidLaunchWithOptions:`, and first creates extra accounts, so a push
/// tap that opens the app reaches its account. Call it in `didFinishLaunchingWithOptions`.
///
/// ```
/// CleverTapInstanceConfig *insurance = [[CleverTapInstanceConfig alloc] initWithAccountId:@"INS-ID" accountToken:@"INS-TOKEN"];
/// [[CleverTapPlugin sharedInstance] applicationDidLaunchWithOptions:launchOptions
///     launchConfigs:@[[[CleverTapPluginLaunchConfig alloc] initWithConfig:insurance]]];
/// ```
///
/// One account that fails (for example a bad template definition) is logged and skipped; the
/// others are still created.
- (void)applicationDidLaunchWithOptions:(NSDictionary *)options launchConfigs:(NSArray<CleverTapPluginLaunchConfig *> *)launchConfigs;
- (void)sceneWillConnectWithOptions:(UISceneConnectionOptions *)connectionOptions API_AVAILABLE(ios(13.0));
- (void)postNotificationWithName:(NSString *)name andBody:(NSDictionary *)body;

@property NSString *launchDeepLink;
@property (strong, nonatomic) NSDictionary *launchNotification;

@end
