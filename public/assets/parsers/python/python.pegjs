// Based on https://github.com/python/cpython/blob/3.9/Grammar/Grammar, available under the Python Software Foundation License v2.
// Broad changes & additions made to actions in order to ensure compatibility with PEG.js
/* Python 3.7 Subset Grammar */
/* https://docs.python.org/3.7/reference/grammar.html */

{
  var indentLevel = 0
}

// ========== Grammar ===========

file_input = prog:(NEWLINE / stmt / comment)* ENDMARKER { return { type: "Program", body: prog.filter(x=>x!==null&x!="\n") } }
eval_input = testlist NEWLINE* ENDMARKER

decorator = AT namedexpr_test NEWLINE
decorators = decorator+
decorated = decorators (funcdef / ASYNC funcdef / classdef)

async_funcdef = ASYNC funcdef
funcdef = DEF NAME p:parameters (LAMBDA_ARROW t:test)? COLON tC:TYPE_COMMENT? b:func_body_suite {
    if(typeof t === "undefined") var t = "";
    return {
        type: "FunctionDefinition",
        parameters: p,
        typeType: t || tC,
        body: b
    }
}

parameters = OPEN_PAREN params:typedargslist? CLOSE_PAREN { 
  if(typeof params === "undefined") var params = [];
  if(params === null) params = [];
  return { 
    type: "Parameters", 
    params: params.filter(x=>x)
  }; 
}

arguments = head:argument tail:(COMMA TYPE_COMMENT? argument)* { 
    if(typeof tail === "undefined") {
        var tail = [];
    }
    console.log("ht", head, tail);
    return { type: "Arguments", arguments: [head].concat(tail.map(x=>x[2])) };
}
kwargs = DOUBLE_ASTERISKS tfpdef COMMA? TYPE_COMMENT?
args = STAR tfpdef?
kwonly_kwargs = (COMMA TYPE_COMMENT? argument)* (TYPE_COMMENT / (COMMA TYPE_COMMENT? kwargs?)?)
args_kwonly_kwargs = args kwonly_kwargs / kwargs
poskeyword_args_kwonly_kwargs = arguments ( TYPE_COMMENT / (COMMA TYPE_COMMENT? args_kwonly_kwargs?)?)
typedargslist_no_posonly  = poskeyword_args_kwonly_kwargs / args_kwonly_kwargs
typedarglist = (arguments COMMA TYPE_COMMENT? SLASH (COMMA (TYPE_COMMENT? typedargslist_no_posonly)?)?)/(typedargslist_no_posonly)
typedargslist = t:typedarglist { return t; }
     
tfpdef = n:NAME t:(COLON test)? {
    if(t && t.length > 0) return { type: "TypedArgument", typeType: t[1], name: n };
    else return n;
}

vararglist_no_posonly = poskeyword_args_kwonly_kwargs / args_kwonly_kwargs
varargslist = arguments COMMA SLASH (COMMA((vararglist_no_posonly))?)? / (vararglist_no_posonly)

vfpdef = NAME

stmt = s:(simple_stmt / compound_stmt) com:comment? { if(com) return { type: "CommentedStatement", comment:com, statement: s }; else return s; }
simple_stmt = head:small_stmt tail:(SEMICOLON small_stmt)* (SEMICOLON)? NEWLINE { 
	if(tail && tail.length) return { type: "StatementList", list: [head].concat(tail.map(x=>x[1])) }; 
    else return head 
}
small_stmt = s:(del_stmt / pass_stmt / flow_stmt /
             import_stmt / global_stmt / nonlocal_stmt / assert_stmt / exec_stmt / print_stmt / expr_stmt) { return s; }

expr_stmt = expr:testlist_star_expr asgn:(annassign / augassign (yield_expr/testlist) /
                     asgn:( ass:(EQUALS y:(yield_expr/testlist_star_expr) { return y; })+ t:TYPE_COMMENT? { if(t) return { type:"TypedAssignment", type: t, assignment: ass }; else return ass;  })? ) {
                     if(asgn)
                     return {
                         type: "AssignmentExpressionStatement",
                         expr: expr,
                         asgn: asgn
                     }
                     else return {
                         type: "ExpressionStatement",
                         expr: expr
                     }
                     }
annassign = COLON test (EQUALS (yield_expr/testlist_star_expr))?
testlist_star_expr = head:(test/star_expr) tail:(COMMA (test/star_expr))* COMMA? {
    if(tail && tail.length > 0) return {
        type: "TestList",
        list: [head].concat(tail.map(x=>x[1]))
    };
	else return head;
}
augassign = o:(PLUSEQUAL / MINEQUAL / STAREQUAL / ATEQUAL / SLASHEQUAL / PERCENTEQUAL / AMPEREQUAL / VBAREQUAL / CIRCUMFLEXEQUAL /
            LEFTSHIFTEQUAL / RIGHTSHIFTEQUAL / DOUBLESTAREQUAL / DOUBLESLASHEQUAL) { return o;  }
            
// For normal and annotated assignments, additional restrictions enforced by the interpreter
del_stmt = DEL e:exprlist { return { type: "DelStatement", exprlist: e } }
pass_stmt = PASS { return { type: "PassStatement" } }
flow_stmt = s:(break_stmt / continue_stmt / return_stmt / raise_stmt / yield_stmt) { return s; }
break_stmt = BREAK { return { type: "BreakStatement" } }
continue_stmt = CONTINUE { return { type: "ContinueStatement" } }
exec_stmt = EXEC expr:STRING ctx:(IN testlist_star_expr)? { return { type: "ExecStatement", value: expr, ctx: ctx?ctx[1]:ctx } }
return_stmt = RETURN expr:testlist_star_expr? { return { type:"ReturnStatement", value: expr }; }
print_stmt = PRINT expr:testlist_star_expr { return { type:"PrintStatement", value: expr }; }
yield_stmt = y:yield_expr { return { type: "YieldStatement", yielded: y } }
raise_stmt = RAISE (test (FROM test)?)?

import_stmt = t:(import_name / import_from) { return t; }
import_name = IMPORT i:dotted_as_names { return {type: "ImportNameStatement", imports: i}; }
// note below: the (DOT / ELLIPSIS) is necessary because ELLIPSIS is tokenized as ELLIPSIS
import_from = FROM ellips:(ELLIPSIS / DOT / DOUBLEDOT)* name:dotted_name? IMPORT
    from:(import_as_names / STAR / OPEN_PAREN import_as_names CLOSE_PAREN) { 
    if(from.constructor == Array && from.length == 3) from = from[1];
    return {
        type: "ImportFromStatement", 
        name: name,
        imprt: from,
        ellips: ellips.join("")
    } }
import_as_name = head:NAME tail:(AS NAME)? { if(!tail) return head; else { return { type:"DottedName", head: head, tail: tail.map(x=>x[1]) } }  }
dotted_as_name = head:dotted_name as:(AS NAME)? { if(!as || !as[0]) return head; else return { type: "AsName", target: head, as: as} }
import_as_names = head:import_as_name tail:(COMMA import_as_name)* COMMA? { return [head].concat(tail.map(x=>x[1]));  }
dotted_as_names = head:dotted_as_name tail:(COMMA dotted_as_name)* { return [head].concat(tail.map(x=>x[1]));  }
dotted_name = head:NAME tail:(DOT NAME)* { if(tail.length == 0) return head; else { return { type:"DottedName", head: head, tail: tail.map(x=>x[1]) } } }

global_stmt = GLOBAL NAME (COMMA NAME)*
nonlocal_stmt = NONLOCAL NAME (COMMA NAME)*
assert_stmt = ASSERT test (COMMA test)?

compound_stmt = if_stmt / while_stmt / for_stmt / try_stmt / with_stmt / funcdef / classdef / decorated / async_stmt
async_stmt = ASYNC (funcdef / with_stmt / for_stmt)
if_stmt = IF namedexpr_test COLON suite (ELIF namedexpr_test COLON suite)* (ELSE COLON suite)?
while_stmt = WHILE namedexpr_test COLON suite (ELSE COLON suite)?
for_stmt = FOR exprlist IN testlist COLON TYPE_COMMENT? suite (ELSE COLON suite)?
try_stmt = TRY COLON s:suite
           e:(x:(except_clause COLON suite)+
            l:(ELSE COLON suite)?
            f:(FINALLY COLON suite)? 
            { return { type: "CatchBlock", finallyBlock: f&&f[2], elseBlock: l&&l[2], exceptBlocks: x.map(x=>x[2])  }}
            /
           FINALLY COLON f:suite { return { type: "CatchBlock", finallyBlock: f };} ) {
               return {
               	type: "TryStatement",
                body: s,
                catchBlock: e
               }
           }

with_stmt = WITH w:(with_item_list / with_item) COLON s:suite {
		return {type: "WithStatement", body: s, withItem: w};
	}
with_item_list = OPEN_PAREN !{console.log("fe")} head:with_item !{console.log(head)}  tail:(COMMA with_item )+  &{console.log("with_item_list",head,tail); return true;} CLOSE_PAREN
with_item = v:test a:(AS expr)? { 
		if(a && a.length > 0) return { type: "WithAsItem", value: v, as: a[1] } 
        else return { type: "WithItem", value: v };
    }

// NB compile.c makes sure that the default except clause is last
except_clause = EXCEPT (test (AS NAME)?)? (COMMA (test (AS NAME)?)?)*
suite = simp:simple_stmt / NEWLINE INDENT body:(SAMEDENT stmt)+ DEDENT {
    if(typeof simp !== "undefined") return simp;
    else return {
        type: "Suite",
        body: body
    }
}

namedexpr_test = t:test n:(COLONEQUAL test)? { 
    if(n && n.length > 0) return {type: "NamedExpression", expr: t, value: n[1]}
    else return t;
  }
test = or:or_test conditional:(IF __ or_test ELSE test)? {
	if(typeof conditional !== "undefined" && conditional != null)
      return { 
      	type: "ConditionalExpression", 
        condition: conditional[2],
        value: or,
        alternate: conditional[5] 
      };
  
  return or
}
  / lambdef:lambdef
{
      return {
        type: "LambdaExpression",
        lambda: lambdef
      };
}
test_nocond = or_test / lambdef_nocond
lambdef = LAMBDA varargslist? COLON test
lambdef_nocond = LAMBDA varargslist? COLON test_nocond
or_test = head:and_test tail:(OR and_test)* {
    if(tail == null || tail.length == 0) return head;
    else return {
        type: "Comparison",
        left: head,
        operator: "or",
        right: tail.map(x=>x[1])
    }
}
and_test = head:not_test tail:(AND not_test)* {
    if(tail == null || tail.length == 0) return head;
    else return {
        type: "Comparison",
        left: head,
        operator: "or",
        right: tail.map(x=>x[1])
    }
}
not_test = NOT head:not_test {
return {
    type: "UnaryOperator",
    operator: "not ",
    value: head
}
} / c:comparison { return c } 

comparison = head:expr tail:(comp_op expr)* {
    if(tail == null || tail.length == 0) return head;
    else return {
    	type: "Comparison",
        left: head,
        right: tail.map(x=> ({
          operator: x[0],
          right: x[1]
        }))
      };
}
// <> isn't actually a valid comparison operator in Python. It's here for the
// sake of a __future__ import described in PEP 401 (which really works :-)
comp_op = l:(LESS/GREATER/DOUBLE_EQUALS/GREATEREQUAL/LESSEQUAL/NOTEQUAL_EXCEL/NOTEQUAL/IN/NOT IN/IS/IS NOT) {
    return l.join("");
}
star_expr = STAR expr:expr { return { type: "StarExpression", expr: expr }; }
expr = head:xor_expr tail:(VBAR xor_expr)* {
    if(tail == null || tail.length == 0) return head;
    else return {
        type: "OperatorExpression",
        left: head,
        right: tail.map(x=>({ type: "OperatorExpressionTail", operator: "|", value: x[1]}))
    }
}
xor_expr = head:and_expr tail:(CIRCUMFLEX and_expr)* {
    if(tail == null || tail.length == 0) return head;
    else return {
        type: "OperatorExpression",
        left: left,
        right: tail.map(x=>({ type: "OperatorExpressionTail", operator: "^", value: x[1]}))
    }
}
and_expr = head:shift_expr tail:(AMPER shift_expr)* {
    if(tail == null || tail.length == 0) return head;
    else return {
        type: "OperatorExpression",
        left: head,
        right: tail.map(x=>({ type: "OperatorExpressionTail", operator: "&", value: x[1]}))
    }
}
shift_expr = head:arith_expr tail:(( LEFTSHIFT / RIGHTSHIFT) arith_expr)* {
    if(tail == null || tail.length == 0) return head;
    else return {
        type: "OperatorExpression",
        left: head,
        right: tail.map(x=>({ type: "OperatorExpressionTail", operator: x[0], value: x[1]}))
    }
}
arith_expr = head:term tail:((PLUS/MINUS) term)* {
    if(tail == null || tail.length == 0) return head;
    else return {
        type: "OperatorExpression",
        left: head,
        right: tail.map(x=>({ type: "OperatorExpressionTail", operator: x[0], value: x[1]}))
    }
}
term = head:factor tail:((STAR/AT/SLASH/PERCENT/DOUBLESLASH) factor)* {
    if(tail == null || tail.length == 0) return head;
    else return {
        type: "OperatorExpression",
        left: head,
        right: tail.map(x=>({ type: "OperatorExpressionTail", operator: x[0], value: x[1]}))
    }
}
factor = op:(PLUS/MINUS/TILDE) head:factor {
    return {
        type: "UnaryOperator",
        left: head,
        value: op
    }
} / p:power { return p; }
power = head:atom_expr tail:(DOUBLE_ASTERISKS factor)? {
    if(tail == null || tail.length == 0) return head;
    else return {
        type: "OperatorExpression",
        left: head,
        right: tail.map(x=>({ type: "OperatorExpressionTail", operator: x[0], value: x[1]}))
    }
}
atom_expr = a:AWAIT? l:atom t:trailer* {
     var ty = a ? "AsyncValue" : "Value";
     if(t && t.length > 0) return { type: ty,value: l,rest: t};
     else return {type: ty, value: l};
}
atom = l:(OPEN_PAREN (yield_expr/testlist_comp)? CLOSE_PAREN /
       OPEN_SQUARE_BRACKET testlist_comp? CLOSE_SQUARE_BRACKET /
       OPEN_CURLY_BRACKET dictorsetmaker? CLOSE_CURLY_BRACKET /
       NAME / NUMBER / STRING+ / ELLIPSIS / NONE_LITERAL / TRUE /FALSE) {
           return {
           	  type: "Atom",
              value: l
       	   }
       }
testlist_comp = (namedexpr_test/star_expr) ( comp_for / (COMMA (namedexpr_test/star_expr))* COMMA? )
trailer = OPEN_PAREN arglist? CLOSE_PAREN / OPEN_SQUARE_BRACKET subscriptlist CLOSE_SQUARE_BRACKET / DOT NAME
subscriptlist = subscript (COMMA subscript)* COMMA?
subscript = test / test? COLON test? sliceop?
sliceop = COLON test?
exprlist = (expr/star_expr) (COMMA (expr/star_expr))* COMMA?
testlist = test (COMMA test)* COMMA?
dictorsetmaker = ( ((test COLON test / DOUBLE_ASTERISKS expr)
                   (comp_for / (COMMA (test COLON test / DOUBLE_ASTERISKS expr))* COMMA?)) /
                  ((test / star_expr)
                   (comp_for / (COMMA (test / star_expr))* COMMA?)) )

classdef = CLASS NAME (OPEN_PAREN arglist? CLOSE_PAREN)? COLON suite

arglist = argument (COMMA argument)*  COMMA?

// The reason that keywords are test nodes instead of NAME is that using NAME
// results in an ambiguity. ast.c makes sure it's a NAME.
// "test EQUALS test" is really "keyword EQUALS test", but we have no such token.
// These need to be in a single rule to avoid grammar that is ambiguous
// to our LL(1) parser. Even though 'test' includes '*expr' in star_expr,
// we explicitly match STAR here, too, to give it proper precedence.
// Illegal combinations and orderings are blocked in ast.c:
// multiple (test comp_for) arguments are blocked; keyword unpackings
// that precede iterable unpackings are blocked; etc.
argument = a:(left:test op:COLONEQUAL right:test { return { type: "ExpressionAssignmentDefaultValueArg", argument: left, defaultVal: right }; } /
		    left:test compFor:comp_for? { 
				if(compFor) return { type: "ForInArgument", arg: left, compFor: compFor };
                else return { type: "Argument", arg: left}; } /
            left:test op:EQUALS right:test { return { type: "DefaultValueArg", argument: left, defaultVal: right }; } /
            op:DOUBLE_ASTERISKS left:tfpdef { return {type: "KwVarArg", argument: left}; } /
            op:STAR left:tfpdef { return {type: "VarArg", argument: left}; } /
            STAR { return { type: "PositionOnlyArgsMarkerArg" }; }) t:(COLON test)? d:(EQUALS test)? {
               var result = a;
               if(d && d.length > 0) return { type: "DefaultArgument", default: d[1], arg: result }; 
               if(t && t.length > 0) return { type: "TypedArgument", type: t[1], arg: result };
               
               return result;
              } 
            

comp_iter = t:comp_for { return t; } / t:comp_if { return t; }
sync_comp_for = FOR exprlist IN or_test comp_iter?
comp_for = ASYNC? sync_comp_for
comp_if = IF __ test_nocond comp_iter?

yield_expr = YIELD yield_arg?
yield_arg = FROM test / testlist_star_expr

comment = c:COMMENT { return { type: "Comment", comment: c }; }

// the TYPE_COMMENT in suites is only parsed for funcdefs,
// but can't go elsewhere due to ambiguity
func_body_suite = simp:simple_stmt / NEWLINE (typeType:TYPE_COMMENT NEWLINE)? INDENT body:(SAMEDENT stmt)+ DEDENT 
{
    if(typeof simp !== "undefined") return simp;
    else return {
        type: "Suite",
        body: body
    }
}

func_type_input = func_type NEWLINE* ENDMARKER
func_type = OPEN_PAREN typelist? CLOSE_PAREN RARROW test
// typelist is a modified typedargslist (see above)
typelist = (test (COMMA test)* (COMMA
       (STAR test? (COMMA test)* (COMMA DOUBLE_ASTERISKS test)? / DOUBLE_ASTERISKS test)?)?
     /  STAR test? (COMMA test)* (COMMA DOUBLE_ASTERISKS test)? / DOUBLE_ASTERISKS test)
     
     
// =========== Token ============


SAMEDENT = i:tabs &{
      return i.length === indentLevel;
    } { return ""; }

INDENT
= &(t: tabs &{
      var newIndent = t.join("").length/2;
      var oldIndent = indentLevel;
      indentLevel = newIndent; 
      return newIndent > oldIndent;
    } { return ""; })

DEDENT
= &(t:tabs &{
	  var newIndent = t.join("").length/2;
      var oldIndent = indentLevel;
      indentLevel = newIndent; 
      return true;
    } { return ""; })
    
tabs
  = t:tab* { return t; }

tab
  = t:("\t" / "  ") { return t; }

STRING
  = l:(DOUBLE_QUOTE stringitem* DOUBLE_QUOTE / SINGLE_QUOTE stringitem* SINGLE_QUOTE) {
      var val = l[0] + l[1].join("") + l[l.length - 1];
      return {
          type: "StringLiteral",
          value: val
      };
  }

stringitem
  = l:(stringchar / escapeseq) {
      return l;
  }

stringchar = l:[^\\"'] {
    return l;
}

escapeseq
  = l:("\\" [\\'"abfnrtv]) { return l.join(""); }

NUMBER
  = l:('-'? ('0o' / '0x')? [0-9]+) {
      return {
          type: "NumericLiteral",
          value: (l[0] || "") + (l[1] || "") + l[2].join("")
      }
  }

NEWLINE
  = com:comment? ('\r\n' / '\n' / '\r') { if(com) return com; else return "\n"; }

COMMENT = '#' com:[^\n]+ { return com.join(""); }

__
  = [ ]+

_
  = [ ]*

EOF
  = !.
  
ENDMARKER = EOF


TYPE_COMMENT = COMMENT

AWAIT = "await"

EOL
  = "\r\n" / "\n" / "\r"
  AT = ' '* '@' ' '* { return '@' }
ASYNC = _ "async" _ { return "async" }
DEF = "def" __ { return "def" }
LAMBDA_ARROW = "->" { return "->" }
COLON = ' '* ":" ' '* { return ":" }
OPEN_PAREN = ' '* "(" ' '* { return "(" }
CLOSE_PAREN = ' '* ")" ' '* { return ")" }
EQUALS = ' '* "=" ' '* { return "=" }
COMMA = ' '* "," ' '* { return "," }
SLASH = ' '* "/" ' '* { return "/" }
STAR = ' '* "*" ' '* { return "*" }
DOUBLE_ASTERISKS = ' '* "**" ' '* { return "**" }
SEMICOLON = ' '* ";" ' '* { return ";" }
PLUSEQUAL = ' '* "+=" ' '* { return "+=" }
MINEQUAL = ' '* "-=" ' '* { return "-=" }
STAREQUAL = ' '* "*=" ' '* { return "*=" }
ATEQUAL = ' '* "@=" ' '* { return "@=" }
SLASHEQUAL = ' '* "/=" ' '* { return "/=" }
PERCENTEQUAL = ' '* "%=" ' '* { return "%=" }
AMPEREQUAL = ' '* "&=" ' '* { return "&=" }
VBAREQUAL = ' '* "|=" ' '* { return "|=" }
CIRCUMFLEXEQUAL = ' '* "^=" ' '* { return "^=" }
LEFTSHIFTEQUAL = ' '* "<<=" ' '* { return "<<=" }
RIGHTSHIFTEQUAL = ' '* ">>=" ' '* { return ">>=" }
DOUBLESTAREQUAL = ' '* "**=" ' '* { return "**=" }
DOUBLESLASHEQUAL = ' '* "//=" ' '* { return "//=" }
EXEC = _ "exec" _ { return "exec"; }
DEL = _ "del" _ { return "del" }
PASS =  _ "pass" _ { return "pass" }
BREAK = _ "break" _ { return "break" }
CONTINUE = "continue" { return "continue" }
RETURN = _ "return" _ { return "return" }
RAISE = _ "raise" _ { return "raise" }
FROM = _ "from" _ { return "from" }
IMPORT = _ "import" _ { return "import" }
DOT = _ "." _ { return "." }
DOUBLEDOT = _ '..' _ { return ".." }
ELLIPSIS = _ "..." _ { return "..." }
AS = _ "as" _ { return "as" }
GLOBAL = _ "global" _ { return "global" }
NONLOCAL = _ "nonlocal" _ { return "nonlocal" }
ASSERT = _ "assert" _ { return "assert" }
IF = _ "if" _ { return "if" }
ELIF = _ "elif" _ { return "elif" }
ELSE = _ "else" _ { return "else" }
WHILE = "while" ' '* { return "while" }
PRINT = "print" ' '* { return "print" }
FOR = "for" ' '* { return "for" }
IN = ' '* "in" ' '* { return "in" }
TRY = "try" ' '* { return "try" }
FINALLY = "finally" ' '* { return "finally" }
WITH = "with" ' '* { return "with" }
EXCEPT = "except" { return "except" }
COLONEQUAL = ":=" { return ":=" }
LAMBDA = "lambda" { return "lambda" }
OR = ' '* "or" ' '* { return "or" }
AND = ' '* "and" ' '* { return "and" }
NOT = ' '* "not" ' '* { return "not" }
LESS = ' '* "<" ' '* { return "<" }
GREATER = ' '* ">" ' '* { return ">" }
DOUBLE_EQUALS = ' '* "==" ' '* { return "==" }
GREATEREQUAL = ' '* ">=" ' '* { return ">=" }
LESSEQUAL = ' '* "<=" ' '* { return "<=" }
NOTEQUAL_EXCEL = ' '* "<>" ' '* { return "<>" }
NOTEQUAL = ' '* "!=" ' '* { return "!=" }
IS = ' '* "is" ' '* { return "is" }
VBAR = ' '* "|" ' '* { return "|" }
CIRCUMFLEX = ' '* "^" ' '* { return "^" }
AMPER = ' '* "&" ' '* { return "&" }
LEFTSHIFT = ' '* "<<" ' '* { return "<<" }
RIGHTSHIFT = ' '* ">>" ' '* { return ">>" }
PLUS = ' '* "+" ' '* { return "+" }
MINUS = ' '* "-" ' '* { return "-" }
PERCENT = ' '* "%" ' '* { return "%" }
DOUBLESLASH = ' '* "//" ' '* { return "//" }
TILDE = ' '* "~" ' '* { return "~" }
OPEN_SQUARE_BRACKET = ' '* "[" ' '* { return "[" }
CLOSE_SQUARE_BRACKET = ' '* "]" ' '* { return "]" }
OPEN_CURLY_BRACKET = ' '* "{" ' '* { return "{}".substring(0,1); }
CLOSE_CURLY_BRACKET = ' '* "}" ' '* { return "{}".substring(1,2); }
NONE_LITERAL = ' '* "None" ' '* { return "None" }
TRUE = ' '* "True" ' '* { return "True" }
FALSE = ' '* "False" ' '* { return "False" }
CLASS = ' '* "class" ' '* { return "class" }
YIELD = ' '* "yield" ' '* { return "yield" }
RARROW = ' '* "->" ' '* { return "->" }
DOUBLE_QUOTE = ' '* '"' ' '* { return '"'; }
SINGLE_QUOTE = ' '* "'" ' '* { return "'"; }

NAME
  = _ head:[a-zA-Z_] tail:[a-zA-Z0-9_]* _
    &{
    var name = head + tail.join("");
    var reserved = ["and","as","assert","break","class","continue","def","del","elif",
    				"else","except","finally","for","from","global","if","import","in","is",
                    "lambda","None","nonlocal","not","or","pass","raise","return","try","while",
                    "with","yield","False","True"];
    if(reserved.indexOf(name) == -1) return true;
    else return false;
    }
    { return {
    	type: "Identifier",
        value: head + tail.join("")
      }; 
    }