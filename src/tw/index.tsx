/**
 * NativeWind v5 CSS-first wrappers
 *
 * These wrappers provide className support for React Native components
 * using NativeWind v5's useCssElement approach
 */

import { View as RNView, Text as RNText, ScrollView as RNScrollView, Pressable as RNPressable, TextInput as RNTextInput } from 'react-native';

// For now, export native components directly
// NativeWind v5 setup will be completed with proper useCssElement wrappers later
export const View = RNView;
export const Text = RNText;
export const ScrollView = RNScrollView;
export const Pressable = RNPressable;
export const TextInput = RNTextInput;
