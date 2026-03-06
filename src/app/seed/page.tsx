'use client'

import { useState, useCallback } from 'react'
import { registrarConEmail, actualizarPerfil } from '@/lib/firebase/firebase-auth'
import { setDoc, doc, collection, getDocs, deleteDoc, serverTimestamp, getDb } from '@/lib/firebase/firebase-firestore'
import { categoriasIniciales } from '@/lib/dominio/categorias-iniciales'
import { provinciasEcuador } from '@/lib/dominio/provincias-ecuador'
import { imagenesPorCategoria } from './imagenes-seed'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

type LogEntry = {
  message: string
  type: 'info' | 'success' | 'error'
}

const ADMIN_EMAIL = 'admin@todoesalquilable.com'
const ADMIN_PASSWORD = 'TodoEsAlquilabl='
const ADMIN_NAME = 'Administrador'
const ADMIN_PHONE = '0991234567'

type Condicion = 'nuevo' | 'como_nuevo' | 'buen_estado' | 'aceptable'
type UnidadPrecio = 'hora' | 'dia' | 'semana' | 'mes'

const listingsPorCategoria: Record<string, Array<{ title: string; description: string; price: number; priceUnit: UnidadPrecio; condition: Condicion }>> = {
  Herramientas: [
    { title: 'Taladro percutor Bosch', description: 'Taladro percutor profesional Bosch 800W, ideal para trabajos en concreto y mampostería. Incluye maletín y juego de brocas.', price: 8, priceUnit: 'dia', condition: 'buen_estado' },
    { title: 'Sierra circular DeWalt', description: 'Sierra circular DeWalt 7 1/4" con guía láser. Perfecta para cortes precisos en madera y melamina.', price: 12, priceUnit: 'dia', condition: 'como_nuevo' },
    { title: 'Amoladora angular 9"', description: 'Amoladora angular industrial de 9 pulgadas, 2200W. Para corte y desbaste de metal y concreto.', price: 10, priceUnit: 'dia', condition: 'buen_estado' },
    { title: 'Compresor de aire 50L', description: 'Compresor de aire de 50 litros, 2.5 HP. Incluye manguera y pistola para pintar. Ideal para talleres.', price: 15, priceUnit: 'dia', condition: 'aceptable' },
    { title: 'Soldadora inverter MIG', description: 'Soldadora inverter MIG/MMA 200A. Fácil de transportar, perfecta para trabajos de soldadura en campo.', price: 20, priceUnit: 'dia', condition: 'nuevo' },
    { title: 'Pulidora de pisos industrial', description: 'Pulidora de pisos industrial para mármol, granito y concreto. Rendimiento de 40m2/hora.', price: 35, priceUnit: 'dia', condition: 'buen_estado' },
    { title: 'Rotomartillo Makita', description: 'Rotomartillo Makita SDS-Plus 26mm, 800W. Tres modos de operación: taladro, percutor y cincelado.', price: 15, priceUnit: 'dia', condition: 'como_nuevo' },
    { title: 'Lijadora orbital profesional', description: 'Lijadora orbital Makita de 5", velocidad variable. Ideal para acabados finos en madera y pintura.', price: 6, priceUnit: 'dia', condition: 'buen_estado' },
    { title: 'Juego de llaves torquímetro', description: 'Set completo de llaves con torquímetro de 1/2". Rango de 28-210 Nm. Para mecánica automotriz.', price: 10, priceUnit: 'dia', condition: 'nuevo' },
    { title: 'Hidrolavadora 2000 PSI', description: 'Hidrolavadora de alta presión 2000 PSI. Perfecta para limpieza de fachadas, vehículos y pisos.', price: 18, priceUnit: 'dia', condition: 'como_nuevo' },
  ],
  'Electrónica': [
    { title: 'Proyector Epson Full HD', description: 'Proyector Epson 3600 lúmenes, resolución Full HD. Incluye cable HDMI y control remoto. Ideal para presentaciones y cine en casa.', price: 25, priceUnit: 'dia', condition: 'como_nuevo' },
    { title: 'Laptop gaming MSI 16GB RAM', description: 'Laptop MSI con RTX 3060, 16GB RAM, SSD 512GB. Para diseño gráfico, edición de video o gaming.', price: 30, priceUnit: 'dia', condition: 'buen_estado' },
    { title: 'Parlante JBL Partybox 310', description: 'Parlante JBL Partybox 310 con luces LED. Potencia de 240W, batería de 18 horas. Para fiestas y eventos.', price: 35, priceUnit: 'dia', condition: 'nuevo' },
    { title: 'iPad Pro 12.9" con Apple Pencil', description: 'iPad Pro 12.9 pulgadas M2 con Apple Pencil 2da generación. Para diseño digital, ilustración o notas.', price: 20, priceUnit: 'dia', condition: 'como_nuevo' },
    { title: 'Monitor 4K 27" para diseño', description: 'Monitor LG 27UK850 4K UHD con USB-C. Calibración de color profesional, ideal para diseño y fotografía.', price: 12, priceUnit: 'dia', condition: 'buen_estado' },
    { title: 'Consola PlayStation 5', description: 'PlayStation 5 con dos mandos y 5 juegos. Incluye cables y soporte vertical. Perfecta para fin de semana.', price: 18, priceUnit: 'dia', condition: 'como_nuevo' },
    { title: 'Drone DJI Mini 3 Pro', description: 'Drone DJI Mini 3 Pro con cámara 4K. Autonomía de 34 minutos. Incluye 3 baterías y estuche de transporte.', price: 40, priceUnit: 'dia', condition: 'nuevo' },
    { title: 'Impresora 3D Creality Ender', description: 'Impresora 3D Creality Ender 3 V2. Volumen de impresión 220x220x250mm. Incluye filamento PLA de 1kg.', price: 15, priceUnit: 'dia', condition: 'buen_estado' },
    { title: 'Router WiFi 6 Mesh', description: 'Sistema WiFi 6 Mesh de 3 nodos. Cobertura de hasta 500m2. Ideal para eventos o cobertura temporal.', price: 8, priceUnit: 'dia', condition: 'nuevo' },
    { title: 'Smartwatch Garmin Fenix 7', description: 'Reloj GPS Garmin Fenix 7 con mapas topográficos. Para trekking, trail running y aventura al aire libre.', price: 10, priceUnit: 'dia', condition: 'como_nuevo' },
  ],
  Deportes: [
    { title: 'Bicicleta de montaña Trek', description: 'Bicicleta MTB Trek Marlin 7, rodado 29. Suspensión delantera RockShox. Ideal para rutas en la sierra ecuatoriana.', price: 15, priceUnit: 'dia', condition: 'buen_estado' },
    { title: 'Kayak individual con remo', description: 'Kayak sit-on-top individual con remo y chaleco salvavidas incluido. Para ríos tranquilos y lagunas.', price: 25, priceUnit: 'dia', condition: 'como_nuevo' },
    { title: 'Tabla de surf 6\'2"', description: 'Tabla de surf shortboard 6\'2". Ideal para las olas de Montañita, Ayampe o Canoa.', price: 12, priceUnit: 'dia', condition: 'buen_estado' },
    { title: 'Set de palos de golf completo', description: 'Set completo de palos de golf Callaway con bolsa y carrito. 14 palos incluidos. Para golfistas ocasionales.', price: 20, priceUnit: 'dia', condition: 'como_nuevo' },
    { title: 'Equipo completo de buceo', description: 'Equipo de buceo: máscara, regulador, BCD, traje de neopreno 3mm. Certificación requerida para alquilar.', price: 30, priceUnit: 'dia', condition: 'buen_estado' },
    { title: 'Caminadora eléctrica plegable', description: 'Caminadora eléctrica plegable con inclinación hasta 15%. Velocidad máxima 16 km/h. Monitor de frecuencia cardíaca.', price: 50, priceUnit: 'mes', condition: 'nuevo' },
    { title: 'Raquetas de tenis Wilson (par)', description: 'Par de raquetas de tenis Wilson Pro Staff con estuche. Incluye tubo de pelotas Wilson US Open.', price: 8, priceUnit: 'dia', condition: 'buen_estado' },
    { title: 'Patineta eléctrica Xiaomi', description: 'Scooter eléctrico Xiaomi Pro 2, autonomía 45km. Velocidad máxima 25km/h. Para movilidad urbana en Quito o Guayaquil.', price: 10, priceUnit: 'dia', condition: 'como_nuevo' },
    { title: 'Tabla de paddle surf inflable', description: 'Tabla de paddle surf inflable con remo, bomba y mochila. Ideal para el mar o lagos de la sierra.', price: 15, priceUnit: 'dia', condition: 'nuevo' },
    { title: 'Elíptica magnética profesional', description: 'Elíptica magnética con 16 niveles de resistencia y programas de entrenamiento. Para rehabilitación o ejercicio en casa.', price: 45, priceUnit: 'mes', condition: 'buen_estado' },
  ],
  'Vehículos': [
    { title: 'Camioneta Hilux doble cabina', description: 'Toyota Hilux 4x4 doble cabina, perfecta para viajes a la sierra o transporte de carga. Incluye seguro básico.', price: 65, priceUnit: 'dia', condition: 'buen_estado' },
    { title: 'Moto Yamaha XTZ 250', description: 'Moto enduro Yamaha XTZ 250. Ideal para recorrer rutas de aventura en Ecuador. Se entrega con casco y chaleco.', price: 30, priceUnit: 'dia', condition: 'como_nuevo' },
    { title: 'Furgoneta para mudanzas', description: 'Furgoneta de carga 2 toneladas. Perfecta para mudanzas dentro de la ciudad. Combustible no incluido.', price: 50, priceUnit: 'dia', condition: 'aceptable' },
    { title: 'Auto sedán para turismo', description: 'Hyundai Accent sedán, económico en combustible. Ideal para turismo en la costa o la sierra. Aire acondicionado incluido.', price: 35, priceUnit: 'dia', condition: 'buen_estado' },
    { title: 'Cuadrones ATV 250cc (par)', description: 'Par de cuadrones ATV 250cc para aventura. Ideales para recorridos en la playa o caminos rurales.', price: 40, priceUnit: 'dia', condition: 'buen_estado' },
    { title: 'SUV familiar Kia Sportage', description: 'Kia Sportage 4x2, 5 pasajeros. Amplio baúl, aire acondicionado, GPS incluido. Ideal para viajes familiares.', price: 55, priceUnit: 'dia', condition: 'como_nuevo' },
    { title: 'Bicicleta eléctrica urbana', description: 'Bicicleta eléctrica con autonomía de 60km. Motor 350W, perfecta para movilidad diaria en la ciudad.', price: 12, priceUnit: 'dia', condition: 'nuevo' },
    { title: 'Remolque para carga ligera', description: 'Remolque de carga ligera hasta 500kg. Enganche universal. Para transporte de materiales o equipos.', price: 20, priceUnit: 'dia', condition: 'aceptable' },
    { title: 'Van para transporte de grupo', description: 'Van Hyundai H1, 12 pasajeros. Para excursiones grupales, traslados al aeropuerto o eventos.', price: 70, priceUnit: 'dia', condition: 'buen_estado' },
    { title: 'Moto scooter automática 150cc', description: 'Scooter automática 150cc, ideal para movilizarse en ciudades de la costa. Bajo consumo de combustible.', price: 18, priceUnit: 'dia', condition: 'como_nuevo' },
  ],
  Hogar: [
    { title: 'Lavadora Samsung 18kg', description: 'Lavadora Samsung de carga frontal, 18kg. Tecnología EcoBubble. Ideal mientras tu lavadora está en reparación.', price: 60, priceUnit: 'mes', condition: 'como_nuevo' },
    { title: 'Aspiradora Robot iRobot Roomba', description: 'Robot aspiradora iRobot Roomba i7 con mapeo inteligente. Se programa desde el celular. Incluye base de carga.', price: 8, priceUnit: 'dia', condition: 'nuevo' },
    { title: 'Colchón matrimonial con sommier', description: 'Colchón Chaide matrimonial con sommier y protector. Memory foam, firmeza media. Para visitas o mudanzas.', price: 40, priceUnit: 'mes', condition: 'buen_estado' },
    { title: 'Juego de sala completo', description: 'Juego de sala: sofá de 3 cuerpos, loveseat y sillón individual. Tela antimanchas color gris. Para eventos o amoblado temporal.', price: 80, priceUnit: 'mes', condition: 'buen_estado' },
    { title: 'Refrigeradora Mabe dos puertas', description: 'Refrigeradora Mabe 400L, dos puertas, dispensador de agua. Para departamentos temporales o eventos.', price: 55, priceUnit: 'mes', condition: 'aceptable' },
    { title: 'Cocina de inducción 4 hornillas', description: 'Cocina de inducción con 4 hornillas y horno. Compatible con ollas de inducción. Instalación incluida.', price: 45, priceUnit: 'mes', condition: 'como_nuevo' },
    { title: 'Purificador de aire Dyson', description: 'Purificador de aire Dyson Pure Cool con filtro HEPA. Remueve 99.95% de partículas. Para alergias o calidad de aire.', price: 10, priceUnit: 'dia', condition: 'nuevo' },
    { title: 'Escritorio ejecutivo con silla', description: 'Escritorio de madera con silla ergonómica reclinable. Para home office temporal o estudios.', price: 35, priceUnit: 'mes', condition: 'buen_estado' },
    { title: 'Microondas y horno eléctrico', description: 'Combo: microondas Samsung 32L + horno eléctrico 60L. Para departamentos amoblados o temporadas.', price: 25, priceUnit: 'mes', condition: 'como_nuevo' },
    { title: 'Ventilador industrial de pedestal', description: 'Ventilador industrial de pedestal, 3 velocidades, oscilación. Ideal para la costa ecuatoriana en temporada caliente.', price: 5, priceUnit: 'dia', condition: 'buen_estado' },
  ],
  'Eventos y Fiestas': [
    { title: 'Carpa para eventos 6x12m', description: 'Carpa tipo hangar 6x12 metros con laterales desmontables. Capacidad 80 personas. Para matrimonios, quinceañeras o ferias.', price: 120, priceUnit: 'dia', condition: 'buen_estado' },
    { title: 'Mesas y sillas plegables (20 sets)', description: '20 mesas rectangulares plegables con 80 sillas. Incluye mantelería blanca. Para eventos sociales y corporativos.', price: 80, priceUnit: 'dia', condition: 'buen_estado' },
    { title: 'Inflable castillo para niños', description: 'Inflable tipo castillo 4x4m con tobogán. Incluye motor soplador y supervisión básica. Para fiestas infantiles.', price: 50, priceUnit: 'dia', condition: 'como_nuevo' },
    { title: 'Máquina de humo y luces LED', description: 'Kit de iluminación: máquina de humo 1500W + 4 luces LED PAR + bola disco. Para fiestas y eventos sociales.', price: 25, priceUnit: 'dia', condition: 'nuevo' },
    { title: 'Equipo de sonido profesional', description: 'Sistema de sonido: 2 cabinas activas 15", subwoofer 18", mezcladora 12 canales. Para eventos de hasta 200 personas.', price: 60, priceUnit: 'dia', condition: 'buen_estado' },
    { title: 'Fuente de chocolate 5 niveles', description: 'Fuente de chocolate de 5 niveles en acero inoxidable. Capacidad 4kg de chocolate. Para matrimonios y eventos.', price: 30, priceUnit: 'dia', condition: 'como_nuevo' },
    { title: 'Arco de globos y decoración', description: 'Kit de decoración: arco de globos orgánico, cortina de flecos, letrero LED personalizable. Para baby showers y cumpleaños.', price: 35, priceUnit: 'dia', condition: 'nuevo' },
    { title: 'Karaoke profesional con pantalla', description: 'Sistema de karaoke: pantalla 55", amplificador, 2 micrófonos inalámbricos, catálogo de 5000 canciones en español.', price: 40, priceUnit: 'dia', condition: 'buen_estado' },
    { title: 'Catering set para 50 personas', description: 'Set de catering: chafing dishes, bandejas, cubiertos, copas y platos para 50 personas. Incluye transporte.', price: 45, priceUnit: 'dia', condition: 'como_nuevo' },
    { title: 'Photobooth con props e impresora', description: 'Photobooth con cámara, impresora instantánea, ring light y más de 50 props divertidos. Para cualquier evento.', price: 55, priceUnit: 'dia', condition: 'nuevo' },
  ],
  'Ropa y Disfraces': [
    { title: 'Vestido de novia talla M', description: 'Vestido de novia estilo princesa, talla M, color ivory. Incluye velo y crinolina. Usado una sola vez.', price: 50, priceUnit: 'dia', condition: 'como_nuevo' },
    { title: 'Terno completo caballero talla L', description: 'Terno slim fit azul marino talla L. Incluye saco, pantalón, camisa blanca y corbata. Para graduaciones o eventos formales.', price: 25, priceUnit: 'dia', condition: 'buen_estado' },
    { title: 'Disfraz completo de superhéroe', description: 'Disfraz profesional de superhéroe con capa, máscara y accesorios. Talla adulto. Para fiestas temáticas o animación.', price: 15, priceUnit: 'dia', condition: 'buen_estado' },
    { title: 'Colección de disfraces infantiles', description: '10 disfraces infantiles variados: princesas, piratas, animales. Tallas de 4 a 10 años. Para fiestas de disfraces.', price: 30, priceUnit: 'dia', condition: 'como_nuevo' },
    { title: 'Vestido de quinceañera rosa', description: 'Vestido de quinceañera estilo ball gown color rosa pastel, talla S-M. Incluye corona y guantes.', price: 40, priceUnit: 'dia', condition: 'nuevo' },
    { title: 'Traje típico ecuatoriano Otavalo', description: 'Traje típico de Otavalo para mujer: anaco, blusa bordada, fachalina. Para eventos culturales o presentaciones.', price: 20, priceUnit: 'dia', condition: 'buen_estado' },
    { title: 'Pack de togas de graduación (10)', description: '10 togas con birretes en color azul oscuro. Tallas variadas. Para ceremonias de graduación escolar o universitaria.', price: 35, priceUnit: 'dia', condition: 'como_nuevo' },
    { title: 'Vestido largo de gala talla S', description: 'Vestido largo de gala color rojo con lentejuelas, talla S. Espalda descubierta. Para eventos elegantes.', price: 20, priceUnit: 'dia', condition: 'como_nuevo' },
    { title: 'Disfraz mascota corporativa', description: 'Disfraz de mascota tipo peluche personalizable. Ideal para publicidad, eventos corporativos o activaciones de marca.', price: 45, priceUnit: 'dia', condition: 'buen_estado' },
    { title: 'Uniforme de chef profesional', description: 'Uniforme completo de chef: chaqueta, pantalón, gorro y delantal. Talla L. Para eventos gastronómicos o fotografía.', price: 10, priceUnit: 'dia', condition: 'nuevo' },
  ],
  'Música': [
    { title: 'Guitarra acústica Fender', description: 'Guitarra acústica Fender CD-60S con estuche rígido. Cuerdas nuevas, excelente sonido. Para prácticas o presentaciones.', price: 8, priceUnit: 'dia', condition: 'buen_estado' },
    { title: 'Piano digital Yamaha 88 teclas', description: 'Piano digital Yamaha P-125, 88 teclas con peso. Incluye pedal de sustain y soporte. Ideal para ensayos o recitales.', price: 15, priceUnit: 'dia', condition: 'como_nuevo' },
    { title: 'Batería acústica Pearl completa', description: 'Batería Pearl Export 5 piezas con platillos Zildjian. Incluye baquetas y banqueta. Para ensayos de bandas.', price: 25, priceUnit: 'dia', condition: 'buen_estado' },
    { title: 'Controlador DJ Pioneer DDJ-400', description: 'Controlador DJ Pioneer DDJ-400 con software Rekordbox. Para fiestas, prácticas o eventos pequeños.', price: 15, priceUnit: 'dia', condition: 'nuevo' },
    { title: 'Violín 4/4 con estuche y arco', description: 'Violín 4/4 de madera maciza con estuche, arco y resina. Afinado y listo para tocar. Para estudiantes o eventos.', price: 10, priceUnit: 'dia', condition: 'como_nuevo' },
    { title: 'Amplificador guitarra Marshall 100W', description: 'Amplificador Marshall DSL 100W con gabinete 4x12. Sonido clásico para rock y blues. Ideal para presentaciones en vivo.', price: 20, priceUnit: 'dia', condition: 'buen_estado' },
    { title: 'Teclado Korg sintetizador', description: 'Sintetizador Korg Minilogue XD de 4 voces. Polifonía analógica. Para producción musical o presentaciones.', price: 12, priceUnit: 'dia', condition: 'como_nuevo' },
    { title: 'Set de micrófonos Shure (4)', description: '4 micrófonos Shure SM58 con cables XLR y stands. Estándar de la industria para voz en vivo.', price: 18, priceUnit: 'dia', condition: 'buen_estado' },
    { title: 'Bajo eléctrico Fender Jazz Bass', description: 'Bajo eléctrico Fender Jazz Bass con amplificador Ampeg 100W. Incluye cable, correa y estuche.', price: 15, priceUnit: 'dia', condition: 'como_nuevo' },
    { title: 'Cajón peruano artesanal', description: 'Cajón peruano hecho a mano en Ecuador, madera de tornillo. Sonido profundo y nítido. Para música latina y fusión.', price: 5, priceUnit: 'dia', condition: 'nuevo' },
  ],
  'Fotografía y Video': [
    { title: 'Cámara Canon EOS R6 con lente', description: 'Canon EOS R6 mirrorless con lente RF 24-105mm f/4L. Incluye tarjeta SD 128GB y batería extra.', price: 40, priceUnit: 'dia', condition: 'como_nuevo' },
    { title: 'Kit de iluminación estudio (3 luces)', description: 'Kit de 3 luces LED bicolor con softboxes, stands y reflectores. Para fotografía de producto o retratos.', price: 25, priceUnit: 'dia', condition: 'buen_estado' },
    { title: 'Gimbal DJI RS3 para cámara', description: 'Estabilizador DJI RS3 para cámaras mirrorless. Carga máxima 3kg. Para video cinematográfico profesional.', price: 20, priceUnit: 'dia', condition: 'nuevo' },
    { title: 'Lente Sony 70-200mm f/2.8 GM', description: 'Teleobjetivo Sony 70-200mm f/2.8 GM II. Para deportes, retratos y eventos. Montura Sony E-mount.', price: 30, priceUnit: 'dia', condition: 'como_nuevo' },
    { title: 'Cámara GoPro Hero 12 Black', description: 'GoPro Hero 12 con accesorios: arnés de pecho, mount para casco, selfie stick y estuche acuático.', price: 15, priceUnit: 'dia', condition: 'nuevo' },
    { title: 'Backdrop y fondos fotográficos', description: 'Set de 5 fondos fotográficos (blanco, negro, gris, verde chromakey, madera). Con estructura de soporte 3x2.6m.', price: 12, priceUnit: 'dia', condition: 'buen_estado' },
    { title: 'Drone DJI Air 3 para video', description: 'Drone DJI Air 3 con cámara dual 4K/48MP. 3 baterías, filtros ND incluidos. Para video aéreo profesional.', price: 45, priceUnit: 'dia', condition: 'como_nuevo' },
    { title: 'Trípode Manfrotto carbono', description: 'Trípode Manfrotto de fibra de carbono con cabezal fluido. Capacidad 8kg. Para fotografía y video profesional.', price: 8, priceUnit: 'dia', condition: 'buen_estado' },
    { title: 'Monitor de campo Atomos 7"', description: 'Monitor Atomos Ninja V 5" HDR con grabación ProRes. Para monitoreo y grabación profesional en campo.', price: 18, priceUnit: 'dia', condition: 'como_nuevo' },
    { title: 'Kit de audio para video', description: 'Kit de audio: micrófono Rode VideoMic Pro+, grabadora Zoom H5, micrófono lavalier. Para entrevistas y documentales.', price: 22, priceUnit: 'dia', condition: 'nuevo' },
  ],
  'Camping y Aventura': [
    { title: 'Carpa 4 personas North Face', description: 'Carpa North Face Wawona 4 personas, doble capa. Resistente a lluvia y viento. Ideal para el Cotopaxi o Cajas.', price: 12, priceUnit: 'dia', condition: 'buen_estado' },
    { title: 'Sleeping bag -10°C', description: 'Sleeping bag para temperatura de hasta -10°C, relleno sintético. Incluye bolsa de compresión. Para alta montaña.', price: 8, priceUnit: 'dia', condition: 'como_nuevo' },
    { title: 'Cocina portátil a gas con bombonas', description: 'Cocina portátil de camping con 2 quemadores y 4 bombonas de gas. Incluye parrilla. Para acampadas en grupo.', price: 7, priceUnit: 'dia', condition: 'buen_estado' },
    { title: 'Hamacas con mosquitero (par)', description: 'Par de hamacas ultraligeras con mosquitero integrado. Para camping en la Amazonía o costa ecuatoriana.', price: 6, priceUnit: 'dia', condition: 'nuevo' },
    { title: 'Set de escalada completo', description: 'Arnés, casco, mosquetones, cuerdas y dispositivo de aseguramiento. Para escalada en roca o vía ferrata.', price: 20, priceUnit: 'dia', condition: 'buen_estado' },
    { title: 'Cooler con ruedas 60L', description: 'Cooler Igloo 60 litros con ruedas. Mantiene hielo hasta 5 días. Para camping, playa o eventos al aire libre.', price: 5, priceUnit: 'dia', condition: 'como_nuevo' },
    { title: 'Kit de trekking (bastones + mochila)', description: 'Mochila de trekking 65L + par de bastones telescópicos. Para rutas como el Quilotoa o Ingapirca.', price: 10, priceUnit: 'dia', condition: 'buen_estado' },
    { title: 'GPS Garmin para senderismo', description: 'GPS Garmin GPSMAP 66i con comunicación satelital InReach. Mapas de Ecuador precargados. Para rutas remotas.', price: 12, priceUnit: 'dia', condition: 'como_nuevo' },
    { title: 'Linterna frontal y panel solar', description: 'Linterna frontal recargable 1000 lúmenes + panel solar plegable 20W. Para camping sin acceso a electricidad.', price: 5, priceUnit: 'dia', condition: 'nuevo' },
    { title: 'Binoculares profesionales 10x42', description: 'Binoculares Nikon Monarch 10x42. Para observación de aves en Mindo, Mashpi o las Galápagos.', price: 8, priceUnit: 'dia', condition: 'como_nuevo' },
  ],
  'Bebés y Niños': [
    { title: 'Coche de bebé Travel System', description: 'Coche de bebé Chicco Travel System con silla para auto. Plegable, liviano, ideal para viajes o paseos.', price: 8, priceUnit: 'dia', condition: 'como_nuevo' },
    { title: 'Cuna portátil plegable', description: 'Cuna portátil Graco Pack n Play con cambiador y móvil musical. Para viajes o cuando el bebé visita la casa de los abuelos.', price: 6, priceUnit: 'dia', condition: 'buen_estado' },
    { title: 'Silla de comer para bebé', description: 'Silla de comer Ingenuity 3 en 1 con bandeja removible. Para bebés de 6 meses a 3 años. Fácil de limpiar.', price: 4, priceUnit: 'dia', condition: 'como_nuevo' },
    { title: 'Parque infantil hexagonal', description: 'Corral de juegos hexagonal con colchoneta y juguetes. Seguro y portátil. Para bebés de 6 a 24 meses.', price: 5, priceUnit: 'dia', condition: 'buen_estado' },
    { title: 'Andador y saltarín 2 en 1', description: 'Andador Baby Einstein con estación de actividades y modo saltarín. Estimulación temprana incluida.', price: 4, priceUnit: 'dia', condition: 'nuevo' },
    { title: 'Silla de auto para niños grupo 1-2', description: 'Silla de auto Britax con sistema ISOFIX, grupo 1-2 (9-25kg). Para viajes seguros con niños pequeños.', price: 6, priceUnit: 'dia', condition: 'como_nuevo' },
    { title: 'Bañera plegable con soporte', description: 'Bañera plegable para bebé con soporte ajustable y termómetro integrado. Para recién nacidos hasta 24 meses.', price: 3, priceUnit: 'dia', condition: 'buen_estado' },
    { title: 'Monitor de bebé con cámara', description: 'Monitor Motorola con cámara, visión nocturna, sensor de temperatura. Pantalla de 5 pulgadas. Tranquilidad para los padres.', price: 5, priceUnit: 'dia', condition: 'como_nuevo' },
    { title: 'Cargador ergonómico portabebé', description: 'Cargador ergonómico Ergobaby Omni 360 para bebés de 3-20kg. 4 posiciones de carga. Para paseos y viajes.', price: 4, priceUnit: 'dia', condition: 'nuevo' },
    { title: 'Castillo inflable pequeño', description: 'Inflable para niños 2x2m para uso en interiores o patios pequeños. Incluye motor soplador. Para cumpleaños infantiles.', price: 25, priceUnit: 'dia', condition: 'buen_estado' },
  ],
  Oficina: [
    { title: 'Silla ergonómica Herman Miller', description: 'Silla ergonómica Herman Miller Aeron, talla B. Ajuste lumbar y reposabrazos. Para home office profesional.', price: 45, priceUnit: 'mes', condition: 'como_nuevo' },
    { title: 'Escritorio de pie motorizado', description: 'Escritorio standing desk motorizado, superficie 140x70cm. Memoria de 3 alturas. Mejora la productividad en casa.', price: 35, priceUnit: 'mes', condition: 'nuevo' },
    { title: 'Impresora multifunción láser', description: 'Impresora HP LaserJet Pro multifunción: imprime, escanea, copia. WiFi y Ethernet. Incluye tóner de inicio.', price: 25, priceUnit: 'mes', condition: 'buen_estado' },
    { title: 'Monitor doble brazo + 2 pantallas', description: 'Dos monitores Dell 27" Full HD con brazo doble articulado. Para productividad y trabajo multitarea.', price: 30, priceUnit: 'mes', condition: 'como_nuevo' },
    { title: 'Pizarra digital interactiva 75"', description: 'Pizarra digital interactiva Samsung Flip 75". Para salas de reuniones, capacitaciones o coworkings temporales.', price: 40, priceUnit: 'dia', condition: 'nuevo' },
    { title: 'Kit de videoconferencia Logitech', description: 'Kit Logitech Rally: cámara 4K, barra de sonido, micrófono. Para salas de videoconferencia profesionales.', price: 20, priceUnit: 'dia', condition: 'buen_estado' },
    { title: 'Destructor de documentos industrial', description: 'Trituradora industrial Fellowes para 20 hojas simultáneas. Corte en partículas. Para oficinas temporales.', price: 15, priceUnit: 'mes', condition: 'como_nuevo' },
    { title: 'Proyector interactivo Epson', description: 'Proyector Epson interactivo de tiro corto, 3500 lúmenes. Para presentaciones y capacitaciones empresariales.', price: 30, priceUnit: 'dia', condition: 'buen_estado' },
    { title: 'UPS regulador de voltaje 3KVA', description: 'UPS APC Smart 3KVA con regulador de voltaje integrado. Protección para equipos de cómputo. Autonomía 30 minutos.', price: 20, priceUnit: 'mes', condition: 'nuevo' },
    { title: 'Webcam 4K con ring light', description: 'Webcam Elgato Facecam Pro 4K + Ring Light de 18". Para streaming, videoconferencias o grabación de contenido.', price: 8, priceUnit: 'dia', condition: 'como_nuevo' },
  ],
}

const obtenerImagenes = (categoriaNombre: string, listingIndex: number): string[] => {
  const pool = imagenesPorCategoria[categoriaNombre] ?? []
  if (pool.length === 0) return []
  const i = listingIndex * 2
  return [pool[i % pool.length], pool[(i + 1) % pool.length]]
}

// Distribute provinces deterministically so every province gets listings
let provinceCounter = 0
const getNextProvince = (): string => {
  const provincia = provinciasEcuador[provinceCounter % provinciasEcuador.length]
  provinceCounter++
  return provincia.nombre
}

export default function SeedPage() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [isDone, setIsDone] = useState(false)

  const addLog = useCallback((message: string, type: LogEntry['type'] = 'info') => {
    setLogs((prev) => [...prev, { message, type }])
  }, [])

  const runSeed = useCallback(async () => {
    setIsRunning(true)
    setLogs([])
    setIsDone(false)

    const db = getDb()
    let adminUid = ''
    provinceCounter = 0

    // Step 1: Create admin user
    addLog('Creando usuario administrador...')
    try {
      const credential = await registrarConEmail(ADMIN_EMAIL, ADMIN_PASSWORD)
      adminUid = credential.user.uid

      await actualizarPerfil(credential.user, { displayName: ADMIN_NAME })

      await setDoc(doc(db, 'users', adminUid), {
        uid: adminUid,
        email: ADMIN_EMAIL,
        displayName: ADMIN_NAME,
        photoURL: null,
        phone: ADMIN_PHONE,
        province: 'Pichincha',
        city: 'Quito',
        address: 'Av. Amazonas y Naciones Unidas',
        role: 'super_admin',
        activeListingCount: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })

      addLog(`Usuario admin creado: ${ADMIN_EMAIL} (uid: ${adminUid})`, 'success')
    } catch (error: unknown) {
      const firebaseError = error as { code?: string; message?: string }
      if (firebaseError.code === 'auth/email-already-in-use') {
        addLog('El usuario admin ya existe. Intentando iniciar sesion...', 'info')
        try {
          const { iniciarSesionConEmail } = await import('@/lib/firebase/firebase-auth')
          const credential = await iniciarSesionConEmail(ADMIN_EMAIL, ADMIN_PASSWORD)
          adminUid = credential.user.uid

          await setDoc(doc(db, 'users', adminUid), {
            uid: adminUid,
            email: ADMIN_EMAIL,
            displayName: ADMIN_NAME,
            photoURL: null,
            phone: ADMIN_PHONE,
            province: 'Pichincha',
            city: 'Quito',
            address: 'Av. Amazonas y Naciones Unidas',
            role: 'super_admin',
            activeListingCount: 0,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          }, { merge: true })

          addLog(`Usuario admin existente actualizado (uid: ${adminUid})`, 'success')
        } catch (loginError: unknown) {
          const loginFirebaseError = loginError as { message?: string }
          addLog(`Error al iniciar sesion con admin existente: ${loginFirebaseError.message}`, 'error')
          setIsRunning(false)
          return
        }
      } else {
        addLog(`Error creando admin: ${firebaseError.message}`, 'error')
        setIsRunning(false)
        return
      }
    }

    // Step 2: Delete existing data
    addLog('Eliminando datos anteriores...')
    try {
      const listingsSnap = await getDocs(collection(db, 'listings'))
      let deletedListings = 0
      for (const docSnap of listingsSnap.docs) {
        try {
          await deleteDoc(doc(db, 'listings', docSnap.id))
          deletedListings++
        } catch {
          // Skip individual delete failures
        }
        await delay(50)
      }
      addLog(`  ${deletedListings} anuncios eliminados`, 'success')

      const catsSnap = await getDocs(collection(db, 'categories'))
      let deletedCats = 0
      for (const docSnap of catsSnap.docs) {
        try {
          await deleteDoc(doc(db, 'categories', docSnap.id))
          deletedCats++
        } catch {
          // Skip individual delete failures
        }
        await delay(50)
      }
      addLog(`  ${deletedCats} categorias eliminadas`, 'success')
    } catch (error: unknown) {
      const firebaseError = error as { message?: string }
      addLog(`Error eliminando datos: ${firebaseError.message}`, 'error')
    }

    // Step 3: Create categories
    addLog('Creando categorias...')
    const categoryIds: Record<string, string> = {}

    for (const cat of categoriasIniciales) {
      try {
        const catRef = doc(collection(db, 'categories'))
        const catData = {
          name: cat.nombre,
          nameLower: cat.nombre.toLowerCase(),
          icon: cat.icono,
          listingCount: 10,
          isActive: true,
          createdAt: serverTimestamp(),
        }
        await setDoc(catRef, catData)
        categoryIds[cat.nombre] = catRef.id
        addLog(`  Categoria creada: ${cat.icono} ${cat.nombre} (id: ${catRef.id})`, 'success')
      } catch (error: unknown) {
        const firebaseError = error as { message?: string }
        addLog(`  Error creando categoria ${cat.nombre}: ${firebaseError.message}`, 'error')
      }
      await delay(100)
    }

    // Step 4: Create listings
    addLog('Creando anuncios de alquiler...')
    let totalCreated = 0

    for (const cat of categoriasIniciales) {
      const catId = categoryIds[cat.nombre]
      if (!catId) {
        addLog(`  Saltando anuncios para ${cat.nombre} (sin ID de categoria)`, 'error')
        continue
      }

      const listings = listingsPorCategoria[cat.nombre]
      if (!listings) {
        addLog(`  No hay datos de anuncios para ${cat.nombre}`, 'error')
        continue
      }

      for (let li = 0; li < listings.length; li++) {
        const listing = listings[li]
        const province = getNextProvince()
        const images = obtenerImagenes(cat.nombre, li)

        const listingData = {
          title: listing.title,
          titleLower: listing.title.toLowerCase(),
          description: listing.description,
          categoryId: catId,
          categoryName: cat.nombre,
          condition: listing.condition,
          price: listing.price,
          priceUnit: listing.priceUnit,
          province,
          images,
          thumbnails: images,
          ownerId: adminUid,
          ownerName: ADMIN_NAME,
          ownerPhone: ADMIN_PHONE,
          ownerPhotoURL: null,
          status: 'aprobado',
          rejectionReason: null,
          moderatorId: adminUid,
          moderatedAt: serverTimestamp(),
          viewCount: Math.floor(Math.random() * 150),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        }

        for (let attempt = 0; attempt < 2; attempt++) {
          try {
            const listingRef = doc(collection(db, 'listings'))
            await setDoc(listingRef, listingData)
            totalCreated++
            break
          } catch (error: unknown) {
            if (attempt === 0) {
              await delay(500)
            } else {
              const firebaseError = error as { message?: string }
              addLog(`  Error creando anuncio "${listing.title}": ${firebaseError.message}`, 'error')
            }
          }
        }

        // Small delay to avoid overwhelming Firestore rule evaluations
        await delay(100)
      }

      addLog(`  ${cat.icono} ${cat.nombre}: 10 anuncios creados`, 'success')
    }

    addLog(`Seed completado: ${Object.keys(categoryIds).length} categorias y ${totalCreated} anuncios creados.`, 'success')
    setIsDone(true)
    setIsRunning(false)
  }, [addLog])

  return (
    <div style={{ maxWidth: 800, margin: '40px auto', padding: '0 20px', fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ fontSize: 28, marginBottom: 8 }}>Seed de Base de Datos</h1>
      <p style={{ color: '#666', marginBottom: 24 }}>
        Esta pagina crea un usuario administrador, 12 categorias y 120 anuncios de prueba en Firestore.
      </p>

      <button
        onClick={runSeed}
        disabled={isRunning}
        style={{
          padding: '12px 24px',
          fontSize: 16,
          fontWeight: 600,
          color: '#fff',
          backgroundColor: isRunning ? '#999' : '#2563eb',
          border: 'none',
          borderRadius: 8,
          cursor: isRunning ? 'not-allowed' : 'pointer',
          marginBottom: 24,
        }}
      >
        {isRunning ? 'Ejecutando seed...' : isDone ? 'Ejecutar seed de nuevo' : 'Iniciar Seed'}
      </button>

      {logs.length > 0 && (
        <div
          style={{
            backgroundColor: '#111',
            color: '#eee',
            borderRadius: 8,
            padding: 16,
            maxHeight: 500,
            overflowY: 'auto',
            fontSize: 14,
            lineHeight: 1.6,
            fontFamily: 'monospace',
          }}
        >
          {logs.map((log, i) => (
            <div
              key={i}
              style={{
                color:
                  log.type === 'success'
                    ? '#4ade80'
                    : log.type === 'error'
                      ? '#f87171'
                      : '#94a3b8',
              }}
            >
              {log.type === 'success' ? '[OK] ' : log.type === 'error' ? '[ERROR] ' : '[...] '}
              {log.message}
            </div>
          ))}
        </div>
      )}

      {isDone && (
        <div
          style={{
            marginTop: 24,
            padding: 16,
            backgroundColor: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: 8,
            color: '#166534',
          }}
        >
          <strong>Seed completado exitosamente.</strong>
          <br />
          Admin: {ADMIN_EMAIL} / {ADMIN_PASSWORD}
          <br />
          Categorias: 12 | Anuncios: 120
        </div>
      )}
    </div>
  )
}
