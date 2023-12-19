import { compareTwoVdom } from "./react-dom";
import { findDOM } from "./utils";

class Updater {
  constructor(classInstance) {
    this.classInstance = classInstance;
    this.pendingStates = [];
    this.callbacks = [];
  }
  addState(partialState, callback) {
    this.pendingStates.push(partialState);
    if (typeof callback === 'function') {
      this.callbacks.push(callback);
    }
    this.emitUpdate();
  }

  emitUpdate(nextProps) {
      this.updateComponent();
  }

  updateComponent() {
    const { classInstance, pendingStates } = this;
    if (pendingStates.length > 0) {
      shouldUpdate(classInstance, this.getState());
    }
  }

  getState() {
    const { classInstance, pendingStates } = this;
    let { state } = classInstance;
    pendingStates.forEach(nextState => {
      if (typeof nextState === 'function') {
        nextState = nextState(state);
      }
      state = { ...state, ...nextState };
    })
    pendingStates.length = 0;
    return state;
  }
}

const shouldUpdate = (classInstance, nextState) => {
  classInstance.state = nextState;
  classInstance.forceUpdate();
}

class Component {
  static isReactComponent = true;
  constructor(props) {
    this.props = props;
    this.state = {};
    this.updater = new Updater(this);
  }
  setState(partialState, callback) {
     this.updater.addState(partialState, callback);   
  }
  updateComponent() {
    this.forceUpdate();
  }
  forceUpdate() {
    const oldRenderVnode = this.oldRenderVnode;
    const newRenderVnode = this.render();
    const currentDOM = findDOM(oldRenderVnode);
    compareTwoVdom(currentDOM.parentNode, oldRenderVnode, newRenderVnode);
    this.oldRenderVnode = newRenderVnode;
  }
}

export default Component;