'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _lodashFlow = require('lodash/flow');

var _lodashFlow2 = _interopRequireDefault(_lodashFlow);

var _reactDnd = require('react-dnd');

var _Value2 = require('./Value');

var _Value3 = _interopRequireDefault(_Value2);

var ItemTypes = { TAG: 'value' };

var dragSource = function dragSource(connect, monitor) {
	return {
		connectDragSource: connect.dragSource(),
		connectDragPreview: connect.dragPreview(),
		isDragging: monitor.isDragging()
	};
};

var dropCollect = function dropCollect(connect) {
	return {
		connectDropTarget: connect.dropTarget()
	};
};

var tagSource = {
	beginDrag: function beginDrag(props) {
		return {
			index: props.index
		};
	},
	endDrag: function endDrag(props, monitor) {
		if (!monitor.didDrop()) {
			return;
		}
	}
};

var tagTarget = {
	hover: function hover(props, monitor, component) {
		var dragIndex = monitor.getItem().index;
		var hoverIndex = props.index;

		// Don't replace items with themselves
		if (dragIndex === hoverIndex) {
			return;
		}

		// Time to actually perform the action
		props.handlerReorder(dragIndex, hoverIndex);

		// Note: we're mutating the monitor item here!
		// Generally it's better to avoid mutations,
		// but it's good here for the sake of performance
		// to avoid expensive index searches.
		monitor.getItem().index = hoverIndex;
	}
};

var propTypes = {
	children: _propTypes2['default'].node,
	connectDragPreview: _propTypes2['default'].func.isRequired,
	connectDragSource: _propTypes2['default'].func.isRequired,
	connectDropTarget: _propTypes2['default'].func.isRequired,
	disabled: _propTypes2['default'].bool, // disabled prop passed to ReactSelect
	handlerReorder: _propTypes2['default'].func,
	id: _propTypes2['default'].string, // Unique id for the value - used for aria
	index: _propTypes2['default'].number.isRequired,
	isDragging: _propTypes2['default'].bool.isRequired,
	onClick: _propTypes2['default'].func, // method to handle click on value label
	onRemove: _propTypes2['default'].func, // method to handle removal of the value
	value: _propTypes2['default'].object.isRequired };

// the option object for this value

var DraggableValue = (function (_Value) {
	_inherits(DraggableValue, _Value);

	function DraggableValue() {
		_classCallCheck(this, DraggableValue);

		_get(Object.getPrototypeOf(DraggableValue.prototype), 'constructor', this).apply(this, arguments);
	}

	_createClass(DraggableValue, [{
		key: 'handleParentMouseDown',
		value: function handleParentMouseDown(event) {
			event.stopPropagation();
		}
	}, {
		key: 'renderDragIcon',
		value: function renderDragIcon() {
			if (this.props.disabled || !this.props.onRemove) return;
			return _react2['default'].createElement(
				'span',
				{ className: 'Select-value-drag-icon',
					'aria-hidden': 'true',
					style: { cursor: 'move' } },
				'⇔'
			);
		}
	}, {
		key: 'render',
		value: function render() {
			var _props = this.props;
			var connectDragSource = _props.connectDragSource;
			var isDragging = _props.isDragging;
			var connectDropTarget = _props.connectDropTarget;
			var connectDragPreview = _props.connectDragPreview;

			var styles = _extends({}, this.props.value.style, { opacity: isDragging ? 0.5 : 1 });
			return connectDragPreview(_react2['default'].createElement(
				'div',
				{ className: (0, _classnames2['default'])('Select-value', this.props.value.className),
					style: styles,
					title: this.props.value.title,
					onMouseDown: this.handleParentMouseDown
				},
				connectDragSource(connectDropTarget(this.renderDragIcon())),
				this.renderLabel(),
				this.renderRemoveIcon()
			));
		}
	}]);

	return DraggableValue;
})(_Value3['default']);

;

DraggableValue.propTypes = propTypes;

module.exports = (0, _lodashFlow2['default'])((0, _reactDnd.DragSource)(ItemTypes.TAG, tagSource, dragSource), (0, _reactDnd.DropTarget)(ItemTypes.TAG, tagTarget, dropCollect))(DraggableValue);