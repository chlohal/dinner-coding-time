/* Python 3.7 Subset Grammar */
/* https://docs.python.org/3.7/reference/grammar.html */

{
  var indentLevel = 0
}

// ========== Grammar ===========

file_input = (NEWLINE / stmt COMMENT?)* ENDMARKER
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
    return { type: "Arguments", arguments: [head].concat(tail.map(x=>x[2])).filter(x=>x.constructor == Object) };
}
kwargs = DOUBLE_ASTERISKS tfpdef COMMA? TYPE_COMMENT?
args = STAR tfpdef?
kwonly_kwargs = (COMMA TYPE_COMMENT? argument)* (TYPE_COMMENT / (COMMA TYPE_COMMENT? kwargs?)?)
args_kwonly_kwargs = args kwonly_kwargs / kwargs
poskeyword_args_kwonly_kwargs = arguments ( TYPE_COMMENT / (COMMA TYPE_COMMENT? args_kwonly_kwargs?)?)
typedargslist_no_posonly  = poskeyword_args_kwonly_kwargs / args_kwonly_kwargs
typedarglist = (arguments COMMA TYPE_COMMENT? SLASH (COMMA (TYPE_COMMENT? typedargslist_no_posonly)?)?)/(typedargslist_no_posonly)
typedargslist = t:typedarglist { return t; }
     
tfpdef = n:NAME (COLON t:test)? {
	if(typeof t === "undefined") var t = null;
    if(typeof d === "undefined") var d = null;
    return { type: "TypedArgument", typeType: t, name: n, initial: d };
}

vararglist_no_posonly = poskeyword_args_kwonly_kwargs / args_kwonly_kwargs
varargslist = arguments COMMA SLASH (COMMA((vararglist_no_posonly))?)? / (vararglist_no_posonly)

vfpdef = NAME

stmt = s:(simple_stmt / compound_stmt) COMMENT? { return s; }
simple_stmt = small_stmt (SEMICOLON small_stmt)* (SEMICOLON)? NEWLINE
small_stmt = (del_stmt / pass_stmt / flow_stmt /
             import_stmt / global_stmt / nonlocal_stmt / assert_stmt / exec_stmt / print_stmt / expr_stmt)
expr_stmt = testlist_star_expr (annassign / augassign (yield_expr/testlist) /
                     ((EQUALS (yield_expr/testlist_star_expr))+ TYPE_COMMENT?)? )
annassign = COLON test (EQUALS (yield_expr/testlist_star_expr))?
testlist_star_expr = (test/star_expr) (COMMA (test/star_expr))* COMMA?
augassign = (PLUSEQUAL / MINEQUAL / STAREQUAL / ATEQUAL / SLASHEQUAL / PERCENTEQUAL / AMPEREQUAL / VBAREQUAL / CIRCUMFLEXEQUAL /
            LEFTSHIFTEQUAL / RIGHTSHIFTEQUAL / DOUBLESTAREQUAL / DOUBLESLASHEQUAL)
// For normal and annotated assignments, additional restrictions enforced by the interpreter
del_stmt = DEL e:exprlist { return { type: "DelStatement", exprlist: e } }
pass_stmt = PASS { return { type: "PassStatement" } }
flow_stmt = s:(break_stmt / continue_stmt / return_stmt / raise_stmt / yield_stmt) { return s; }
break_stmt = BREAK { return { type: "BreakStatement" } }
continue_stmt = CONTINUE
exec_stmt = EXEC STRING (IN testlist_star_expr)?
return_stmt = RETURN testlist_star_expr?
print_stmt = PRINT testlist_star_expr
yield_stmt = yield_expr
raise_stmt = RAISE (test (FROM test)?)?

import_stmt = import_name / import_from
import_name = IMPORT dotted_as_names
// note below: the (DOT / ELLIPSIS) is necessary because ELLIPSIS is tokenized as ELLIPSIS
import_from = FROM (ELLIPSIS / DOT / DOUBLEDOT)* (dotted_name)? IMPORT
    (import_as_names / STAR / OPEN_PAREN import_as_names CLOSE_PAREN)
import_as_name = NAME (AS NAME)?
dotted_as_name = dotted_name (AS NAME)?
import_as_names = import_as_name (COMMA import_as_name)* COMMA?
dotted_as_names = dotted_as_name (COMMA dotted_as_name)*
dotted_name = NAME (DOT NAME)*

global_stmt = GLOBAL NAME (COMMA NAME)*
nonlocal_stmt = NONLOCAL NAME (COMMA NAME)*
assert_stmt = ASSERT test (COMMA test)?

compound_stmt = if_stmt / while_stmt / for_stmt / try_stmt / with_stmt / funcdef / classdef / decorated / async_stmt
async_stmt = ASYNC (funcdef / with_stmt / for_stmt)
if_stmt = IF namedexpr_test COLON suite (ELIF namedexpr_test COLON suite)* (ELSE COLON suite)?
while_stmt = WHILE namedexpr_test COLON suite (ELSE COLON suite)?
for_stmt = FOR exprlist IN testlist COLON TYPE_COMMENT? suite (ELSE COLON suite)?
try_stmt = (TRY COLON suite
           ((except_clause COLON suite)+
            (ELSE COLON suite)?
            (FINALLY COLON suite)? /
           FINALLY COLON suite))
with_stmt = WITH (OPEN_PAREN (with_item COMMA)+ with_item CLOSE_PAREN / with_item) COLON TYPE_COMMENT? suite
with_item = test (AS expr)?
// NB compile.c makes sure that the default except clause is last
except_clause = EXCEPT (test (AS NAME)?)? (COMMA (test (AS NAME)?)?)*
suite = simp:simple_stmt / NEWLINE INDENT body:(SAMEDENT stmt)+ DEDENT {
    if(typeof simp !== "undefined") return simp;
    else return {
        type: "Suite",
        body: body
    }
}

namedexpr_test = test (COLONEQUAL test)?
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
atom_expr = await:AWAIT? l:atom t:trailer* {
     return {
          type: "Value",
          value: l,
          rest: t
     };
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

classdef = CLASS NAME (OPEN_PAREN typedargslist? CLOSE_PAREN)? COLON suite

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
argument = (left:test op:COLONEQUAL right:test { return { type: "ExpressionAssignmentDefaultValueArg", argument: left, defaultVal: right }; } /
			t:tfpdef { return t; }/
		    left:test compFor:comp_for? { 
				if(compFor) return { type: "ForInArgument", arg: left, compFor: compFor };
                else return { type: "Argument", arg: left}; } /
            left:test op:EQUALS right:test { return { type: "DefaultValueArg", argument: left, defaultVal: right }; } /
            op:DOUBLE_ASTERISKS left:tfpdef { return {type: "KwVarArg", argument: left}; } /
            op:STAR left:tfpdef { return {type: "VarArg", argument: left}; } /
            STAR { return { type: "PositionOnlyArgsMarkerArg" }; } ) (EQUALS test)?
            

comp_iter = comp_for / comp_if
sync_comp_for = FOR exprlist IN or_test comp_iter?
comp_for = ASYNC? sync_comp_for
comp_if = IF __ test_nocond comp_iter?

// not used in grammar, but may appear in "node" passed from Parser to Compiler
encoding_decl = NAME

yield_expr = YIELD yield_arg?
yield_arg = FROM test / testlist_star_expr

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
  = COMMENT? ('\r\n' / '\n' / '\r')

COMMENT = '#' [^\n]+ { return ""; }

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