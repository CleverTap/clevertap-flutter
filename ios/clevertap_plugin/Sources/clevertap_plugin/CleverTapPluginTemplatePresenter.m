//
//  CleverTapPluginTemplatePresenter.m
//  CleverTapPlugin
//
//  Created by Nikola Zagorchev on 2.10.24.
//

#import "CleverTapPluginTemplatePresenter.h"
#import "CleverTapPlugin.h"
#import "CleverTapPlugin+Internal.h"

@interface CleverTapPluginTemplatePresenter ()
@property (nonatomic, copy, nullable) NSString *accountId;
@end

@implementation CleverTapPluginTemplatePresenter

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
    [[CleverTapPlugin sharedInstance] postNotificationWithName:kCleverTapCustomTemplatePresent andBody:body accountId:self.accountId];
}

- (void)onCloseClicked:(nonnull CTTemplateContext *)context {
    NSMutableDictionary *body = [NSMutableDictionary new];
    body[@"templateName"] = (context.templateName != nil) ? context.templateName : [NSMutableDictionary new];
    [[CleverTapPlugin sharedInstance] postNotificationWithName:kCleverTapCustomTemplateClose andBody:body accountId:self.accountId];
}

@end
