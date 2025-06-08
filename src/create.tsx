import * as React from "react";

import Rook from "./rook";
import type {
  RookStore,
  RookContext,
  RookContextValue,
  UseStoreHookReturn,
  RookStoreReducer,
  RookReducers,
  RookComponent,
  StoreRead,
} from "./type";

export const createUseRook =
  <Store extends RookStore>(context: RookContext<Store>) =>
  <StoreKey extends keyof Store>(
    key?: StoreKey
  ): UseStoreHookReturn<Store, StoreKey> => {
    const { store, update } =
      React.useContext<RookContextValue<Store>>(context);

    if (key === undefined) {
      // Quand key est undefined, on retourne le store entier et la fonction update
      return [store, update] as UseStoreHookReturn<Store, StoreKey>;
    }

    const setValue = <StoreValue extends Store[Extract<StoreKey, keyof Store>]>(
      value: StoreValue | ((prev: StoreRead<StoreValue>) => StoreValue)
    ) => {
      if (typeof value === "function") {
        const transformValue = value as (
          prev: StoreRead<StoreValue>
        ) => StoreValue;

        update({
          [key]: transformValue(store[key]),
        } as Partial<Store>);

        return;
      }

      update({
        [key]: value,
      } as Partial<Store>);
    };

    return [store[key], setValue] as UseStoreHookReturn<Store, StoreKey>;
  };

export function createRook<Store extends RookStore>({
  defaultStore,
  storeReducer,
  reducers,
}: {
  init?: undefined;
  defaultStore: Store;
  storeReducer?: RookStoreReducer<Store>;
  reducers?: RookReducers<Store>;
}): [
  RookComponent,
  <StoreKey extends Extract<keyof Store, string> | undefined = undefined>(
    key?: StoreKey
  ) => UseStoreHookReturn<Store, StoreKey>
];

export function createRook<
  const DefaultStore extends RookStore,
  const Store extends RookStore
>({
  defaultStore,
  init,
  storeReducer,
  reducers,
}: {
  defaultStore?: DefaultStore;
  init: (initStore: DefaultStore) => Promise<Store>;
  storeReducer?: RookStoreReducer<Store>;
  reducers?: RookReducers<Store>;
}): [
  RookComponent,
  <StoreKey extends Extract<keyof Store, string> | undefined = undefined>(
    key?: StoreKey
  ) => UseStoreHookReturn<Store, StoreKey>
];

export function createRook<
  Store extends RookStore,
  DefaultStore extends RookStore
>({
  defaultStore,
  init,
  storeReducer,
  reducers,
}: {
  init?: ((initStore: DefaultStore) => Promise<Store>) | undefined;
  defaultStore?: DefaultStore | Store;
  storeReducer?: RookStoreReducer<Store>;
  reducers?: RookReducers<Store>;
}): [
  RookComponent,
  <StoreKey extends Extract<keyof Store, string>>(
    key?: StoreKey
  ) => UseStoreHookReturn<Store, StoreKey>
] {
  const context = React.createContext({} as RookContextValue<Store>);

  const CreatedRook = ({ children }: React.PropsWithChildren) => (
    <Rook<Store, DefaultStore>
      Provider={context.Provider}
      storeReducer={storeReducer}
      reducers={reducers}
      init={init || ((initStore) => ({ ...initStore } as unknown as Store))}
      defaultStore={(defaultStore || {}) as DefaultStore}
    >
      {children}
    </Rook>
  );
  const useRook = createUseRook<Store>(context);

  return [CreatedRook, useRook];
}

export const createStoreRook = <Store extends RookStore>(
  defaultStore: Store,
  {
    reducers,
    storeReducer,
  }: {
    reducers?: RookReducers<Store>;
    storeReducer?: RookStoreReducer<Store>;
  } = {}
): [
  RookComponent,
  <StoreKey extends Extract<keyof Store, string> | undefined = undefined>(
    key?: StoreKey
  ) => UseStoreHookReturn<Store, StoreKey>
] => {
  return createRook({
    defaultStore,
    reducers,
    storeReducer,
  });
};
