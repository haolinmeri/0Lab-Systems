void RFIDread() {
  int i = 0;
  int readByte;
  boolean tag = false;

  if (rSerial.available() == tagLen) {
    tag = true;
  }

  if (tag == true) {
    while (rSerial.available()) {

      readByte = rSerial.read();

      /* This will skip the first byte (2, STX, start of text) and the last three,
      ASCII 13, CR/carriage return, ASCII 10, LF/linefeed, and ASCII 3, ETX/end of
      text, leaving only the unique part of the tag string. It puts the byte into
      the first space in the array, then steps ahead one spot */
      if (readByte != 2 && readByte != 13 && readByte != 10 && readByte != 3) {
        newTag[i] = readByte;
        i++;
      }

      // If we see ASCII 3, ETX, the tag is over
      if (readByte == 3) {
        tag = false;
      }

    }
  }
  if (strlen(newTag) == 0) {
    return;
  }

  else {
    int total = 0;

    for (int ct = 0; ct < kTags; ct++) {
      total = checkTag(newTag, knownTags[ct]);
    }

    if (total > 0) {
      Serial1.println("yes");
      digitalWrite(13, HIGH);
      SDRead();
    }

    else {
      // This prints out unknown cards so you can add them to your knownTags as needed
      Serial1.println("no");
      //Serial1.println(newTag);
      digitalWrite(13, HIGH);
    }
  }

  // Once newTag has been checked, fill it with zeroes
  // to get ready for the next tag read
  for (int c = 0; c < idLen; c++) {
    newTag[c] = 0;
  }
}

int checkTag(char nTag[], char oTag[]) {
  for (int i = 0; i < idLen; i++) {
    if (nTag[i] != oTag[i]) {
      return 0;
    }
  }
  return 1;
}

