import React from "react"
import './pump.css'

export interface PumpProps {
	value?: number
	step?: number
	max?: number
}

export interface PumpState {
	isPumping: boolean
	isValueIncreasable: boolean
	value: number
}

export class Pump extends React.Component<PumpProps, PumpState> {
	private mouseUpListener = () => {
		if (this.state.isPumping) {
			this._endPumping();
		}
	}

	private _mouseMoveListener = (event: MouseEvent) => {
		if (this.state.isPumping) {
			this._movePiston(event)
		}
	}

	private _pistonRef = React.createRef<HTMLDivElement>();

	constructor(props: PumpProps) {
		super(props)
		this.state = {
			isPumping: false,
			value: this.props.value ?? 0,
			isValueIncreasable: true
		}
	}

	componentDidMount(): void {
		window.addEventListener('mouseup', this.mouseUpListener.bind(this))
		window.addEventListener('mousemove', this._mouseMoveListener.bind(this))
	}

	componentWillUnmount(): void {
		window.removeEventListener('mouseup', this.mouseUpListener.bind(this))
		window.removeEventListener('mousemove', this._mouseMoveListener.bind(this))
	}

	render() {
		return (<div className="wrap">
			<div className="piston" ref={this._pistonRef}>
				<span
					className="piston__handle"
					onMouseDown={event => this._startPumping(event)}
					onMouseUp={event => this._endPumping(event)}
				></span>
			</div>
			<div className="cylinder">
				<span className="caption">{this.state.value}</span>
				<span className="progress-bar">
					<span className="progress-bar__filling" style={{ height: `${this.state.value}%` }}></span>
				</span>
			</div>
		</div>)
	}

	private _movePiston(event: MouseEvent): void {
		const piston = this._pistonRef.current;
		if (piston === null) {
			return;
		}
		let currentPosition = parseInt(piston.style.top, 10)
		if (isNaN(currentPosition)) {
			currentPosition = 0
		}
		const { movementY } = event
		if ((movementY < 0 && currentPosition <= 0) || (movementY > 0 && currentPosition >= 100)) {
			return
		}
		const updatedValue = currentPosition + movementY
		const valueToSet = updatedValue > 100 ? 100 : updatedValue < 0 ? 0 : updatedValue
		piston.style.top = `${valueToSet}px`

		if (valueToSet > 90 && this.state.isValueIncreasable) {
			this._increaseValue()
			this.setState({
				isValueIncreasable: false
			})
		} else if (valueToSet < 10) {
			this.setState({
				isValueIncreasable: true
			})
		} 
	}

	private _increaseValue(): void {
		const step = this.props.step ?? 5
		const maxValue = this.props.max ?? 100
		const updateValue = this.state.value + step
		const valueToSet = updateValue > maxValue ? maxValue : updateValue < 0 ? 0 : updateValue

		if (this.state.value <= maxValue) {
			this.setState({
				value: valueToSet
			})
		}
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
		const piston = this._pistonRef.current;
		if (piston === null) {
			return
		}
		piston.style.top = '';
		console.debug('_endPumping')
	}
}