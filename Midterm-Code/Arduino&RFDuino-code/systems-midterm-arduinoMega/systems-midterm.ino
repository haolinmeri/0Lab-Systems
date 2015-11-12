//color sensor connection
// SDA - A4 (mega 20)
// SCL - A5 (mega 21)
// GND - GND
// VIN - 5v

//neopixel - 6

//GPS
//rx - 10
//tx - 11

//sd card breakout connection
//Connect the 5V pin to the 5V pin on the Arduino
//Connect the GND pin to the GND pin on the Arduino
//Connect CLK to pin 13 or 52
//Connect DO to pin 12 or 50
//Connect DI to pin 11 or 51
//Connect CS to pin 10 or 53        

//color button
const int colorButton = 5;
int colorButtonState = 0;

//GPS button
const int GPSButton = 3;
int GPSButtonState = 0;

//laser button
const int laserButton = 7;
int laserState = 0;
const int laser = 13;

//power button
const int powerLED = 4;

//***********color sensor***********
#include <Wire.h>
#include "Adafruit_TCS34725.h"

// set to false if using a common cathode LED
#define commonAnode false

//RGB -> eye-recognized gamma color
byte gammatable[256];

Adafruit_TCS34725 tcs = Adafruit_TCS34725(TCS34725_INTEGRATIONTIME_50MS, TCS34725_GAIN_4X);

//***********neopixels***********
#include <Adafruit_NeoPixel.h>
#ifdef __AVR__
#include <avr/power.h>
#endif

#define neoPin      6   //data in pin
#define neoNum      12

Adafruit_NeoPixel neoRing = Adafruit_NeoPixel(neoNum, neoPin, NEO_GRB + NEO_KHZ800);

int delayTime = 50;

float r, g, b;
int rVal, gVal, bVal;
String colorData;

//***********sd card***********
#include <SPI.h>
#include <SD.h>

File colorFile;
File GPSFile;

const int chipSelect = 10;

//***********GPS module***********
#include <Adafruit_GPS.h>
#include <SoftwareSerial.h>

//HardwareSerial mySerial = Serial1; //for Mega (hardware Serial)
SoftwareSerial mySerial(11, 10);

Adafruit_GPS GPS(&mySerial);

// Set GPSECHO to 'false' to turn off echoing the GPS data to the Serial console
// Set to 'true' if you want to debug and listen to the raw GPS sentences.
#define GPSECHO  true

boolean usingInterrupt = false;
void useInterrupt(boolean);

//***********RFID module***********
SoftwareSerial rSerial(A10, A11); //soft serial for reading RFID

const int tagLen = 16; //total length
const int idLen = 13;  //length that is needed
const int kTags = 1;  //number of know tags

//known tags
char knownTags[kTags][idLen] = {
             "7C0056702B71"
};
char newTag[idLen];

void setup() {
  Serial.begin(9600); 
  Serial1.begin(9600); //for RFDuino
  //rSerial.begin(9600); //for RFID

  pinMode(colorButton, INPUT);
  pinMode(GPSButton, INPUT);
  pinMode(laserButton, INPUT);
  pinMode(powerLED, OUTPUT);
  pinMode(laser, OUTPUT);

  neoRing.begin();

  colorConvert();

  sdCardBegin();

  GPSBegin();
}


void loop() {
  digitalWrite(powerLED, HIGH);
  colorButtonState = digitalRead(colorButton);
  GPSButtonState = digitalRead(GPSButton);
  laserState = digitalRead(laserButton);

  if (colorButtonState == HIGH) {
    getColor();
    setPixel();
    sdColorLog();
    Serial.println(colorButtonState);
  } else {
    neoRing.setPixelColor(neoNum, 0);
  }
  
  if (GPSButtonState == HIGH) {
    GPSUpdate();
    sdGPSLog();
  }

  if(laserState == HIGH) {
    digitalWrite(laser, HIGH);
  } else {
    digitalWrite(laser, LOW);
  }

  //RFIDread();

  //for RFDuino
  Serial1.println("255,0,255,255,0,0");
  delay(250);
}



