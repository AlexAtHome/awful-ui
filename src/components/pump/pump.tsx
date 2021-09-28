import React from "react"
import { clearInterval } from "timers";
import './pump.css'

export interface PumpProps {
	value?: number
	step?: number
	decreaseStep?: number
	onChange?: (event: { updatedValue: number }) => void
}

export interface PumpState {
	isPumping: boolean
	isValueIncreasable: boolean
	value: number
}

export class Pump extends React.Component<PumpProps, PumpState> {
	private _mouseUpListener = () => {
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

	private _decreasingTimerId: NodeJS.Timeout | null = null;

	constructor(props: PumpProps) {
		super(props)
		this.state = {
			isPumping: false,
			value: this.props.value ?? 0,
			isValueIncreasable: true
		}
	}

	componentDidMount(): void {
		window.addEventListener('mouseup', this._mouseUpListener.bind(this))
		window.addEventListener('mousemove', this._mouseMoveListener.bind(this))
		this._decreasingTimerId = setInterval(() => {
			if (this.state.value > 0) {
				const value = this.state.value - 1
				this.setState({ value })
				this.props.onChange?.({
					updatedValue: value
				})
			}
		}, (this.props.decreaseStep ?? 500))
	}

	componentWillUnmount(): void {
		window.removeEventListener('mouseup', this._mouseUpListener.bind(this))
		window.removeEventListener('mousemove', this._mouseMoveListener.bind(this))
		this._decreasingTimerId && clearInterval(this._decreasingTimerId)
	}

	render() {
		return (<div className="wrap">
			<input type="number" hidden value={this.state.value} readOnly={true} />
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

		if (valueToSet > 90 && this.state.isValueIncreasable && this.state.value < 100) {
			this._increaseValue()
			this.setState({
				isValueIncreasable: false
			})
		} else if (valueToSet < 10 && this.state.value < 100) {
			this.setState({
				isValueIncreasable: true
			})
		} 
	}

	private _increaseValue(): void {
		const step = this.props.step ?? 5
		const maxValue = 100
		const updateValue = this.state.value + step
		const valueToSet = updateValue > maxValue ? maxValue : updateValue < 0 ? 0 : updateValue

		this.setState({
			value: valueToSet
		})
		this.props.onChange?.({
			updatedValue: valueToSet
		})
	}

	private _startPumping(event: React.MouseEvent<HTMLSpanElement, MouseEvent>): void {
		event.preventDefault()
		this.setState({
			isPumping: true
		})
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
	}
}