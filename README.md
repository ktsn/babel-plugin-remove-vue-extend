# babel-plugin-remove-vue-extend

Babel plugin for removing `Vue.extend` from components.

## Usage

Install:

```sh
npm install babel-plugin-remove-vue-extend
# or
yarn add babel-plugin-remove-vue-extend
```

.babelrc:

```json
{
  "plugins": ["remove-vue-extend"]
}
```

Then if you have the following component:

```js
import Vue from 'vue'

export default Vue.extend({
  data() {
    return { message: 'Hello!' }
  }
})
```

It will be transformed into:

```js
export default {
  data() {
    return { message: 'Hello!' }
  }
}
```

If you are using some extended component and extend from it like:

```js
import Sub from './Sub.vue'

export default Sub.extend({
  data() {
    return { message: 'Hello!' }
  }
})
```

It will be removed the `extend` call expression but moved into `extends` option:

```js
import Sub from './Sub.vue'

export default {
  extends: Sub,

  data() {
    return { message: 'Hello!' }
  }
}
```

## License

MIT
