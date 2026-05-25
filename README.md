# 🧠 mercadoACTIVO — Oráculo de Bolsa para City Venture 📈

¡Bienvenido a **mercadoACTIVO**! Este proyecto es un simulador interactivo de mercado de valores en tiempo real diseñado específicamente como oráculo de cotizaciones, calculadora de efectivo e inyector de eventos para el juego de mesa físico **City Venture**.

Esta versión del simulador está optimizada en exclusiva para el sector de **Tecnología / IA**, proporcionando una experiencia ágil, de alta volatilidad y emocionante para los jugadores.

---

## 🚀 Características Clave

- **Bolsa en Tiempo Real**: Un motor deterministic-realtime que simula movimientos en las acciones minuto a minuto basándose en un algoritmo de camino aleatorio sincronizado por tiempo.
- **Enfoque Tecnológico (Tecnología / IA)**: Cotizaciones para las 6 grandes empresas ficticias del sector:
  - 🟢 **NVDA Core** (Inspirada en NVIDIA)
  - 🟢 **AetherAI**
  - 🟢 **Quantum Byte**
  - 🟢 **CyberMind Industries**
  - 🟢 **NeuroLink Systems**
  - 🟢 **Titan Compute**
- **Inyección de Eventos Físicos**: Permite inyectar códigos de eventos de cartas físicas directamente en la simulación web para alterar las tendencias y precios del mercado en tiempo real (ej. Códigos `101` a `107` para subidas de mercado, y `201` a `206` para caídas).
- **Calculadora de Transacciones Integrada**: Agiliza la compra y venta de acciones calculando el monto neto en segundos, eliminando errores matemáticos manuales durante la partida física.
- **Noticias Dinámicas**: El monitor central de televisión muestra noticias automáticas simuladas del sector tecnológico, junto a la cuenta regresiva de los eventos inyectados activos.
- **Códigos QR de Acceso Rápido**: Incluye un generador automático de QRs (`download_qrs.js`) para imprimir tarjetas físicas que los jugadores escanean con su móvil para acceder directamente a la cotización de cada empresa.

---

## 🛠️ Estructura del Proyecto

El proyecto está diseñado bajo una arquitectura de **sitio estático puro (Client-Side Only)**, lo que garantiza tiempos de carga instantáneos, cero latencia y facilidad absoluta de despliegue:

- `index.html`: Estructura y diseño responsivo de la interfaz de usuario con estética cyberpunk/fintech premium.
- `market.css`: Estilos visuales personalizados (animaciones fluidas, modo oscuro fintech, gradientes vibrantes y glassmorphism).
- `market.js`: Motor lógico del mercado de valores, generador de tendencias de precios y manejador de eventos activos.
- `download_qrs.js`: Script en Node.js que autogenera los códigos QR de alta resolución listos para imprimir en la carpeta `/QRs_para_imprimir`.

---

## 💻 Ejecución Local

Para ejecutar este proyecto en tu computadora localmente:

1. Clona este repositorio o descarga la carpeta.
2. Abre el archivo `index.html` en tu navegador favorito haciendo doble clic.
3. Alternativamente, si tienes Node.js instalado, puedes levantar un servidor local rápido:
   ```bash
   npm start
   ```
   Y abre `http://localhost:5000` en tu navegador.

---

## 🎴 Generar e Imprimir Códigos QR de Acciones

Si deseas volver a generar los códigos QR de alta resolución de las 6 empresas para tus tarjetas físicas de City Venture:

1. Asegúrate de tener instalado [Node.js](https://nodejs.org/).
2. Ejecuta el script de generación:
   ```bash
   npm run download-qrs
   ```
3. Encontrará las imágenes `.png` generadas listas para impresión en la carpeta `QRs_para_imprimir/` dentro del directorio del proyecto.

---

## 🌐 Despliegues en Vivo

Este proyecto está configurado para desplegarse instantáneamente en:
- **GitHub Pages**
- **Vercel**
- **Render**

*Desarrollado para la máxima diversión estratégica en las noches de juego de City Venture.* 🎮
