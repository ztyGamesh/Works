import React from 'react';
import {Provider} from 'react-redux';
import {
	BrowserRouter,
	Route
} from 'react-router-dom';
import Layouts from '../layouts/index';

import store from '../store';

const Root = () => {
	return (
		<Provider store={store}>
			<BrowserRouter>
				<div>
					<Layouts/>
				</div>
			</BrowserRouter>
		</Provider>
	);
};

export default Root;