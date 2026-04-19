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

  // Mirror the latest store in a ref so async flows can read it without
  // going through a stale closure. This is essential because reducers are
  // asynchronous: two concurrent updateStore calls would otherwise both
  // read the same pre-update state and one update would clobber the other.
  const storeRef = React.useRef<StoreRead<Store> | null>(null);
  const initedRef = React.useRef(false);
  const storeReducerRef = React.useRef(storeReducer);
  const reducersRef = React.useRef(reducers);
  // Serialise async updates: each update awaits the previous one before
  // reading the current store. Without this, two updateStore calls running
  // through async reducers would both read the same snapshot and the second
  // would overwrite the first's contribution.
  const updateQueueRef = React.useRef<Promise<void>>(Promise.resolve());

  React.useEffect(() => {
    storeRef.current = rookState.inited ? rookState.store : null;
    initedRef.current = rookState.inited;
  }, [rookState]);

  React.useEffect(() => {
    storeReducerRef.current = storeReducer;
  }, [storeReducer]);

  React.useEffect(() => {
    reducersRef.current = reducers;
  }, [reducers]);

  const reduceValues = React.useCallback(
    async (
      values: Partial<Store>,
      currentStore: StoreRead<Store>
    ): Promise<Partial<Store>> => {
      const currentStoreReducer = storeReducerRef.current;
      const currentReducers = reducersRef.current;

      // Work on a shallow copy — never mutate the caller's object.
      let nextValues: Partial<Store> = { ...values };

      if (currentStoreReducer) {
        nextValues = {
          ...(await currentStoreReducer(nextValues, currentStore)),
        };
      }

      if (!currentReducers) {
        return nextValues;
      }

      for (const name in nextValues) {
        const reducer = currentReducers[name];
        if (!reducer) {
          continue;
        }

        nextValues[name] = await reducer(
          nextValues[name] as Store[Extract<keyof Store, string>],
          currentStore[name]
        );
      }

      return nextValues;
    },
    []
  );

  const updateStore = React.useCallback(
    (values: Partial<Store> | ((prev: StoreRead<Store>) => Partial<Store>)) => {
      updateQueueRef.current = updateQueueRef.current.then(async () => {
        if (!initedRef.current || storeRef.current === null) {
          return;
        }

        try {
          const currentStore = storeRef.current;
          const valuesToApply =
            typeof values === "function" ? values(currentStore) : values;

          const reducedValues = await reduceValues(valuesToApply, currentStore);

          const nextStore = {
            ...currentStore,
            ...reducedValues,
          };
          // Update the ref synchronously so the next queued update sees the
          // freshly-applied values — React's setState is async but the next
          // iteration of our queue runs before React commits.
          storeRef.current = nextStore;

          setRookState((prev) => {
            if (!prev.inited) {
              return prev;
            }
            return {
              inited: true,
              store: nextStore,
            };
          });
        } catch (error) {
          // Swallow the error at the queue boundary so a single failing
          // reducer cannot permanently stall all subsequent updates. Surface
          // it to the host so callers can still observe failures.
          console.error("[react-rooks] updateStore failed:", error);
        }
      });
    },
    [reduceValues]
  );

  React.useEffect(() => {
    let cancelled = false;

    (async () => {
      const initialStore = await init(defaultStore);

      if (cancelled) {
        return;
      }

      storeRef.current = initialStore;
      initedRef.current = true;
      setRookState({
        inited: true,
        store: initialStore,
      });
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
