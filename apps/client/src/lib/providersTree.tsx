import { type ComponentType, type ReactNode, useMemo } from "react";

type ProviderComponent<Props> = ComponentType<Props> & {
  displayName?: string;
};

// biome-ignore lint/suspicious/noExplicitAny: Okay to use any here
type ComponentsWithProps = [ProviderComponent<any>, Record<string, any>?][];

// Function to build providers tree
export const buildProvidersTree = (
  componentsWithProps: ComponentsWithProps,
): ComponentType<{ children: ReactNode }> => {
  return ({ children }) => {
    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    const Tree = useMemo(() => {
      return componentsWithProps.reduceRight(
        (AccumulatedComponents, [Provider, props]) => {
          return ({ children }: { children: ReactNode }) => (
            <Provider {...(props ?? {})}>
              <AccumulatedComponents>{children}</AccumulatedComponents>
            </Provider>
          );
        },
        ({ children }: { children: ReactNode }) => <>{children}</>,
      );
    }, []);

    return <Tree>{children}</Tree>;
  };
};
