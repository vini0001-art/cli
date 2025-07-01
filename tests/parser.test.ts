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

    const parser = new Parser(input)
    const ast = parser.parse()

    expect(ast.type).toBe("Program")
    expect(ast.body).toHaveLength(1)
    expect(ast.body[0].type).toBe("ComponentDeclaration")
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

    const parser = new Parser(input)
    const ast = parser.parse()

    expect(ast.type).toBe("Program")
    expect(ast.body).toHaveLength(1)
    expect(ast.body[0].type).toBe("PageDeclaration")
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
