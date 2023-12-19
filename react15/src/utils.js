
export const findDOM = (vnode) => {
  const { type } = vnode;
  let dom;
  if (typeof type === 'function') {
    dom = findDOM(vnode.oldRenderVnode);
  } else {
    dom = vnode.dom;
  }
  return dom;
}