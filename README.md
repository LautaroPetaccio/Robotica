# Robótica en la escuela - Robot simulator
The *Robot simulator* is a tool for teaching programing basics by letting the user play and explore with the language it provides for the robot's movement.

The simulator uses MelonJS as the gaming library for the robot, Jison for the language parsing, Bootstrap and others.

## Programing language

The language is intendeed to be:
* **Simple:** to be easy to memoerize and understand.
* **Easy to write:** to overcome the difficulties of writing when the users are not used to a keyboard.
* **A good starter:** it includes the language basics to be a bridge for the understanding of more complex languages and programing.

The language has the following instructions:
* **if** boolean_expresion**:** code **endif**
* **if** boolean_expresion**:** code **else** code **endif**
* **while** boolean_expresion**:** code **loop**
* **$VAR_NAME =** number/boolean_expresion
* **mover** left_wheel_power**,** right_wheel_power**,** seconds
* **sensor** number

Right now, the language is case sensitive.

## Running:
Running a webserver with the code should be sufficient.
For the creation and updating of the parser, it is necessary to have jison installed.
Calling jison parser2.jison.js will output the parser in the parser2.js file.

## TODO:
- [ ] Make the language not case sensitive.
- [ ] Make the language as easy as possible to be written by people without prior daily usage of the keyboard.
- [ ] Create a better object oriented structure for the parsing and excecuting.
- [ ] Create the robot tracing.
- [ ] Add the ability to use different robot traces (color).
- [ ] Add the while expresion.
- [ ] Create the sensors in context and update them.
- [ ] Align in a better way the content in the website.
- [ ] Create the standalone version.
- [ ] Add the syntax highlighter.
- [ ] Add search functionalities to the text editor.
- [ ] Add the saving/loading functionalities for the robot's code.
- [ ] Create about menu.
- [ ] Create help menu.
- [ ] Translate to various languages.
- [ ] Know the answer to life.