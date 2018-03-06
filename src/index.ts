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

        if (
          !exported.isCallExpression() ||
          !exported.get('callee').isMemberExpression() ||
          !exported.get('callee.property').isIdentifier({ name: 'extend' }) ||
          exported.node.arguments.length !== 1
        ) {
          return
        }

        const ctor = exported.get('callee.object')
        if (!ctor.isIdentifier()) {
          return
        }

        const name = ctor.node.name
        const ctorBinding = path.scope.getBinding(name)
        if (!ctorBinding) {
          return
        }

        const ctorImport = ctorBinding.path.parentPath
        if (
          !ctorImport.isImportDeclaration() ||
          ctorImport.node.source.value !== 'vue'
        ) {
          return
        }

        const options = exported.get('arguments.0')
        if (!options.isObjectExpression()) {
          return
        }

        exported.replaceWith(options)
        ctorImport.remove()
        path.stop()
      }
    }
  }
}
