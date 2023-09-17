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

log(new Visitor().visitClassDecl(bookClassDecl));
