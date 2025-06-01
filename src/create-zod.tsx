import {
  z,
  ZodObject,
  ZodDefault,
  ZodTypeAny,
  ZodNullable,
  ZodOptional,
  ZodEffects,
} from "zod";
import { createRook } from "./create";
import { RookStore, StoreRead } from "./type";

export type ZodDefinedType =
  | ZodDefault<ZodTypeAny>
  | ZodNullable<ZodTypeAny>
  | ZodOptional<ZodTypeAny>;
export type RookZodStore = RookStore<
  ZodDefinedType | ZodEffects<ZodDefinedType>
>;

export const createZodRook = <
  Schema extends ZodObject<RookZodStore> | ZodEffects<ZodObject<RookZodStore>>,
  Store extends z.input<Schema>
>(
  schema: Schema,
  {
    storeReducer: customStoreReducer,
    onValidationError,
  }: {
    storeReducer?: (
      values: Partial<Store>,
      currentStore: StoreRead<Store>
    ) => Store;
    onValidationError?: (
      error: z.ZodError,
      values: StoreRead<Store>,
      currentStore: StoreRead<Store>
    ) => void;
  } = {}
) => {
  console.log("Default store:", schema);
  const defaultStore = schema.parse({}) as Store;

  const storeReducer = (
    values: Partial<Store>,
    currentStore: StoreRead<Store>
  ): Store => {
    let valuesToValidate: StoreRead<Store>;
    if (customStoreReducer) {
      valuesToValidate = customStoreReducer(values, currentStore);
    } else {
      valuesToValidate = { ...currentStore, ...values };
    }

    const parsedStore = schema.safeParse(valuesToValidate);

    if (!parsedStore.success) {
      onValidationError?.(parsedStore.error, valuesToValidate, currentStore);

      return currentStore as Store;
    }

    return parsedStore.data as Store;
  };

  return createRook<Store>({
    defaultStore,
    storeReducer,
  });
};
