import { parseS4FT } from "../parser/parser.js"
import { transpileS4FT } from "../transpiler/transpiler.js"
import type { Store } from "../state/store.js"
import type { Router } from "../router/router.js"

// Testing utilities for S4FT components
export interface TestOptions {
  props?: Record<string, any>
  store?: Store
  router?: Router
  locale?: string
}

export interface TestResult {
  component: any
  html: string
  errors: Error[]
}

// Test a S4FT component
export async function testS4FTComponent(s4ftCode: string, options: TestOptions = {}): Promise<TestResult> {
  const errors: Error[] = []
  let component: any = null
  let html = ""

  try {
    // Parse S4FT code
    const ast = parseS4FT(s4ftCode)

    // Transpile to React
    const reactCode = transpileS4FT(ast)

    // Create mock component for testing
    component = createMockComponent(reactCode, options)

    // Generate HTML representation
    html = generateTestHTML(component, options)
  } catch (error) {
    errors.push(error as Error)
  }

  return { component, html, errors }
}

// Create mock component for testing
function createMockComponent(reactCode: string, options: TestOptions): any {
  // Mock React hooks and components for testing
  const mockReact = {
    useState: (initial: any) => [initial, () => {}],
    useEffect: () => {},
    createElement: (type: string, props: any, ...children: any[]) => ({
      type,
      props: { ...props, children },
    }),
  }

  try {
    // Create component function from transpiled code
    const componentFn = new Function(
      "React",
      "useState",
      `
      ${reactCode}
      return typeof ${extractComponentName(reactCode)} !== 'undefined' ? ${extractComponentName(reactCode)} : null;
    `,
    )(mockReact, mockReact.useState)

    return componentFn
  } catch (error) {
    throw new Error(`Failed to create test component: ${error}`)
  }
}

// Extract component name from React code
function extractComponentName(reactCode: string): string {
  const match = reactCode.match(/export default function (\w+)/) || reactCode.match(/function (\w+)/)
  return match ? match[1] : "TestComponent"
}

// Generate HTML representation for testing
function generateTestHTML(component: any, options: TestOptions): string {
  if (!component) return ""

  try {
    // Mock render the component
    const result = component(options.props || {})
    return renderMockElement(result)
  } catch (error) {
    return `<div>Error rendering component: ${error}</div>`
  }
}

// Render mock React element to HTML string
function renderMockElement(element: any): string {
  if (!element) return ""

  if (typeof element === "string" || typeof element === "number") {
    return String(element)
  }

  if (typeof element === "object" && element.type) {
    const { type, props } = element
    const { children, ...attrs } = props || {}

    // Build attributes string
    const attrString = Object.entries(attrs)
      .map(([key, value]) => `${key}="${value}"`)
      .join(" ")

    // Handle self-closing tags
    const selfClosing = ["img", "br", "hr", "input", "meta", "link"]
    if (selfClosing.includes(type)) {
      return `<${type}${attrString ? ` ${attrString}` : ""} />`
    }

    // Render children
    const childrenHTML = Array.isArray(children)
      ? children.map(renderMockElement).join("")
      : renderMockElement(children)

    return `<${type}${attrString ? ` ${attrString}` : ""}>${childrenHTML}</${type}>`
  }

  return ""
}

// Test utilities for assertions
export class TestAssertions {
  constructor(private result: TestResult) {}

  // Assert no errors occurred
  hasNoErrors(): this {
    if (this.result.errors.length > 0) {
      throw new Error(`Expected no errors, but got: ${this.result.errors.map((e) => e.message).join(", ")}`)
    }
    return this
  }

  // Assert component was created
  hasComponent(): this {
    if (!this.result.component) {
      throw new Error("Expected component to be created")
    }
    return this
  }

  // Assert HTML contains text
  htmlContains(text: string): this {
    if (!this.result.html.includes(text)) {
      throw new Error(`Expected HTML to contain "${text}", but got: ${this.result.html}`)
    }
    return this
  }

  // Assert HTML matches pattern
  htmlMatches(pattern: RegExp): this {
    if (!pattern.test(this.result.html)) {
      throw new Error(`Expected HTML to match pattern ${pattern}, but got: ${this.result.html}`)
    }
    return this
  }

  // Assert specific element exists
  hasElement(selector: string): this {
    // Simple selector matching for testing
    const hasTag = this.result.html.includes(`<${selector}`)
    if (!hasTag) {
      throw new Error(`Expected element "${selector}" to exist in HTML: ${this.result.html}`)
    }
    return this
  }
}

// Create test assertions
export function expect(result: TestResult): TestAssertions {
  return new TestAssertions(result)
}

// Test suite runner
export class TestSuite {
  private tests: Array<{ name: string; fn: () => Promise<void> | void }> = []
  private beforeEachFn?: () => Promise<void> | void
  private afterEachFn?: () => Promise<void> | void

  // Add test
  test(name: string, fn: () => Promise<void> | void): void {
    this.tests.push({ name, fn })
  }

  // Add before each hook
  beforeEach(fn: () => Promise<void> | void): void {
    this.beforeEachFn = fn
  }

  // Add after each hook
  afterEach(fn: () => Promise<void> | void): void {
    this.afterEachFn = fn
  }

  // Run all tests
  async run(): Promise<void> {
    console.log(`🧪 Running ${this.tests.length} tests...`)

    let passed = 0
    let failed = 0

    for (const test of this.tests) {
      try {
        if (this.beforeEachFn) {
          await this.beforeEachFn()
        }

        await test.fn()

        if (this.afterEachFn) {
          await this.afterEachFn()
        }

        console.log(`✅ ${test.name}`)
        passed++
      } catch (error) {
        console.log(`❌ ${test.name}: ${error}`)
        failed++
      }
    }

    console.log(`\n📊 Test Results: ${passed} passed, ${failed} failed`)

    if (failed > 0) {
      throw new Error(`${failed} tests failed`)
    }
  }
}

// Example test
export function createExampleTests(): TestSuite {
  const suite = new TestSuite()

  suite.test("should parse simple component", async () => {
    const s4ftCode = `
      component Button(props: { text: string }) {
        <button>{props.text}</button>
      }
    `

    const result = await testS4FTComponent(s4ftCode, {
      props: { text: "Click me" },
    })

    expect(result).hasNoErrors().hasComponent().htmlContains("Click me").hasElement("button")
  })

  suite.test("should handle state", async () => {
    const s4ftCode = `
      page Counter {
        state {
          count: number = 0
        }
        
        <div>Count: {count}</div>
      }
    `

    const result = await testS4FTComponent(s4ftCode)

    expect(result).hasNoErrors().hasComponent().htmlContains("Count: 0").hasElement("div")
  })

  return suite
}
