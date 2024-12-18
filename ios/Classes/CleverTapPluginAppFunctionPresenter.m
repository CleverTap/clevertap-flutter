//
//  CleverTapPluginAppFunctionPresenter.m
//  CleverTapPlugin
//
//  Created by Nikola Zagorchev on 2.10.24.
//

#import "CleverTapPluginAppFunctionPresenter.h"
#import "CleverTapPlugin.h"

@implementation CleverTapPluginAppFunctionPresenter

- (void)onPresent:(nonnull CTTemplateContext *)context {
    NSMutableDictionary *body = [NSMutableDictionary new];
    body[@"templateName"] = (context.templateName != nil) ? context.templateName : [NSMutableDictionary new];
    [[CleverTapPlugin sharedInstance] postNotificationWithName:kCleverTapCustomTemplatePresent andBody:body];
}

- (void)onCloseClicked:(nonnull CTTemplateContext *)context {
    // NOOP - App Functions cannot have Action arguments.
}

@end
