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
}, {
	locale: (locale, oldLocale) => {
		console.log('locale changed from ' + oldLocale + ' to ' + locale);
	}
});

export const ChangeLocale = () => {
	const [locale, setLocale] = useRook('locale');

	React.useEffect(() => setTimeout(() => setLocale(locale === 'en' ? 'fr' : 'en'), 2500), []);

	return null;
};

export const App = () => (
	<Rook>
		<ChangeLocale />
	</Rook>
);

export default App;