import { Keyword, Token, Type } from "./types";

// Also known as tokenizer, lexer
export class Scanner {
	tokenize(text: string): Token[] {
		let current = "";
		let tokens: Token[] = [];
		let isStringParsing = false;

		function saveToken(type: Type, value?: string | number) {
			tokens.push(value ? { type, value } : { type }); // To remove the value:undefined print
			current = "";
		}

		for (let i = 0; i < text.length; i++) {
			current += text[i];
			const next = text[i + 1];

			if (text[i] === '"') {
				isStringParsing = !isStringParsing;
				current = current.trim();
				if (!isStringParsing) saveToken(Type.STR, current);
				continue;
			}

			if (isStringParsing || (current = current.trim()) === "") continue;

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

			const isText = (value: string) => /\w/.exec(value);

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
