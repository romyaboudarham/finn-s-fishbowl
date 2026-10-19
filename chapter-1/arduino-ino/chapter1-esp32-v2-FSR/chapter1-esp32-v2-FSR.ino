#include <WiFi.h>
#include <WebSocketsServer.h>

// Must be an ADC1 pin (A2/A3/A4 on the Feather V2) - ADC2 pins stop working once Wi-Fi is on
#define FORCE_SENSOR_PIN_FOOT 39 // A3

const char* ssid = "pond_sensor";
const char* password = "pond1234"; // WPA2 requires at least 8 characters

WebSocketsServer webSocket(81);

void setup() {
  Serial.begin(115200);
  analogReadResolution(12);

  // Create the Feather's own Wi-Fi network
  WiFi.mode(WIFI_AP);
  if (!WiFi.softAP(ssid, password)) {
    Serial.println("Failed to start Wi-Fi network!");
    while (true) delay(1000);
  }

  Serial.println("Wi-Fi network started!");
  Serial.print("Network IP: ");
  Serial.println(WiFi.softAPIP());

  // Start WebSocket server
  webSocket.begin();

  Serial.println("WebSocket server started on port 81");
}

void loop() {
  webSocket.loop();

  int foot = analogRead(FORCE_SENSOR_PIN_FOOT);
  Serial.println(foot);

  // Send the reading as JSON
  String data = "{\"foot\":" + String(foot) + "}";

  webSocket.broadcastTXT(data);

  delay(20); // About 50 updates per second
}
