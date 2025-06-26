export interface ASTNode {
  type: string
  line?: number
  column?: number
}

export interface Program extends ASTNode {
  type: "Program"
  body: Statement[]
}

export interface Statement extends ASTNode {}

export interface Expression extends ASTNode {}

export interface ImportStatement extends Statement {
  type: "ImportStatement"
  specifiers: ImportSpecifier[]
  source: string
}

export interface ImportSpecifier extends ASTNode {
  type: "ImportSpecifier"
  imported: string
  local: string
}

export interface ExportStatement extends Statement {
  type: "ExportStatement"
  declaration: ComponentDeclaration | PageDeclaration | LayoutDeclaration
}

export interface ComponentDeclaration extends Statement {
  type: "ComponentDeclaration"
  name: string
  props: PropDeclaration[]
  state: StateDeclaration[]
  events: EventDeclaration[]
  body: JSXElement
}

export interface PageDeclaration extends Statement {
  type: "PageDeclaration"
  name: string
  props: PropDeclaration[]
  state: StateDeclaration[]
  events: EventDeclaration[]
  body: JSXElement
}

export interface LayoutDeclaration extends Statement {
  type: "LayoutDeclaration"
  name: string
  props: PropDeclaration[]
  state: StateDeclaration[]
  events: EventDeclaration[]
  body: JSXElement
}

export interface PropDeclaration extends ASTNode {
  type: "PropDeclaration"
  name: string
  dataType: string
  defaultValue?: Expression
}

export interface StateDeclaration extends ASTNode {
  type: "StateDeclaration"
  name: string
  dataType: string
  initialValue: Expression
}

export interface EventDeclaration extends ASTNode {
  type: "EventDeclaration"
  name: string
  parameters: Parameter[]
  body: Statement[]
}

export interface Parameter extends ASTNode {
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

export interface JSXAttribute extends ASTNode {
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
