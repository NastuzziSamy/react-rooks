import * as React from 'react';
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