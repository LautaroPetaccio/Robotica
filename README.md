# Robótica en la escuela - Robot simulator

The *Robot simulator* is a tool for teaching programing basics by letting the user play and explore with the blocks it provides for the robot's movement.

The simulator uses MelonJS as the gaming library for the robot, Blocky for the blocky styled language, Bootstrap and others.

Latter versions of the robot simulator used a written language using Jison as the language parser. The new way of programming, using Blocky, introduces an easier way to give the robot instructions, eliminating the need to write, that could be hard to some people that haven't had experience with computers before, making the focus in the logics of programming itself.

## Setup

1. Install nodejs.

  ```
  wget https://nodejs.org/dist/v4.4.4/node-v4.4.4-linux-x64.tar.xz
  tar -xf node-v4.4.4-linux-x64.tar.xz
  cd node-v4.4.4-linux-x64/
  sudo cp -r bin/* /usr/bin/
  sudo cp -r lib/* /usr/lib/
  sudo cp -r include/* /usr/include/
  sudo cp -r share/* /usr/share/
  sudo ln -s /usr/bin/node /usr/bin/nodejs
  echo "export NODE_PATH=/usr/bin/node:/usr/bin/nodejs:/usr/lib/node_modules:/usr/include/node" >> ~/.bashrc
  source ~/.bashrc
  ```

2. Check npm installation (installed automatically with nodejs):

  ```
  $ npm -v
  2.15.1
  ```

3. Install bower and check installation.

  ```
  $ sudo npm install -g bower
  $ bower -v
  1.7.9
  ```

4. Install gulp and check installation.

  ```
  $ sudo npm install -g gulp
  $ gulp -v
  [...] CLI version 3.9.1
  ```

5. Install dev local dependencies (run from the project's root directory).

  ```
  $ npm install
  [...]
  ```

6. Install front-end dependencies (run from the project's root directory).

  ```
  $ bower install
  [...]
  ```

## Running

* Build distributable version.

  ```
  $ gulp build
  $ ls dist/
  ```

* Run app locally for development. There's no need to run `gulp build` first.

  ```
  $ gulp serve
  ```
   A new window or tab will open in the default browser, showing a running version of the app. Any changes on html files, scripts, or styles in the src folder will update automatically the running app without needing a manual page refresh. 


## TODO
- [ ] Create the robot tracing (the robot leaves a trail when moving).
- [ ] Add the ability to use different robot traces (color).
- [ ] Create the sensors in context and update them.
- [ ] Create objects and its collision boundaries.
- [ ] Align in a better way the content in the website.
- [ ] Create scripts to automatically resize the Blockly toolbox and the game screen to fit all screen sizes.
- [ ] Create the standalone version.
- [ ] Add step by step execution, with the blocks highlighter
- [ ] Add the saving/loading functionalities for the robot's code.
- [ ] Add the exporting functionalities for the Arduino.
- [ ] Add the loading map functionality, use the Tiled map editor's format.
- [ ] Create the documentation on how to create new maps.
- [ ] Create about menu.
- [ ] Create help menu.
- [ ] Translate to various languages.
