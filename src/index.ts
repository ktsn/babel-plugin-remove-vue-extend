import * as _t from 'babel-types'
import { PluginObj } from 'babel-core'

export default function plugin({
  types: t
}: {
  types: typeof _t
}): PluginObj<{}> {
  return {
    visitor: {
      ExportDefaultDeclaration(path, state) {
        const exported = path.get('declaration')
        const options = exported.get('arguments.0')

        if (
          // check if the exported expression is Vue component like
          !exported.isCallExpression() ||
          !exported.get('callee').isMemberExpression() ||
          !exported.get('callee.property').isIdentifier({ name: 'extend' }) ||
          exported.node.arguments.length !== 1 ||
          !options.isObjectExpression()
        ) {
          return
        }

        const ctor = exported.get('callee.object')
        if (!ctor.isIdentifier()) {
          return
        }

        const ctorBinding = path.scope.getBinding(ctor.node.name)
        if (!ctorBinding) {
          return
        }

        const ctorImport = ctorBinding.path.parentPath

        if (ctorImport.isImportDeclaration()) {
          // If it is base vue contructor, just remove it
          // otherwise move it into `extend` option.
          if (ctorImport.node.source.value === 'vue') {
            ctorImport.remove()
          } else {
            const extendProp = t.objectProperty(
              t.identifier('extends'),
              t.identifier(ctor.node.name)
            )
            ;(options as any).unshiftContainer('properties', extendProp)
          }
        }

        exported.replaceWith(options)
        path.stop()
      }
    }
  }
}
