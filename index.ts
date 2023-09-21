import { log } from "console";

class ClassDecl {
	constructor(public name: string, public methods: MethodDecl[]) {}
}
class MethodDecl {
	constructor(public name: string, public type: string | null, public body: string) {}
}

class Visitor {
	visitClassDecl(decl: ClassDecl) {
		let ctx = `function ${decl.name}() {}\n`;
		decl.methods.forEach((method) => {
			const methodName = `${decl.name}${method.type !== "static" ? ".prototype." : "."}${method.name}`;
			ctx += `${methodName} = function() { ${method.body} }\n`;
		});
		return ctx;
	}
}

enum Type {
	NUM = "NUMBER",
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
}

type Token = { type: Type; value?: string | number };

// Also known as tokenizer, lexer
class Scanner {
	tokenize(text: string): Token[] {
		let current = "";
		let tokens: Token[] = [];

		function saveToken(type: Type, value?: string | number) {
			tokens.push(value ? { type, value } : { type }); // To remove the value:undefined print
			current = "";
		}

		for (let i = 0; i < text.length; i++) {
			current += text[i];
			current = current.trim();

			const next = text[i + 1];
			if (current === "") continue;

			if ([Type.LBRACE, Type.RBRACE, Type.LPAR, Type.RPAR].includes(current as Type)) {
				saveToken(current as Type);
				continue;
			}

			if (Number(current) && !Number(next)) {
				saveToken(Type.NUM, Number(current));
				continue;
			}

			const operators = "+-/*%>=!";
			if (operators.includes(current) && !operators.includes(next)) {
				saveToken(Type.OP, current);
				continue;
			}

			const isText = (value: string) => /[\w"']/.exec(value);

			if (isText(current) && !isText(next)) {
				const keywords = Object.values(Keyword) as string[];
				saveToken(keywords.includes(current) ? Type.KWORD : Type.IDENT, current);
				continue;
			}

			if ([";", "\n"].includes(current)) {
				saveToken(Type.EOL, current);
				continue;
			}
		}

		saveToken(Type.EOF);
		return tokens;
	}
}

enum Context {
	CLASS = "class",
	METHOD = "method",
	// TODO: Use this context for spaces
	STRING = "string",
	NONE = "none",
}

class Parser {
	constructor(public tokens: Token[], public index = 0, public methods: MethodDecl[] = [], public ctx = Context.NONE) {}

	openContext(context: Context) {
		let currToken;
		while ((currToken = this.tokens[this.index++])) {
			if (currToken.type === Type.LBRACE) {
				this.ctx = context;
				break;
			}
		}
	}

	closeContext() {
		if (this.ctx === Context.CLASS) this.ctx = Context.NONE;
		else if (this.ctx === Context.METHOD) this.ctx = Context.CLASS;
	}

	parseKeyword(token: Token, ast: ClassDecl[]) {
		const nextToken: Token = this.tokens[this.index++];
		if (token.value === Context.CLASS && nextToken.type === Type.IDENT) {
			ast.push(new ClassDecl(nextToken.value + "", (this.methods = [])));
			this.openContext(Context.CLASS);
		} else if (token.value === "static" && this.ctx === Context.CLASS && nextToken.type === Type.IDENT) {
			this.openMethodContext(nextToken.value + "", "static");
		}
	}

	parseIdentifier(token: Token) {
		if (this.ctx === Context.CLASS) {
			this.openMethodContext(token.value + "");
		} else if (this.ctx === Context.METHOD) {
			this.appendToLastMethodBody(token.value + "");
		}
	}

	openMethodContext(name: string, type: string = "") {
		this.methods.push(new MethodDecl(name, type, ""));
		this.openContext(Context.METHOD);
	}

	appendToLastMethodBody(value: string | number) {
		this.methods[this.methods.length - 1].body += value;
	}

	parse(): ClassDecl[] {
		const ast: ClassDecl[] = [];
		let currToken: Token | undefined;

		while ((currToken = this.tokens[this.index++])) {
			const tokType = currToken.type;

			if (tokType === Type.KWORD) this.parseKeyword(currToken, ast);
			else if (tokType === Type.IDENT) this.parseIdentifier(currToken);
			else if (tokType === Type.RBRACE) this.closeContext();
			else if (this.ctx === Context.METHOD) this.appendToLastMethodBody(currToken.value ?? currToken.type);
		}

		return ast;
	}
}

const code = `
class Book {
  addBook() { 
		var syke = "There is no book";
		return syke;
	}
  removeBook() { }
  static getBook() { 
		console.log("text"); 
		println("This is Lol");
	}
}`;

const tokens = new Scanner().tokenize(code);
log("Tokens: ", tokens);

const ast = new Parser(tokens).parse();
log("AST: ", ast);

log(new Visitor().visitClassDecl(ast[0]));
