import { mount } from '@vue/test-utils'
import HelloWorld from '@/HelloWorld.vue'

test('displays message', async () => {
  const wrapper = mount(HelloWorld, {
    props: {
      msg: 'test msg'
    }
  })

  // Assert the rendered text of the component
  expect(wrapper.find('h1').text()).toBe('test msg')
  expect(wrapper.find('button').text()).toBe('count is: 0')
  await wrapper.find('button').trigger('click')
  expect(wrapper.find('button').text()).toBe('count is: 1')
})
