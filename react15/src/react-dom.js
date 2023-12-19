import { REACT_TEXT } from "./constants";
import { findDOM } from "./utils";

const render = (vnode, container) => {
  mount(vnode, container);
}

export function mount(vdom, container) {
  let newDOM = createDOM(vdom);
  container.appendChild(newDOM);
}

const mountFunctionComponent = (vnode) => {
  const { type, props } = vnode;
  const renderVnode = type(props);
  vnode.oldRenderVnode = renderVnode;
  return createDOM(renderVnode);
}

const mountClassComponent = (vnode) => {
  const { type, props } = vnode;
  const classInstance = new type(props);
  const renderVnode = classInstance.render();
  classInstance.oldRenderVnode = vnode.oldRenderVnode = renderVnode;
  vnode.classInstance = classInstance;
  return createDOM(renderVnode);
}

const createDOM = (vnode) => {
  const { type, props } = vnode;
  if (type === REACT_TEXT) {
    return document.createTextNode(props);
  }
  if (typeof type === 'function') {
    if (type.isReactComponent) {
      return mountClassComponent(vnode);
    }
    return mountFunctionComponent(vnode);
  }
  const dom = document.createElement(type);
  if (props) {
    updateProps(dom, {}, props);
    if (typeof props.children === 'object' && props.children.type) {
      mount(props.children, dom);
    } else if (Array.isArray(props.children)) {
      reconcileChildren(props.children, dom);
    }
  }
  vnode.dom = dom;
  return dom;
}

const reconcileChildren = (childrenVnode, parentDOM) => {
  for (let i = 0; i < childrenVnode.length; i++) {
    let childVnode = childrenVnode[i];
    mount(childVnode, parentDOM);
  }
}

export const compareTwoVdom = (parentDOM, oldVnode, newVnode, nextDOM) => {
  if (!oldVnode && !newVnode) {
    return null;
  } else if (oldVnode && !newVnode) {
    let currentDOM = findDOM(oldVnode);
    currentDOM && parentDOM.removeChild(currentDOM);
    if (oldVnode.classInstance && oldVnode.classInstance.componentWillUnmount) {
      oldVnode.classInstance.componentWillUnmount();
    }
  } else if (!oldVnode && newVnode) {
    let newDOM = createDOM(newVnode);
    if (nextDOM) {
      parentDOM.insertBefore(newDOM, nextDOM);
    } else {
      parentDOM.appendChild(newDOM);
    }
    if (newVnode.classInstance && newVnode.classInstance.componentDidMount) {
      newVnode.classInstance.componentDidMount();
    }
  } else if (oldVnode && newVnode && oldVnode.type !== newVnode.type) {
    let oldDOM = findDOM(oldVnode);
    let newDOM = createDOM(newVnode);
    parentDOM.replaceChild(newDOM, oldDOM);
    if (oldVnode.classInstance && oldVnode.classInstance.componentWillUnmount) {
      oldVnode.classInstance.componentWillUnmount();
    }
    if (newVnode.classInstance && newVnode.classInstance.componentDidMount) {
      newVnode.classInstance.componentDidMount();
    }
  } else {
    // updateElement(oldVnode, newVnode);
  }
}


function updateProps(dom, oldProps = {}, newProps = {}) {
  for (let key in newProps) {
    if (key === 'children') {
      continue;
    } else if (key === 'style') {
      let styleObj = newProps[key];
      for (let attr in styleObj) {
        dom.style[attr] = styleObj[attr];
      }
    } else if (/^on[A-Z].*/.test(key)) {
      dom[key.toLowerCase()] = newProps[key];
    } else {
      dom[key] = newProps[key];
    }
  }
  for (let key in oldProps) {
    if (!newProps.hasOwnProperty(key)) {
      dom[key] = null;
    }
  }
}



const ReactDOM = {
  render,
}

export default ReactDOM;

