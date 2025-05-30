export type ValueOf<T> = T extends Record<string, infer U> ? U : never;

export type StoreRead<T> = {
  readonly [P in keyof T]: T[P] extends object ? StoreRead<T[P]> : T[P];
};

export type RookStore = Record<string, any>;
export type RookStoreData<Store extends RookStore, Key> = Key extends Extract<
  keyof Store,
  string
>
  ? StoreRead<Store[Key]>
  : StoreRead<Store>;

export type RookContextValue<Store extends RookStore> = {
  store: StoreRead<Store>;
  update: (
    values: Partial<Store> | ((prev: StoreRead<Store>) => Partial<Store>)
  ) => void;
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
      store: StoreRead<Store>;
    };

export type RookInit<
  Store extends RookStore,
  DefaultStore extends RookStore
> = (initStore: StoreRead<DefaultStore>) => Promise<Store>;

export type RookStoreReducer<Store extends RookStore> = (
  values: Partial<Store>,
  store: StoreRead<Store>
) => Partial<Store>;

export type RookReducer<
  Store extends RookStore,
  Key extends Extract<keyof Store, string>
> = (newValue: Store[Key], oldValue: StoreRead<Store[Key]>) => Store[Key];

export type RookReducers<Store extends RookStore> = Partial<{
  [Key in Extract<keyof Store, string>]: (
    newValue: Store[Key],
    oldValue: StoreRead<Store[Key]>
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
      StoreRead<Store>,
      (
        values: Partial<Store> | ((prev: StoreRead<Store>) => Partial<Store>)
      ) => void
    ]
  : StoreKey extends keyof Store
  ? [
      StoreRead<Store>[StoreKey],
      (
        value:
          | StoreRead<Store[StoreKey]>
          | ((
              prev: StoreRead<Store[Extract<StoreKey, keyof Store>]>
            ) => Store[Extract<StoreKey, keyof Store>])
      ) => void
    ]
  : never;
