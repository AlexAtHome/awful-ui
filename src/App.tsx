import React from 'react';
import './App.css';
import { Pump } from './components/pump';

class App extends React.Component {
	render() {
		return (
			<div className="App">
				<figure>
					<Pump value={10} />
					<figcaption>Pump</figcaption>
				</figure>
			</div>
		);
	}
}

export default App;
