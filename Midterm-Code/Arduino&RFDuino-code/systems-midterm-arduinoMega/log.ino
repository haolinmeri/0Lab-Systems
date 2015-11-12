void sdCardBegin() {
  //initialize sd card
  pinMode(SS, OUTPUT);

  if (!SD.begin(chipSelect)) {
    //Serial1.println("initialization failed!");
    return;
  }
  //Serial1.println("initialization done.");

  // open the file. note that only one file can be open at a time,
  // so you have to close this one before opening another.
  //colorFile = SD.open("color.txt", FILE_WRITE);
  //testing this 
  //GPSFile = SD.open("GPS.txt", FILE_WRITE);
}

void sdColorLog() {
  GPSFile.close();
  colorFile = SD.open("color.txt", FILE_WRITE);
  colorFile.println(colorData);
  colorFile.flush();
  delay(500);
}

void sdGPSLog() {
  colorFile.close();
  GPSFile = SD.open("GPS.txt", FILE_WRITE);
  GPSFile.println(GPSData);
  GPSFile.flush();
  delay(500);
}

