/* Left motor pins */
#define LeftMotorEnablePin 11
#define LeftMotorFirstLogicPin 13
#define LeftMotorSecondLogicPin 12
/* Right Motor pins */
#define RightMotorEnablePin 10
#define RightMotorFirstLogicPin 9
#define RightMotorSecondLogicPin 8
/* Left sonar sensor pins, A0, A1 */
#define LeftSensorTriggerPin 14
#define LeftSensorEchoPin 15
/* Frontal sonar sensor pins, A2, A3 */
#define FrontalSensorTriggerPin 16
#define FrontalSensorEchoPin 17
/* Right sonar sensor pins, A4, A5 */
#define RightSensorTriggerPin 18
#define RightSensorEchoPin 19
/* Factor to multiply the duration time */
#define TimeFactor 1000

void setMotorDirection(char motorPower, char firstLogicPin, char secondLogicPin) {
  if(motorPower > 0) {
    motorPower = -motorPower;
    digitalWrite(firstLogicPin, LOW);
    digitalWrite(secondLogicPin, HIGH);
  }
  else {
    digitalWrite(firstLogicPin, HIGH);
    digitalWrite(secondLogicPin, LOW);
  }
}

void moveRobot(char leftMotorPower, char rightMotorPower, unsigned long durartion) {
  /* We'll use for now that the left and right motor values go from -127 to -127 */
  unsigned long startTime = millis();
  unsigned char resultPWM;
  setMotorDirection(leftMotorPower, LeftMotorFirstLogicPin, LeftMotorSecondLogicPin);
  setMotorDirection(rightMotorPower, RightMotorFirstLogicPin, RightMotorSecondLogicPin);
  /* Enable motors */
  resultPWM = map(motorPower, -127, 127, 0, 255);
  analogWrite(LeftMotorEnablePin, resultPWM);
  analogWrite(RightMotorEnablePin, resultPWM);
  /* Keep the motors running for the duration needed */
  while(millis() - startTime < (duration * TimeFactor))
  /* Turn off the motors */
  analogWrite(LeftMotorEnablePin, 0);
  analogWrite(RightMotorEnablePin, 0);
}

void setup() {
  /* Motor pins setup */
  pinMode(LeftMotorEnablePin, OUTPUT);
  pinMode(LeftMotorFirstLogicPin, OUTPUT);
  pinMode(LeftMotorSecondLogicPin, OUTPUT);
  pinMode(RightMotorEnablePin, OUTPUT);
  pinMode(RightMotorFirstLogicPin, OUTPUT);
  pinMode(RightMotorSecondLogicPin, OUTPUT);
  /* Sonar sensors pins setup*/
  pinMode(LeftSensorTriggerPin, OUTPUT);
  pinMode(LeftSensorEchoPin, INPUT);
  pinMode(FrontalSensorTriggerPin, OUTPUT);
  pinMode(FrontalSensorEchoPin, INPUT);
  pinMode(RightSensorTriggerPin, OUTPUT);
  pinMode(RightSensorEchoPin, INPUT);
}

void loop() {
  /* Code */

}
