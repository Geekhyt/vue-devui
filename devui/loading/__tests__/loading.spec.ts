import { mount } from '@vue/test-utils';
import { ref, Ref, nextTick, h, shallowReactive } from 'vue';
import loading from '../index';

// 服务方式
const LoadingService = loading.LoadingService

// 全局属性
const globalOption = {
  directives: {
    dLoading: loading.dLoading
  }
}

describe('Loading as directive', () => {
  it('loading init render', async () => {
    const wrapper = mount(
      {
        template: `<div v-dLoading="true"></div>`
      },
      {
        global: globalOption
      }
    )

    await nextTick()
    const loadingEl = wrapper.find('.devui-loading-contanier')
    expect(loadingEl.exists()).toBeTruthy()
    const loadingMask = wrapper.find('.devui-loading-mask')
    expect(loadingMask.exists()).toBeTruthy()
  })

  it('loading test mask', async () => {
    const wrapper = mount(
      {
        template: `<div v-dLoading="true" :backdrop="false"></div>`
      },
      {
        global: globalOption
      }
    )

    const loadingMask = wrapper.find('.devui-loading-mask')
    expect(loadingMask.exists()).toBeFalsy()
  })

  it('loading test positionType', async () => {
    const wrapper = mount(
      {
        template: `<div v-dLoading="true" id="testLoading" positionType="absolute"></div>`
      },
      {
        global: globalOption
      }
    )

    const loadingPType = wrapper.find('#testLoading')
    expect(loadingPType).toBeTruthy()
    // @ts-ignore
    const targetEle = loadingPType.wrapperElement.instance.vnode.el
    expect(targetEle.parentNode.style.position).toEqual('absolute')
  })
  
  it('loading test loadingTemplateRef', async () => {
    const wrapper = mount(
      {
        template: `<div v-dLoading="true" id="testLoading" :loadingTemplateRef="ele"></div>`,
        data() {
          return {
            ele: h('div', {
              className: 'test-component'
            }, '正在加载中...') 
          }
        }
      },
      {
        global: globalOption
      }
    )

    await nextTick()
    const loadingComp = wrapper.find('.test-component')
    expect(loadingComp.exists()).toBeTruthy()
    expect(loadingComp.text()).toEqual('正在加载中...')

    const loadingContainer = wrapper.find('.devui-loading-wrapper')
    expect(loadingContainer.exists()).toBeFalsy()
  })

  it('loading test vLoading', async () => {
    const wrapper = mount(
      {
        template: `
          <div>
            <button id="testbtn" @click="click"></button>
            <div v-dLoading="isShow"></div>
          </div>
        `,
        setup() {
          const isShow = ref(false)
          const click = () => {
            isShow.value = !isShow.value
          }
          return {
            isShow,
            click
          }
        }
      },
      {
        global: globalOption
      }
    )

    await nextTick()
    const loadingContainer = wrapper.find('.devui-loading-contanier')
    expect(loadingContainer.exists()).toBeFalsy()
    const btn = wrapper.find('#testbtn')
    expect(btn.exists()).toBeTruthy()
    
    await btn.trigger('click')
    expect(wrapper.find('.devui-loading-contanier').exists()).toBeTruthy()

    await btn.trigger('click')
    expect(wrapper.find('.devui-loading-contanier').exists()).toBeFalsy()

  })

  // TODO Promise 的单元测试, 需完善
  it('loading test Promise', async () => {
    const wrapper = mount(
      {
        template: `
          <div>
            <button id="testbtn" @click="click"></button>
            <div v-dLoading="loading" id="testLoading"></div>
          </div>
        `,
        setup() {
          const loading: Ref<Promise<any> | undefined | boolean> = ref(undefined) 

          const click = () => {
            loading.value = new Promise((res: any) => {
              res(111)
            })
          }

          return {
            loading,
            click
          }
        }
      },
      {
        global: globalOption
      }
    )

    const btn = wrapper.find('#testbtn')
    expect(btn.exists()).toBeTruthy()

    await btn.trigger('click')
    expect(wrapper.find('.devui-loading-wrapper').exists()).toBeFalsy()
  })

  // TODO 多个 Promise 的单元测试, 需完善
  it('loading test mutiple Promise', async () => {
    const wrapper = mount(
      {
        template: `
          <div>
            <button id="testbtn" @click="fetchMutiplePromise"></button>
            <div v-dLoading="promises.value" id="testLoading"></div>
          </div>
        `,
        setup() {
          let promises: any = shallowReactive({
            value: []
          })
          const fetchMutiplePromise = () => {
            let list = []
            for (let i = 0; i < 3; i++) {
              list.push(new Promise((res: any) => {
                res(true)
              }))
            }
            promises.value = list
          }

          return {
            fetchMutiplePromise,
            promises
          }
        }
      },
      {
        global: globalOption
      }
    )

    await nextTick()
    const btn = wrapper.find('#testbtn')
    expect(btn.exists()).toBeTruthy()
    
    await btn.trigger('click')
    expect(wrapper.find('.devui-loading-wrapper').exists()).toBeFalsy()
  })
})

describe('Loading as Service', () => {
  it('service init', async () => {
    const loading = LoadingService.open()

    await nextTick()
    let ele = document.querySelector('.devui-loading-contanier')
    expect(ele).toBeTruthy()
    expect(ele.parentNode == document.body).toBe(true)

    loading.loadingInstance.close()
    await nextTick()
    let ele2 = document.querySelector('.devui-loading-contanier')
    expect(ele2).toBe(null)
  })

  it('service target', async () => {
    const div = document.createElement('div')
    document.body.appendChild(div)

    const loading = LoadingService.open({
      target: div
    })

    await nextTick()
    let ele = document.querySelector('.devui-loading-contanier')
    expect(ele).toBeTruthy()
    expect(ele.parentNode === div).toBe(true)
    
    loading.loadingInstance.close()
  })
  
  it('service message', async () => {
    const loading = LoadingService.open({
      message: '正在加载中...'
    })

    await nextTick()
    let ele = document.querySelector('.devui-loading-contanier')
    expect(ele).toBeTruthy()
    expect(ele.textContent).toBe('正在加载中...')
    
    loading.loadingInstance.close()
  })
  
  it('service Style', async () => {
    const loading = LoadingService.open({
      positionType: 'absolute',
      view: {
        top: '40%',
        left: '60%'
      },
      zIndex: 1000
    })

    await nextTick()
    let ele = document.querySelector('.devui-loading-contanier')
    expect(ele).toBeTruthy()
    // @ts-ignore
    expect(ele.parentNode.style.position).toBe('absolute')

    let loadingEle = ele.querySelector('.devui-loading-area')
    // @ts-ignore
    const style = loadingEle.style
    expect(style.top).toBe('40%')
    expect(style.left).toBe('60%')
    expect(style.zIndex).toBe('1000')
    
    loading.loadingInstance.close()
  })

  it('service template', async () => {
    const loading = LoadingService.open({
      loadingTemplateRef: h('div', {
        className: 'test-class'
      }, '正在加载中')
    })

    await nextTick()
    const ele = document.querySelector('.test-class')
    expect(ele).toBeTruthy()
    expect(ele.textContent).toBe('正在加载中')

    const originEle = document.querySelector('.devui-loading-wrapper')
    expect(originEle).toBeFalsy()
    
    loading.loadingInstance.close()
  })

  it('service mask', async () => {
    const loading = LoadingService.open({
      backdrop: false
    })

    await nextTick()

    const wrapper = document.querySelector('.devui-loading-wrapper')
    const mask = document.querySelector('.devui-loading-mask')
    
    expect(wrapper).toBeTruthy()
    expect(mask).toBeFalsy()
    
    loading.loadingInstance.close()
  })
})