#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <DHT.h>
#include <OneWire.h>
#include <DallasTemperature.h>

//#define 
#define DHTTYPE DHT11
#define DHTPIN 14
#define ONE_WIRE_BUS 2

const int PIN_RED   = 16;
const int PIN_GREEN = 5;
const int PIN_BLUE  = 4;

const int trigPin = 1;  //D3
const int echoPin = 3;  //D4

//define variables
const char *ssid = "TXM_CENTRAL2.4";
const char *password = "4Ptxm_0605_22!";
const char *mqtt_server = "34.28.106.98";  // Cambia esto a la dirección IP de tu servidor MQTT
float hume, temp;
// //
float duration;
float distance;
float luz;
String valor;

OneWire oneWire(ONE_WIRE_BUS);  
DallasTemperature sen_water(&oneWire);
WiFiClient espClient;
PubSubClient client(espClient);

// Pin de datos del sensor DHT11
DHT dht(DHTPIN, DHTTYPE);


void setup() {
  Serial.begin(9600);
  delay(10);
// Conectar a la red WiFi

 
  Serial.println("\n Conectando a " + String(ssid));
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(2000);
    Serial.print(".");
  }
  Serial.println("\nConectado a la red WiFi");

  // Configurar el servidor MQTT
  client.setServer(mqtt_server,9000);
  client.setCallback(callback);

  // Inicializar el sensor DHT11
  dht.begin();
  sen_water.begin();
  
  pinMode(PIN_RED,   OUTPUT);
  pinMode(PIN_GREEN, OUTPUT);
  pinMode(PIN_BLUE,  OUTPUT);

  pinMode(trigPin, OUTPUT); // Sets the trigPin as an Output
  pinMode(echoPin, INPUT);

  
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }

   // reads the input on analog pin A0 (value between 0 and 1023)
  int analogValue = analogRead(A0);

  // Clears the trigPin
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);


  // Sets the trigPin on HIGH state for 10 micro seconds
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  // Reads the echoPin, returns the sound wave travel time in microseconds
  duration = pulseIn(echoPin, HIGH);

  // Calculating the distance
  distance= duration*0.034/2;

  String mensaje2;
  

if (analogValue < 100) {
    luz = 4; 
    valor = "Muy brillante"; 
    mensaje2 = "Luz: " + String(luz,2) + " luz " + " Valor: " + valor + " valor";  
    //Serial.println(" - Very bright");
  } else if (analogValue < 200) {
    luz = 3; 
    valor = "Brillante"; 
    mensaje2 = "Luz: " + String(luz,2) + " luz " + " Valor: " + valor + " valor";  
    //Serial.println(" - Bright");
  } else if (analogValue < 500) {
    luz = 2; 
    valor = "Claro"; 
    mensaje2 = "Luz: " + String(luz,2) + " luz " + " Valor: " + valor + " valor";  
    //Serial.println(" - Light");
  } else if (analogValue < 800) {
    luz = 1; 
    valor = "Tenue"; 
    mensaje2 = "Luz: " + String(luz,2) + " luz " + " Valor: " + valor + " valor";  
    //Serial.println(" - Dim");
  } else {
    luz = 0; 
    valor = "Oscuro"; 
    mensaje2 = "Luz: " + String(luz,2) + " luz " + " Valor: " + valor + " valor";  
    //Serial.println(" - Dark");
  }
  // Leer la temperatura y humedad desde el sensor DHT11
  float temperatura = dht.readTemperature();
  float humedad = dht.readHumidity();
  //temp Agua
  sen_water.requestTemperatures();
  String temp = String(sen_water.getTempCByIndex(0));

  // Construir el mensaje con temperatura,humedad & temperatura de agua
  String mensaje = "Temperatura: " + String(temperatura, 2) + " °C, Humedad: " + String(humedad, 2) + " %";
  String mensaje_Agua = "TemperaturaAgua: "+ temp ;
  String mensaje_Distancia = "Distancia: " + String(distance,2) + " cm";

  
  // Publicar en el tema específico
  client.publish("Tema/Datos", mensaje.c_str());
  client.publish("Tema/TempAgua",mensaje_Agua.c_str());
  // Usar c_str() para obtener el puntero a la cadena de caracteres
   Serial.println( mensaje.c_str() );
   Serial.println(mensaje_Agua.c_str());
  delay(5000);  // Esperar 5 segundos antes de la siguiente lectura
  
   // Publicar en el tema específico
  client.publish("Tema/Distancia", mensaje_Distancia.c_str());  // Usar c_str() para obtener el puntero a la cadena de caracteres
  client.publish("Tema/Luz", mensaje2.c_str());  // Usar c_str() para obtener el puntero a la cadena de caracteres
  Serial.println( mensaje.c_str() );
  Serial.println( mensaje2.c_str() );
  delay(5000);
}

void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Mensaje recibido en el tema: ");
  Serial.println(topic);
  Serial.print("Mensaje:");
  for (int i = 0; i < length; i++) {
    Serial.print((char)payload[i]);
  }
  Serial.print("Mensaje  0 :");
  Serial.println((char)payload[0]);

  // Control del LED
  if ((char)payload[0] == '1') {

    digitalWrite(PIN_RED,HIGH);  
    digitalWrite(PIN_GREEN,LOW);  
    digitalWrite(PIN_BLUE,HIGH);
    Serial.print("GREEN");
  } 
  if ((char)payload[0] == '2') {

   digitalWrite(PIN_RED,LOW);  
    digitalWrite(PIN_GREEN,LOW);  
    digitalWrite(PIN_BLUE,HIGH);  
    Serial.print("RED");
  } 
  if ((char)payload[0] == '3') {

    digitalWrite(PIN_RED,LOW);  
    digitalWrite(PIN_GREEN,HIGH);  
    digitalWrite(PIN_BLUE,HIGH);  
    Serial.print("RED");
  } 
  if ((char)payload[0] == '4') {

    digitalWrite(PIN_RED,255);  
    digitalWrite(PIN_GREEN,255);  
    digitalWrite(PIN_BLUE,LOW);   
   
    Serial.print("BLUE");
  } 
   else {
    digitalWrite(PIN_RED,LOW);  
    digitalWrite(PIN_GREEN,HIGH);  
    digitalWrite(PIN_BLUE,LOW);   
   
    Serial.print("BLUE");
  }
}
  


void reconnect() {
  while (!client.connected()) {
    Serial.println("Intentando conectar al servidor MQTT...");
    if (client.connect("ESP8266_Cliente")) {
      Serial.println("Conectado al servidor MQTT");
    } else {
      Serial.print("Fallo con error -> ");
      Serial.println(client.state());
      delay(2000);
    }
  }
}
