export interface Node {
  type: string
}

export interface ASTNode extends Node {
  line?: number
  column?: number
}

export interface Program extends Node {
  type: "Program"
  body: Node[]
}

export interface Statement extends Node {}

export interface Expression extends Node {}

export interface ImportStatement extends Statement {
  type: "ImportStatement"
  specifiers: ImportSpecifier[]
  source: string
}

export interface ImportSpecifier extends Node {
  type: "ImportSpecifier"
  imported: string
  local: string
}

export interface ExportStatement extends Statement {
  type: "ExportStatement"
  declaration: ComponentDeclaration | PageDeclaration | LayoutDeclaration
}

export interface ComponentDeclaration extends Node {
  type: "ComponentDeclaration"
  name: string
  props: PropDeclaration[]
  state: StateDeclaration[]
  events: EventDeclaration[]
  body: string
}

export interface PageDeclaration extends Node {
  type: "PageDeclaration"
  name: string
  state: StateDeclaration[]
  events: EventDeclaration[]
  body: string
}

export interface LayoutDeclaration extends Node {
  type: "LayoutDeclaration"
  name: string
  props: PropDeclaration[]
  body: string
}

export interface PropDeclaration {
  name: string
  type: string
  defaultValue: string | null
}

export interface StateDeclaration {
  name: string
  type: string
  defaultValue: string | null
}

export interface EventDeclaration {
  name: string
  body: string
}

export interface Parameter extends Node {
  type: "Parameter"
  name: string
  dataType: string
}

export interface JSXElement extends Expression {
  type: "JSXElement"
  tagName: string
  attributes: JSXAttribute[]
  children: (JSXElement | JSXText | JSXExpression)[]
  selfClosing: boolean
}

export interface JSXAttribute extends Node {
  type: "JSXAttribute"
  name: string
  value: Expression | string
}

export interface JSXText extends Expression {
  type: "JSXText"
  value: string
}

export interface JSXExpression extends Expression {
  type: "JSXExpression"
  expression: Expression
}

export interface Identifier extends Expression {
  type: "Identifier"
  name: string
}

export interface Literal extends Expression {
  type: "Literal"
  value: string | number | boolean
  raw: string
}

export interface BinaryExpression extends Expression {
  type: "BinaryExpression"
  left: Expression
  operator: string
  right: Expression
}

export interface CallExpression extends Expression {
  type: "CallExpression"
  callee: Expression
  arguments: Expression[]
}

export interface MemberExpression extends Expression {
  type: "MemberExpression"
  object: Expression
  property: Expression
  computed: boolean
}

export interface ConditionalStatement extends Statement {
  type: "ConditionalStatement"
  test: Expression
  consequent: Statement[]
  alternate?: Statement[]
}

export interface ForStatement extends Statement {
  type: "ForStatement"
  variable: string
  iterable: Expression
  body: Statement[]
}
