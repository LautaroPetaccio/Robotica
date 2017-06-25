# Robótica en la escuela - Robot simulator

![alt text](https://user-images.githubusercontent.com/1120791/27517156-e7a33a14-599d-11e7-8fd7-9ba575714a8b.png "Screenshot")

The *Robot simulator* is a tool for teaching programing basics by letting the user play and explore with the blocks it provides for the robot's movement and sensor's control.

The code from the simulator can be exported to Arduino code to program the project's robot.

The simulator uses MelonJS as the gaming library for the robot, Blocky ([Ardublockly](http://ardublockly.embeddedlog.com)) for the blocky styled language, Bootstrap and others.

Blocky, introduces an easier way to give the robot instructions, eliminating the need to write, that could be hard to some people that haven't had experience with computers before, making the focus in the logics of programming itself.

## Setup

1. Install nodejs.

  The robot simulator was developed and tested with the nodejs version 7.10.0. It should work with older versions aswell.

  To install the required version, we recommend using a package manager. The instructions to do so are provided in the node website https://nodejs.org/en/download/package-manager/ .


2. Check npm installation (installed automatically with nodejs):

  ```
  $ npm -v
  4.2.0
  ```

3. Install bower and check installation.

  ```
  $ sudo npm install -g bower
  $ bower -v
  1.8.0
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
