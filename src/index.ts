import { log } from "console";
import { Parser } from "transpiler/parser";
import { Scanner } from "transpiler/scanner";
import { Visitor } from "transpiler/visitor";

const filepath = Bun.argv[2] ?? "../example/code.js";
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
