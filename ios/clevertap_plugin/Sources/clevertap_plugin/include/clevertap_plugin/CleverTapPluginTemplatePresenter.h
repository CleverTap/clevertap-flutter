//
//  CleverTapPluginTemplatePresenter.h
//  CleverTapPlugin
//
//  Created by Nikola Zagorchev on 2.10.24.
//

#import <Foundation/Foundation.h>
#if __has_include(<CleverTapSDK/CTTemplatePresenter.h>)
#import <CleverTapSDK/CTTemplatePresenter.h>
#else
#import "CTTemplatePresenter.h"
#endif

NS_ASSUME_NONNULL_BEGIN

/// A `CTTemplatePresenter` handling Custom Templates presentation.
/// Posts a `kCleverTapCustomTemplatePresent` notification to PluginNative
/// when a Custom Template `onPresent:` is called.
/// Posts a `kCleverTapCustomTemplateClose` notification to PluginNative
/// when a Custom Template `onCloseClicked:` is called.
@interface CleverTapPluginTemplatePresenter : NSObject <CTTemplatePresenter>

/// A presenter for one account: its notifications carry that account's ID, so Dart sends them to
/// that account's handlers. `init` keeps the old behavior (no account: the default handlers).
- (instancetype)initWithAccountId:(nullable NSString *)accountId;

@end

NS_ASSUME_NONNULL_END
