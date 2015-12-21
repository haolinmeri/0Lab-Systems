#include <Wire.h>
#include <Adafruit_L3GD20.h>

// Comment this next line to use SPI
//#define USE_I2C

#ifdef USE_I2C
// The default constructor uses I2C
Adafruit_L3GD20 gyro;
#else
// To use SPI, you have to define the pins
#define GYRO_CS 4 // labeled CS
#define GYRO_DO 5 // labeled SA0
#define GYRO_DI 6  // labeled SDA
#define GYRO_CLK 7 // labeled SCL
Adafruit_L3GD20 gyro(GYRO_CS, GYRO_DO, GYRO_DI, GYRO_CLK);
#endif

int divider;
int moveX;
int moveZ;

boolean up;
boolean down;
boolean left;
boolean right;
boolean fire;

String dataStr;

//shock
String inputString = "";
boolean stringComplete = false;

//mic
const int sampleWindow = 50; // Sample window width in mS (50 mS = 20Hz)
unsigned int sample;


void setup() {
  Serial.begin(9600);
  inputString.reserve(200);

  divider = 200;
  up = false;
  down = false;
  left = false;
  right = false;

  if (!gyro.begin(gyro.L3DS20_RANGE_250DPS)) {
    Serial.println("Oops ... unable to initialize the L3GD20. Check your wiring!");
    while (1);
  }

  //output shock
  pinMode(12, OUTPUT);
  pinMode(11, OUTPUT);

}

void loop() {
  gyro.read();

  moveX = (int)gyro.data.x;
  moveZ = (int)gyro.data.z;

  if (moveX > divider) {
    up = true;
    down = false;
  } else if (moveX < -divider) {
    up = false;
    down = true;
  } else {
    up = false;
    down = false;
  }

  if (moveZ > divider) {
    left = true;
    right = false;
  } else if (moveZ < -divider) {
    left = false;
    right = true;
  } else {
    left = false;
    right = false;
  }

  //mic input
  unsigned long startMillis = millis(); // Start of sample window
  unsigned int peakToPeak = 0;   // peak-to-peak level

  unsigned int signalMax = 0;
  unsigned int signalMin = 1024;

  // collect data for 50 mS
  while (millis() - startMillis < sampleWindow)
  {
    sample = analogRead(0);
    if (sample < 1024)  // toss out spurious readings
    {
      if (sample > signalMax)
      {
        signalMax = sample;  // save just the max levels
      }
      else if (sample < signalMin)
      {
        signalMin = sample;  // save just the min levels
      }
    }
  }
  peakToPeak = signalMax - signalMin;  // max - min = peak-peak amplitude
  double volts = (peakToPeak * 3.3) / 1024;  // convert to volts

  //Serial.println(volts);

  if (volts >= 1.6) {
    fire = true;
  } else {
    fire = false;
  }


  //transmit data
  dataStr = String(left) + "," + String(right) + "," + String(up) + "," + String(down) + "," + String(fire);

  Serial.println(dataStr);

  delay(100);

  //shock
  while (Serial.available()) {
    char inChar = (char)Serial.read();
    inputString += inChar;  // add it to the inputString
    if (inChar == '\n') {
      stringComplete = true;
    }
  }

  if (stringComplete) {
    //Serial.println(inputString);
    digitalWrite(12, HIGH);
    delay(200);
    digitalWrite(11, HIGH);

    //    if (inputString == "true") {
    //      Serial.println("yay!");
    //      digitalWrite(12, HIGH);
    //    } else {
    //      digitalWrite(12, LOW);
    //    }

    inputString = ""; // clear the string:
    stringComplete = false;
  } else {
    digitalWrite(12, LOW);
    digitalWrite(11, LOW);
  }


}



