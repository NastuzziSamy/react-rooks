import * as React from 'react';
import createRook, { RookContainer} from 'react-rooks';

// Some global/stored values.
export const [FirstRook, useFirstRook] = createRook({
    storedUser: {},
    locale: 'en',
    title: 'My React app',
} as {
    storedUser: { id?: string; name?: string; /* whatever */ };
    locale: 'en' | 'fr';
    title: string;
});

export const [SecondRook, useSecondRook] = createRook({
    loaded: false,
	connected: false,
} as {
    loaded: boolean;
    connected: boolean;
});

export const FirstComponent = () => {
	const [locale, setLocale] = useFirstRook('locale');
	const [connected, setConnected] = useSecondRook('connected');

	return null;
};

export const SecondComponent = () => {
	const [title, setTitle] = useFirstRook('title');
	const [loaded, setLoaded] = useSecondRook('loaded');

	return null;
};

export const App = () => (
	<RookContainer rooks={[FirstRook, SecondRook]}>
		<FirstComponent />
		<SecondComponent />
	</RookContainer>
);

export default App;