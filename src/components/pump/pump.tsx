import React from "react"
import './pump.css'

export interface PumpProps {
	value?: number
	step?: number
}

export interface PumpState {
	isPumping: boolean
}

export class Pump extends React.Component<PumpProps, PumpState> {
	private mouseUpListener = () => {
		if (this.state.isPumping) {
			this._endPumping();
		}
	}

	constructor(props: PumpProps) {
		super(props)
		this.state = {
			isPumping: false,
		}
	}

	componentDidMount(): void {
		window.addEventListener('mouseup', this.mouseUpListener.bind(this))
	}

	componentWillUnmount(): void {
		window.removeEventListener('mouseup', this.mouseUpListener.bind(this))
	}

	render() {
		const value = this.props.value ?? 0
		return (<div className="wrap">
			<div className="piston">
				<span
					className="piston__handle"
					onMouseDown={event => this._startPumping(event)}
					onMouseUp={event => this._endPumping(event)}
					onMouseMove={event => this.state.isPumping && this._movePiston(event)}
				></span>
			</div>
			<div className="cylinder">
				<span className="caption">{value}</span>
				<span className="progress-bar">
					<span className="progress-bar__filling" style={{ height: `${value}%` }}></span>
				</span>
			</div>
		</div>)
	}

	private _movePiston(event: React.MouseEvent<HTMLSpanElement, MouseEvent>): void {
		console.warn('Why?')
	}

	private _startPumping(event: React.MouseEvent<HTMLSpanElement, MouseEvent>): void {
		event.preventDefault()
		this.setState({
			isPumping: true
		})
		console.debug('_startPumping')
	}

	private _endPumping(event?: React.MouseEvent<HTMLSpanElement, MouseEvent>): void {
		event?.preventDefault()
		this.setState({
			isPumping: false
		})
		console.debug('_endPumping')
	}
}