// rfDuino
// Yumeng as device, Nico as host
// Input: button, flex sensor, Output:
// Reference code from the wonderful Ayo

#include <RFduinoBLE.h>
#include <RFduinoGZLL.h>

device_t role = DEVICE2;

//pot
//const int xpin = 2;
const int ypin = 4;

//ultrasonic distance sensor
#define trigPin 6
#define echoPin 2

//X is Potentiometer
//Y is button
int xval = 0;
int yval = 0;

void setup() {
  Serial.begin(9600);

  //pinMode(xpin, INPUT);
  pinMode(ypin, INPUT);

  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);

  RFduinoGZLL.txPowerLevel = 0;
  RFduinoGZLL.begin(role);
}

void loop() {

  char xdata[4];
  char ydata[2];
  char mydata[6];

  String xstr;
  String ystr;

  String mystr;

  //Read physical inputs
  //xval = analogRead(xpin);
  yval = digitalRead(ypin);

  //distance sensor
  long duration, distance;
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  duration = pulseIn(echoPin, HIGH);
  distance = (duration / 2) / 29.1;
  xval = distance;
  //Serial.println(distance);

  int barVal = map(xval, 0, 220, 100, 0);

  ystr = String(yval);

  if (barVal >= 100)
  {
    xstr = String(barVal);
  }
  else if (barVal < 100 && barVal >= 10) {
    xstr = String(0) + String(barVal);
  }
  else if (barVal < 10) {
    xstr = String(0) + String(0) + String(barVal);
  }

  xstr.toCharArray(xdata, 4);
  ystr.toCharArray(ydata, 2);

  //mystr = ystr+","+xstr;
  mystr = "c" + xstr + ystr;
  mystr.toCharArray(mydata, 7);
  Serial.println(mydata);

  RFduinoGZLL.sendToHost(mydata, 7);
  delay(250);
}

void RFduinoGZLL_onReceive(device_t device, int rssi, char *data, int len)
{
  // ignore acknowledgement without payload
  if (len > 0)
  {
    // set the Green led if this device is the closest device
    device_t closest_device = (device_t)data[0];
    //digitalWrite(green_led, (role == closest_device));

  }
}

