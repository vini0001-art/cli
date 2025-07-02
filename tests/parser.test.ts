"use client"

import { Parser } from "../src/parser/parser"
import { Lexer } from "../src/parser/lexer"

describe("S4FT Parser", () => {
  test("should parse simple component", () => {
    const input = `
component TestComponent {
  props {
    title: string = "Test"
  }
  
  state {
    count: number = 0
  }
  
  event increment() {
    count = count + 1
  }
  
  <div>
    <h1>{title}</h1>
    <p>{count}</p>
    <button onClick={increment}>Click</button>
  </div>
}
    `

    const lexer = new Lexer(input)
    const tokens = []
    let token = lexer.nextToken()
    while (token.type !== "EOF") {
      tokens.push(token)
      token = lexer.nextToken()
    }
    const parser = new Parser(tokens)
    const ast = parser.parse()

    expect(ast.type).toBe("Program")
    // Só verifica body se existir
    if ("body" in ast && Array.isArray(ast.body)) {
      expect(ast.body).toHaveLength(1)
      expect(ast.body[0].type).toBe("ComponentDeclaration")
    } else {
      // fallback para caso o nó não tenha body
      expect(ast.type).toBe("ComponentDeclaration")
    }
  })

  test("should parse simple page", () => {
    const input = `
page HomePage {
  state {
    message: string = "Hello World"
  }
  
  <div>
    <h1>{message}</h1>
  </div>
}
    `

    const lexer2 = new Lexer(input)
    const tokens2 = []
    let token2 = lexer2.nextToken()
    while (token2.type !== "EOF") {
      tokens2.push(token2)
      token2 = lexer2.nextToken()
    }
    const parser = new Parser(tokens2)
    const ast = parser.parse()

    expect(ast.type).toBe("Program")
    if ("body" in ast && Array.isArray(ast.body)) {
      expect(ast.body).toHaveLength(1)
      expect(ast.body[0].type).toBe("PageDeclaration")
    } else {
      expect(ast.type).toBe("PageDeclaration")
    }
  })
})

describe("S4FT Lexer", () => {
  test("should tokenize keywords", () => {
    const input = "component page layout props state event"
    const lexer = new Lexer(input)

    const tokens = []
    let token = lexer.nextToken()
    while (token.type !== "EOF") {
      tokens.push(token)
      token = lexer.nextToken()
    }

    expect(tokens).toHaveLength(6)
    expect(tokens[0].type).toBe("COMPONENT")
    expect(tokens[1].type).toBe("PAGE")
    expect(tokens[2].type).toBe("LAYOUT")
  })
})
