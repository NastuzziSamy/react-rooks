type ValueOf<T> = T extends Record<string, infer U> ? U : never;

export type RookStore = Record<string, any>;
export type RookStoreData<Store extends RookStore, Key> = Key extends Extract<
  keyof Store,
  string
>
  ? Store[Key]
  : Store;

export type RookContextValue<Store extends RookStore> = {
  store: Store;
  update: (values: Partial<Store> | ((prev: Store) => Partial<Store>)) => void;
};
export type RookContext<Store extends RookStore> = React.Context<
  RookContextValue<Store>
>;

export type RookComponent = React.ComponentType<{ children: React.ReactNode }>;

export type RookContainerProps = {
  rooks: RookComponent[];
  children: React.ReactNode;
};

export type RookState<Store extends RookStore> =
  | {
      inited: false;
      store: null;
    }
  | {
      inited: true;
      store: Store;
    };

export type RookInit<
  Store extends RookStore,
  DefaultStore extends RookStore
> = (initStore: DefaultStore) => Promise<Store>;

export type RookStoreReducer<Store extends RookStore> = (
  values: Partial<Store>,
  store: Store
) => Partial<Store>;

export type RookReducer<
  Store extends RookStore,
  Key extends Extract<keyof Store, string>
> = (newValue: Store[Key], oldValue: Store[Key]) => Store[Key];

export type RookReducers<Store extends RookStore> = Partial<{
  [Key in Extract<keyof Store, string>]: (
    newValue: Store[Key],
    oldValue: Store[Key]
  ) => Store[Key];
}>;

export type RookProps<
  Store extends RookStore,
  DefaultStore extends RookStore
> = {
  init: RookInit<Store, DefaultStore>;
  defaultStore: DefaultStore;
  storeReducer?: RookStoreReducer<Store> | undefined;
  reducers?: RookReducers<Store> | undefined;
  Provider: RookContext<Store>["Provider"];
  children: React.ReactNode;
};

export type UseStoreHookReturn<
  Store extends RookStore,
  StoreKey extends keyof Store | undefined
> = StoreKey extends undefined
  ? [
      Store,
      (values: Partial<Store> | ((prev: Store) => Partial<Store>)) => void
    ]
  : StoreKey extends keyof Store
  ? [
      Store[StoreKey],
      (
        value:
          | Store[StoreKey]
          | ((
              prev: Store[Extract<StoreKey, keyof Store>]
            ) => Store[Extract<StoreKey, keyof Store>])
      ) => void
    ]
  : never;
