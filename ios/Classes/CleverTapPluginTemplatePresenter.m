#import "CleverTapReactTemplatePresenter.h"
#import "CleverTapReact.h"

@implementation CleverTapReactTemplatePresenter

- (void)onPresent:(nonnull CTTemplateContext *)context { 
    [CleverTapReact sendEventOnObserving:kCleverTapCustomTemplatePresent body:context.templateName];
}

- (void)onCloseClicked:(nonnull CTTemplateContext *)context {
    [CleverTapReact sendEventOnObserving:kCleverTapCustomTemplateClose body:context.templateName];
}

@end
