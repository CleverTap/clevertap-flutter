#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

/**
 * The checked input of `createInstance(config)`, read from the Dart map BEFORE any SDK object is
 * built. Android twin: InstanceConfigRequest.kt. Same fields, same rules, same messages.
 *
 * The Dart side sends a typed CleverTapInstanceConfig, so a wrong type cannot come from it. These
 * checks are the backup for a hand-written invokeMethod('createInstance', ...).
 *
 * Rules:
 *  - a missing key or NSNull means "not set", and the SDK keeps its default;
 *  - a value of the wrong type is an error: parse:error: returns nil with a message naming the
 *    field, and createInstance answers EINVALID.
 *
 * Example: @{@"accountId": @"ACC-B", @"accountToken": @"TOK-B", @"logLevel": @"HIGH"} gives
 * "logLevel must be one of off, info, debug, verbose" instead of quietly using a default level.
 *
 * Nullable NSNumber properties are booleans: nil = not set, otherwise @YES / @NO.
 */
@interface CleverTapPluginInstanceConfigRequest : NSObject

@property (nonatomic, copy, readonly) NSString *accountId;
@property (nonatomic, copy, readonly) NSString *accountToken;
@property (nonatomic, copy, readonly, nullable) NSString *region;
@property (nonatomic, copy, readonly, nullable) NSString *proxyDomain;
@property (nonatomic, copy, readonly, nullable) NSString *spikyProxyDomain;
@property (nonatomic, copy, readonly, nullable) NSString *handshakeDomain;
@property (nonatomic, copy, readonly, nullable) NSArray<NSString *> *identityKeys;
@property (nonatomic, copy, readonly, nullable) NSString *logLevel;
@property (nonatomic, copy, readonly, nullable) NSString *encryptionLevel;
@property (nonatomic, strong, readonly, nullable) NSNumber *analyticsOnly;
@property (nonatomic, strong, readonly, nullable) NSNumber *enablePersonalization;
@property (nonatomic, strong, readonly, nullable) NSNumber *disableAppLaunchedEvent;
@property (nonatomic, strong, readonly, nullable) NSNumber *encryptionInTransit;
@property (nonatomic, strong, readonly, nullable) NSNumber *useCustomCleverTapId;
@property (nonatomic, copy, readonly, nullable) NSString *cleverTapId;
@property (nonatomic, strong, readonly, nullable) NSNumber *disableIDFV;
@property (nonatomic, strong, readonly, nullable) NSNumber *enableFileProtection;

/// The checked request, or nil with *error set to a message naming the bad field.
+ (nullable instancetype)parse:(nullable id)config error:(NSString * _Nullable * _Nonnull)error;

@end

NS_ASSUME_NONNULL_END
