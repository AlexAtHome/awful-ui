import React from "react";
import './pump.css'

export interface PumpProps {
	value?: number
	step?: number
}

export interface PumpState {
	isPumping: boolean;
}

export class Pump extends React.Component<PumpProps> {
	constructor(props: PumpProps) {
		super(props)
		this.state = {
			isPumping: false,
		}
	}

	render() {
		const value = this.props.value ?? 0;
		return (<div className="wrap">
			<div className="piston">
				<span className="piston__handle"></span>
			</div>
			<div className="cylinder">
				<span className="caption">{value}</span>
				<span className="progress-bar">
					<span className="progress-bar__filling" style={{ height: `${value}%` }}></span>
				</span>
			</div>
		</div>)
	}
}