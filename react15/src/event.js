
export const addEvent = (dom, eventType, listener) => {
  eventType = eventType.toLowerCase();
  let eventStore = dom.eventStore || (dom.eventStore = {});
  eventStore[eventType] = listener;
  document.addEventListener(eventType.slice(2), dispatchEvent, false);
}

export const dispatchEvent = (event) => {
  const { target, type } = event || {};
  let eventType = `on${type}`;
  const syntheticEvent = createSyntheticEvent(nativeEvent);
  
}

export const createSyntheticEvent = (nativeEvent) => {
  let syntheticEvent = {};
  for (const key  in nativeEvent) {
    let value = nativeEvent[key];
    if (typeof value === 'function') {
      value = value.bind(nativeEvent)
    }
    syntheticEvent[key] = nativeEvent[key]
  }
  syntheticEvent.nativeEvent = nativeEvent;
  syntheticEvent.isDefaultPrevented = false;
  syntheticEvent.isPropagationStopped = false;
  syntheticEvent.preventDefault = preventDefault;
  syntheticEvent.stopPropagation = stopPropagation;
  return syntheticEvent
}