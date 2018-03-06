import babel = require('babel-core')
import plugin from '../src/index'

describe('Transform Vue Deextend', () => {
  it('should remove Vue.extend', () => {
    const input = `
    import Vue from 'vue'

    export default Vue.extend({
      data () {
        return { message: 'Hello!' }
      }
    })
    `
    const { code } = babel.transform(input, {
      plugins: [plugin]
    })
    expect(code).toMatchSnapshot()
  })

  it('should not remove other module', () => {
    const input = `
    import Vue from 'some-other-module'

    export default Vue.extend({
      data () {
        return { message: 'Hello!' }
      }
    })
    `
    const { code } = babel.transform(input, {
      plugins: [plugin]
    })
    expect(code).toMatchSnapshot()
  })
})
