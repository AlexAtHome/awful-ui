import React from 'react';
import './App.css';
import { Pump } from './components/pump';

class App extends React.Component {
	render() {
		return (
			<div className="App">
				<h1>It's painful to use</h1>
				<div className="grid">
					<figure className="component">
						<Pump value={0} />
						<figcaption>Pump</figcaption>
						<pre>
							<code>&lt;Pump value={0} /&gt;</code>
						</pre>
					</figure>
				</div>
			</div>
		);
	}
}

export default App;
