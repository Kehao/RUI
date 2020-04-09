import PropTypes from 'prop-types';
import { Component } from 'react';
import { requireCondition } from '../utils';

const windowKey = Symbol.for('er_register_map');
const registerMap = window[windowKey] = window[windowKey] || {
  ids: {}
};

const isNotNull = t => (t != null);

const hasRegistered = ({ id }) => isNotNull(registerMap.ids[id]);

const cleanRegister = props => {
  const { target, eventName, func, isUseCapture, id } = props;
  if (hasRegistered(props)) {
    target.removeEventListener(eventName, func, isUseCapture);
    delete registerMap.ids[id];
  }
};

const doRegister = props => {
  const { id, eventName, func, isUseCapture } = props;
  registerMap.ids[id] = id;
  document.addEventListener(eventName, func, isUseCapture);
};

/**
 * register events that hooked up react lifecycle
 */
export default class EventRegister extends Component {
  componentDidMount() {
    const { eventName, id } = this.props;
    let lowerEventName = eventName.toLowerCase();
    if (/^on/.test(lowerEventName)) {
      lowerEventName = lowerEventName.substring(2);
    }
    this.cached = Object.assign({}, this.props, { lowerEventName });

    requireCondition(typeof id === 'string', 'id prop is required');
    requireCondition(!hasRegistered(this.cached), `id: ${id} has been registered`);

    doRegister(this.cached);
  }

  componentWillUnmount() {
    cleanRegister(this.cached);
  }

  render() {
    return null;
  }
}


EventRegister.propTypes = {
  id: PropTypes.string.isRequired,
  target: PropTypes.object.isRequired,
  eventName: PropTypes.string.isRequired,
  func: PropTypes.func.isRequired,
  isUseCapture: PropTypes.bool
};
