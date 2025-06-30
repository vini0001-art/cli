// Base AST Node
export interface ASTNode {
  type: string
  line?: number
  column?: number
}

// S4FT specific nodes
export type S4FTNode = PageNode | ComponentNode

export interface PageNode extends ASTNode {
  type: "Page"
  name: string
  state?: StateNode
  events: EventNode[]
  jsx: JSXElement
}

export interface ComponentNode extends ASTNode {
  type: "Component"
  name: string
  props?: PropsNode
  state?: StateNode
  events: EventNode[]
  jsx: JSXElement
}

export interface PropsNode extends ASTNode {
  type: "Props"
  properties: PropsProperty[]
}

export interface PropsProperty extends ASTNode {
  type: "PropsProperty"
  name: string
  dataType: string
  optional: boolean
  defaultValue?: any
}

export interface StateNode extends ASTNode {
  type: "State"
  properties: StateProperty[]
}

export interface StateProperty extends ASTNode {
  type: "StateProperty"
  name: string
  dataType: string
  defaultValue?: any
}

export interface EventNode extends ASTNode {
  type: "Event"
  name: string
  parameters: Parameter[]
  body: string
}

export interface Parameter extends ASTNode {
  type: "Parameter"
  name: string
  dataType: string
  optional?: boolean
}

// JSX nodes
export interface JSXElement extends ASTNode {
  type: "JSXElement"
  tagName: string
  attributes: JSXAttribute[]
  children: (JSXElement | JSXText | JSXExpression)[]
  selfClosing: boolean
}

export interface JSXAttribute extends ASTNode {
  type: "JSXAttribute"
  name: string
  value: string | JSXExpression
}

export interface JSXText extends ASTNode {
  type: "JSXText"
  value: string
}

export interface JSXExpression extends ASTNode {
  type: "JSXExpression"
  expression: string
}

// Import/Export nodes
export interface ImportNode extends ASTNode {
  type: "Import"
  source: string
  imports: string[]
  defaultImport?: string
}

export interface ExportNode extends ASTNode {
  type: "Export"
  name: string
  isDefault: boolean
}

// Expression nodes
export interface BinaryExpression extends ASTNode {
  type: "BinaryExpression"
  left: Expression
  operator: string
  right: Expression
}

export interface UnaryExpression extends ASTNode {
  type: "UnaryExpression"
  operator: string
  operand: Expression
}

export interface CallExpression extends ASTNode {
  type: "CallExpression"
  callee: Expression
  arguments: Expression[]
}

export interface MemberExpression extends ASTNode {
  type: "MemberExpression"
  object: Expression
  property: Expression
  computed: boolean
}

export interface Identifier extends ASTNode {
  type: "Identifier"
  name: string
}

export interface Literal extends ASTNode {
  type: "Literal"
  value: any
  raw: string
}

export type Expression = BinaryExpression | UnaryExpression | CallExpression | MemberExpression | Identifier | Literal

// Statement nodes
export interface BlockStatement extends ASTNode {
  type: "BlockStatement"
  body: Statement[]
}

export interface ExpressionStatement extends ASTNode {
  type: "ExpressionStatement"
  expression: Expression
}

export interface IfStatement extends ASTNode {
  type: "IfStatement"
  test: Expression
  consequent: Statement
  alternate?: Statement
}

export interface WhileStatement extends ASTNode {
  type: "WhileStatement"
  test: Expression
  body: Statement
}

export interface ForStatement extends ASTNode {
  type: "ForStatement"
  init?: Expression
  test?: Expression
  update?: Expression
  body: Statement
}

export interface ReturnStatement extends ASTNode {
  type: "ReturnStatement"
  argument?: Expression
}

export interface VariableDeclaration extends ASTNode {
  type: "VariableDeclaration"
  kind: "var" | "let" | "const"
  declarations: VariableDeclarator[]
}

export interface VariableDeclarator extends ASTNode {
  type: "VariableDeclarator"
  id: Identifier
  init?: Expression
}

export type Statement =
  | BlockStatement
  | ExpressionStatement
  | IfStatement
  | WhileStatement
  | ForStatement
  | ReturnStatement
  | VariableDeclaration

// Program node (root)
export interface Program extends ASTNode {
  type: "Program"
  body: (S4FTNode | ImportNode | ExportNode)[]
}
