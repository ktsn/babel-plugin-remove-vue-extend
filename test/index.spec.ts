import babel = require('babel-core')
import plugin from '../src/index'

describe('Remove vue extend', () => {
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

  it('should not remove local binding', () => {
    const input = `
    const Vue = {
      extend () {}
    }

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

  it('should not remove a non Ctor method', () => {
    const input = `
    import Vue from 'vue'

    export default Vue.something.extend({
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

  it('should not remove a function', () => {
    const input = `
    import extend from './extend'

    export default extend({
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

  it('should remove but move into extends option', () => {
    const input = `
    import Sub from './Sub.vue'

    export default Sub.extend({
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
