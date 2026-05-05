#import "RCTCustomButton.h"

#import <react/renderer/components/AppSpecs/ComponentDescriptors.h>
#import <react/renderer/components/AppSpecs/EventEmitters.h>
#import <react/renderer/components/AppSpecs/Props.h>
#import <react/renderer/components/AppSpecs/RCTComponentViewHelpers.h>

using namespace facebook::react;

@interface RCTCustomButton () <RCTCustomButtonViewProtocol>
@end

@implementation RCTCustomButton {
  UIButton *_button;
}

- (instancetype)init {
  if (self = [super init]) {
    _button = [UIButton buttonWithType:UIButtonTypeSystem];
    _button.titleLabel.font = [UIFont systemFontOfSize:16 weight:UIFontWeightSemibold];
    [_button setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
    _button.backgroundColor = [UIColor systemBlueColor];
    _button.layer.cornerRadius = 4;
    [_button addTarget:self
                action:@selector(handlePress)
      forControlEvents:UIControlEventTouchUpInside];
    [self addSubview:_button];
  }
  return self;
}

- (void)updateProps:(Props::Shared const &)props
           oldProps:(Props::Shared const &)oldProps {
  const auto &oldViewProps = *std::static_pointer_cast<CustomButtonProps const>(_props);
  const auto &newViewProps = *std::static_pointer_cast<CustomButtonProps const>(props);

  if (oldViewProps.text != newViewProps.text) {
    NSString *title = [NSString stringWithCString:newViewProps.text.c_str()
                                         encoding:NSUTF8StringEncoding];
    [_button setTitle:title forState:UIControlStateNormal];
  }

  if (oldViewProps.disabled != newViewProps.disabled) {
    _button.enabled = !newViewProps.disabled;
    _button.alpha = newViewProps.disabled ? 0.5 : 1.0;
  }

  [super updateProps:props oldProps:oldProps];
}

- (void)layoutSubviews {
  [super layoutSubviews];
  _button.frame = self.bounds;
}

- (void)handlePress {
  if (_eventEmitter) {
    std::static_pointer_cast<CustomButtonEventEmitter const>(_eventEmitter)
      ->onCustomButtonPress({});
  }
}

+ (ComponentDescriptorProvider)componentDescriptorProvider {
  return concreteComponentDescriptorProvider<CustomButtonComponentDescriptor>();
}

@end
