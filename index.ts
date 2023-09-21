import { log } from "console";
import { Parser } from "./parser";
import { Scanner } from "./scanner";
import { Visitor } from "./visitor";

const filepath = Bun.argv[2] ?? "code.js";
const code = await Bun.file(filepath).text();

const tokens = new Scanner().tokenize(code);
log("Tokens: ", tokens);

const ast = new Parser(tokens).parse();
log("AST: ", ast);

const codeV2 = new Visitor().visitClassDecl(ast[0]);
log(codeV2);

const filename = filepath.split(".");
filename[0] += "v2";
Bun.write(filename.join("."), codeV2);
