class ClassDecl {
	constructor(public name: string, public methods: MethodDecl[]) {}
}
class MethodDecl {
	constructor(public name: string, public type: string | null, public body: string) {}
}

enum Type {
	NUM = "NUMBER",
	STR = "STRING",
	LPAR = "(",
	RPAR = ")",
	LBRACE = "{",
	RBRACE = "}",
	OP = "OPERATOR",
	IDENT = "IDENTIFIER",
	KWORD = "KEYWORD",
	EOL = "EOL",
	EOF = "EOF",
}

enum Keyword {
	CLASS = "class",
	FUNCTION = "function",
	PROTOTYPE = "prototype",
	STATIC = "static",
	LET = "let",
	VAR = "var",
	TYPEOF = "typeof",
	CONST = "const",
	RETURN = "return",
}

type Token = { type: Type; value?: string | number };

enum Context {
	CLASS = "class",
	METHOD = "method",
	NONE = "none",
}

export { ClassDecl, MethodDecl, Type, Token, Keyword, Context };
