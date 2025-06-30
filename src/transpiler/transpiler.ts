"use client"

import type * as AST from "../parser/ast.js"

export class Transpiler {
  transpile(ast: AST.Program): string {
    return this.transpileProgram(ast)
  }

  private transpileProgram(program: AST.Program): string {
    const imports = ["import React, { useState, useEffect } from 'react';", ""].join("\n")

    const components = program.body
      .map((node) => this.transpileNode(node))
      .filter(Boolean)
      .join("\n\n")

    return imports + components
  }

  private transpileNode(node: AST.Node): string {
    switch (node.type) {
      case "ComponentDeclaration":
        return this.transpileComponent(node as AST.ComponentDeclaration)
      case "PageDeclaration":
        return this.transpilePage(node as AST.PageDeclaration)
      case "LayoutDeclaration":
        return this.transpileLayout(node as AST.LayoutDeclaration)
      default:
        return ""
    }
  }

  private transpileComponent(component: AST.ComponentDeclaration): string {
    const name = component.name
    const props = this.transpileProps(component.props)
    const state = this.transpileState(component.state)
    const events = this.transpileEvents(component.events)
    const jsx = this.transpileJSX(component.body)

    return `
export function ${name}(${props}) {
  ${state}
  
  ${events}
  
  return (
    ${jsx}
  );
}
    `.trim()
  }

  private transpilePage(page: AST.PageDeclaration): string {
    const name = page.name
    const state = this.transpileState(page.state)
    const events = this.transpileEvents(page.events)
    const jsx = this.transpileJSX(page.body)

    return `
export default function ${name}() {
  ${state}
  
  ${events}
  
  return (
    ${jsx}
  );
}
    `.trim()
  }

  private transpileLayout(layout: AST.LayoutDeclaration): string {
    const name = layout.name
    const props = this.transpileProps(layout.props)
    const jsx = this.transpileJSX(layout.body)

    return `
export function ${name}(${props}) {
  return (
    ${jsx}
  );
}
    `.trim()
  }

  private transpileProps(props: AST.PropDeclaration[]): string {
    if (!props || props.length === 0) {
      return "props = {}"
    }

    const propTypes = props
      .map((prop) => {
        const defaultValue = prop.defaultValue ? ` = ${prop.defaultValue}` : ""
        return `${prop.name}${defaultValue}`
      })
      .join(", ")

    return `{ ${propTypes} }`
  }

  private transpileState(state: AST.StateDeclaration[]): string {
    if (!state || state.length === 0) {
      return ""
    }

    return state
      .map((stateVar) => {
        const defaultValue = stateVar.defaultValue || this.getDefaultValueForType(stateVar.type)
        return `const [${stateVar.name}, set${this.capitalize(stateVar.name)}] = useState(${defaultValue});`
      })
      .join("\n  ")
  }

  private transpileEvents(events: AST.EventDeclaration[]): string {
    if (!events || events.length === 0) {
      return ""
    }

    return events
      .map((event) => {
        return `const ${event.name} = () => {
    ${event.body || "// Event handler implementation"}
  };`
      })
      .join("\n\n  ")
  }

  private transpileJSX(jsx: string): string {
    // Simples transpilação de JSX - em uma implementação real seria mais complexa
    return jsx || "<div>Component content</div>"
  }

  private getDefaultValueForType(type: string): string {
    switch (type) {
      case "string":
        return '""'
      case "number":
        return "0"
      case "boolean":
        return "false"
      case "array":
        return "[]"
      case "object":
        return "{}"
      default:
        return "null"
    }
  }

  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }
}
