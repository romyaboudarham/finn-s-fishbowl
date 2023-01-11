#define FORCE_SENSOR_PIN_FOOT 39 // ESP32 pin GIOP36 (ADC0): the FSR and 10K pulldown are connected to A0
#define FORCE_SENSOR_PIN_FINGER 36 // ESP32 pin GIOP36 (ADC0): the FSR and 10K pulldown are connected to A0

#if defined(ESP8266)
#include <ESP8266WiFi.h>
#else
#include <WiFi.h>
#endif
#include <WiFiUdp.h>
#include <OSCMessage.h>

char ssid[] = "Gray Area Incubator";          // your network SSID (name)
char pass[] = "il0vegrayarea";                    // your network password
// char ssid[] = "Pixel_4232";          // your network SSID (name)
// char pass[] = "p00p00p1";                    // your network password

WiFiUDP Udp;                                // A UDP instance to let us send and receive packets over UDP
const IPAddress outIp(10,10,7,33);        // remote IP of your computer
const unsigned int outPort = 9999;          // remote port to receive OSC
const unsigned int localPort = 8888;        // local port to listen for OSC packets (actually not used for sending)

int del = 10;

void setup() {
    Serial.begin(9600);

    // Connect to WiFi network
    Serial.println();
    Serial.println();
    Serial.print("Connecting to ");
    Serial.println(ssid);
    WiFi.begin(ssid, pass);

    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }
    Serial.println("");

    Serial.println("WiFi connected");
    Serial.println("IP address: ");
    Serial.println(WiFi.localIP());

    Serial.println("Starting UDP");
    Udp.begin(localPort);
    Serial.print("Local port: ");
#ifdef ESP32
    Serial.println(localPort);
#else
    Serial.println(Udp.localPort());
#endif
}

void loop() {
  int analogReadingFoot = analogRead(FORCE_SENSOR_PIN_FOOT);
  int analogReadingFinger = analogRead(FORCE_SENSOR_PIN_FINGER);
  if(analogReadingFoot > 200) {
    OSCMessage msg("/foot");
    msg.add(analogReadingFoot);
    Udp.beginPacket(outIp, outPort);
    msg.send(Udp);
    Udp.endPacket();
    msg.empty();
    delay(del);
  } else if (analogReadingFinger > 200) {
    OSCMessage msg("/finger");
    msg.add(analogReadingFinger);
    Udp.beginPacket(outIp, outPort);
    msg.send(Udp);
    Udp.endPacket();
    msg.empty();
    delay(del);
  }
}           