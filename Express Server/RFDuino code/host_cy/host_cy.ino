/*
This sketch demonstrates how to send data from a Device
to another Device (using the Host as an intermediary)
in a Gazell network.

When Button A on Device0 is pressed and released,
the green led on Device1 will toggle.
*/

#include <RFduinoGZLL.h>

device_t role = HOST;

// the last known state from DEVICE0 (default to off)
char state = 0;

void setup() {
  Serial.begin(9600);
  // start the GZLL stack
  RFduinoGZLL.begin(role);
}

void loop() {
}

void RFduinoGZLL_onReceive(device_t device, int rssi, char *data, int len) {

  String info = data;
  String sendInfo = info.substring(1, 7);

  if (data[0] == 99) {
    Serial.println(sendInfo);
  }
}
