//
//  CleverTapPluginCustomTemplates.m
//  CleverTapPlugin
//
//  Created by Nikola Zagorchev on 2.10.24.
//


#import "CleverTapPluginCustomTemplates.h"
#import "CleverTapPluginTemplatePresenter.h"
#import "CleverTapPluginAppFunctionPresenter.h"

#if __has_include(<CleverTapSDK/CTJsonTemplateProducer.h>)
#import <CleverTapSDK/CTJsonTemplateProducer.h>
#else
#import "CTJsonTemplateProducer.h"
#endif

#if __has_include(<CleverTapSDK/CTCustomTemplatesManager.h>)
#import <CleverTapSDK/CTCustomTemplatesManager.h>
#else
#import "CTCustomTemplatesManager.h"
#endif

/// Builds the templates of one JSON file for each account. The SDK calls `defineTemplates:` once per
/// account, with that account's config, and the template context it later hands to a presenter
/// does not say which account it belongs to. So each account gets new presenters that remember
/// its ID. Example: A and B both show "Spin"; A's presenter posts ("Spin", A), B's posts ("Spin", B).
@interface CleverTapPluginAccountTemplateProducer : NSObject <CTTemplateProducer>
@property (nonatomic, copy) NSString *definitionsJson;
@end

@implementation CleverTapPluginAccountTemplateProducer

- (NSSet<CTCustomTemplate *> * _Nonnull)defineTemplates:(CleverTapInstanceConfig * _Nonnull)instanceConfig {
    CleverTapPluginTemplatePresenter *templatePresenter = [[CleverTapPluginTemplatePresenter alloc] initWithAccountId:instanceConfig.accountId];
    CleverTapPluginAppFunctionPresenter *functionPresenter = [[CleverTapPluginAppFunctionPresenter alloc] initWithAccountId:instanceConfig.accountId];
    CTJsonTemplateProducer *producer = [[CTJsonTemplateProducer alloc] initWithJson:self.definitionsJson templatePresenter:templatePresenter functionPresenter:functionPresenter];
    return [producer defineTemplates:instanceConfig];
}

@end

@implementation CleverTapPluginCustomTemplates

+ (void)registerCustomTemplates:(nonnull NSString *)firstJsonAsset, ... NS_REQUIRES_NIL_TERMINATION {
    va_list args;
    va_start(args, firstJsonAsset);
    
    NSBundle *bundle = [NSBundle mainBundle];
    [self registerCustomTemplates:bundle firstJsonAsset:firstJsonAsset args:args];
    va_end(args);
}

+ (void)registerCustomTemplates:(nonnull NSBundle *)bundle jsonFileNames:(nonnull NSString *)firstJsonAsset, ... NS_REQUIRES_NIL_TERMINATION {
    va_list args;
    va_start(args, firstJsonAsset);
    
    [self registerCustomTemplates:bundle firstJsonAsset:firstJsonAsset args:args];
    va_end(args);
}

+ (void)registerCustomTemplates:(NSBundle * _Nonnull)bundle firstJsonAsset:(NSString * _Nonnull)firstJsonAsset args:(va_list)args  {
    for (NSString *arg = firstJsonAsset; arg != nil; arg = va_arg(args, NSString*)) {
        NSString *filePath = [bundle pathForResource:arg ofType:@"json"];
        if (filePath) {
            NSString *definitionsJson = [NSString stringWithContentsOfFile:filePath encoding:NSUTF8StringEncoding error:nil];
            
            CleverTapPluginAccountTemplateProducer *producer = [[CleverTapPluginAccountTemplateProducer alloc] init];
            producer.definitionsJson = definitionsJson;
            [CleverTap registerCustomInAppTemplates:producer];
        } else {
            NSLog(@"Custom templates JSON file not found. File name: \"%@\" in bundle: %@.", arg, bundle);
        }
    }
}

@end
