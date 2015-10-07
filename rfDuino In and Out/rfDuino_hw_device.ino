// rfDuino
// Yumeng as device, Nico as host
// Input: button, flex sensor, Output:
// Reference code from the wonderful Ayo

#include <RFduinoBLE.h>

#include <RFduinoGZLL.h>
device_t role = DEVICE2;

//flex sensor
const int xpin = 2;
//button
const int ypin = 4;

int xval = 0;
int yval = 0;


double x;
double y;

void setup() {
  Serial.begin(9600);
  pinMode(xpin,INPUT);
  pinMode(ypin,INPUT);
  RFduinoGZLL.txPowerLevel = 0;
  RFduinoGZLL.begin(role);
}
//rfDuiono
//Yumeng as device, Nico as host

void loop() {
  char xdata[4];
  char ydata[4];
  char mydata[8];
  String xstr;
  String ystr;
  String mystr;
  xval = analogRead(xpin);
  yval = digitalRead(ypin);
  xstr = String(xval);
  ystr = String(yval);
  Serial.println(yval);

  xstr.toCharArray(xdata, 4);
  ystr.toCharArray(ydata, 4);  

  mystr = ystr+","+xstr;
  mystr.toCharArray(mydata, 8);

  Serial.print(" button:");
  Serial.println(ydata);

  Serial.print("                        flex:");
  Serial.print(xdata);

 RFduinoGZLL.sendToHost(mydata, 8);
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
