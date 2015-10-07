// rfDuino 
// Yumeng as host, Nico as device
// Input: button, potentiometer, Output: LED, Fading LED (servo), piezo speaker 
// Reference code from the wonderful Ayo

#include <RFduinoGZLL.h>
#include <Servo.h> 

device_t role = HOST;

// the last known state from DEVICE0 (default to off)
char state = 0;

int buttonState = 0;
int potVal = 0;


//output - led, servo, piezo speaker
const int ledPin = 2;
Servo myServo;
const int servoPin = 4;
const int ledFadePin = 4;
const int piezoPin = 6;


void setup() {
  Serial.begin(9600);
  // start the GZLL stack  
  RFduinoGZLL.begin(role);

  pinMode(ledPin, OUTPUT);

  myServo.attach(servoPin);
  pinMode(ledFadePin, OUTPUT);
}

void loop()
{
}

void RFduinoGZLL_onReceive(device_t device, int rssi, char *data, int len)
{

//  Serial.print(device);
//  Serial.print(",");
//  Serial.print(abs(rssi));
//  Serial.print(",");
  
  String info = data;
  String buttonInfo = info.substring(0,1);
  String potInfo = info.substring(2,6);
  
  buttonState = buttonInfo.toInt();
  potVal = potInfo.toInt();
  Serial.print(buttonState);
  Serial.print(" --- ");
  Serial.println(potVal);
  
  if (device == DEVICE1)  // relay the last known state to DEVICE1
    RFduinoGZLL.sendToDevice(device, state);

    ledOnOff();
    servoMove();
    sound();
    ledFading();
}


void ledOnOff() {
  if (buttonState == 1) {
    digitalWrite(ledPin, HIGH);
  } else {
    digitalWrite(ledPin, LOW);
  }
}

void servoMove() {
  int angle = map(potVal, 0, 1023, 0, 179);
  myServo.write(angle);
  Serial.println(angle);
}

void sound() {
  if (buttonState == 1) {
    tone(piezoPin, 1600, 1500);
  } else {
    noTone(piezoPin);
  }
}

void ledFading() {
  int fadeVal = map(potVal, 0, 1023, 0, 255);
  analogWrite(ledFadePin, fadeVal);
  delay(20);
}

