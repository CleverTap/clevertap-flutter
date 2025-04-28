//
//  CleverTapPluginPendingEvent.m
//  Pods
//
//  Created by Kushagra Mishra on 28/04/25.
//

#import "CleverTapPluginPendingEvent.h"

@implementation CleverTapPluginPendingEvent

- (instancetype)initWithName:(NSString *)name body:(NSDictionary *)body {
    self = [super init];
    if (self) {
        _name = name;
        _body = body;
    }
    return self;
}

@end
