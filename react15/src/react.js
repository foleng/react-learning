import Component from "./Component";
import { REACT_ELEMENT, REACT_TEXT } from "./constants";

export function wrapToVdom(element) {
  return typeof element === "string" || typeof element === "number"
    ? { type: REACT_TEXT, props: element }
    : element;
}

function createElement(tag, config, ...children) {
  const { key, ref, __self, __source, ...props } = config || {};
  if (arguments.length > 3) {
    children = Array.prototype.slice.call(arguments, 2);
    children = children.map(wrapToVdom)
  } else if (arguments.length === 3 && Array.isArray(children)) {
    children = wrapToVdom(children[0]);
  }

  return {
    $$typeof: REACT_ELEMENT,
    type: tag,
    props: {
      ...props,
      children,
    },
    key,
    ref
  }
}



const React = {
  createElement,
  Component 
}

export default React;