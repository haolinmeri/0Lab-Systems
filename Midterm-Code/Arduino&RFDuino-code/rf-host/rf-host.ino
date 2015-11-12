
#include <RFduinoGZLL.h> // include rfduino library

device_t role = HOST; // set Device name... DEVICE2 to DEVICE7 / HOST
String sstr;
void setup()
{
  Serial.begin(9600); // begin serial communications
  // start the GZLL stack
  RFduinoGZLL.begin(role); // begin BLE communications
}

void loop()
{
  Serial.println(sstr);

  delay(250);
}

void RFduinoGZLL_onReceive(device_t device, int rssi, char *data, int len) // this function receives BLE communications
{

  if (data[0] == 90) { // if first character is a (ascci code 97) then print out the data

    sstr = data; // print out data

    if (device == DEVICE1)  // if device name is DEVICE1 relay the last known state to DEVICE1
      RFduinoGZLL.sendToDevice(device, "data from host");
  }
}
