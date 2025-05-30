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
} from "./type";

export const createUseRook =
  <Store extends RookStore>(context: RookContext<Store>) =>
  <StoreKey extends keyof Store | undefined = undefined>(
    key?: StoreKey
  ): UseStoreHookReturn<Store, StoreKey> => {
    const { store, update } =
      React.useContext<RookContextValue<Store>>(context);

    if (key === undefined) {
      // Quand key est undefined, on retourne le store entier et la fonction update
      return [store, update] as UseStoreHookReturn<Store, StoreKey>;
    }

    const setValue = (
      value:
        | Store[Extract<StoreKey, keyof Store>]
        | ((
            prev: Store[Extract<StoreKey, keyof Store>]
          ) => Store[Extract<StoreKey, keyof Store>])
    ) => {
      if (typeof value === "function") {
        const transformValue = value as (
          prev: Store[Extract<StoreKey, keyof Store>]
        ) => Store[Extract<StoreKey, keyof Store>];

        update({
          [key]: transformValue(
            store[key] as Store[Extract<StoreKey, keyof Store>]
          ),
        } as unknown as Partial<Store>);

        return;
      }

      update({
        [key]: value,
      } as unknown as Partial<Store>);
    };

    return [store[key], setValue] as UseStoreHookReturn<Store, StoreKey>;
  };

// Overload pour l'inférence automatique avec init
export const createRook = <
  Store extends RookStore,
  DefaultStore extends Partial<Store>
>({
  defaultStore,
  init,
  storeReducer,
  reducers,
}: {
  storeReducer?: RookStoreReducer<Store>;
  reducers?: RookReducers<Store>;
} & (
  | {
      init?: undefined;
      defaultStore: Store;
    }
  | {
      init: (initStore: DefaultStore) => Promise<Store>;
      defaultStore?: DefaultStore;
    }
)): [
  RookComponent,
  <StoreKey extends Extract<keyof Store, string> | undefined = undefined>(
    key?: StoreKey
  ) => UseStoreHookReturn<Store, StoreKey>
] => {
  const context = React.createContext({} as RookContextValue<Store>);

  const CreatedRook = ({
    // onInit,
    children,
  }: React.PropsWithChildren) => (
    <Rook<Store, DefaultStore>
      Provider={context.Provider}
      storeReducer={storeReducer}
      reducers={reducers}
      init={
        init || (async (initStore) => ({ ...initStore } as unknown as Store))
      }
      defaultStore={(defaultStore || {}) as DefaultStore}
    >
      {children}
    </Rook>
  );
  const useRook = createUseRook<Store>(context);

  return [CreatedRook, useRook];
};

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
