import type { HostComponent, ViewProps } from 'react-native';
import type { DirectEventHandler } from 'react-native/Libraries/Types/CodegenTypes';
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';

// eslint-disable-next-line @typescript-eslint/ban-types
type CustomButtonPressEvent = Readonly<{}>;

export interface NativeProps extends ViewProps {
  text?: string;
  disabled?: boolean;
  onCustomButtonPress?: DirectEventHandler<CustomButtonPressEvent>;
}

export default codegenNativeComponent<NativeProps>(
  'CustomButton',
) as HostComponent<NativeProps>;
