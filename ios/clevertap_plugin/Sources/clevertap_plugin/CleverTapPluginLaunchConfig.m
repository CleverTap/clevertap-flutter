//
//  CleverTapPluginLaunchConfig.m
//  CleverTapPlugin
//

#import "CleverTapPluginLaunchConfig.h"

@implementation CleverTapPluginLaunchConfig

- (instancetype)initWithConfig:(CleverTapInstanceConfig *)config {
    return [self initWithConfig:config cleverTapID:nil];
}

- (instancetype)initWithConfig:(CleverTapInstanceConfig *)config cleverTapID:(nullable NSString *)cleverTapID {
    self = [super init];
    if (self) {
        _config = config;
        _cleverTapID = [cleverTapID copy];
    }
    return self;
}

@end
