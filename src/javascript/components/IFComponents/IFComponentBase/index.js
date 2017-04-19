import { Component } from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';

const { is } = Immutable;

export default
class IFComponentBase extends Component {
	constructor(props) {
	  super(props);
	
	  this.state = {
	  	option: Immutable.fromJS(props.option),
	  	eventMap: {},
	  };
	}

	getFieldValue(field) {
		return this.state.option.get(field);
	}

	setFieldValue(json, callback = () => {}) {
		let $$option = this.state.option;

		Object.keys(json).map((field) => {
			$$option = $$option.set(field, json[field]);
		});

		this.setState({
			option: $$option,
		}, callback);
	}

	getFieldValues(array) {
		let valueObj = {};

		array.map((field) => {
			console.log(`this.getFieldValue(${field})`, this.getFieldValue(field));
			valueObj[field] = this.getFieldValue(field);
		});

		console.log('getFieldValues');
		return valueObj;
	}

	getValue() {
		return this.getFieldValue('value');
	}

	setValue(value, callback) {
		this.setFieldValue({
			value,
		}, callback);
	}

	getDataModel() {
		return this.getFieldValues([
			'id',
			'name',
			'value',
		]);
	}

	shouldComponentUpdate(nextProps, nextState) {
		return !(this.props === nextProps || is(this.props, nextProps)) 
			|| !(this.state === nextState || is(this.state, nextState));
	}
	
	render() {
		return (
			<div>
				<h1>Warning</h1>
				<p>You need to override the IFComponentBase Class in your SubClass</p>
			</div>
		)
	}
}