"use strict";
//------------------------------------------------------------
//-------------------       Lexer          -------------------
//---   Responsible for producing tokens from the source   ---
//------------------------------------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenize = exports.TokenType = void 0;
var TokenType;
(function (TokenType) {
    // Literal Types
    TokenType[TokenType["Number"] = 0] = "Number";
    TokenType[TokenType["Identifier"] = 1] = "Identifier";
    TokenType[TokenType["String"] = 2] = "String";
    // Keywords
    TokenType[TokenType["Var"] = 3] = "Var";
    TokenType[TokenType["Const"] = 4] = "Const";
    TokenType[TokenType["FUNC"] = 5] = "FUNC";
    TokenType[TokenType["ASYNC"] = 6] = "ASYNC";
    TokenType[TokenType["ARRAY"] = 7] = "ARRAY";
    TokenType[TokenType["IF"] = 8] = "IF";
    TokenType[TokenType["ELSE"] = 9] = "ELSE";
    TokenType[TokenType["ELIF"] = 10] = "ELIF";
    TokenType[TokenType["WHILE"] = 11] = "WHILE";
    TokenType[TokenType["FOR"] = 12] = "FOR";
    TokenType[TokenType["CHAR"] = 13] = "CHAR";
    TokenType[TokenType["PULL"] = 14] = "PULL";
    // Operators
    TokenType[TokenType["ARROWUP"] = 15] = "ARROWUP";
    TokenType[TokenType["DASH"] = 16] = "DASH";
    TokenType[TokenType["GT"] = 17] = "GT";
    TokenType[TokenType["GTE"] = 18] = "GTE";
    TokenType[TokenType["EQUALTO"] = 19] = "EQUALTO";
    TokenType[TokenType["LT"] = 20] = "LT";
    TokenType[TokenType["LTE"] = 21] = "LTE";
    TokenType[TokenType["NOT"] = 22] = "NOT";
    TokenType[TokenType["AND"] = 23] = "AND";
    TokenType[TokenType["OR"] = 24] = "OR";
    TokenType[TokenType["NULL"] = 25] = "NULL";
    TokenType[TokenType["PLUSEQUAL"] = 26] = "PLUSEQUAL";
    TokenType[TokenType["MINUSEQUAL"] = 27] = "MINUSEQUAL";
    TokenType[TokenType["OpenParen"] = 28] = "OpenParen";
    TokenType[TokenType["CloseParen"] = 29] = "CloseParen";
    TokenType[TokenType["OPENBRACE"] = 30] = "OPENBRACE";
    TokenType[TokenType["CLOSEBRACE"] = 31] = "CLOSEBRACE";
    TokenType[TokenType["OPENBRACKET"] = 32] = "OPENBRACKET";
    TokenType[TokenType["CLOSEBRACKET"] = 33] = "CLOSEBRACKET";
    TokenType[TokenType["HASH"] = 34] = "HASH";
    // Grouping * Operators
    TokenType[TokenType["BinaryOperator"] = 35] = "BinaryOperator";
    TokenType[TokenType["Equals"] = 36] = "Equals";
    TokenType[TokenType["Semicolen"] = 37] = "Semicolen";
    TokenType[TokenType["COLON"] = 38] = "COLON";
    TokenType[TokenType["COMMA"] = 39] = "COMMA";
    TokenType[TokenType["DOT"] = 40] = "DOT";
    TokenType[TokenType["UNDERSCORE"] = 41] = "UNDERSCORE";
    TokenType[TokenType["THEN"] = 42] = "THEN";
    TokenType[TokenType["RETURN"] = 43] = "RETURN";
    // Special
    TokenType[TokenType["EOF"] = 44] = "EOF";
})(TokenType = exports.TokenType || (exports.TokenType = {}));
/**
 * Constant lookup for keywords and known identifiers + symbols.
 */
const KEYWORDS = {
    have: TokenType.Var,
    const: TokenType.Const,
    func: TokenType.FUNC,
    async: TokenType.ASYNC,
    if: TokenType.IF,
    else: TokenType.ELSE,
    elif: TokenType.ELIF,
    then: TokenType.THEN,
    return: TokenType.RETURN,
    array: TokenType.ARRAY,
    while: TokenType.WHILE,
    for: TokenType.FOR,
};
// Returns a token of a given type and value
function token(value = "", type, line) {
    return { value, type, line };
}
/**
 * Returns whether the character passed in alphabetic -> [a-zA-Z]
 */
function isalpha(src) {
    return src.toUpperCase() != src.toLowerCase();
}
/**
 * Returns true if the character is whitespace like -> [\s, \t, \n]
 */
function isskippable(str) {
    return str == " " || str == "\n" || str == "\t" || str == "\r";
}
/**
 Return whether the character is a valid integer -> [0-9]
 */
function isint(str) {
    const c = str.charCodeAt(0);
    const bounds = ["0".charCodeAt(0), "9".charCodeAt(0)];
    return c >= bounds[0] && c <= bounds[1];
}
/**
 * Given a string representing source code: Produce tokens and handles
 * possible unidentified characters.
 *
 * - Returns a array of tokens.
 * - Does not modify the incoming string.
 */
function tokenize(sourceCode) {
    let Line = 1;
    let inString = false;
    let currentString = "";
    const tokens = new Array();
    const src = sourceCode.split("");
    while (src.length > 0) {
        // Check if the new line character is present
        if (src[0] == "\n") {
            Line++;
        }
        // Skip over any comments in the source code
        if (src[0] === "/" && src[1] === "*") {
            while (src.length > 0 && (src[0] !== "*" || src[1] !== "/")) {
                src.shift();
            }
            src.shift();
            src.shift();
            continue;
        }
        else if (src[0] === "#") {
            while (src.length > 0 && src[0] !== "\n") {
                src.shift();
            }
            continue;
        }
        if (src[0] === "\"") {
            if (inString) {
                inString = false;
                tokens.push(token(src.shift(), TokenType.String, Line));
                currentString = "";
            }
            else {
                inString = true;
                tokens.push(token(src.shift(), TokenType.String, Line));
            }
            src.shift();
            continue;
        }
        else if (inString) {
            currentString += src.shift();
            continue;
        }
        // BEGIN PARSING ONE CHARACTER TOKENS
        if (src[0] == "(") {
            tokens.push(token(src.shift(), TokenType.OpenParen, Line));
        }
        else if (src[0] == ")") {
            tokens.push(token(src.shift(), TokenType.CloseParen, Line));
        }
        else if (src[0] == "[") {
            tokens.push(token(src.shift(), TokenType.OPENBRACE, Line));
        }
        else if (src[0] == "]") {
            tokens.push(token(src.shift(), TokenType.CLOSEBRACE, Line));
        }
        else if (src[0] == "{") {
            tokens.push(token(src.shift(), TokenType.OPENBRACKET, Line));
        }
        else if (src[0] == "}") {
            tokens.push(token(src.shift(), TokenType.CLOSEBRACKET, Line));
        }
        else if (src[0] == "_") {
            tokens.push(token(src.shift(), TokenType.UNDERSCORE, Line));
        }
        else if (src[0] == ".") {
            tokens.push(token(src.shift(), TokenType.DOT, Line));
        }
        else if (src[0] == "?") {
            tokens.push(token(src.shift(), TokenType.NULL, Line));
        }
        // HANDLE MULTICHARACTER KEYWORDS, TOKENS, IDENTIFIERS ETC...
        else if (src[0] == ";") {
            tokens.push(token(src.shift(), TokenType.Semicolen, Line));
        }
        else if (src[0] == ":") {
            if (tokens[tokens.length - 1].type === TokenType.Identifier) {
                tokens.push(token(src.shift(), TokenType.COLON, Line));
            }
        }
        else if (src[0] == "<") {
            if (src[1] == "=") {
                tokens.push(token(src.shift(), TokenType.LTE, Line));
                src.shift();
            }
            else {
                tokens.push(token(src.shift(), TokenType.LT, Line));
            }
        }
        else if (src[0] == ">") {
            if (src[1] == "=") {
                tokens.push(token(src.shift(), TokenType.GTE, Line));
                src.shift();
            }
            else {
                tokens.push(token(src.shift(), TokenType.GT, Line));
            }
        }
        else if (src[0] == "=") {
            if (src[1] == "=") {
                tokens.push(token(src.shift(), TokenType.EQUALTO, Line));
                src.shift();
            }
            else {
                tokens.push(token(src.shift(), TokenType.Equals, Line));
            }
        }
        else if (src[0] == ",") {
            tokens.push(token(src.shift(), TokenType.COMMA, Line));
        }
        else if (src[0] == "!" && src[1] == "=") {
            tokens.push(token(src.shift(), TokenType.NOT, Line));
            src.shift();
        }
        else if (src[0] == "&" && src[1] == "&") {
            tokens.push(token(src.shift(), TokenType.AND, Line));
            src.shift();
        }
        else if (src[0] == "|") {
            if (src[1] == "|") {
                tokens.push(token(src.shift(), TokenType.OR, Line));
                src.shift();
            }
        }
        else if (src[0] == "+" && src[1] == "=") {
            tokens.push(token(src.shift(), TokenType.PLUSEQUAL, Line));
            src.shift();
        }
        else if (src[0] == "-" && src[1] == "=") {
            tokens.push(token(src.shift(), TokenType.MINUSEQUAL, Line));
            src.shift();
        }
        // HANDLE WHITESPACE
        else if (isskippable(src[0])) {
            src.shift();
        }
        // HANDLE BINARY OPERATORS
        else if (src[0] == "+" ||
            src[0] == "-" ||
            src[0] == "*" ||
            src[0] == "/" ||
            src[0] == "%") {
            tokens.push(token(src.shift(), TokenType.BinaryOperator, Line));
        } // Handle Conditional & Assignment Tokens
        // TODO:: HANDLE CHAR LITERALS
        else {
            // Handle numeric literals -> Integers
            if (isint(src[0])) {
                let num = "";
                while (src.length > 0 && isint(src[0])) {
                    num += src.shift();
                }
                // append new numeric token.
                tokens.push(token(num, TokenType.Number, Line));
            }
            // TODO:: HANDLE STRING LITERALS
            else if (src[0] == '"') {
                let str = "";
                while (src.length > 0 && src[0] != '"') {
                    str += src.shift();
                }
                tokens.push(token(str, TokenType.String, Line));
            }
            // Handle Identifier & Keyword Tokens.
            else if (isalpha(src[0]) || src[0] == "_") {
                let ident = "";
                while (src.length > 0) {
                    if (isalpha(src[0]) || isint(src[0]) || src[0] == "_") {
                        ident += src.shift();
                    }
                    else {
                        break;
                    }
                }
                // CHECK FOR RESERVED KEYWORDS
                const reserved = KEYWORDS[ident];
                // If value is not undefined then the identifier is
                // reconized keyword
                if (typeof reserved == "number") {
                    tokens.push(token(ident, reserved, Line));
                }
                else {
                    // Unreconized name must mean user defined symbol.
                    tokens.push(token(ident, TokenType.Identifier, Line));
                }
            }
            else if (isskippable(src[0])) {
                // Skip uneeded chars.
                src.shift();
            } // Handle unreconized characters.
            // TODO: Impliment better errors and error recovery.
            else {
                console.error("Unreconized character found in source: ", src[0].charCodeAt(0), src[0]);
                Deno.exit(1);
            }
        }
    }
    tokens.push({ type: TokenType.EOF, value: "EndOfFile", line: Line });
    return tokens;
}
exports.tokenize = tokenize;
//# sourceMappingURL=lexer.js.map