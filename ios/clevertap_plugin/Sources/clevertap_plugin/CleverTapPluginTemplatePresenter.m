//
//  CleverTapPluginTemplatePresenter.m
//  CleverTapPlugin
//
//  Created by Nikola Zagorchev on 2.10.24.
//

#import "CleverTapPluginTemplatePresenter.h"
#import "CleverTapPlugin.h"

@implementation CleverTapPluginTemplatePresenter

- (void)onPresent:(nonnull CTTemplateContext *)context {
    NSMutableDictionary *body = [NSMutableDictionary new];
    body[@"templateName"] = (context.templateName != nil) ? context.templateName : [NSMutableDictionary new];
    [[CleverTapPlugin sharedInstance] postNotificationWithName:kCleverTapCustomTemplatePresent andBody:body];
}

- (void)onCloseClicked:(nonnull CTTemplateContext *)context {
    NSMutableDictionary *body = [NSMutableDictionary new];
    body[@"templateName"] = (context.templateName != nil) ? context.templateName : [NSMutableDictionary new];
    [[CleverTapPlugin sharedInstance] postNotificationWithName:kCleverTapCustomTemplateClose andBody:body];
}

@end
