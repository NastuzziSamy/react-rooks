import * as React from "react";

import Rook from "./rook";
import type {
  RookStore,
  RookContext,
  RookContextValue,
  UseStoreHookReturn,
  RookInit,
  RookStoreReducer,
  RookReducers,
  RookProps,
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

        update((prev: Store[Extract<StoreKey, keyof Store>]) => ({
          ...prev,
          [key]: transformValue(
            prev[key] as Store[Extract<StoreKey, keyof Store>]
          ),
        }));

        return;
      }

      update({
        [key]: value,
      });
    };

    return [store[key], setValue] as UseStoreHookReturn<Store, StoreKey>;
  };

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
      init: RookInit<Store, DefaultStore>;
      defaultStore?: DefaultStore;
    }
  | {
      init?: undefined;
      defaultStore: Store;
    }
)): [
  RookComponent,
  <StoreKey extends keyof Store | undefined = undefined>(
    key?: StoreKey
  ) => UseStoreHookReturn<Store, StoreKey>
] => {
  const context = React.createContext({} as RookContextValue<Store>);

  const CreatedRook = ({
    // onInit,
    children,
  }: RookProps<Store>) => (
    <Rook
      Provider={context.Provider}
      storeReducer={storeReducer}
      reducers={reducers}
      {...({
        defaultStore,
        init,
      } as { defaultStore: Store; init?: undefined })} // Type assertion to ensure TypeScript knows the value exists
    >
      {children}
    </Rook>
  );

  const useRook = createUseRook<Store>(context);

  return [CreatedRook, useRook];
};
