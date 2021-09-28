import React from 'react';
import './App.css';
import { Pump } from './components/pump';

class App extends React.Component {
	render() {
		return (
			<div className="App">
				<figure>
					<Pump value={0} onChange={() => console.log('it works!')} />
					<figcaption>Pump</figcaption>
				</figure>
			</div>
		);
	}
}

export default App;
