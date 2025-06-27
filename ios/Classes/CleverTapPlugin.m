
#import "CleverTap.h"
#import "CleverTapPlugin.h"
#import "CleverTap+Inbox.h"
#import "CleverTapUTMDetail.h"
#import "CleverTapEventDetail.h"
#import "CleverTapSyncDelegate.h"
#import "CleverTap+DisplayUnit.h"
#import "CleverTap+FeatureFlags.h"
#import "CleverTap+ProductConfig.h"
#import "CleverTapPushNotificationDelegate.h"
#import "CleverTapInAppNotificationDelegate.h"
#import "CleverTap+InAppNotifications.h"
#import "CleverTap+PushPermission.h"
#import "CTLocalInApp.h"
#import "CleverTap+CTVar.h"
#import "CTVar.h"
#import "CTTemplateContext.h"

@interface CleverTapPlugin () <CleverTapSyncDelegate, CleverTapInAppNotificationDelegate, CleverTapDisplayUnitDelegate, CleverTapInboxViewControllerDelegate, CleverTapProductConfigDelegate, CleverTapFeatureFlagsDelegate, CleverTapPushNotificationDelegate, CleverTapPushPermissionDelegate>

@property (strong, nonatomic) FlutterMethodChannel *dartToNativeMethodChannel;
@property (strong, nonatomic) FlutterMethodChannel *nativeToDartMethodChannel;
@property(nonatomic, strong) NSMutableDictionary *allVariables;

@end

static NSDateFormatter *dateFormatter;

@implementation CleverTapPlugin

+ (void)registerWithRegistrar:(NSObject<FlutterPluginRegistrar>*)registrar {
    
    CleverTapPlugin.sharedInstance.dartToNativeMethodChannel = [FlutterMethodChannel methodChannelWithName:@"clevertap_plugin/dart_to_native" binaryMessenger:[registrar messenger]];
    [registrar addMethodCallDelegate:CleverTapPlugin.sharedInstance channel:CleverTapPlugin.sharedInstance.dartToNativeMethodChannel];
    
    CleverTapPlugin.sharedInstance.nativeToDartMethodChannel = [FlutterMethodChannel methodChannelWithName:@"clevertap_plugin/native_to_dart" binaryMessenger:[registrar messenger]];
}

+ (instancetype)sharedInstance {
    
    static CleverTapPlugin *sharedInstance = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        sharedInstance = [[CleverTapPlugin alloc] init];
    });
    return sharedInstance;
}

- (void)dealloc {
    
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (instancetype)init {
    
    self = [super init];
    if (self) {
        self.allVariables = [NSMutableDictionary dictionary];
        CleverTap *clevertap = [CleverTap sharedInstance];
        [clevertap setSyncDelegate:self];
        [clevertap setInAppNotificationDelegate:self];
        [clevertap setDisplayUnitDelegate:self];
        [[clevertap productConfig] setDelegate:self];
        [[clevertap featureFlags] setDelegate:self];
        [clevertap setPushNotificationDelegate:self];
        [clevertap setPushPermissionDelegate:self];
        [self addObservers];
    }
    return self;
}

- (void)applicationDidLaunchWithOptions:(NSDictionary *)options {
    
    NSDictionary *notification = [options valueForKey:UIApplicationLaunchOptionsRemoteNotificationKey];
    if (notification && notification[@"wzrk_dl"]) {
        self.launchDeepLink = notification[@"wzrk_dl"];
        NSLog(@"CleverTapFlutter: setting launch deeplink: %@", self.launchDeepLink);
    }
}

- (void)handleMethodCall:(FlutterMethodCall*)call result:(FlutterResult)result {
    
    if ([@"getPlatformVersion" isEqualToString:call.method])
        result([@"iOS " stringByAppendingString:[[UIDevice currentDevice] systemVersion]]);
    else if ([@"recordEvent" isEqualToString:call.method])
        [self recordEvent:call withResult:result];
    else if ([@"setDebugLevel" isEqualToString:call.method])
        [self setDebugLog:call withResult:result];
    else if ([@"profileSet" isEqualToString:call.method])
        [self profileSet:call withResult:result];
    else if ([@"recordChargedEvent" isEqualToString:call.method])
        [self recordChargedEvent:call withResult:result];
    else if ([@"initializeInbox" isEqualToString:call.method])
        [self initializeInbox];
    else if ([@"showInbox" isEqualToString:call.method])
        [self showInbox:call withResult:result];
    else if ([@"onUserLogin" isEqualToString:call.method])
        [self onUserLogin:call withResult:result];
    else if ([@"setPushToken" isEqualToString:call.method])
        [self setPushTokenAsString:call withResult:result];
    else if ([@"registerForPush" isEqualToString:call.method])
        [self registerForPush:call withResult:result];
    else if ([@"enablePersonalization" isEqualToString:call.method])
        [self enablePersonalization:call withResult:result];
    else if ([@"disablePersonalization" isEqualToString:call.method])
        [self disablePersonalization:call withResult:result];
    else if ([@"recordScreenView" isEqualToString:call.method])
        [self recordScreenView:call withResult:result];
    else if ([@"setOptOut" isEqualToString:call.method])
        [self setOptOut:call withResult:result];
    else if ([@"setOffline" isEqualToString:call.method])
        [self setOffline:call withResult:result];
    else if ([@"enableDeviceNetworkInfoReporting" isEqualToString:call.method])
        [self enableDeviceNetworkInfoReporting:call withResult:result];
    else if ([@"eventGetFirstTime" isEqualToString:call.method])
        [self eventGetFirstTime:call withResult:result];
    else if ([@"eventGetLastTime" isEqualToString:call.method])
        [self eventGetLastTime:call withResult:result];
    else if ([@"eventGetOccurrences" isEqualToString:call.method])
        [self eventGetOccurrences:call withResult:result];
    else if ([@"eventGetDetail" isEqualToString:call.method])
        [self eventGetDetail:call withResult:result];
    else if ([@"getEventHistory" isEqualToString:call.method])
        [self getEventHistory:call withResult:result];
    else if ([@"setLocation" isEqualToString:call.method])
        [self setLocation:call withResult:result];
    else if ([@"profileGetCleverTapAttributionIdentifier" isEqualToString:call.method])
        [self profileGetCleverTapAttributionIdentifier:call withResult:result];
    else if ([@"profileGetCleverTapID" isEqualToString:call.method])
        [self profileGetCleverTapID:call withResult:result];
    else if ([@"getCleverTapID" isEqualToString:call.method])
        [self getCleverTapID:call withResult:result];
    else if ([@"profileGetProperty" isEqualToString:call.method])
        [self profileGetProperty:call withResult:result];
    else if ([@"profileRemoveValueForKey" isEqualToString:call.method])
        [self profileRemoveValueForKey:call withResult:result];
    else if ([@"profileSetMultiValues" isEqualToString:call.method])
        [self profileSetMultiValues:call withResult:result];
    else if ([@"profileAddMultiValue" isEqualToString:call.method])
        [self profileAddMultiValue:call withResult:result];
    else if ([@"profileAddMultiValues" isEqualToString:call.method])
        [self profileAddMultiValues:call withResult:result];
    else if ([@"profileRemoveMultiValue" isEqualToString:call.method])
        [self profileRemoveMultiValue:call withResult:result];
    else if ([@"profileRemoveMultiValues" isEqualToString:call.method])
        [self profileRemoveMultiValues:call withResult:result];
    else if ([@"profileIncrementValue" isEqualToString:call.method])
        [self profileIncrementValue:call withResult:result];
    else if ([@"profileDecrementValue" isEqualToString:call.method])
        [self profileDecrementValue:call withResult:result];
    else if ([@"pushInstallReferrer" isEqualToString:call.method])
        [self pushInstallReferrer:call withResult:result];
    else if ([@"sessionGetTimeElapsed" isEqualToString:call.method])
        [self sessionGetTimeElapsed:call withResult:result];
    else if ([@"sessionGetTotalVisits" isEqualToString:call.method])
        [self sessionGetTotalVisits:call withResult:result];
    else if ([@"sessionGetScreenCount" isEqualToString:call.method])
        [self sessionGetScreenCount:call withResult:result];
    else if ([@"sessionGetPreviousVisitTime" isEqualToString:call.method])
        [self sessionGetPreviousVisitTime:call withResult:result];
    else if ([@"sessionGetUTMDetails" isEqualToString:call.method])
        [self sessionGetUTMDetails:call withResult:result];
    else if ([@"suspendInAppNotifications" isEqualToString:call.method])
        [self suspendInAppNotifications];
    else if ([@"discardInAppNotifications" isEqualToString:call.method])
        [self discardInAppNotifications];
    else if ([@"resumeInAppNotifications" isEqualToString:call.method])
        [self resumeInAppNotifications];
    else if ([@"getInboxMessageCount" isEqualToString:call.method])
        [self getInboxMessageCount:call withResult:result];
    else if ([@"getInboxMessageUnreadCount" isEqualToString:call.method])
        [self getInboxMessageUnreadCount:call withResult:result];
    else if ([@"getAllInboxMessages" isEqualToString:call.method])
        [self getAllInboxMessages:call withResult:result];
    else if ([@"getUnreadInboxMessages" isEqualToString:call.method])
        [self getUnreadInboxMessages:call withResult:result];
    else if ([@"getInboxMessageForId" isEqualToString:call.method])
        [self getInboxMessageForId:call withResult:result];
    else if ([@"deleteInboxMessageForId" isEqualToString:call.method])
        [self deleteInboxMessageForId:call withResult:result];
    else if ([@"markReadInboxMessageForId" isEqualToString:call.method])
        [self markReadInboxMessageForId:call withResult:result];
    else if ([@"markReadInboxMessagesForIds" isEqualToString:call.method])
        [self markReadInboxMessagesForIds:call withResult:result];
    else if ([@"deleteInboxMessagesForIds" isEqualToString:call.method])
        [self deleteInboxMessagesForIds:call withResult:result];
    else if ([@"dismissInbox" isEqualToString:call.method])
        [self dismissInbox:call withResult:result];
    else if ([@"pushInboxNotificationClickedEventForId" isEqualToString:call.method])
        [self pushInboxNotificationClickedEventForId:call withResult:result];
    else if ([@"pushInboxNotificationViewedEventForId" isEqualToString:call.method])
        [self pushInboxNotificationViewedEventForId:call withResult:result];
    else if ([@"getInitialUrl" isEqualToString:call.method])
        [self getInitialUrl:call result:result];
    else if ([@"getAllDisplayUnits" isEqualToString:call.method])
        [self getAllDisplayUnits:call withResult:result];
    else if ([@"getDisplayUnitForId" isEqualToString:call.method])
        [self getDisplayUnitForId:call withResult:result];
    else if ([@"pushDisplayUnitViewedEvent" isEqualToString:call.method])
        [self pushDisplayUnitViewedEvent:call withResult:result];
    else if ([@"pushDisplayUnitClickedEvent" isEqualToString:call.method])
        [self pushDisplayUnitClickedEvent:call withResult:result];
    else if ([@"fetch" isEqualToString:call.method])
        [self fetch:call withResult:result];
    else if ([@"fetchWithMinimumFetchIntervalInSeconds" isEqualToString:call.method])
        [self fetchWithMinimumFetchIntervalInSeconds:call withResult:result];
    else if ([@"setMinimumFetchIntervalInSeconds" isEqualToString:call.method])
        [self setMinimumFetchIntervalInSeconds:call withResult:result];
    else if ([@"activate" isEqualToString:call.method])
        [self activate:call withResult:result];
    else if ([@"fetchAndActivate" isEqualToString:call.method])
        [self fetchAndActivate:call withResult:result];
    else if ([@"setDefaultsMap" isEqualToString:call.method])
        [self setDefaultsMap:call withResult:result];
    else if ([@"getLastFetchTimeStampInMillis" isEqualToString:call.method])
        [self getLastFetchTimeStampInMillis:call withResult:result];
    else if ([@"getBoolean" isEqualToString:call.method])
        [self getBoolean:call withResult:result];
    else if ([@"getString" isEqualToString:call.method])
        [self getString:call withResult:result];
    else if ([@"getLong" isEqualToString:call.method])
        [self getLong:call withResult:result];
    else if ([@"getDouble" isEqualToString:call.method])
        [self getDouble:call withResult:result];
    else if ([@"getFeatureFlag" isEqualToString:call.method])
        [self getFeatureFlag:call withResult:result];
    else if ([@"pushNotificationViewedEvent" isEqualToString:call.method])
        [self pushNotificationViewedEvent:call withResult:result];
    else if ([@"pushNotificationClickedEvent" isEqualToString:call.method])
        [self pushNotificationClickedEvent:call withResult:result];
    else if ([@"createNotification" isEqualToString:call.method])
        result(nil);
    else if ([@"processPushNotification" isEqualToString:call.method])
        result(nil);
    else if ([@"createNotificationChannel" isEqualToString:call.method])
        result(nil);
    else if ([@"createNotificationChannelWithSound" isEqualToString:call.method])
        result(nil);
    else if ([@"createNotificationChannelWithGroupId" isEqualToString:call.method])
        result(nil);
    else if ([@"createNotificationChannelWithGroupIdAndSound" isEqualToString:call.method])
        result(nil);
    else if ([@"createNotificationChannelGroup" isEqualToString:call.method])
        result(nil);
    else if ([@"deleteNotificationChannel" isEqualToString:call.method])
        result(nil);
    else if ([@"pushRegistrationToken" isEqualToString:call.method])
        result(nil);
    else if ([@"setLibrary" isEqualToString:call.method])
        [self setLibrary:call withResult:result];
    else if ([@"promptPushPrimer" isEqualToString:call.method])
        [self promptPushPrimer:call withResult:result];
    else if ([@"promptForPushNotification" isEqualToString:call.method])
        [self promptForPushNotification:call withResult:result];
    else if ([@"getPushNotificationPermissionStatus" isEqualToString:call.method])
        [self getPushNotificationPermissionStatus:call withResult:result];
    else if ([@"syncVariables" isEqualToString:call.method])
        [self syncVariables];
    else if ([@"syncVariablesinProd" isEqualToString:call.method])
        [self syncVariablesinProd:call withResult:result];
    else if ([@"fetchVariables" isEqualToString:call.method])
        [self fetchVariables:call withResult:result];
    else if ([@"defineVariables" isEqualToString:call.method])
        [self defineVariables:call withResult:result];
    else if ([@"defineFileVariable" isEqualToString:call.method])
        [self defineFileVariable:call withResult:result];
    else if ([@"getVariables" isEqualToString:call.method])
        [self getVariables:call withResult:result];
    else if ([@"getVariable" isEqualToString:call.method])
        [self getVariable:call withResult:result];
    else if ([@"onVariablesChanged" isEqualToString:call.method])
        [self onVariablesChanged:call withResult:result];
    else if ([@"onOneTimeVariablesChanged" isEqualToString:call.method])
        [self onOneTimeVariablesChanged:call withResult:result];
    else if ([@"onVariablesChangedAndNoDownloadsPending" isEqualToString:call.method])
        [self onVariablesChangedAndNoDownloadsPending:call withResult:result];
    else if ([@"onceVariablesChangedAndNoDownloadsPending" isEqualToString:call.method])
        [self onceVariablesChangedAndNoDownloadsPending:call withResult:result];
    else if ([@"onFileValueChanged" isEqualToString:call.method])
        [self onFileValueChanged:call withResult:result];
    else if ([@"fetchInApps" isEqualToString:call.method])
        [self fetchInApps:call withResult:result];
    else if ([@"clearInAppResources" isEqualToString:call.method])
        [self clearInAppResources:call withResult:result];
    else if ([@"onValueChanged" isEqualToString:call.method])
        [self onValueChanged:call withResult:result];
    else if ([@"setLocale" isEqualToString:call.method])
        [self setLocale:call withResult:result];
    else if ([@"syncCustomTemplates" isEqualToString:call.method])
        [self syncCustomTemplates:call withResult:result];
    else if ([@"syncCustomTemplatesInProd" isEqualToString:call.method])
        [self syncCustomTemplatesInProd:call withResult:result];
    else if ([@"customTemplateGetBooleanArg" isEqualToString:call.method])
        [self customTemplateGetBooleanArg:call withResult:result];
    else if ([@"customTemplateGetFileArg" isEqualToString:call.method])
        [self customTemplateGetFileArg:call withResult:result];
    else if ([@"customTemplateGetNumberArg" isEqualToString:call.method])
        [self customTemplateGetNumberArg:call withResult:result];
        else if ([@"customTemplateGetObjectArg" isEqualToString:call.method])
        [self customTemplateGetObjectArg:call withResult:result];
    else if ([@"customTemplateGetStringArg" isEqualToString:call.method])
        [self customTemplateGetStringArg:call withResult:result];
    else if ([@"customTemplateRunAction" isEqualToString:call.method])
        [self customTemplateRunAction:call withResult:result];
    else if ([@"customTemplateSetDismissed" isEqualToString:call.method])
        [self customTemplateSetDismissed:call withResult:result];
    else if ([@"customTemplateSetPresented" isEqualToString:call.method])
        [self customTemplateSetPresented:call withResult:result];
    else if ([@"customTemplateContextToString" isEqualToString:call.method])
        [self customTemplateContextToString:call withResult:result];
    else if ([@"getUserEventLog" isEqualToString:call.method])
        [self getUserEventLog:call withResult:result];
    else if ([@"getUserEventLogCount" isEqualToString:call.method])
        [self getUserEventLogCount:call withResult:result];
    else if ([@"getUserEventLogHistory" isEqualToString:call.method])
        [self getUserEventLogHistory:call withResult:result];
    else if ([@"getUserAppLaunchCount" isEqualToString:call.method])
        [self getUserAppLaunchCount:call withResult:result];
    else if ([@"getUserLastVisitTs" isEqualToString:call.method])
        [self getUserLastVisitTs:call withResult:result];
    else
        result(FlutterMethodNotImplemented);
}


#pragma mark - Launch

- (void)getInitialUrl:(FlutterMethodCall*)call result:(FlutterResult)result {
    
    NSString *launchDeepLink = self.launchDeepLink;
    if (launchDeepLink != nil) {
        result(launchDeepLink);
    } else {
        result(nil);
    }
}

- (void)setDebugLog:(FlutterMethodCall *)call withResult:(FlutterResult)result {
    
    [CleverTap setDebugLevel:[call.arguments[@"debugLevel"] intValue]];
    result(nil);
}

- (void)setPushToken:(FlutterMethodCall *)call withResult:(FlutterResult)result {
    
    [[CleverTap sharedInstance] setPushToken:call.arguments[@"token"]];
    result(nil);
}

- (void)setPushTokenAsString:(FlutterMethodCall *)call withResult:(FlutterResult)result {
    
    [[CleverTap sharedInstance] setPushTokenAsString:call.arguments[@"token"]];
    result(nil);
}

- (void)registerForPush:(FlutterMethodCall *)call withResult:(FlutterResult)result {
    
    if (@available(iOS 10.0, *)) {
        UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
        [center requestAuthorizationWithOptions:(UNAuthorizationOptionAlert | UNAuthorizationOptionSound | UNAuthorizationOptionBadge)
                              completionHandler:^(BOOL granted, NSError * _Nullable error) {
            if (granted) {
                dispatch_async(dispatch_get_main_queue(), ^(void) {
                    [[UIApplication sharedApplication] registerForRemoteNotifications];
                });
            }
        }];
    } else {
        // Fallback on earlier versions
        UIUserNotificationSettings *settings = [UIUserNotificationSettings settingsForTypes:(UIUserNotificationTypeBadge | UIUserNotificationTypeAlert | UIUserNotificationTypeSound) categories:nil];
        [[UIApplication sharedApplication] registerForRemoteNotifications];
        [[UIApplication sharedApplication] registerUserNotificationSettings:settings];
    }
    result(nil);
}

- (void)setLibrary:(FlutterMethodCall*)call withResult:(FlutterResult)result {
    [[CleverTap sharedInstance] setLibrary:call.arguments[@"libName"]];
    [[CleverTap sharedInstance] setCustomSdkVersion:call.arguments[@"libName"] version:[call.arguments[@"libVersion"]intValue]];
}


#pragma mark - Personalization

- (void)enablePersonalization:(FlutterMethodCall *)call withResult:(FlutterResult)result {
    
    [CleverTap enablePersonalization];
    result(nil);
}

- (void)disablePersonalization:(FlutterMethodCall *)call withResult:(FlutterResult)result {
    
    [CleverTap disablePersonalization];
    result(nil);
}


#pragma mark - Event API

- (void)recordEvent:(FlutterMethodCall *)call withResult:(FlutterResult)result {
    
    [[CleverTap sharedInstance] recordEvent:call.arguments[@"eventName"] withProps:call.arguments[@"eventData"]];
    result(nil);
}

- (void)recordChargedEvent:(FlutterMethodCall *)call withResult:(FlutterResult)result {
    
    [[CleverTap sharedInstance] recordChargedEventWithDetails:call.arguments[@"chargeDetails"] andItems:call.arguments[@"items"]];
    result(nil);
}

- (void)recordScreenView:(FlutterMethodCall *)call withResult:(FlutterResult)result {
    
    [[CleverTap sharedInstance] recordScreenView:call.arguments[@"screenName"]];
    result(nil);
}

- (void)profileSet:(FlutterMethodCall *)call withResult:(FlutterResult)result {
    
    [[CleverTap sharedInstance] profilePush:call.arguments[@"profile"]];
    result(nil);
}

- (void)onUserLogin:(FlutterMethodCall *)call withResult:(FlutterResult)result {
    
    [[CleverTap sharedInstance] onUserLogin:call.arguments[@"profile"]];
    result(nil);
}

- (void)setOptOut:(FlutterMethodCall *)call withResult:(FlutterResult)result {
    
    [[CleverTap sharedInstance] setOptOut:[call.arguments[@"value"] boolValue]];
    result(nil);
}

- (void)setOffline:(FlutterMethodCall *)call withResult:(FlutterResult)result {
    
    [[CleverTap sharedInstance] setOffline:[call.arguments[@"value"] boolValue]];
    result(nil);
}

- (void)enableDeviceNetworkInfoReporting:(FlutterMethodCall *)call withResult:(FlutterResult)result {
    
    [[CleverTap sharedInstance] enableDeviceNetworkInfoReporting:[call.arguments[@"value"] boolValue]];
    result(nil);
}

- (void)eventGetFirstTime:(FlutterMethodCall *)call withResult:(FlutterResult)result {
    
    NSTimeInterval res = [[CleverTap sharedInstance] eventGetFirstTime:call.arguments[@"eventName"]];
    result(@(res));
}

- (void)eventGetLastTime:(FlutterMethodCall *)call withResult:(FlutterResult)result {
    
    NSTimeInterval res = [[CleverTap sharedInstance] eventGetLastTime:call.arguments[@"eventName"]];
    result(@(res));
}

- (void)eventGetOccurrences:(FlutterMethodCall *)call withResult:(FlutterResult)result {
    
    int res = [[CleverTap sharedInstance] eventGetOccurrences:call.arguments[@"eventName"]];
    result(@(res));
}

- (void)eventGetDetail:(FlutterMethodCall *)call withResult:(FlutterResult)result {
    
    CleverTapEventDetail *detail = [[CleverTap sharedInstance] eventGetDetail:call.arguments[@"eventName"]];
    NSDictionary *res = [self _eventDetailToDict:detail];
    result(res);
}

- (void)getEventHistory:(FlutterMethodCall *)call withResult:(FlutterResult)result {
    
    NSDictionary *history = [[CleverTap sharedInstance] userGetEventHistory];
    NSMutableDictionary *res = [NSMutableDictionary new];
    for (NSString *eventName in [history keyEnumerator]) {
        CleverTapEventDetail *detail = history[eventName];
        NSDictionary * _inner = [self _eventDetailToDict:detail];
        res[eventName] = _inner;
    }
    result(res);
}

- (void)getUserEventLog:(FlutterMethodCall *)call withResult:(FlutterResult)result {
    
    CleverTapEventDetail *detail = [[CleverTap sharedInstance] getUserEventLog:call.arguments[@"eventName"]];
    NSDictionary *res = [self _eventDetailToDict:detail];
    result(res);
}

- (void)getUserEventLogHistory:(FlutterMethodCall *)call withResult:(FlutterResult)result {
    
    NSDictionary *history = [[CleverTap sharedInstance] getUserEventLogHistory];
    NSMutableDictionary *res = [NSMutableDictionary new];
    for (NSString *eventName in [history keyEnumerator]) {
        CleverTapEventDetail *detail = history[eventName];
        NSDictionary * _inner = [self _eventDetailToDict:detail];
        res[eventName] = _inner;
    }
    result(res);
}

- (void)getUserEventLogCount:(FlutterMethodCall *)call withResult:(FlutterResult)result {
    
    int res = [[CleverTap sharedInstance] getUserEventLogCount:call.arguments[@"eventName"]];
    result(@(res));
}

- (void)setLocation:(FlutterMethodCall *)call withResult:(FlutterResult)result {
    
    double lat = [call.arguments[@"latitude"] doubleValue];
    double lon = [call.arguments[@"longitude"] doubleValue];
    CLLocationCoordinate2D coordinate = CLLocationCoordinate2DMake(lat,lon);
    [[CleverTap sharedInstance] setLocation: coordinate];
    result(nil);
}

- (void)profileGetCleverTapAttributionIdentifier:(FlutterMethodCall *)call withResult:(FlutterResult)result {
    
    result([[CleverTap sharedInstance] profileGetCleverTapAttributionIdentifier]);
}

- (void)profileGetCleverTapID:(FlutterMethodCall *)call withResult:(FlutterResult)result {
    
    result([[CleverTap sharedInstance] profileGetCleverTapID]);
}

- (void)getCleverTapID:(FlutterMethodCall *)call withResult:(FlutterResult)result {
    
    result([[CleverTap sharedInstance] profileGetCleverTapID]);
}

- (void)profileGetProperty:(FlutterMethodCall *)call withResult:(FlutterResult)result {
    
    result([[CleverTap sharedInstance] profileGet:call.arguments[@"propertyName"]]);
}

- (void)profileRemoveValueForKey:(FlutterMethodCall *)call withResult:(FlutterResult)result {
    
    [[CleverTap sharedInstance] profileRemoveValueForKey:call.arguments[@"key"]];
    result(nil);
}

- (void)profileSetMultiValues:(FlutterMethodCall *)call withResult:(FlutterResult)result {
    
    [[CleverTap sharedInstance] profileSetMultiValues:call.arguments[@"values"] forKey:call.arguments[@"key"]];
    result(nil);
}

- (void)profileAddMultiValue:(FlutterMethodCall *)call withResult:(FlutterResult)result {
    
    [[CleverTap sharedInstance] profileAddMultiValue:call.arguments[@"value"] forKey:call.arguments[@"key"]];
    result(nil);
}

- (void)profileAddMultiValues:(FlutterMethodCall *)call withResult:(FlutterResult)result {
    [[CleverTap sharedInstance] profileAddMultiValues:call.arguments[@"values"] forKey:call.arguments[@"key"]];
    result(nil);
}

- (void)profileRemoveMultiValue:(FlutterMethodCall *)call withResult:(FlutterResult)result {
    
    [[CleverTap sharedInstance] profileRemoveMultiValue:call.arguments[@"value"] forKey:call.arguments[@"key"]];
    result(nil);
}

- (void)profileRemoveMultiValues:(FlutterMethodCall *)call withResult:(FlutterResult)result {
    
    [[CleverTap sharedInstance] profileRemoveMultiValues:call.arguments[@"values"] forKey:call.arguments[@"key"]];
    result(nil);
}

- (void)profileIncrementValue:(FlutterMethodCall *)call withResult:(FlutterResult)result {
    
    [[CleverTap sharedInstance] profileIncrementValueBy:call.arguments[@"value"] forKey:call.arguments[@"key"]];
    result(nil);
}

- (void)profileDecrementValue:(FlutterMethodCall *)call withResult:(FlutterResult)result {
    
    [[CleverTap sharedInstance] profileDecrementValueBy:call.arguments[@"value"] forKey:call.arguments[@"key"]];
    result(nil);
}

- (void)pushInstallReferrer:(FlutterMethodCall *)call withResult:(FlutterResult)result {
    
    [[CleverTap sharedInstance] pushInstallReferrerSource:call.arguments[@"source"] medium:call.arguments[@"medium"] campaign:call.arguments[@"campaign"]];
    result(nil);
}

- (void)sessionGetTimeElapsed:(FlutterMethodCall *)call withResult:(FlutterResult)result {
    
    NSTimeInterval res = [[CleverTap sharedInstance] sessionGetTimeElapsed];
    result(@(res));
}

- (void)sessionGetTotalVisits:(FlutterMethodCall *)call withResult:(FlutterResult)result {
    
    int res = [[CleverTap sharedInstance] userGetTotalVisits];
    result(@(res));
}

- (void)getUserAppLaunchCount:(FlutterMethodCall *)call withResult:(FlutterResult)result {
    
    int res = [[CleverTap sharedInstance] getUserAppLaunchCount];
    result(@(res));
}

- (void)sessionGetScreenCount:(FlutterMethodCall *)call withResult:(FlutterResult)result {
    
    int res = [[CleverTap sharedInstance] userGetScreenCount];
    result(@(res));
}

- (void)sessionGetPreviousVisitTime:(FlutterMethodCall *)call withResult:(FlutterResult)result {
    
    NSTimeInterval res = [[CleverTap sharedInstance] userGetPreviousVisitTime];
    result(@(res));
}

- (void)getUserLastVisitTs:(FlutterMethodCall *)call withResult:(FlutterResult)result {
    
    NSTimeInterval res = [[CleverTap sharedInstance] getUserLastVisitTs];
    result(@(res));
}

- (void)sessionGetUTMDetails:(FlutterMethodCall *)call withResult:(FlutterResult)result {
    
    CleverTapUTMDetail *detail = [[CleverTap sharedInstance] sessionGetUTMDetails];
    NSDictionary *res = [self _utmDetailToDict:detail];
    result(res);
}

#pragma mark - InApp Notification Controls

- (void)suspendInAppNotifications {
    
    [[CleverTap sharedInstance] suspendInAppNotifications];
}

- (void)discardInAppNotifications {
    
    [[CleverTap sharedInstance] discardInAppNotifications];
}

- (void)resumeInAppNotifications {
    
    [[CleverTap sharedInstance] resumeInAppNotifications];
}

#pragma mark - InApp Controls

- (void)fetchInApps:(FlutterMethodCall *)call withResult:(FlutterResult)result {
    [[CleverTap sharedInstance]fetchInApps:^(BOOL success) {
        result(@(success));
    }];
}

- (void)clearInAppResources:(FlutterMethodCall *)call withResult:(FlutterResult)result {
    BOOL expiredOnly = [call.arguments boolValue];
    [[CleverTap sharedInstance] clearInAppResources: expiredOnly];
}

#pragma mark - Inbox

- (void)pushInboxNotificationViewedEventForId:(FlutterMethodCall *)call withResult:(FlutterResult)result {
    
    [[CleverTap sharedInstance] recordInboxNotificationViewedEventForID:call.arguments[@"messageId"]];
    result(nil);
}

- (void)pushInboxNotificationClickedEventForId:(FlutterMethodCall *)call withResult:(FlutterResult)result {
    
    [[CleverTap sharedInstance] recordInboxNotificationClickedEventForID:call.arguments[@"messageId"]];
    result(nil);
}

- (void)markReadInboxMessageForId:(FlutterMethodCall *)call withResult:(FlutterResult)result {
    
    [[CleverTap sharedInstance] markReadInboxMessageForID:call.arguments[@"messageId"]];
    result(nil);
}

- (void)markReadInboxMessagesForIds:(FlutterMethodCall *)call withResult:(FlutterResult)result {
    [[CleverTap sharedInstance]markReadInboxMessagesForIDs:call.arguments[@"messageIds"]];
    result(nil);
}

- (void)deleteInboxMessagesForIds:(FlutterMethodCall *)call withResult:(FlutterResult)result {
    [[CleverTap sharedInstance]deleteInboxMessagesForIDs:call.arguments[@"messageIds"]];
    result(nil);
}

- (void)deleteInboxMessageForId:(FlutterMethodCall *)call withResult:(FlutterResult)result {
    
    [[CleverTap sharedInstance] deleteInboxMessageForID:call.arguments[@"messageId"]];
    result(nil);
}

- (void)getInboxMessageForId:(FlutterMethodCall *)call withResult:(FlutterResult)result {
    
    CleverTapInboxMessage *message = [[CleverTap sharedInstance] getInboxMessageForId:call.arguments[@"messageId"]];
    NSDictionary *res = message.json;
    result(res);
}

- (void)getUnreadInboxMessages:(FlutterMethodCall *)call withResult:(FlutterResult)result {
    
    NSArray *messages = [[CleverTap sharedInstance] getUnreadInboxMessages];
    NSArray *results = [self _cleverTapInboxMessagesToArray:messages];
    result(results);
}

- (void)getAllInboxMessages:(FlutterMethodCall *)call withResult:(FlutterResult)result {
    
    NSArray *messages = [[CleverTap sharedInstance] getAllInboxMessages];
    NSArray *results = [self _cleverTapInboxMessagesToArray:messages];
    result(results);
}

- (void)getInboxMessageCount:(FlutterMethodCall *)call withResult:(FlutterResult)result {
    
    int res = (int)[[CleverTap sharedInstance] getInboxMessageCount];
    result(@(res));
}

- (void)getInboxMessageUnreadCount:(FlutterMethodCall *)call withResult:(FlutterResult)result {
    
    int res = (int)[[CleverTap sharedInstance] getInboxMessageUnreadCount];
    result(@(res));
}

- (void)initializeInbox {
    
    [[CleverTap sharedInstance] initializeInboxWithCallback:^(BOOL success) {
        if (success) {
            [self postNotificationWithName:kCleverTapInboxDidInitialize andBody:nil];
            [[CleverTap sharedInstance] registerInboxUpdatedBlock:^{
                [self postNotificationWithName:kCleverTapInboxMessagesDidUpdate andBody:nil];
            }];
        }
    }];
}

- (void)showInbox:(FlutterMethodCall *)call withResult:(FlutterResult)result {
    
    NSDictionary *styleConfig = call.arguments[@"styleConfig"];
    if ([styleConfig isKindOfClass:[NSNull class]]) {
        styleConfig = nil;
    }
    CleverTapInboxViewController *inboxController = [[CleverTap sharedInstance] newInboxViewControllerWithConfig:[self _dictToInboxStyleConfig:styleConfig ? styleConfig : nil] andDelegate:(id <CleverTapInboxViewControllerDelegate>)self];
    if (inboxController) {
        UINavigationController *navigationController = [[UINavigationController alloc] initWithRootViewController:inboxController];
        UIWindow *keyWindow = [[UIApplication sharedApplication] keyWindow];
        UIViewController *mainViewController = keyWindow.rootViewController;
        [mainViewController presentViewController:navigationController animated:YES completion:nil];
    }
}

- (void)dismissInbox:(FlutterMethodCall *)call withResult:(FlutterResult)result {
    [[CleverTap sharedInstance]dismissAppInbox];
}

- (CleverTapInboxStyleConfig*)_dictToInboxStyleConfig: (NSDictionary *)dict {
    
    CleverTapInboxStyleConfig *_config = [CleverTapInboxStyleConfig new];
    NSString *title = [dict valueForKey:@"navBarTitle"];
    if (title) {
        _config.title = title;
    }
    NSString *firstTabTitle = [dict valueForKey:@"firstTabTitle"];
    if (firstTabTitle) {
        _config.firstTabTitle = firstTabTitle;
    }
    NSArray *messageTags = [dict valueForKey:@"tabs"];
    if (messageTags) {
        _config.messageTags = messageTags;
    }
    NSString *backgroundColor = [dict valueForKey:@"inboxBackgroundColor"];
    if (backgroundColor) {
        _config.backgroundColor = [self ct_colorWithHexString:backgroundColor alpha:1.0];
    }
    NSString *navigationBarTintColor = [dict valueForKey:@"navBarColor"];
    if (navigationBarTintColor) {
        _config.navigationBarTintColor = [self ct_colorWithHexString:navigationBarTintColor alpha:1.0];
    }
    NSString *navigationTintColor = [dict valueForKey:@"navBarTitleColor"];
    if (navigationTintColor) {
        _config.navigationTintColor = [self ct_colorWithHexString:navigationTintColor alpha:1.0];
    }
    NSString *tabBackgroundColor = [dict valueForKey:@"tabBackgroundColor"];
    if (tabBackgroundColor) {
        _config.navigationBarTintColor = [self ct_colorWithHexString:tabBackgroundColor alpha:1.0];
    }
    NSString *tabSelectedBgColor = [dict valueForKey:@"tabSelectedBgColor"];
    if (tabSelectedBgColor) {
        _config.tabSelectedBgColor = [self ct_colorWithHexString:tabSelectedBgColor alpha:1.0];
    }
    NSString *tabSelectedTextColor = [dict valueForKey:@"tabSelectedTextColor"];
    if (tabSelectedTextColor) {
        _config.tabSelectedTextColor = [self ct_colorWithHexString:tabSelectedTextColor alpha:1.0];
    }
    NSString *tabUnSelectedTextColor = [dict valueForKey:@"tabUnSelectedTextColor"];
    if (tabUnSelectedTextColor) {
        _config.tabUnSelectedTextColor = [self ct_colorWithHexString:tabUnSelectedTextColor alpha:1.0];
    }
    NSString *noMessageTextColor = [dict valueForKey:@"noMessageTextColor"];
    if (noMessageTextColor) {
        _config.noMessageViewTextColor = [self ct_colorWithHexString:noMessageTextColor alpha:1.0];
    }
    NSString *noMessageText = [dict valueForKey:@"noMessageText"];
    if (noMessageText) {
        _config.noMessageViewText = noMessageText;
    }
    return _config;
}

- (UIColor *)ct_colorWithHexString:(NSString *)string alpha:(CGFloat)alpha {
    
    if (![string isKindOfClass:[NSString class]] || [string length] == 0) {
        return [UIColor colorWithRed:0.0f green:0.0f blue:0.0f alpha:1.0f];
    }
    unsigned int hexint = 0;
    NSScanner *scanner = [NSScanner scannerWithString:string];
    [scanner setCharactersToBeSkipped:[NSCharacterSet
                                       characterSetWithCharactersInString:@"#"]];
    [scanner scanHexInt:&hexint];
    UIColor *color =
    [UIColor colorWithRed:((CGFloat) ((hexint & 0xFF0000) >> 16))/255
                    green:((CGFloat) ((hexint & 0xFF00) >> 8))/255
                     blue:((CGFloat) (hexint & 0xFF))/255
                    alpha:alpha];
    return color;
}


#pragma mark - Native Display

- (void)getAllDisplayUnits:(FlutterMethodCall *)call withResult:(FlutterResult)result {
    
    NSArray<CleverTapDisplayUnit *> *displayUnits = [[CleverTap sharedInstance] getAllDisplayUnits];
    NSArray *results = [self _cleverTapDisplayUnitToArray:displayUnits];
    result(results);
}

- (void)getDisplayUnitForId:(FlutterMethodCall *)call withResult:(FlutterResult)result {
    
    CleverTapDisplayUnit *unit = [[CleverTap sharedInstance] getDisplayUnitForID:call.arguments[@"unitId"]];
    NSDictionary *res = unit.json;
    result(res);
}

- (void)pushDisplayUnitViewedEvent:(FlutterMethodCall *)call withResult:(FlutterResult)result {
    
    [[CleverTap sharedInstance] recordDisplayUnitViewedEventForID:call.arguments[@"unitId"]];
    result(nil);
}

- (void)pushDisplayUnitClickedEvent:(FlutterMethodCall *)call withResult:(FlutterResult)result {
    
    [[CleverTap sharedInstance] recordDisplayUnitClickedEventForID:call.arguments[@"unitId"]];
    result(nil);
}

- (void)displayUnitsUpdated:(NSArray<CleverTapDisplayUnit *> *)displayUnits {
    
    NSMutableDictionary *_dict = [NSMutableDictionary new];
    [_dict setValue:[self _cleverTapDisplayUnitToArray:displayUnits] forKey:@"adUnits"];
    [self postNotificationWithName:kCleverTapDisplayUnitsLoaded andBody:_dict];
}


#pragma mark - Product Config

- (void)fetch:(FlutterMethodCall *)call withResult:(FlutterResult)result {
    [[[CleverTap sharedInstance] productConfig] fetch];
    result(nil);
}

- (void)fetchWithMinimumFetchIntervalInSeconds:(FlutterMethodCall *)call withResult:(FlutterResult)result {
    int interval = [call.arguments[@"interval"] intValue];
    [[[CleverTap sharedInstance] productConfig] fetchWithMinimumInterval:interval];
    result(nil);
}

- (void)setMinimumFetchIntervalInSeconds:(FlutterMethodCall *)call withResult:(FlutterResult)result {
    int interval = [call.arguments[@"interval"] intValue];
    [[[CleverTap sharedInstance] productConfig] setMinimumFetchInterval:interval];
    result(nil);
}

- (void)activate:(FlutterMethodCall *)call withResult:(FlutterResult)result {
    [[[CleverTap sharedInstance] productConfig] activate];
    result(nil);
}

- (void)fetchAndActivate:(FlutterMethodCall *)call withResult:(FlutterResult)result {
    [[[CleverTap sharedInstance] productConfig] fetchAndActivate];
    result(nil);
}

- (void)setDefaultsMap:(FlutterMethodCall *)call withResult:(FlutterResult)result {
    [[[CleverTap sharedInstance] productConfig] setDefaults:call.arguments[@"defaults"]];
    result(nil);
}

- (void)getLastFetchTimeStampInMillis:(FlutterMethodCall *)call withResult:(FlutterResult)result {
    NSDate *date = [[[CleverTap sharedInstance] productConfig] getLastFetchTimeStamp];
    double interval = date.timeIntervalSince1970;
    result(@(interval));
}

- (void)getBoolean:(FlutterMethodCall *)call withResult:(FlutterResult)result {
    NSString *key = call.arguments[@"key"];
    BOOL value = [[[[CleverTap sharedInstance] productConfig] get:key]boolValue];
    result(@(value));
}

- (void)getString:(FlutterMethodCall *)call withResult:(FlutterResult)result {
    NSString *key = call.arguments[@"key"];
    NSString *value = [[[[CleverTap sharedInstance] productConfig] get:key]stringValue];
    result(value);
}

- (void)getLong:(FlutterMethodCall *)call withResult:(FlutterResult)result {
    NSString *key = call.arguments[@"key"];
    long value = [[[[CleverTap sharedInstance] productConfig] get:key] numberValue].longValue;
    result(@(value));
}

- (void)getDouble:(FlutterMethodCall *)call withResult:(FlutterResult)result {
    NSString *key = call.arguments[@"key"];
    double value = [[[[CleverTap sharedInstance] productConfig] get:key]numberValue].doubleValue;
    result(@(value));
}


#pragma mark - Product Config Delegates

- (void)ctProductConfigFetched {
    
    [self postNotificationWithName:kCleverTapProductConfigFetched andBody:nil];
}

- (void)ctProductConfigActivated {
    [self postNotificationWithName:kCleverTapProductConfigActivated andBody:nil];
}

- (void)ctProductConfigInitialized {
    [self postNotificationWithName:kCleverTapProductConfigInitialized andBody:nil];
}


#pragma mark - Feature Flag

- (void)getFeatureFlag:(FlutterMethodCall *)call withResult:(FlutterResult)result {
    NSString *key = call.arguments[@"key"];
    BOOL defaultValue = [call.arguments[@"defaultValue"] boolValue];
    BOOL value = [[[CleverTap sharedInstance] featureFlags] get:key withDefaultValue:defaultValue];
    result(@(value));
}

- (void)ctFeatureFlagsUpdated {
    [self postNotificationWithName:kCleverTapFeatureFlagsUpdated andBody:nil];
}


#pragma mark - Helpers

- (NSArray*)_cleverTapInboxMessagesToArray:(NSArray*) inboxMessages {
    
    NSMutableArray *returnArray = [NSMutableArray new];
    for(CleverTapInboxMessage *unit in inboxMessages){
        [returnArray addObject:unit.json];
    }
    return returnArray;
}

- (NSArray*)_cleverTapDisplayUnitToArray:(NSArray*) displayUnits {
    
    NSMutableArray *returnArray = [NSMutableArray new];
    for(CleverTapDisplayUnit *unit in displayUnits){
        [returnArray addObject:unit.json];
    }
    return returnArray;
}

- (NSDictionary*)_eventDetailToDict:(CleverTapEventDetail*)detail {
    
    NSMutableDictionary *_dict = [NSMutableDictionary new];
    
    if(detail) {
        if(detail.eventName) {
            [_dict setObject:detail.eventName forKey:@"eventName"];
        }

        if(detail.normalizedEventName){
            [_dict setObject:detail.normalizedEventName forKey:@"normalizedEventName"];
        }
        
        if(detail.firstTime){
            [_dict setObject:@(detail.firstTime) forKey:@"firstTime"];
        }
        
        if(detail.lastTime){
            [_dict setObject:@(detail.lastTime) forKey:@"lastTime"];
        }
        
        if(detail.count){
            [_dict setObject:@(detail.count) forKey:@"count"];
        }

        if(detail.deviceID){
            [_dict setObject:detail.deviceID forKey:@"deviceID"];
        }
    }
    
    return _dict;
}

- (NSDictionary*)_utmDetailToDict:(CleverTapUTMDetail*)detail {
    
    NSMutableDictionary *_dict = [NSMutableDictionary new];
    
    if(detail) {
        if(detail.source) {
            [_dict setObject:detail.source forKey:@"source"];
        }
        
        if(detail.medium) {
            [_dict setObject:detail.medium forKey:@"medium"];
        }
        
        if(detail.campaign) {
            [_dict setObject:detail.campaign forKey:@"campaign"];
        }
    }
    return _dict;
}

- (NSDictionary *)formatProfile:(NSDictionary *)profile {
    
    NSMutableDictionary *_profile = [NSMutableDictionary new];
    
    for (NSString *key in [profile keyEnumerator]) {
        id value = [profile objectForKey:key];
        
        if([key isEqualToString:@"DOB"]) {
            
            NSDate *dob = nil;
            
            if([value isKindOfClass:[NSString class]]) {
                
                if(!dateFormatter) {
                    dateFormatter = [[NSDateFormatter alloc] init];
                    [dateFormatter setDateFormat:@"yyyy-MM-dd"];
                }
                
                dob = [dateFormatter dateFromString:value];
                
            }
            else if ([value isKindOfClass:[NSNumber class]]) {
                dob = [NSDate dateWithTimeIntervalSince1970:[value doubleValue]];
            }
            
            if(dob) {
                value = dob;
            }
        }
        
        [_profile setObject:value forKey:key];
    }
    
    return _profile;
}

- (CTVar *)createVarForName:(NSString *)name andValue:(id)value {

    if ([value isKindOfClass:[NSString class]]) {
        return [[CleverTap sharedInstance]defineVar:name withString:value];
    }
    if ([value isKindOfClass:[NSDictionary class]]) {
        return [[CleverTap sharedInstance]defineVar:name withDictionary:value];
    }
    if ([value isKindOfClass:[NSNumber class]]) {
        if ([self isBoolNumber:value]) {
            return [[CleverTap sharedInstance]defineVar:name withBool:value];
        }
        return [[CleverTap sharedInstance]defineVar:name withNumber:value];
    }
    return nil;
}

- (BOOL)isBoolNumber:(NSNumber *)number {
    CFTypeID boolID = CFBooleanGetTypeID();
    CFTypeID numID = CFGetTypeID(CFBridgingRetain(number));
    return (numID == boolID);
}

- (NSMutableDictionary *)getVariableValues {
    NSMutableDictionary *varValues = [NSMutableDictionary dictionary];
    [self.allVariables enumerateKeysAndObjectsUsingBlock:^(id  _Nonnull key, CTVar*  _Nonnull var, BOOL * _Nonnull stop) {
        varValues[key] = var.value;
    }];
    return varValues;
}

#pragma mark - Notifications

- (void)emitEventInternal:(NSNotification *)notification {
    dispatch_async(dispatch_get_main_queue(), ^{
        [self.nativeToDartMethodChannel invokeMethod:notification.name arguments:notification.userInfo];
    });
}

- (void)emitEventPushPermissionResponse:(NSNotification *)notification {
    // Passed boolean value of `accepted` directly.
    dispatch_async(dispatch_get_main_queue(), ^{
        [self.nativeToDartMethodChannel invokeMethod:notification.name arguments:notification.userInfo[@"accepted"]];
    });
}

- (void)emitEventDisplayUnitsLoaded:(NSNotification *)notification {
    // Passed CleverTapDisplayUnit Array directly.
    dispatch_async(dispatch_get_main_queue(), ^{
        [self.nativeToDartMethodChannel invokeMethod:notification.name arguments:notification.userInfo[@"adUnits"]];
    });
}

- (void)emitCustomTemplate:(NSNotification *)notification {
    // Passed Custom Template String directly.
    dispatch_async(dispatch_get_main_queue(), ^{
        [self.nativeToDartMethodChannel invokeMethod:notification.name arguments:notification.userInfo[@"templateName"]];
    });
}

- (void)addObservers {
    
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(emitEventInternal:)
                                                 name:kCleverTapProfileDidInitialize
                                               object:nil];
    
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(emitEventInternal:)
                                                 name:kCleverTapProfileSync
                                               object:nil];
    
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(emitEventInternal:)
                                                 name:kCleverTapInAppNotificationDismissed
                                               object:nil];
    
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(emitEventInternal:)
                                                 name:kCleverTapInboxDidInitialize
                                               object:nil];
    
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(emitEventInternal:)
                                                 name:kCleverTapInboxMessagesDidUpdate
                                               object:nil];
    
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(emitEventDisplayUnitsLoaded:)
                                                 name:kCleverTapDisplayUnitsLoaded
                                               object:nil];
    
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(emitEventInternal:)
                                                 name:kCleverTapInAppNotificationButtonTapped
                                               object:nil];
    
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(emitEventInternal:)
                                                 name:kCleverTapInboxMessageButtonTapped
                                               object:nil];
    
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(emitEventInternal:)
                                                 name:kCleverTapInboxMessageTapped
                                               object:nil];
    
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(emitEventInternal:)
                                                 name:kCleverTapProductConfigFetched
                                               object:nil];
    
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(emitEventInternal:)
                                                 name:kCleverTapProductConfigActivated
                                               object:nil];
    
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(emitEventInternal:)
                                                 name:kCleverTapProductConfigInitialized
                                               object:nil];
    
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(emitEventInternal:)
                                                 name:kCleverTapFeatureFlagsUpdated
                                               object:nil];
    
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(emitEventInternal:)
                                                 name:kCleverTapPushNotificationClicked
                                               object:nil];

    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(emitEventPushPermissionResponse:)
                                                 name:kCleverTapPushPermissionResponseReceived
                                               object:nil];

    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(emitEventInternal:)
                                                 name:kCleverTapOnVariablesChanged
                                               object:nil];

    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(emitEventInternal:)
                                                 name:kCleverTapOnOneTimeVariablesChanged
                                               object:nil];

    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(emitEventInternal:)
                                                 name:kCleverTapOnVariablesChangedAndNoDownloadsPending
                                               object:nil];

    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(emitEventInternal:)
                                                 name:kCleverTapOnceVariablesChangedAndNoDownloadsPending
                                               object:nil];       

    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(emitEventInternal:)
                                                 name:kCleverTapOnFileValueChanged
                                               object:nil];
    
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(emitEventInternal:)
                                                 name:kCleverTapOnValueChanged
                                               object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(emitCustomTemplate:)
                                                 name:kCleverTapCustomTemplatePresent
                                               object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(emitCustomTemplate:)
                                                 name:kCleverTapCustomFunctionPresent
                                               object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(emitCustomTemplate:)
                                                 name:kCleverTapCustomTemplateClose
                                               object:nil];
}

- (void)postNotificationWithName:(NSString *)name andBody:(NSDictionary *)body {
    [[NSNotificationCenter defaultCenter] postNotificationName:name object:nil userInfo:body];
}

#pragma mark - Delegates
#pragma mark CleverTapSyncDelegate

- (void)profileDidInitialize:(NSString*)cleverTapID {
    
    if(!cleverTapID) {
        return;
    }
    [self postNotificationWithName:kCleverTapProfileDidInitialize andBody:@{@"CleverTapID":cleverTapID}];
}

- (void)profileDataUpdated:(NSDictionary *)updates {
    
    if(!updates) {
        return ;
    }
    [self postNotificationWithName:kCleverTapProfileSync andBody:@{@"updates":updates}];
}


#pragma mark CleverTapInAppNotificationDelegate

- (void)inAppNotificationDismissedWithExtras:(NSDictionary *)extras andActionExtras:(NSDictionary *)actionExtras {
    
    NSMutableDictionary *body = [NSMutableDictionary new];
    body[@"extras"] = (extras != nil) ? extras : [NSMutableDictionary new];
    body[@"actionExtras"] = (actionExtras != nil) ? actionExtras : [NSMutableDictionary new];
    [self postNotificationWithName:kCleverTapInAppNotificationDismissed andBody:body];
}

- (void)inAppNotificationButtonTappedWithCustomExtras:(NSDictionary *)customExtras {
    
    NSMutableDictionary *body = [NSMutableDictionary new];
    if (customExtras != nil) {
        body[@"customExtras"] = customExtras;
    }
    [self postNotificationWithName:kCleverTapInAppNotificationButtonTapped andBody:customExtras];
}


#pragma mark CleverTapInboxViewControllerDelegate

- (void)messageButtonTappedWithCustomExtras:(NSDictionary *_Nullable)customExtras {
    NSMutableDictionary *body = [NSMutableDictionary new];
    if (customExtras != nil) {
        body = [NSMutableDictionary dictionaryWithDictionary:customExtras];
    }
    [self postNotificationWithName:kCleverTapInboxMessageButtonTapped andBody:body];
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
    [self postNotificationWithName:kCleverTapInboxMessageTapped andBody:body];
}

#pragma mark CleverTapPushNotificationDelegate

- (void)pushNotificationTappedWithCustomExtras:(NSDictionary *)customExtras {
    NSMutableDictionary *pushNotificationExtras = [NSMutableDictionary new];
    if (customExtras != nil) {
        pushNotificationExtras = [NSMutableDictionary dictionaryWithDictionary:customExtras];
    }
    [self postNotificationWithName:kCleverTapPushNotificationClicked andBody:pushNotificationExtras];
}

#pragma mark - Push Notifications

- (void)pushNotificationViewedEvent:(FlutterMethodCall *)call withResult:(FlutterResult)result {
    
    [[CleverTap sharedInstance] recordNotificationViewedEventWithData:call.arguments[@"notificationData"]];
    result(nil);
}

- (void)pushNotificationClickedEvent:(FlutterMethodCall *)call withResult:(FlutterResult)result {
    
    [[CleverTap sharedInstance] recordNotificationClickedEventWithData:call.arguments[@"notificationData"]];
    result(nil);
}

#pragma mark - Push Primer

- (void)promptForPushNotification:(FlutterMethodCall *)call withResult:(FlutterResult)result {
    BOOL isFallbackToSettings = [call.arguments boolValue];
    [[CleverTap sharedInstance] promptForPushPermission: isFallbackToSettings];
}

- (void)promptPushPrimer:(FlutterMethodCall *)call withResult:(FlutterResult)result {
    NSDictionary *json = call.arguments;
    BOOL isJSONInvalid = [self validatePushPrimerRequiredSettings:json];
    if (!isJSONInvalid) {
        CTLocalInApp *localInAppBuilder = [self buildLocalInApp:json];
        [[CleverTap sharedInstance] promptPushPrimer:localInAppBuilder.getLocalInAppSettings];
    } else {
        NSLog(@"CleverTapFlutter: Invalid Push Primer JSON received");
    }
}

- (void)getPushNotificationPermissionStatus:(FlutterMethodCall *)call withResult:(FlutterResult)result {
    [[CleverTap sharedInstance] getNotificationPermissionStatusWithCompletionHandler:^(UNAuthorizationStatus status) {
        BOOL isPushEnabled = YES;
        if (status == UNAuthorizationStatusNotDetermined || status == UNAuthorizationStatusDenied) {
            isPushEnabled = NO;
        }
        result(@(isPushEnabled));
    }];
}

#pragma mark - CleverTapPushPermissionDelegate

- (void)onPushPermissionResponse:(BOOL)accepted {
    NSMutableDictionary *body = [NSMutableDictionary new];
    body[@"accepted"] = [NSNumber numberWithBool:accepted];
    [self postNotificationWithName:kCleverTapPushPermissionResponseReceived andBody:body];
}

- (BOOL)validatePushPrimerRequiredSettings:(NSDictionary *)json {
    // Returns YES if any required key is not present or not of required type.
    BOOL isJSONFormatInvalid = NO;
    if (json[@"inAppType"] != nil) {
        if (![json[@"inAppType"]  isEqual:@"half-interstitial"] && ![json[@"inAppType"]  isEqual:@"alert"]) {
            isJSONFormatInvalid = YES;
        }
    } else {
        isJSONFormatInvalid = YES;
    }
    if (json[@"titleText"] == nil || ![json[@"titleText"] isKindOfClass:[NSString class]]) {
        isJSONFormatInvalid = YES;
    }
    if (json[@"messageText"] == nil || ![json[@"messageText"] isKindOfClass:[NSString class]]) {
        isJSONFormatInvalid = YES;
    }
    if (json[@"followDeviceOrientation"] == nil) {
        isJSONFormatInvalid = YES;
    }
    if (json[@"positiveBtnText"] == nil || ![json[@"positiveBtnText"] isKindOfClass:[NSString class]]) {
        isJSONFormatInvalid = YES;
    }
    if (json[@"negativeBtnText"] == nil || ![json[@"negativeBtnText"] isKindOfClass:[NSString class]]) {
        isJSONFormatInvalid = YES;
    }
    return isJSONFormatInvalid;
}

- (CTLocalInApp *)buildLocalInApp:(NSDictionary *)json {
    CTLocalInAppType inAppType;
    if ([json[@"inAppType"]  isEqual:@"half-interstitial"]) {
        inAppType = HALF_INTERSTITIAL;
    } else {
        inAppType = ALERT;
    }
    CTLocalInApp *localInAppBuilder = [[CTLocalInApp alloc] initWithInAppType:inAppType
                                                                    titleText:json[@"titleText"]
                                                                  messageText:json[@"messageText"]
                                                      followDeviceOrientation:[json[@"followDeviceOrientation"] boolValue]
                                                              positiveBtnText:json[@"positiveBtnText"]
                                                              negativeBtnText:json[@"negativeBtnText"]];
    if (json[@"fallbackToSettings"] != nil) {
        [localInAppBuilder setFallbackToSettings:[json[@"fallbackToSettings"] boolValue]];
    }
    if (json[@"backgroundColor"] != nil && [json[@"backgroundColor"] isKindOfClass:[NSString class]]) {
        [localInAppBuilder setBackgroundColor:json[@"backgroundColor"]];
    }
    if (json[@"btnBorderColor"] != nil && [json[@"btnBorderColor"] isKindOfClass:[NSString class]]) {
        [localInAppBuilder setBtnBorderColor:json[@"btnBorderColor"]];
    }
    if (json[@"titleTextColor"] != nil && [json[@"titleTextColor"] isKindOfClass:[NSString class]]) {
        [localInAppBuilder setTitleTextColor:json[@"titleTextColor"]];
    }
    if (json[@"messageTextColor"] != nil && [json[@"messageTextColor"] isKindOfClass:[NSString class]]) {
        [localInAppBuilder setMessageTextColor:json[@"messageTextColor"]];
    }
    if (json[@"btnTextColor"] != nil && [json[@"btnTextColor"] isKindOfClass:[NSString class]]) {
        [localInAppBuilder setBtnTextColor:json[@"btnTextColor"]];
    }
    if (json[@"btnBackgroundColor"] != nil && [json[@"btnBackgroundColor"] isKindOfClass:[NSString class]]) {
        [localInAppBuilder setBtnBackgroundColor:json[@"btnBackgroundColor"]];
    }
    if (json[@"btnBorderRadius"] != nil && [json[@"btnBorderRadius"] isKindOfClass:[NSString class]]) {
        [localInAppBuilder setBtnBorderRadius:json[@"btnBorderRadius"]];
    }
    NSString *altText = nil;
    if (json[@"altText"] != nil && [json[@"altText"] isKindOfClass:[NSString class]]) {
        altText = json[@"altText"];
    }
    if (json[@"imageUrl"] != nil && [json[@"imageUrl"] isKindOfClass:[NSString class]]) {
        [localInAppBuilder setImageUrl:json[@"imageUrl"] contentDescription:altText];
    }
    return localInAppBuilder;
}

#pragma mark - Product Experiences - syncVariables

- (void)syncVariables {
    [[CleverTap sharedInstance]syncVariables];
}

- (void)syncVariablesinProd:(FlutterMethodCall *)call withResult:(FlutterResult)result {
    [[CleverTap sharedInstance]syncVariables:[call.arguments[@"isProduction"] boolValue]];
}

- (void)fetchVariables:(FlutterMethodCall *)call withResult:(FlutterResult)result {
    [[CleverTap sharedInstance]fetchVariables:^(BOOL success) {
        result(@(success));
    }];
}

- (void)defineVariables:(FlutterMethodCall *)call withResult:(FlutterResult)result {

    NSDictionary *variables = call.arguments[@"variables"];
    if (!variables || [variables count] == 0) {
        result(nil);
        return;
    }

    [variables enumerateKeysAndObjectsUsingBlock:^(NSString*  _Nonnull key, id  _Nonnull value, BOOL * _Nonnull stop) {
        CTVar *var = [self createVarForName:key andValue:value];

        if (var) {
            self.allVariables[key] = var;
        }
    }];
    result(nil);
}

- (void)defineFileVariable:(FlutterMethodCall *)call withResult:(FlutterResult)result {
    NSString *fileVariable = call.arguments[@"fileVariable"];
    if (!fileVariable) return;

    CTVar *fileVar = [[CleverTap sharedInstance] defineFileVar:fileVariable];
    if (fileVar) {
        self.allVariables[fileVariable] = fileVar;
    }
    result(nil);
}

- (void)getVariables:(FlutterMethodCall *)call withResult:(FlutterResult)result {
    NSMutableDictionary *varValues = [self getVariableValues];
    result(varValues);
}

- (void)getVariable:(FlutterMethodCall *)call withResult:(FlutterResult)result {
    CTVar *var = self.allVariables[call.arguments[@"name"]];
    result(var.value);
}

- (void)onVariablesChanged:(FlutterMethodCall *)call withResult:(FlutterResult)result {
    [[CleverTap sharedInstance]onVariablesChanged:^{
        [self postNotificationWithName:kCleverTapOnVariablesChanged andBody:[self getVariableValues]];
    }];
}

- (void)onOneTimeVariablesChanged:(FlutterMethodCall *)call withResult:(FlutterResult)result {
    [[CleverTap sharedInstance]onceVariablesChanged:^{
        [self postNotificationWithName:kCleverTapOnOneTimeVariablesChanged andBody:[self getVariableValues]];
    }];
}

- (void)onValueChanged:(FlutterMethodCall *)call withResult:(FlutterResult)result {
    CTVar *var = self.allVariables[call.arguments[@"name"]];
    if (var) {
        [var onValueChanged:^{
            NSDictionary *varResult = @{
                var.name: var.value
            };
            [self postNotificationWithName:kCleverTapOnValueChanged andBody:varResult];
        }];
    }
}

- (void)onVariablesChangedAndNoDownloadsPending:(FlutterMethodCall *)call withResult:(FlutterResult)result {
    [[CleverTap sharedInstance]onVariablesChangedAndNoDownloadsPending:^{
        [self postNotificationWithName:kCleverTapOnVariablesChangedAndNoDownloadsPending andBody:[self getVariableValues]];
    }];
}

- (void)onceVariablesChangedAndNoDownloadsPending:(FlutterMethodCall *)call withResult:(FlutterResult)result {
    [[CleverTap sharedInstance]onceVariablesChangedAndNoDownloadsPending:^{
        [self postNotificationWithName:kCleverTapOnceVariablesChangedAndNoDownloadsPending andBody:[self getVariableValues]];
    }];
}

- (void)onFileValueChanged:(FlutterMethodCall *)call withResult:(FlutterResult)result {
    CTVar *var = self.allVariables[call.arguments[@"name"]];
    if (var) {
        [var onFileIsReady:^{
            NSDictionary *varFileResult = @{
                var.name: var.value
            };
            [self postNotificationWithName:kCleverTapOnFileValueChanged andBody:varFileResult];
        }];
    }
}

- (void)setLocale:(FlutterMethodCall *)call withResult:(FlutterResult)result {
    NSLocale *locale = [[NSLocale alloc] initWithLocaleIdentifier:call.arguments];
    [[CleverTap sharedInstance] setLocale:locale];
    result(nil);
}

#pragma mark - Custom Code Templates

- (void)syncCustomTemplates:(FlutterMethodCall *)call withResult:(FlutterResult)result {
    [[CleverTap sharedInstance] syncCustomTemplates];
    result(nil);
}

- (void)syncCustomTemplatesInProd:(FlutterMethodCall *)call withResult:(FlutterResult)result {
    BOOL isProduction = [call.arguments[@"isProduction"] boolValue];
    [[CleverTap sharedInstance] syncCustomTemplates:isProduction];
    result(nil);
}

- (void)customTemplateSetDismissed:(FlutterMethodCall *)call withResult:(FlutterResult)result {
    NSString *templateName = call.arguments;
    
    CTTemplateContext *context = [[CleverTap sharedInstance] activeContextForTemplate:templateName];
    if (context) {
        [context dismissed];
        result(nil);
    } else {
        result([FlutterError errorWithCode:@"CustomTemplateError"
                                   message:[NSString stringWithFormat:@"Custom template: %@ is not currently being presented", templateName]
                                   details:nil]);
    }
}

- (void)customTemplateSetPresented:(FlutterMethodCall *)call withResult:(FlutterResult)result {
    NSString *templateName = call.arguments;
    
    CTTemplateContext *context = [[CleverTap sharedInstance] activeContextForTemplate:templateName];
    if (context) {
        [context presented];
        result(nil);
    } else {
        result([FlutterError errorWithCode:@"CustomTemplateError"
                                   message:[NSString stringWithFormat:@"Custom template: %@ is not currently being presented", templateName]
                                   details:nil]);
    }
}

- (void)customTemplateRunAction:(FlutterMethodCall *)call withResult:(FlutterResult)result {
    NSString *templateName = call.arguments[@"templateName"];
    NSString *argName = call.arguments[@"argName"];
    
    CTTemplateContext *context = [[CleverTap sharedInstance] activeContextForTemplate:templateName];
    if (context) {
        [context triggerActionNamed:argName];
        result(nil);
    } else {
        result([FlutterError errorWithCode:@"CustomTemplateError"
                                   message:[NSString stringWithFormat:@"Custom template: %@ is not currently being presented", templateName]
                                   details:nil]);
    }
}

- (void)customTemplateGetStringArg:(FlutterMethodCall *)call withResult:(FlutterResult)result {
    NSString *templateName = call.arguments[@"templateName"];
    NSString *argName = call.arguments[@"argName"];
    
    CTTemplateContext *context = [[CleverTap sharedInstance] activeContextForTemplate:templateName];
    if (context) {
        NSString *str = [context stringNamed:argName];
        result(str ? str : [NSNull null]);
    } else {
        result([FlutterError errorWithCode:@"CustomTemplateError"
                                   message:[NSString stringWithFormat:@"Custom template: %@ is not currently being presented", templateName]
                                   details:nil]);
    }
}

- (void)customTemplateGetNumberArg:(FlutterMethodCall *)call withResult:(FlutterResult)result {
    NSString *templateName = call.arguments[@"templateName"];
    NSString *argName = call.arguments[@"argName"];
    
    CTTemplateContext *context = [[CleverTap sharedInstance] activeContextForTemplate:templateName];
    if (context) {
        NSNumber *number = [context numberNamed:argName];
        result(number ? number : [NSNull null]);
    } else {
        result([FlutterError errorWithCode:@"CustomTemplateError"
                                   message:[NSString stringWithFormat:@"Custom template: %@ is not currently being presented", templateName]
                                   details:nil]);
    }
}

- (void)customTemplateGetBooleanArg:(FlutterMethodCall *)call withResult:(FlutterResult)result {
    NSString *templateName = call.arguments[@"templateName"];
    NSString *argName = call.arguments[@"argName"];
    
    CTTemplateContext *context = [[CleverTap sharedInstance] activeContextForTemplate:templateName];
    if (context) {
        NSNumber *boolean = [NSNumber numberWithBool:[context boolNamed:argName]];
        result(boolean);
    } else {
        result([FlutterError errorWithCode:@"CustomTemplateError"
                                   message:[NSString stringWithFormat:@"Custom template: %@ is not currently being presented", templateName]
                                   details:nil]);
    }
}

- (void)customTemplateGetFileArg:(FlutterMethodCall *)call withResult:(FlutterResult)result {
    NSString *templateName = call.arguments[@"templateName"];
    NSString *argName = call.arguments[@"argName"];
    
    CTTemplateContext *context = [[CleverTap sharedInstance] activeContextForTemplate:templateName];
    if (context) {
        NSString *filePath = [context fileNamed:argName];
        result(filePath ? filePath : [NSNull null]);
    } else {
        result([FlutterError errorWithCode:@"CustomTemplateError"
                                   message:[NSString stringWithFormat:@"Custom template: %@ is not currently being presented", templateName]
                                   details:nil]);
    }
}

- (void)customTemplateGetObjectArg:(FlutterMethodCall *)call withResult:(FlutterResult)result {
    NSString *templateName = call.arguments[@"templateName"];
    NSString *argName = call.arguments[@"argName"];
    
    CTTemplateContext *context = [[CleverTap sharedInstance] activeContextForTemplate:templateName];
    if (context) {
        NSDictionary *dictionary = [context dictionaryNamed:argName];
        result(dictionary ? dictionary : [NSNull null]);
    } else {
        result([FlutterError errorWithCode:@"CustomTemplateError"
                                   message:[NSString stringWithFormat:@"Custom template: %@ is not currently being presented", templateName]
                                   details:nil]);
    }
}

- (void)customTemplateContextToString:(FlutterMethodCall *)call withResult:(FlutterResult)result {
    NSString *templateName = call.arguments[@"templateName"];
    
    if (![CleverTap sharedInstance]) {
        result([FlutterError errorWithCode:@"CustomTemplateError"
                                    message:@"CleverTap is not initialized"
                                    details:nil]);
        return;
    }
    
    CTTemplateContext *context = [[CleverTap sharedInstance] activeContextForTemplate:templateName];
    if (!context) {
        result([FlutterError errorWithCode:@"CustomTemplateError"
                                    message:[NSString stringWithFormat:@"Custom template: %@ is not currently being presented", templateName]
                                    details:nil]);
        return;
    }
    
    result([context debugDescription]);
}

@end
