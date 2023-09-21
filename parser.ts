import { Token, MethodDecl, Context, Type, ClassDecl, Keyword } from "./types";

export class Parser {
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
		} else if (token.value === Keyword.STATIC && this.ctx === Context.CLASS && nextToken.type === Type.IDENT) {
			this.openMethodContext(nextToken.value + "", Keyword.STATIC);
		} else if (this.ctx === Context.METHOD) {
			this.appendToLastMethodBody(token.value + " " + nextToken.value);
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
