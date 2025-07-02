export interface ASTNode {
    type: string;
    line?: number;
    column?: number;
}
export interface PageNode extends ASTNode {
    type: "Page";
    name: string;
    state?: StateNode;
    events: EventNode[];
    jsx: JSXElement;
}
export interface ComponentNode extends ASTNode {
    type: "Component";
    name: string;
    props?: PropsNode;
    state?: StateNode;
    events: EventNode[];
    jsx: JSXElement;
}
export interface StateNode extends ASTNode {
    type: "State";
    properties: StateProperty[];
}
export interface StateProperty extends ASTNode {
    type: "StateProperty";
    name: string;
    dataType: string;
    defaultValue?: any;
}
export interface EventNode extends ASTNode {
    type: "Event";
    name: string;
    parameters: Parameter[];
    body: string;
}
export interface PropsNode extends ASTNode {
    type: "Props";
    properties: PropsProperty[];
}
export interface PropsProperty extends ASTNode {
    type: "PropsProperty";
    name: string;
    dataType: string;
    optional: boolean;
}
export interface Parameter extends ASTNode {
    type: "Parameter";
    name: string;
    dataType?: string;
}
export interface JSXElement extends ASTNode {
    type: "JSXElement";
    tagName: string;
    attributes: JSXAttribute[];
    children: (JSXElement | JSXText | JSXExpression)[];
    selfClosing: boolean;
}
export interface JSXAttribute extends ASTNode {
    type: "JSXAttribute";
    name: string;
    value: string | JSXExpression;
}
export interface JSXText extends ASTNode {
    type: "JSXText";
    value: string;
}
export interface JSXExpression extends ASTNode {
    type: "JSXExpression";
    expression: string;
}
export type S4FTNode = PageNode | ComponentNode;
