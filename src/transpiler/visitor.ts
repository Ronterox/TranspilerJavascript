import { ClassDecl } from "types";

export class Visitor {
	visitClassDecl(decl: ClassDecl) {
		let ctx = `function ${decl.name}() {}\n`;
		decl.methods.forEach((method) => {
			const methodName = `${decl.name}${method.type !== "static" ? ".prototype." : "."}${method.name}`;
			ctx += `${methodName} = function() { ${method.body} }\n`;
		});
		return ctx;
	}
}