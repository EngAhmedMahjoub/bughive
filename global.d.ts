declare module "*.css";

// Compatibility shim for dependencies that still use the legacy global JSX namespace.
declare namespace JSX {
  type ElementType = import("react").JSX.ElementType;
  interface Element extends import("react").JSX.Element {}
  interface ElementClass extends import("react").JSX.ElementClass {}
  interface ElementAttributesProperty
    extends import("react").JSX.ElementAttributesProperty {}
  interface ElementChildrenAttribute
    extends import("react").JSX.ElementChildrenAttribute {}
  type LibraryManagedAttributes<C, P> = import("react").JSX.LibraryManagedAttributes<C, P>;
  interface IntrinsicAttributes extends import("react").JSX.IntrinsicAttributes {}
  interface IntrinsicClassAttributes<T>
    extends import("react").JSX.IntrinsicClassAttributes<T> {}
  interface IntrinsicElements extends import("react").JSX.IntrinsicElements {}
}
