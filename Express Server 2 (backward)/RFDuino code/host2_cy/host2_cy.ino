/*
This sketch demonstrates how to send data from a Device
to another Device (using the Host as an intermediary)
in a Gazell network.

When Button A on Device0 is pressed and released,
the green led on Device1 will toggle.
*/
#include <RFduinoBLE.h>
#include <RFduinoGZLL.h>

device_t role = HOST;
device_t role2 = DEVICE2;

// the last known state from DEVICE0 (default to off)
char state = 0;
String servoData;

void setup() {
  Serial.begin(9600);
  // start the GZLL stack
  RFduinoGZLL.txPowerLevel = 0;
  RFduinoGZLL.begin(role);
  RFduinoGZLL.begin(role2);
}

void loop() {
  if (Serial.available() > 0) {
    servoData = String(Serial.read());
    RFduinoGZLL.sendToHost(servoData);
    delay(250);
  }
}

void RFduinoGZLL_onReceive(device_t device, int rssi, char *data, int len) {

  String info = data;
  String sendInfo = info.substring(1, 7);

  if (data[0] == 99) {
    Serial.println(sendInfo);
  }
}
