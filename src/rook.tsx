import * as React from "react";
import { RookStore, RookState, RookProps } from "./type";

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

  const reduceValues = (values: Partial<Store>) => {
    if (!rookState.inited) {
      return values;
    }

    if (storeReducer) {
      values = storeReducer(values, rookState.store);
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
      values[name] = reducer(
        values[name] as Store[Extract<keyof Store, string>],
        rookState.store[name]
      );
    }

    return values;
  };

  const updateStore = React.useCallback(
    (values: Store, reduce = true) => {
      if (!rookState.inited) {
        return;
      }

      const reducedValues = reduce ? reduceValues(values) : values;

      setRookState({
        store: {
          ...rookState.store,
          ...reducedValues,
        },
        inited: true,
      });
    },
    [setRookState]
  );

  React.useEffect(() => {
    (async () => {
      if (init) {
        setRookState({
          inited: true,
          store: defaultStore
            ? await init(defaultStore as DefaultStore)
            : await init({} as DefaultStore),
        });
      } else {
        setRookState({
          inited: true,
          store: defaultStore as Store,
        });
      }
    })();
  }, []);

  if (rookState.store) {
    return;
  }

  if (!rookState.inited) {
    return;
  }

  return (
    <Provider
      value={{
        store: rookState.store as Store,
        update: updateStore,
      }}
    >
      {children}
    </Provider>
  );
};

export default Rook;
