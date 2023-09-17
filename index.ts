import { log } from "console";

class ClassDecl {
	constructor(public name: string, public methods: MethodDecl[]) {}
}

class MethodDecl {
	constructor(public name: string, public type: string | null, public body: string) {}
}

class Visitor {
	visitClassDecl(decl: ClassDecl) {
		let ctx = "function " + decl.name + "() {}\n";
		decl.methods.forEach((method) => {
			ctx += decl.name + (method.type !== "static" ? ".prototype." : ".") + method.name + " = function() {\n";
			ctx += method.body + "\n";
			ctx += "}\n";
		});
		return ctx;
	}
}

const bookClassDecl: ClassDecl = {
	name: "Book",
	methods: [
		{
			name: "addBook",
			type: null,
			body: "console.log('addBook');",
		},
		{
			name: "removeBook",
			type: null,
			body: "console.log('removeBook');",
		},
		{
			name: "getBook",
			type: "static",
			body: "return 'getBook';",
		},
	],
};

// log(new Visitor().visitClassDecl(bookClassDecl));

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

type Token = { type: Type; value: string | number };

// Also known as tokenizer, lexer
class Scanner {
	tokenize(text: string) {
		let current = "";
		let tokens: Token[] = [];

		for (let i = 0; i < text.length; i++) {
			current += text[i];
			current = current.trim();

			const next = text[i + 1];

			if (current === "") continue;

			if ([Type.LBRACE, Type.RBRACE, Type.LPAR, Type.RPAR].includes(current as Type)) {
				tokens.push({ type: current as Type, value: current });
				current = "";
				continue;
			}

			if (Number(current) && !Number(next)) {
				tokens.push({ type: Type.NUM, value: Number(current) });
				current = "";
				continue;
			}

			const operators = "+-/*%>=!";
			if (operators.includes(current) && !operators.includes(next)) {
				tokens.push({ type: Type.OP, value: current });
				current = "";
				continue;
			}

			const isAlphanumeric = (value: string) => /\w/.exec(value);

			if (isAlphanumeric(current) && !isAlphanumeric(next)) {
				const keywords = "class function prototype static var typeof";
				const isKeyword = keywords.includes(current);
				tokens.push({ type: !isKeyword ? Type.IDENT : Type.KWORD, value: current });
        current = "";
				continue;
			}

			if ([";", "\n"].includes(current)) {
				tokens.push({ type: Type.EOL, value: current });
				current = "";
				continue;
			}
		}

		tokens.push({ type: Type.EOF, value: "" });

		return tokens;
	}
}

const code = `
class Book {
  addBook() { }
  removeBook() { }
  static getBook() { }
}
`;

log(new Scanner().tokenize(code));
