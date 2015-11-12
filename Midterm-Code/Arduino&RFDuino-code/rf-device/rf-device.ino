
#include <RFduinoGZLL.h> // include rfduino library
device_t role = DEVICE2; // set Device name... DEVICE2 to DEVICE7 / HOST

String inputString = "";         // a string to hold incoming data
boolean stringComplete = false;  // whether the string is complete

void setup()
{
  Serial.begin(9600); // begin serial communications

  inputString.reserve(200);
  RFduinoGZLL.txPowerLevel = 0;

  // start the GZLL stack
  RFduinoGZLL.begin(role); // begin BLE communications
}

void loop() {
  //char sdata[49];
  char mydata[20]; 
  
  String mystr;
  String sstr;

  serialEvent(); 
 
  if (stringComplete) {  
    sstr = inputString;
    inputString = "";
    stringComplete = false;
  }

  mystr = "Z," + sstr; 

  mystr.toCharArray(mydata, 20); // place mystr data into character buffer

  //Serial.println(mystr); // print buffer to serial

  RFduinoGZLL.sendToHost(mydata, 20); // send buffer to host other rfduino
  delay(250);

}

// if data is recived from another rfduino
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

void serialEvent() {
  while (Serial.available()) {
    // get the new byte:
    char inChar = (char)Serial.read();
    // add it to the inputString:
    inputString += inChar;
    // if the incoming character is a newline, set a flag
    // so the main loop can do something about it:
    if (inChar == '\n') {
      stringComplete = true;
    }
  }
}

