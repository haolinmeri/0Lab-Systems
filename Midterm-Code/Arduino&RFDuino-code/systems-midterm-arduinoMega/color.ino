void colorConvert() {
  //convert RGB colors to what humans see
  for (int i = 0; i < 256; i++) {
    float x = i;
    x /= 255;
    x = pow(x, 2.5);
    x *= 255;

    if (commonAnode) {
      gammatable[i] = 255 - x;
    } else {
      gammatable[i] = x;
    }
  }
}

void getColor() {
  uint16_t clear, red, green, blue;

  delay(60);

  tcs.getRawData(&red, &green, &blue, &clear);

  //hex code for visualization
  uint32_t sum = clear;
  r = red; r /= sum;
  g = green; g /= sum;
  b = blue; b /= sum;
  r *= 256; g *= 256; b *= 256;
  //Serial.print((int)r, HEX); Serial.print((int)g, HEX); Serial.println((int)b, HEX);
}

void setPixel() {
  int neoBright = 100;

  for (int i = 0; i < neoNum + 4; i++) {
    neoRing.setBrightness(neoBright);
    rVal = gammatable[int(r)];
    gVal = gammatable[int(g)];
    bVal = gammatable[int(b)];
    neoRing.setPixelColor(i, neoRing.Color(rVal, gVal, bVal));

    neoRing.show();

    int turnOff[] = {i - 3, i - 4, i - 5, i - 6};
    for (int j = 0; j < sizeof(turnOff); j++) {
      neoRing.setPixelColor(turnOff[j], 0);
    }
    delay(delayTime);

    colorData = String(rVal) + "," + String(gVal) + "," + String(bVal);

    Serial.println(colorData);
  }
}



