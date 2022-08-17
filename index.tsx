import React from 'react';

type ValueOf<StoreType> = StoreType[Extract<keyof StoreType, string>];

export type Reducer<StoreType> = (
	value: ValueOf<StoreType>,
	oldValue: ValueOf<StoreType>
) => ValueOf<StoreType>;

export type GlobalReducer<StoreType> = (values: StoreType, oldValues: StoreType) => StoreType;

export type Reducers<StoreType> =
	| GlobalReducer<StoreType>
	| Record<keyof StoreType, Reducer<StoreType>>;

export type Context<StoreType> = {
	store: StoreType;
	set: CallableFunction;
	add: CallableFunction;
};

export const RookContainer = ({ rooks, children }: { rooks: Array<React.FunctionComponent>; children: React.ReactNode }): JSX.Element => {
	let contained = <>{children}</>;

	rooks.reverse().forEach((Rook) => {
		contained = (
			<Rook>
				{contained}
			</Rook>
		);
	})

	return contained;
}

export const createRook = <StoreType extends { [key: string]: any }>(
	store: StoreType,
	reducers: Reducers<StoreType> = {} as Reducers<StoreType>,
	init: CallableFunction,
): [
	React.FunctionComponent,
	<T extends keyof StoreType | undefined>(
		name?: T
	) => [T extends undefined ? StoreType : ValueOf<StoreType>, CallableFunction]
] => {
	const context = React.createContext({ store } as Context<StoreType>);
	const { Provider } = context;

	const Rook: React.FunctionComponent = ({ children }) => {
		const [rookStore, setRookStore] = React.useState<StoreType>(store);

		const reduceValues = (values: StoreType) => {
			if (typeof reducers === 'function') {
				return reducers(values, rookStore);
			}

			const reducedValues = {} as StoreType;

			for (const name in values) {
				const reducer = reducers[name];
				const value = values[name];

				reducedValues[name] = reducer ? reducer(value, rookStore[name]) : value;
			}

			return reducedValues;
		};

		const addToStore = React.useCallback(
			(values: StoreType, reduce = true) => {
				const reducedValues = reduce ? reduceValues(values) : values;

				Object.assign(rookStore, reducedValues);

				setRookStore({
					...rookStore,
					...reducedValues,
				});
			},
			[setRookStore]
		);

		const setStore = React.useCallback(
			(values: StoreType, reduce = true) => {
				const reducedValues = reduce ? values : reduceValues(values);

				setRookStore(reducedValues);
			},
			[setRookStore]
		);

		const values = { store: rookStore, set: setStore, add: addToStore };

		if (init) {
			init(values);
		}

		return (
			<Provider value={values}>{children}</Provider>
		);
	};

	const useRook = <T extends keyof StoreType | undefined>(
		name?: T
	): [T extends undefined ? StoreType : ValueOf<StoreType>, CallableFunction] => {
		const { store, set, add } = React.useContext(context);

		if (name === undefined) {
			return [store as T extends undefined ? StoreType : ValueOf<StoreType>, set];
		}

		return [
			store[name as keyof StoreType] as ValueOf<StoreType>,
			(value: ValueOf<StoreType>, reduce = true) =>
				add({ [name as keyof StoreType]: value } as StoreType, reduce),
		];
	};

	return [Rook, useRook];
};

export default createRook;
