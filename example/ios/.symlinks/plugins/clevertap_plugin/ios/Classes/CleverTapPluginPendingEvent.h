//
//  CleverTapPluginPendingEvent.h
//  Pods
//
//  Created by Kushagra Mishra on 28/04/25.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface CleverTapPluginPendingEvent : NSObject

@property (nonatomic, strong) NSString *name;
@property (nonatomic, strong) NSDictionary *body;

- (instancetype)initWithName:(NSString *)name body:(NSDictionary *)body;

@end

NS_ASSUME_NONNULL_END
