
#import <Foundation/Foundation.h>
#if __has_include(<CleverTapSDK/CTTemplatePresenter.h>)
#import <CleverTapSDK/CTTemplatePresenter.h>
#else
#import "CTTemplatePresenter.h"
#endif

NS_ASSUME_NONNULL_BEGIN

/// A `CTTemplatePresenter` handling App Functions presentation.
/// Posts a `kCleverTapCustomFunctionPresent` notification to PluginNative
/// when an App Function onPresent is called.
@interface CleverTapPluginAppFunctionPresenter : NSObject <CTTemplatePresenter>

/// A presenter for one account: its notifications carry that account's ID, so Dart sends them to
/// that account's handlers. `init` keeps the old behavior (no account: the default handlers).
- (instancetype)initWithAccountId:(nullable NSString *)accountId;

@end

NS_ASSUME_NONNULL_END
