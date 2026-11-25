//
//  CleverTapPluginAppFunctionPresenter.m
//  CleverTapPlugin
//
//  Created by Nikola Zagorchev on 2.10.24.
//

#import "CleverTapPluginAppFunctionPresenter.h"
#import "CleverTapPlugin.h"
#import "CleverTapPlugin+Internal.h"

@interface CleverTapPluginAppFunctionPresenter ()
@property (nonatomic, copy, nullable) NSString *accountId;
@end

@implementation CleverTapPluginAppFunctionPresenter

- (instancetype)initWithAccountId:(nullable NSString *)accountId {
    self = [super init];
    if (self) {
        _accountId = [accountId copy];
    }
    return self;
}

- (void)onPresent:(nonnull CTTemplateContext *)context {
    NSMutableDictionary *body = [NSMutableDictionary new];
    body[@"templateName"] = (context.templateName != nil) ? context.templateName : [NSMutableDictionary new];
    // The function event, as on Android. Until Phase 7 this posted kCleverTapCustomTemplatePresent,
    // so on iOS an app function ran the template handler instead of the function handler.
    [[CleverTapPlugin sharedInstance] postNotificationWithName:kCleverTapCustomFunctionPresent andBody:body accountId:self.accountId];
}

- (void)onCloseClicked:(nonnull CTTemplateContext *)context {
    // NOOP - App Functions cannot have Action arguments.
}

@end
