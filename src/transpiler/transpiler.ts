"use client"

import * as AST from "../parser/ast.js"

export class Transpiler {
  private indentLevel = 0

  private indent(): string {
    return "  ".repeat(this.indentLevel)
  }

  private increaseIndent(): void {
    this.indentLevel++
  }

  private decreaseIndent(): void {
    this.indentLevel--
  }

  public transpile(ast: AST.Program): string {
    let output = ""

    // Add React import
    output += "import React, { useState, useEffect } from 'react';\n\n"

    for (const statement of ast.body) {
      output += this.transpileStatement(statement)
      output += "\n"
    }

    return output
  }

  private transpileStatement(node: AST.Statement): string {
    switch (node.type) {
      case "ImportStatement":
        return this.transpileImportStatement(node as AST.ImportStatement)
      case "ExportStatement":
        return this.transpileExportStatement(node as AST.ExportStatement)
      case "ComponentDeclaration":
        return this.transpileComponentDeclaration(node as AST.ComponentDeclaration)
      case "PageDeclaration":
        return this.transpilePageDeclaration(node as AST.PageDeclaration)
      case "LayoutDeclaration":
        return this.transpileLayoutDeclaration(node as AST.LayoutDeclaration)
      default:
        return `// Unsupported statement: ${node.type}`
    }
  }

  private transpileImportStatement(node: AST.ImportStatement): string {
    const specifiers = node.specifiers
      .map((spec) => {
        if (spec.imported === "default") {
          return spec.local
        }
        return spec.imported === spec.local ? spec.imported : `${spec.imported} as ${spec.local}`
      })
      .join(", ")

    const hasDefault = node.specifiers.some((spec) => spec.imported === "default")
    const hasNamed = node.specifiers.some((spec) => spec.imported !== "default")

    if (hasDefault && hasNamed) {
      const defaultSpec = node.specifiers.find((spec) => spec.imported === "default")!
      const namedSpecs = node.specifiers.filter((spec) => spec.imported !== "default")
      return `import ${defaultSpec.local}, { ${namedSpecs
        .map((spec) => (spec.imported === spec.local ? spec.imported : `${spec.imported} as ${spec.local}`))
        .join(", ")} } from '${node.source}';`
    } else if (hasDefault) {
      return `import ${specifiers} from '${node.source}';`
    } else {
      return `import { ${specifiers} } from '${node.source}';`
    }
  }

  private transpileExportStatement(node: AST.ExportStatement): string {
    const declaration = this.transpileStatement(node.declaration)
    return `export ${declaration}`
  }

  private transpileComponentDeclaration(node: AST.ComponentDeclaration): string {
    let output = `function ${node.name}(props) {\n`
    this.increaseIndent()

    // Destructure props
    if (node.props.length > 0) {
      const propNames = node.props.map((prop) => {
        if (prop.defaultValue) {
          return `${prop.name} = ${this.transpileExpression(prop.defaultValue)}`
        }
        return prop.name
      })
      output += `${this.indent()}const { ${propNames.join(", ")} } = props;\n\n`
    }

    // State declarations
    for (const state of node.state) {
      output += `${this.indent()}const [${state.name}, set${this.capitalize(state.name)}] = useState(${this.transpileExpression(state.initialValue)});\n`
    }

    if (node.state.length > 0) {
      output += "\n"
    }

    // Event handlers
    for (const event of node.events) {
      output += `${this.indent()}const ${event.name} = (${event.parameters.map((p) => p.name).join(", ")}) => {\n`
      this.increaseIndent()
      output += `${this.indent()}// Event handler implementation\n`
      this.decreaseIndent()
      output += `${this.indent()}};\n\n`
    }

    // Return JSX
    output += `${this.indent()}return (\n`
    this.increaseIndent()
    output += `${this.indent()}${this.transpileJSXElement(node.body)}\n`
    this.decreaseIndent()
    output += `${this.indent()});\n`

    this.decreaseIndent()
    output += "}"

    return output
  }

  private transpilePageDeclaration(node: AST.PageDeclaration): string {
    // Pages are essentially components with some metadata
    return this.transpileComponentDeclaration({
      ...node,
      type: "ComponentDeclaration",
    } as AST.ComponentDeclaration)
  }

  private transpileLayoutDeclaration(node: AST.LayoutDeclaration): string {
    // Layouts are essentially components with children prop
    const layoutNode = {
      ...node,
      type: "ComponentDeclaration" as const,
      props: [
        ...node.props,
        {
          type: "PropDeclaration" as const,
          name: "children",
          dataType: "ReactNode",
        },
      ],
    }

    return this.transpileComponentDeclaration(layoutNode)
  }

  private transpileJSXElement(node: AST.JSXElement): string {
    let output = `<${node.tagName}`

    // Attributes
    for (const attr of node.attributes) {
      output += ` ${attr.name}=`
      if (typeof attr.value === "string") {
        output += `"${attr.value}"`
      } else {
        output += `{${this.transpileExpression(attr.value)}}`
      }
    }

    if (node.selfClosing) {
      output += " />"
      return output
    }

    output += ">"

    // Children
    for (const child of node.children) {
      if (child.type === "JSXElement") {
        output += this.transpileJSXElement(child)
      } else if (child.type === "JSXText") {
        output += child.value
      } else if (child.type === "JSXExpression") {
        output += `{${this.transpileExpression(child.expression)}}`
      }
    }

    output += `</${node.tagName}>`
    return output
  }

  private transpileExpression(node: AST.Expression): string {
    switch (node.type) {
      case "Identifier":
        return (node as AST.Identifier).name
      case "Literal":
        const literal = node as AST.Literal
        if (typeof literal.value === "string") {
          return `"${literal.value}"`
        }
        return String(literal.value)
      case "BinaryExpression":
        const binary = node as AST.BinaryExpression
        return `${this.transpileExpression(binary.left)} ${binary.operator} ${this.transpileExpression(binary.right)}`
      case "CallExpression":
        const call = node as AST.CallExpression
        const args = call.arguments.map((arg) => this.transpileExpression(arg)).join(", ")
        return `${this.transpileExpression(call.callee)}(${args})`
      case "MemberExpression":
        const member = node as AST.MemberExpression
        const property = member.computed
          ? `[${this.transpileExpression(member.property)}]`
          : `.${this.transpileExpression(member.property)}`
        return `${this.transpileExpression(member.object)}${property}`
      default:
        return `/* Unsupported expression: ${node.type} */`
    }
  }

  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }
}
