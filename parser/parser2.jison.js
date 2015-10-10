
/* description: Parses and executes mathematical expressions. */

/* lexical grammar */
%lex
%%

\s+                   /* skip whitespace */
"/*"(.|\r|\n)*?"*/"   /* ignore newlines */
^"#".+                /* ignore comments */

[0-9]+("."[0-9]+)?\b                    return 'NUMBER'
/* las variables en mayusculas */
"$"[A-Z]+[A-Z0-9]*\b                    return 'VAR'
"$_"[A-Z]+[A-Z0-9]*\b                   return 'VAR'
"<"                                     return '<'
">"                                     return '>'
"=="                                    return '=='
"!="                                    return '!='
"="                                     return '='
"if"                                    return 'IF'
"endif"                                 return 'ENDIF'
"else"                                  return 'ELSE'
"while"                                 return 'WHILE'
"loop"                                  return 'LOOP'
"mover"                                 return 'MOVER'
"sensor"                                return 'SENSOR'
"arriba"|"abajo"|"izquierda"|"derecha"  return 'DIRECCION'
"true"|"false"                          return 'CONST_BOOL'


"$"                     return '$'
","                     return ','
":"                     return ':'
"*"                     return '*'
"/"                     return '/'
"-"                     return '-'
"+"                     return '+'
"^"                     return '^'
"("                     return '('
")"                     return ')'
"PI"                    return 'PI'
"E"                     return 'E'
<<EOF>>                 return 'EOF'
.                       return 'INVALID'

/lex

/* operator associations and precedence */

%left '+' '-'
%left '*' '/'
%left '^'
%right '!'
%right '%'
%left UMINUS

%start program

%% /* language grammar */

program
    : statementsList EOF
        { $$ = new Node(new Program(), [$1]); return $$; }
    ;

statement
    : IF boolExp ':' statementsList ENDIF
        { $$ = new Node(new If($4), $2); }
    | IF boolExp ':' statementsList ELSE statementsList ENDIF
        { $$ = new Node(new IfElse($4, $6), [$2]); }
    | WHILE boolExp ':' statementsList LOOP
        { $$ = new Node(new While($4), $2); }
    | MOVER mathExp ',' mathExp ',' mathExp
        { $$ = new Node(new Mover(), [$2, $4, $6]); }
    | SENSOR mathExp
        { $$ = new Node(new Sensor($2), []); }
    | variable_declaration
        { $$ = $1; }
    ;

/* hay que cambiar los elementos que se utilizan */
variable_declaration
    : VAR '=' mathExp
        { $$ = new Node(new VarDefintion($1), [$3]); }
    | VAR '=' boolExp
        { $$ = new Node(new VarDefintion($1), [$3]); }
    ;

statementsList
    : statementsList statement
        { $1.addChild($2); $$ = $1; }
    |
        { $$ = new Node(new StatementsList(), []); }
    ;

boolExp
    : mathBoolExp '==' mathBoolExp
        {$$ = new Node(new Equal(), [$1, $3]); }
    | mathBoolExp '!=' mathBoolExp
        {$$ = new Node(new NotEqual(), [$1, $3]); }
    /* Deberia contener solo el grater y el lower y GE y LE */
    | mathBoolExp
        {$$ = $1;}
    | CONST_BOOL
        { $$ = true; }
    ;


mathBoolExp
    : mathExp '<' mathExp
        {$$ = new Node(new Lower(), [$1, $3]); }
    | mathExp '>' mathExp
        {$$ = new Node(new Grater(), [$1, $3]); }
    /* Es exactamente lo mismo el igual para los booleanos y para matematica.. aca igual nos aseguramos que sea el mismo tipo siempre */
    | mathExp '==' mathExp
        {$$ = new Node(new Equal(), [$1, $3]); }
    | mathExp '!=' mathExp
        {$$ = new Node(new NotEqual(), [$1, $3]); }
    ;

mathExp
    : mathExp '+' mathExp
       { $$ = new Node(new Sum(), [$1, $3]); }
    | mathExp '-' mathExp
        { $$ = new Node(new Sub(), [$1, $3]); }
    | mathExp '*' mathExp
        { $$ = new Node(new Mult(), [$1, $3]); }
    | mathExp '/' mathExp
        { $$ = new Node(new Div(), [$1, $3] ); }
    | mathExp '^' mathExp
        { $$ = Math.pow($1, $3); }
    | '-' mathExp %prec UMINUS
        {$$ = -$2;}
    | '(' mathExp ')'
        {$$ = $2;}
    | VAR
        { $$ = new Node(new VarUsage($1), []); }
    | NUMBER
        { $$ = new Node(new Number($1), []); }
    | E
        { $$ = new Node(new Number(Math.E), []); }
    | PI
        { $$ = new Node(new Number(Math.PI), []); }
    ;
%%

function Program() {
  this.objectName = "Program";
  this.requiresNewContext = false;
  this.createsContext = function() {
    return this.requiresNewContext;
  }

  this.eval = function(argumentsArr, contextManager, executionStack) {
    return "PROGRAMEND"
  }
}

function StatementsList() {
    this.objectName = "StatementsList";
    this.requiresNewContext = true;
    this.createsContext = function() {
      return this.requiresNewContext;
    }

    this.eval = function(argumentsArr, contextManager, executionStack) {
        return "STATEMENTSEND";
    }
}

function If(execution) {
  this.objectName = "If";
  this.requiresNewContext = false;
  this.createsContext = function() {
    return this.requiresNewContext;
  }

  this.execution = execution;
  this.eval = function(argumentsArr, contextManager, executionStack) {
    console.log("Excecuting IF");
    if(argumentsArr[0]) {
      executionStack.push({ node : execution, childrenLeft : execution.getChildren().length })
    }
    return "IFEND"
  }
}

function IfElse(firstExecution, secondExecution) {
  this.objectName = "IfElse";
  this.requiresNewContext = false;
  this.createsContext = function() {
    return this.requiresNewContext;
  }

  this.firstExecution = firstExecution;
  this.secondExecution = secondExecution;
  this.eval = function(argumentsArr, contextManager, executionStack) {
    console.log("Excecuting IfElse");
    if(argumentsArr[0]) {
      this.executionStack.push({ node : firstExecution, childrenLeft : firstExecution.getChildren().length })
    }
    else {
      this.executionStack.push({ node : secondExecution, childrenLeft : secondExecution.getChildren().length })
    }
    return "IFELSEEND"
  }
}

function While(condition, statements) {
  this.objectName = "While";
  this.requiresNewContext = false;
  this.createsContext = function() {
    return this.requiresNewContext;
  }

  this.condition = condition;
  this.statements = statements;
  this.eval = function(argumentsArr, contextManager, executionStack) {
    if(argumentsArr[0]) {
        this.executionStack.push({ node : statements, childrenLeft : statements.getChildren().length })
        return "WHILEND"
    }
    console.log("While ended");
  }
}

function Mover() {
  this.objectName = "Mover";
  this.requiresNewContext = false;
  this.createsContext = function() {
    return this.requiresNewContext;
  }

  this.eval = function(argumentsArr, contextManager, executionStack) {
    contextManager.pushInstruction({
      action : 'move',
      leftMotor : argumentsArr[0],
      rightMotor : argumentsArr[1],
      duration : argumentsArr[2]
    });
    return "MOVE";
  }
}

function Sensor(number) {
  this.objectName = "Sensor";
  this.requiresNewContext = false;
  this.createsContext = function() {
    return this.requiresNewContext;
  }

  this.number = number;
  this.eval = function(argumentsArr, contextManager, executionStack) {
    //return sensor[number];
  }
}

function Number(number) {
  this.objectName = "Number";
  this.requiresNewContext = false;
  this.createsContext = function() {
    return this.requiresNewContext;
  }

  this.number = parseInt(number);
  this.eval = function(argumentsArr, contextManager, executionStack) {
    return this.number;
  }
}

function VarDefintion(varName) {
    this.objectName = "VarDef";
    this.requiresNewContext = false;
    this.createsContext = function() {
      return this.requiresNewContext;
    }

    this.varName = varName;
    this.varIsLocal = varName[0] == '$' && varName[1] == "_";
    this.eval = function(argumentsArr, contextManager, executionStack) {
        console.log("Definicion de variable ------------------------------");
        console.log("Var name: " + this.varName);
        console.log("Var local: " + this.varIsLocal.toString());
        if(this.varIsLocal) {
            console.log("Se define la variable como local");
            contextManager.actualContext().newVar(this.varName, argumentsArr[0]);
            console.log(contextManager.actualContext());
            return "VARDEF"
        }
        else {
            try {
                console.log("Se intenta settear la variable global");
                contextManager.varLookupSet(this.varName, argumentsArr[0]);
                console.log(contextManager.actualContext());
                return "VARDEF"
            }
            catch(err) {
                console.log("No existia como global, se settea en el contexto actual");
                contextManager.actualContext().newVar(this.varName, argumentsArr[0]);
                console.log(contextManager.actualContext());
                return "VARDEF"
            }
        }
    }
}

function VarUsage(varName) {
  this.objectName = "VarUsage";
  this.requiresNewContext = false;
  this.createsContext = function() {
    return this.requiresNewContext;
  }

  this.varName = varName;
  this.varIsLocal = varName[0] == '$' && varName[1] == "_";
  this.eval = function(argumentsArr, contextManager, executionStack) {
    try {
        console.log("Buscando variable: " + this.varName);
        console.log("La variable es local?" + this.varIsLocal.toString());
        return contextManager.varLookup(this.varName);
    }
    catch(err) {
        console.log(err);
    }
  }
}

function Sum() {
  this.objectName = "Sum";
  this.requiresNewContext = false;
  this.createsContext = function() {
    return this.requiresNewContext;
  }

  this.eval = function(argumentsArr, contextManager, executionStack) {
    return this.leftOp.eval(context) + this.rightOp.eval(context);
  }
}

function Sub() {
  this.objectName = "Sub";
  this.requiresNewContext = false;
  this.createsContext = function() {
    return this.requiresNewContext;
  }

  this.eval = function(argumentsArr, contextManager, executionStack) {
    return this.leftOp.eval(context) - this.rightOp.eval(context);
  }
}

function Mult() {
  this.objectName = "Mult";
  this.requiresNewContext = false;
  this.createsContext = function() {
    return this.requiresNewContext;
  }

  this.eval = function(argumentsArr, contextManager, executionStack) {
    return argumentsArr[0] * argumentsArr[1];
  }
}

function Equal() {
    this.objectName = "E";
    this.requiresNewContext = false;
    this.createsContext = function() {
      return this.requiresNewContext;
    }

    this.eval = function(argumentsArr, contextManager, executionStack) {
      return argumentsArr[0] == argumentsArr[1];
    }
}

function NotEqual() {
    this.objectName = "Ne";
    this.requiresNewContext = false;
    this.createsContext = function() {
      return this.requiresNewContext;
    }

    this.eval = function(argumentsArr, contextManager, executionStack) {
      return argumentsArr[0] != argumentsArr[1];
    }
}

function Lower() {
    this.objectName = "L";
    this.requiresNewContext = false;
    this.createsContext = function() {
      return this.requiresNewContext;
    }

    this.eval = function(argumentsArr, contextManager, executionStack) {
      return argumentsArr[0] < argumentsArr[1];
    }
}

function LowerEqual() {
    this.objectName = "Le";
    this.requiresNewContext = false;
    this.createsContext = function() {
      return this.requiresNewContext;
    }

    this.eval = function(argumentsArr, contextManager, executionStack) {
      return argumentsArr[0] <= argumentsArr[1];
    }
}

function Greater() {
    this.objectName = "G";
    this.requiresNewContext = false;
    this.createsContext = function() {
      return this.requiresNewContext;
    }

    this.eval = function(argumentsArr, contextManager, executionStack) {
      return argumentsArr[0] > argumentsArr[1];
    }
}

function GreaterEqual() {
    this.objectName = "Ge";
    this.requiresNewContext = false;
    this.createsContext = function() {
      return this.requiresNewContext;
    }

    this.eval = function(argumentsArr, contextManager, executionStack) {
      return argumentsArr[0] >= argumentsArr[1];
    }
}

function Div() {
  this.objectName = "Div";
  this.requiresNewContext = false;
  this.createsContext = function() {
    return this.requiresNewContext;
  }

  this.eval = function(argumentsArr, contextManager, executionStack) {
    return argumentsArr[0] / argumentsArr[1];
  }
}

function Node(operation, childrenArray) {
  this.childrenArray = childrenArray;
  this.operation = operation;

  this.addChild = function(child) {
    this.childrenArray.push(child);
  }

  this.setChildren = function(children) {
    this.childrenArray = children;
  } 

  this.child = function(number) {
    return this.childrenArray[number];
  }

  this.getChildren = function() {
    return this.childrenArray;
  }

  this.eval = function(argumentsArr, contextManager, executionStack) {
    return this.operation.eval(argumentsArr, contextManager, executionStack);
  }

}
