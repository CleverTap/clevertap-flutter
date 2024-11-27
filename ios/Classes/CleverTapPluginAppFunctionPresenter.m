//
//  CleverTapPluginAppFunctionPresenter.m

#import "CleverTapPluginAppFunctionPresenter.h"
#import "CleverTapPlugin.h"

@implementation CleverTapPluginAppFunctionPresenter

- (void)onPresent:(nonnull CTTemplateContext *)context {
    [[NSNotificationCenter defaultCenter] postNotification:[NSNotification notificationWithName:CTSendEvent object:@"CleverTapCustomFunctionPresent" userInfo:@{@"result": context.templateName}]];
}

- (void)onCloseClicked:(nonnull CTTemplateContext *)context {
    // NOOP - App Functions cannot have Action arguments.
}

@end
