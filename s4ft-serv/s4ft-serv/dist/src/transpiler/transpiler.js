export class Transpiler {
    transpile(ast) {
        if (ast.type === "Page") {
            return this.transpilePage(ast);
        }
        else if (ast.type === "Component") {
            return this.transpileComponent(ast);
        }
        throw new Error(`Unknown AST node type`);
    }
    transpilePage(page) {
        const imports = this.generateImports();
        const stateHooks = page.state ? this.generateStateHooks(page.state) : "";
        const eventHandlers = this.generateEventHandlers(page.events);
        const jsx = this.transpileJSX(page.jsx);
        return `${imports}

export default function ${page.name}() {
  ${stateHooks}
  
  ${eventHandlers}
  
  return (
    ${jsx}
  )
}`;
    }
    transpileComponent(component) {
        const imports = this.generateImports();
        const propsInterface = component.props ? this.generatePropsInterface(component) : "";
        const propsParam = component.props ? `props: ${component.name}Props` : "";
        const stateHooks = component.state ? this.generateStateHooks(component.state) : "";
        const eventHandlers = this.generateEventHandlers(component.events);
        const jsx = this.transpileJSX(component.jsx);
        return `${imports}

${propsInterface}

export function ${component.name}(${propsParam}) {
  ${stateHooks}
  
  ${eventHandlers}
  
  return (
    ${jsx}
  )
}`;
    }
    generateImports() {
        return `'use client'

import React, { useState } from 'react'`;
    }
    generatePropsInterface(component) {
        if (!component.props)
            return "";
        const properties = component.props.properties
            .map((prop) => {
            const optional = prop.optional ? "?" : "";
            return `  ${prop.name}${optional}: ${this.mapType(prop.dataType)}`;
        })
            .join("\n");
        return `interface ${component.name}Props {
${properties}
}`;
    }
    generateStateHooks(state) {
        return state.properties
            .map((prop) => {
            const defaultValue = this.formatDefaultValue(prop.defaultValue, prop.dataType);
            const setterName = `set${prop.name.charAt(0).toUpperCase() + prop.name.slice(1)}`;
            return `  const [${prop.name}, ${setterName}] = useState<${this.mapType(prop.dataType)}>(${defaultValue})`;
        })
            .join("\n");
    }
    generateEventHandlers(events) {
        return events
            .map((event) => {
            return `  const ${event.name} = () => {
    ${event.body}
  }`;
        })
            .join("\n\n");
    }
    transpileJSX(jsx) {
        const attributes = jsx.attributes.map((attr) => this.transpileJSXAttribute(attr)).join(" ");
        const attributesStr = attributes ? ` ${attributes}` : "";
        if (jsx.selfClosing) {
            return `<${jsx.tagName}${attributesStr} />`;
        }
        const children = jsx.children
            .map((child) => {
            if (child.type === "JSXElement") {
                return this.transpileJSX(child);
            }
            else if (child.type === "JSXText") {
                return child.value;
            }
            else if (child.type === "JSXExpression") {
                return `{${child.expression}}`;
            }
            return "";
        })
            .join("");
        return `<${jsx.tagName}${attributesStr}>${children}</${jsx.tagName}>`;
    }
    transpileJSXAttribute(attr) {
        if (typeof attr.value === "string") {
            return `${attr.name}="${attr.value}"`;
        }
        else if (attr.value && typeof attr.value === "object" && attr.value.type === "JSXExpression") {
            return `${attr.name}={${attr.value.expression}}`;
        }
        return attr.name;
    }
    mapType(s4ftType) {
        const typeMap = {
            string: "string",
            number: "number",
            boolean: "boolean",
            array: "any[]",
            object: "Record<string, any>",
        };
        if (s4ftType.endsWith("[]")) {
            const baseType = s4ftType.slice(0, -2);
            return `${this.mapType(baseType)}[]`;
        }
        return typeMap[s4ftType] || "any";
    }
    formatDefaultValue(value, type) {
        if (value === undefined) {
            switch (type) {
                case "string":
                    return '""';
                case "number":
                    return "0";
                case "boolean":
                    return "false";
                case "array":
                    return "[]";
                case "object":
                    return "{}";
                default:
                    return "undefined";
            }
        }
        if (typeof value === "string") {
            return `"${value}"`;
        }
        if (Array.isArray(value)) {
            return JSON.stringify(value);
        }
        if (typeof value === "object") {
            return JSON.stringify(value);
        }
        return String(value);
    }
}
export function transpileS4FT(ast) {
    const transpiler = new Transpiler();
    return transpiler.transpile(ast);
}
