export {};

// Patch: React 19 + React Native 0.81 JSX type compatibility.
// React Native components use NativeMethods & *Component mixin patterns
// that don't expose the full React.Component<P,S,SS> interface.
// Augmenting ElementClass and GestureHandlerRootViewProps fixes the IDE errors
// without changing any runtime behaviour.

declare module 'react' {
  namespace JSX {
    // Allow React Native's class-based component pattern as JSX elements.
    // React 19 tightened the ElementClass constraint; this relaxes it back.
    interface ElementClass {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [key: string]: any;
    }
  }
}

// Fix: GestureHandlerRootView lost implicit children in React 19.
declare module 'react-native-gesture-handler' {
  interface GestureHandlerRootViewProps {
    children?: import('react').ReactNode;
  }
}