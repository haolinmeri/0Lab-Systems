//String passData;
String readColor;
String readGPS;

void SDRead() {
  int x = 0;
  do {
    colorFile = SD.open("color.txt");
    if (colorFile) {
      while (colorFile.available()) {
        Serial1.write(colorFile.read());
        readColor = String(colorFile.read());
      }
      colorFile.close();
    }

    GPSFile = SD.open("GPS.txt");
    if (GPSFile) {
      while (GPSFile.available()) {
        Serial1.write(GPSFile.read());
        readGPS = String(GPSFile.read());
      }
      GPSFile.close();
    }
    x += 1;
  } while (x >= 1);
}

