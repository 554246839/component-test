import { h, render } from 'vue'

const COMPONENT_CONTAINER_SYMBOL = Symbol('spread_component_container')

/**
 * 创建组件实例对象
 * 返回的实例和调用 getCurrentComponent() 返回的一致
 * @param {*} Component
 */
export const createComponent = (Component: any, props: any, children: any) => {
  const vnode: any = h(Component, { ...props }, children)
  const container = document.createElement('div')
  vnode[COMPONENT_CONTAINER_SYMBOL] = container
  render(vnode, container)
  return vnode.component
}

/**
 * 销毁组件实例对象
 * @param {*} ComponnetInstance 通过createComponent方法得到的组件实例对象
 */
export const unmountComponent = (ComponnetInstance: any) => {
  render(null, ComponnetInstance.vnode[COMPONENT_CONTAINER_SYMBOL])
}
