"use client"

export function transpileS4FT(content: string): string {
  // Parser básico para sintaxe S4FT
  let jsxContent = content

  // Converter sintaxe de página
  jsxContent = jsxContent.replace(/page\s+(\w+)\s*{([\s\S]*?)}/g, (match, name, body) => {
    return `function ${name}() {${body}}`
  })

  // Converter sintaxe de componente
  jsxContent = jsxContent.replace(/component\s+(\w+)\s*{([\s\S]*?)}/g, (match, name, body) => {
    return `function ${name}() {${body}}`
  })

  // Converter state
  jsxContent = jsxContent.replace(/state\s*{([\s\S]*?)}/g, (match, stateBody) => {
    const states = stateBody
      .trim()
      .split("\n")
      .map((line: string) => {
        const trimmed = line.trim()
        if (trimmed && !trimmed.startsWith("//")) {
          const [name, type, value] = trimmed.split(/[:\s=]+/)
          if (name && value) {
            return `const [${name}, set${name.charAt(0).toUpperCase() + name.slice(1)}] = React.useState(${value.replace(",", "")});`
          }
        }
        return ""
      })
      .filter(Boolean)

    return states.join("\n  ")
  })

  // Converter eventos
  jsxContent = jsxContent.replace(/event\s+(\w+)\s*$$\s*$$\s*{([\s\S]*?)}/g, (match, name, body) => {
    return `const ${name} = () => {${body}};`
  })

  // Adicionar imports React
  jsxContent = `import React from 'react';\n\n${jsxContent}`

  // Adicionar export default
  if (!jsxContent.includes("export default")) {
    const functionMatch = jsxContent.match(/function\s+(\w+)/)
    if (functionMatch) {
      jsxContent += `\n\nexport default ${functionMatch[1]};`
    }
  }

  return jsxContent
}
