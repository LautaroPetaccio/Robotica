function TreeWalker(root, onCompleted) {
  this.stack = [{ node : root, childrenLeft : root.getChildren().length }];
  this.results = [];
  this.completed = false;
  this.DEBUG;
  this.onCompleted = onCompleted;

  this.excecution = new Excecution();
  this.contextManager = new ContextManager();

  this.getLastChild = function(stackElem) {
    /* Ver si el menos 1 está bien */
    // console.log("Numero de child");
    // console.log(stackElem.node.getChildren().length - stackElem.childrenLeft)
    return stackElem.node.child(stackElem.node.getChildren().length - stackElem.childrenLeft);
  }

  this.childWalk = function() {
    if(this.stack.length == 0) {
        if(!this.completed) this.completed = true;
        return false;
    }

    var lastStackElement = this.stack[this.stack.length-1];

    if(this.DEBUG) {
      console.log("Walking element: ");
      console.log(lastStackElement.node.operation.objectName);
      console.log("Children left: ");
      console.log(lastStackElement.childrenLeft);     
    }

    if(lastStackElement.node.operation.createsContext()) this.contextManager.newContext();

    if(lastStackElement.childrenLeft > 0) {
      var child = this.getLastChild(lastStackElement);
      // console.log("Got children: ")
      // console.log(child.operation.objectName);
      // console.log("Child childrens")
      // console.log(child.getChildren());
      /* The child is a terminal node */
      if(child.getChildren() == 0) {
        /* Append the value to the results stack */
        this.results[this.results.length-1].push(child.eval([], this.contextManager, this.stack));
      }
      else {
        /* The child is not terminal, append the child to use it in the next iteration */
        this.stack.push({ node : child, childrenLeft : child.getChildren().length });

        /* The child will have a result, append an empty result array */
        this.results.push([]);
      }
      /* One child has been processed, there is one child less */
      lastStackElement.childrenLeft--;
    }
    else {
      /* The last node in the stack doesn't have more children, excecute it */
      var node = this.stack.pop().node;
      var node_value = node.eval(this.results.pop(), this.contextManager, this.stack);
      /* If the node created a context, delete it */
      if(node.operation.createsContext()) this.contextManager.dropContext();
      this.results.push([node_value]);

      // if(node_value === 'PROGRAMEND') {

      // }
    }
    if(this.DEBUG) {
      console.log("-----------------------------------");
      console.log("Child walk resulsts:")
      console.log("Stack:")
      console.log(this.stack);
      console.log("Results:")
      console.log(this.results);
      console.log("-----------------------------------");
    }
  }

  this.sentenceWalk = function() {
    /* Walks a line */
  }
}

function ContextManager() {
    this.contexts = [];
    this.instructions = [];

    this.pushInstruction = function(instruction) {
        this.instructions.push(instruction);
    }

    this.newContext = function() {
        this.contexts.push(new Context());
    }

    this.dropContext = function() {
        this.contexts.pop();
    }

    this.actualContext = function() {
        return this.contexts[this.contexts.length - 1];
    }

    this.varLookupSet = function(varName, varValue) {
        for(var i = this.contexts.length - 1; i >= 0; i--) {
            if(this.contexts[i].varExists(varName)) {
                this.contexts[i].newVar(varName, varValue);
                return true;
            }
        }
        throw "Variable doesnt exist";
    }

    this.varLookup = function(varName) {
        for(var i = this.contexts.length - 1; i >= 0; i--) {
            if(this.contexts[i].varExists(varName)) {
                return this.contexts[i].varValue(varName);
            }
        }
        throw "Variable doesnt exist";
    }

    this.newContext();
}

function Context(number) {
    this.variables = {};

    this.newVar = function(name, value) {
        this.variables[name] = value;
    }

    this.varExists = function(varName) {
        return this.variables[varName] != undefined;
    }

    this.varValue = function(varName) {
        return this.variables[varName];
    }
}

function Excecution() {
  this.paused = false;

  this.pause = function() {
    this.paused = true;
  }

  this.resume = function() {
    this.paused = false;
  }

  this.isPaused = function() {
    return this.paused;
  }
}