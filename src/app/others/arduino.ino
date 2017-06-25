#include <PID_v1.h>
/* Left / Right mirando el robot de atrás (como en el simulador) */
#define MOTOR_R_A 6
#define MOTOR_R_B 5
#define MOTOR_L_A 11
#define MOTOR_L_B 10
#define WHEEL_HOLES 20
#define RIGHT_WHEEL_ENCODER_INTERRUPT_PIN 3
#define LEFT_WHEEL_ENCODER_INTERRUPT_PIN 2
/* Left / Right mirando el robot de atrás */
#define SONAR_L_TRIG 9
#define SONAR_L_ECHO 4
#define SONAR_R_TRIG 12
#define SONAR_R_ECHO 13
#define SONAR_F_TRIG 7
#define SONAR_F_ECHO 8
#define PWM_MAX 255
#define PWM_MIN 30
#define VEL_MAX 100
#define VEL_MIN -100
#define ANGULAR_VEL_MIN (-16 * PI)
#define ANGULAR_VEL_MAX (16 * PI)
#define CONST_PART_ROTATIONAL_SPEED ((2 * PI)/WHEEL_HOLES)
#define KP 2
#define KI 0.1
#define KD 0.25

int sonars[3][2] = { {SONAR_L_TRIG, SONAR_L_ECHO}, {SONAR_R_TRIG, SONAR_R_ECHO}, {SONAR_F_TRIG, SONAR_F_ECHO} };
volatile unsigned long left_wheel_pulses = 0;
volatile unsigned long right_wheel_pulses = 0;
double left_wheel_angular_velocity = 0.0, right_wheel_angular_velocity = 0.0;
volatile unsigned long right_wheel_last_time = 0, right_wheel_actual_time = 0;
volatile unsigned long left_wheel_last_time = 0, left_wheel_actual_time = 0;

/* Sensor's enum */
enum sensor {
  left,
  right,
  front
};

/* Gets the current angular velocity based on the encoders pulses */
double angular_velocity(unsigned long pulses, double measurement_time) {
  return (2 * PI * pulses)/(WHEEL_HOLES * measurement_time);
}

void angular_velocity_measurement() {
   /*  
    Gets the angular velocity for the two wheels.
    The 0.3 seconds is the update time.
  */
  left_wheel_angular_velocity = angular_velocity(left_wheel_pulses, 0.3);
  right_wheel_angular_velocity = angular_velocity(right_wheel_pulses, 0.3);
  
  /* Reset the measurements */
  right_wheel_pulses = 0;
  left_wheel_pulses = 0;
}

void count_pulse(volatile unsigned long &pulses, volatile unsigned long &last_time) {
  // Trying to get rid of wrong counts.
  unsigned long actual_time = millis();
  if(last_time + 10 < actual_time)
    ++pulses;
  last_time = actual_time;
}

/* Left wheel's interrupt function for the encoder pulses */
void left_wheel_encoder_pulse() {
  count_pulse(left_wheel_pulses, left_wheel_last_time);
}

/* Right wheel's interrupt function for the encoder pulses */
void right_wheel_encoder_pulse() {
  count_pulse(right_wheel_pulses, right_wheel_last_time);
}

/* Measures the distance with a sonar sensor */
float measure(int trigger, int echo){
  float pulse_duration;
  /* Initial trigger */
  digitalWrite(trigger, LOW);
  delayMicroseconds(5);
  /* Starts measure */
  digitalWrite(trigger, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigger, LOW);
  /* Gets how long the pulse is active and returns an unsigned long in microseconds */
  /* By limiting the pulse duration count to 145500 microseconds, we can only measure 250cm */
  /* We should be careful about remaining reflections */
  /* 145500 */
  pulse_duration = pulseIn(echo, HIGH, 14550);
  /* Return the result in centimeters */
  return (pulse_duration == 0 ? 14550 : pulse_duration)/58.2;
  
}

/* Custom map is needed to output a double */
double custom_map(long x, double out_min, double out_max, long in_min, long in_max) {
  return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

double compute_angular_velocity_setpoint(int original_velocity) {
  return abs(custom_map(original_velocity, ANGULAR_VEL_MIN, ANGULAR_VEL_MAX, VEL_MIN, VEL_MAX));
}

/* Outputs power to the motors */
void power_motor(int pin_a, int pin_b, int original_velocity, int PWM) {
  if(original_velocity == 0)
    return;
  analogWrite(pin_a, original_velocity > 0 ? PWM_MIN + PWM : 0);
  analogWrite(pin_b, original_velocity > 0 ? 0 : PWM_MIN + PWM);
}

/* Performs a software delay */
void software_delay(unsigned long milliseconds) {
  unsigned long t0 = millis();
  while(millis() < t0 + milliseconds);
}

/* Moves the robot */
/*
  Input:
    motorL_vel and motorR_vel: motor velocity (speed or power), from -100 to 100.
    durarion: time in seconds that the motor should be on.
*/
void motor(int motorL_vel, int motorR_vel, float duration){
  /* Maps the provided velocity to angular velocity */
  double setpoint, left_wheel_PWM = 0.0, right_wheel_PWM = 0.0;
  double setpoint_angular_vel_L = compute_angular_velocity_setpoint(motorL_vel);
  double setpoint_angular_vel_R = compute_angular_velocity_setpoint(motorR_vel);

  unsigned long motor_duration = duration * 1000;

  right_wheel_pulses = 0;
  left_wheel_pulses = 0;

  /* Creates and configures all PID's */
  PID leftWheelPID(&left_wheel_angular_velocity, &left_wheel_PWM, &setpoint_angular_vel_L, KP, KI, KD, DIRECT);
  PID rightWheelPID(&right_wheel_angular_velocity, &right_wheel_PWM, &setpoint_angular_vel_R, KP, KI, KD, DIRECT);
  leftWheelPID.SetMode(AUTOMATIC);
  rightWheelPID.SetMode(AUTOMATIC);
  
  /* Initializes and configures interruptions */
  attachInterrupt(digitalPinToInterrupt(LEFT_WHEEL_ENCODER_INTERRUPT_PIN), left_wheel_encoder_pulse, RISING);
  attachInterrupt(digitalPinToInterrupt(RIGHT_WHEEL_ENCODER_INTERRUPT_PIN), right_wheel_encoder_pulse, RISING);
  /* Movement loop - moves until duration is archieved */
  unsigned long t0 = millis(); // Tiempo del comienzo del movimiento
  while(millis() < (t0 + motor_duration)) {
    angular_velocity_measurement();
    leftWheelPID.Compute();
    rightWheelPID.Compute();
    /* Write PWM values, taking into consideration if the original velocity was negative or positive */
    power_motor(MOTOR_L_A, MOTOR_L_B, motorL_vel, left_wheel_PWM);
    power_motor(MOTOR_R_A, MOTOR_R_B, motorR_vel, right_wheel_PWM);

    /* Software delay to allow interruptions */
    software_delay(300);
  }
  
  /* Removes all interrupts and stops the motors */
  noInterrupts();
  detachInterrupt(digitalPinToInterrupt(LEFT_WHEEL_ENCODER_INTERRUPT_PIN));
  detachInterrupt(digitalPinToInterrupt(RIGHT_WHEEL_ENCODER_INTERRUPT_PIN));
  analogWrite(MOTOR_L_A, 0);
  analogWrite(MOTOR_L_B, 0);
  analogWrite(MOTOR_R_A, 0);
  analogWrite(MOTOR_R_B, 0);
  interrupts();
}

unsigned int sense(sensor selectedSensor){
  float measurement = measure(sonars[selectedSensor][0], sonars[selectedSensor][1]);
  return (unsigned int) measurement;
}

{0}

void setup() {
  Serial.begin(9600);
  /* ================ Left and right motors' setup ================ */
  pinMode(MOTOR_L_A, OUTPUT);
  pinMode(MOTOR_L_B, OUTPUT);
  pinMode(MOTOR_R_A, OUTPUT);
  pinMode(MOTOR_R_B, OUTPUT);
  analogWrite(MOTOR_L_A, 0);
  analogWrite(MOTOR_L_B, 0);
  analogWrite(MOTOR_R_A, 0);
  analogWrite(MOTOR_R_B, 0);
  /* ================ Right, left and frontal sensors' setup ================ */
  pinMode( SONAR_R_TRIG, OUTPUT);
  pinMode( SONAR_R_ECHO, INPUT);
  pinMode( SONAR_L_TRIG, OUTPUT);
  pinMode( SONAR_L_ECHO, INPUT);
  pinMode( SONAR_F_TRIG, OUTPUT);
  pinMode( SONAR_F_ECHO, INPUT);
  {1}
}

void loop() {
  {2}
  while(true)
    delay(1000);
}