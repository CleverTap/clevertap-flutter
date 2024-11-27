//
//  CleverTapReactTemplatePresenter.m

#import "CleverTapPlugin.h"
#import "CleverTapPluginTemplatePresenter.h"

@implementation CleverTapPluginTemplatePresenter

- (void)onPresent:(nonnull CTTemplateContext *)context {
    [[NSNotificationCenter defaultCenter] postNotification:[NSNotification notificationWithName:CTSendEvent object:@"CleverTapCustomTemplatePresent" userInfo:@{@"result": @{@"name": context.templateName}}]];
}

- (void)onCloseClicked:(nonnull CTTemplateContext *)context {
    [[NSNotificationCenter defaultCenter] postNotification:[NSNotification notificationWithName:CTSendEvent  object:@"CleverTapCustomTemplateClose" userInfo:@{@"result": context.templateName}]];
}

@end