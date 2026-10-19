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

@end

NS_ASSUME_NONNULL_END
