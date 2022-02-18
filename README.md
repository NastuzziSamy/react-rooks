# React rooks

Many packages exist for store management.
Why shoud you use this new one ?

Are you searching for :
- hook driven management ?
- simple stores ?
- multiple stores ?
- typed stores ?
- simple reducers ?
- contextual stores ?
- async management ?
- without dependencies ?
- light and quick package ?

Here you'll find everything you need.

## Install

With lovely yarn:
```bash
yarn add react-rooks
```

or with npm:
```bash
npm install react-rooks
```

## Usage

# First, create a rook store

`rook.ts`:
```typescript
import createRook from 'react-rooks';

// Some global/stored values.
export const [Rook, useRook] = createRook({
    storedUser: {},
    locale: 'en',
    title: 'My React app',
} as {
    storedUser: { id?: string; name?: string; /* whatever */ };
    locale: 'en' | 'fr';
    title: string;
});
```

`createRook` takes two arguments:
- `store` (`Record<string, any>`): your stored object
- `reducers`: one or more reducers for your store. Reducers can either be:
  - an object where each key is a key of `store` and each value is a `reducer` ;
  - a global `reducer` where every value is reduced.

A `reducer` takes two arguments: the new value, and the last value. It must return the reduced value.

### Example of reducer

If you want to change your window title, you can reduce the changed title value:
```typescript
import createRook from 'react-rooks';

// Some global/stored values.
export const [Rook, useRook] = createRook({ ... }, {
    title: (value: string) => {
        window.title = 'My React app | ' + value;

        return value; // Here we can even alterate the reduced value.
    }
});

// In a component:
/* ... */
    setTitle('Home page');
/* ... */
```

### Returns

As you can see, `createRook` returns an array:
- `Rook` is the context of your store. You must add it before using the hook `useRook` in your components. `Rook` can be nested, with a duplicated nested store.
- `useRook` is a hook, that retrieve the current store an is similar to `React.useState`.

### Usage with multiple rooks!

Instead of nesting your rooks, you can contain them all together:
```typescript
// From:
export const App = () => (
	<FirstRook>
	    <SecondRook>
            {/* ...more nested rooks... */}
		        {/* Your app */}
            {/* ...more nested rooks... */}
	    </SecondRook>
	</FirstRook>
);

// To:
import { RookContainer } from 'react-rooks';

export const App = () => (
	<RookContainer rooks={[FirstRook, SecondRook, /* ...more rooks... */]}>
        {/* Your app */}
	</FirstRook>
);
```

# Then, use it!

`App.tsx`:
```typescript
import * as React from 'react';
import { Rook, useRook } from './rook';

export const ChangeLocale = () => {
	const [locale, setLocale] = useRook('locale');

	React.useEffect(() => setTimeout(() => setLocale('fr'), 2500), []);

	return null;
};

export const ShowLocale = () => {
	const [locale] = useRook('locale');

	// Log: 'en'.
	// After 2.5s, log: 'fr'.
	console.log(locale);

	return null;
};

export const App = () => (
	<Rook>
		<ChangeLocale />
		<ShowLocale />
	</Rook>
);

export default App;
```

## Feel free and enjoy
