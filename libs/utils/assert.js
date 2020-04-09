import { ExtendableError } from './errors';

class ErrorConditionFailed extends ExtendableError {
  constructor(...args) {
    super(args);
  }
}

export function requireCondition(condition, msg = 'pre-condition failed') {
  if (!condition) {
    throw new ErrorConditionFailed(msg);
  }
}
