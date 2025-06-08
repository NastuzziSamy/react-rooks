import * as React from "react";
import { RookStore, RookState, RookProps, StoreRead } from "./type";

export const Rook = <
  Store extends RookStore,
  DefaultStore extends RookStore = Store
>({
  defaultStore,
  init,
  storeReducer,
  reducers,
  Provider,
  children,
}: RookProps<Store, DefaultStore>) => {
  const [rookState, setRookState] = React.useState<RookState<Store>>({
    inited: false,
    store: null,
  });

  const reduceValues = async (
    values: Partial<Store>,
    currentStore: StoreRead<Store>
  ) => {
    if (storeReducer) {
      values = await storeReducer(values, currentStore);
    }

    if (!reducers) {
      return values;
    }

    for (const name in values) {
      const reducer = reducers[name];
      if (!reducer) {
        continue;
      }

      // Type assertion to ensure TypeScript knows the value exists
      values[name] = await reducer(
        values[name] as Store[Extract<keyof Store, string>],
        currentStore[name]
      );
    }

    return values;
  };

  const updateStore = React.useCallback(
    (values: Partial<Store> | ((prev: StoreRead<Store>) => Partial<Store>)) => {
      (async () => {
        if (!rookState.inited) {
          return;
        }

        // Si values est une fonction, l'appeler avec le store actuel
        const valuesToApply =
          typeof values === "function" ? values(rookState.store) : values;

        const reducedValues = await reduceValues(
          valuesToApply,
          rookState.store
        );

        setRookState({
          store: {
            ...rookState.store,
            ...reducedValues,
          },
          inited: true,
        });
      })();
    },
    [rookState, storeReducer, reducers]
  );

  React.useEffect(() => {
    (async () => {
      setRookState({
        inited: true,
        store: await init(defaultStore),
      });
    })();
  }, []);

  if (!rookState.inited) {
    return null;
  }

  return (
    <Provider
      value={{
        store: rookState.store,
        update: updateStore,
      }}
    >
      {children}
    </Provider>
  );
};

export default Rook;
