// =================================================================================
// APLICACIÓN RASTREADOR DE HUELLA DE CARBONO - SCRIPT PRINCIPAL
// =================================================================================

const app = {
    // Estado de la aplicación
    state: {
        currentDate: new Date().toISOString().split("T")[0],
        dailyData: {
            activities: new Set(),
            total: 0,
            byCategory: {
                transporte: 0,
                energia: 0,
                alimentacion: 0,
                residuos: 0,
            },
        },
        weeklyData: {},
        monthlyData: {},
        achievementsUnlocked: new Set(),
        greenDayStreak: 0,
        currentView: "activities",
        isFirstVisit: true,
    },

    // Datos de configuración
    data: {
        activities: {
            transporte: {
                title: "Transporte",
                icon: "🚗",
                items: [
                    {
                        id: "caminar",
                        name: "Caminé",
                        value: 0,
                        description: "Sin emisiones",
                        icon: "🚶",
                    },
                    {
                        id: "bicicleta",
                        name: "Bicicleta",
                        value: 0,
                        description: "Sin emisiones",
                        icon: "🚲",
                    },
                    {
                        id: "transporte_publico",
                        name: "Transporte Público",
                        value: 0.5,
                        description: "0.5 kg CO₂",
                        icon: "🚌",
                    },
                    {
                        id: "auto_propio",
                        name: "Auto Propio",
                        value: 2.3,
                        description: "2.3 kg CO₂",
                        icon: "🚗",
                    },
                    {
                        id: "auto_compartido",
                        name: "Auto Compartido",
                        value: 1.2,
                        description: "1.2 kg CO₂",
                        icon: "🚕",
                    },
                    {
                        id: "moto",
                        name: "Motocicleta",
                        value: 1.8,
                        description: "1.8 kg CO₂",
                        icon: "🏍️",
                    },
                    {
                        id: "uber_taxi",
                        name: "Uber/Taxi",
                        value: 2.0,
                        description: "2.0 kg CO₂",
                        icon: "🚖",
                    },
                ],
            },
            energia: {
                title: "Energía",
                icon: "⚡",
                items: [
                    {
                        id: "energia_renovable",
                        name: "Usé Energía Renovable",
                        value: 0,
                        description: "Sin emisiones extra",
                        icon: "🌱",
                    },
                    {
                        id: "luces_apagadas",
                        name: "Apagué Luces Innecesarias",
                        value: -0.2,
                        description: "Reducción de 0.2 kg",
                        icon: "💡",
                    },
                    {
                        id: "electrodomesticos_eficientes",
                        name: "Electrodomésticos Eficientes",
                        value: 0.8,
                        description: "0.8 kg CO₂",
                        icon: "🔌",
                    },
                    {
                        id: "aire_acondicionado",
                        name: "Aire Acondicionado",
                        value: 3.2,
                        description: "3.2 kg CO₂",
                        icon: "❄️",
                    },
                    {
                        id: "calefaccion",
                        name: "Calefacción",
                        value: 2.5,
                        description: "2.5 kg CO₂",
                        icon: "🔥",
                    },
                    {
                        id: "energia_standard",
                        name: "Consumo Eléctrico Normal",
                        value: 1.5,
                        description: "1.5 kg CO₂",
                        icon: "⚡",
                    },
                ],
            },
            alimentacion: {
                title: "Alimentación",
                icon: "🍽️",
                items: [
                    {
                        id: "comida_vegana",
                        name: "Comida Vegana",
                        value: 0.3,
                        description: "0.3 kg CO₂",
                        icon: "🥗",
                    },
                    {
                        id: "comida_vegetariana",
                        name: "Comida Vegetariana",
                        value: 0.7,
                        description: "0.7 kg CO₂",
                        icon: "🥕",
                    },
                    {
                        id: "comida_local",
                        name: "Productos Locales",
                        value: 0.2,
                        description: "0.2 kg CO₂",
                        icon: "🌽",
                    },
                    {
                        id: "comida_casera",
                        name: "Comida Casera",
                        value: 1.0,
                        description: "1.0 kg CO₂",
                        icon: "🍳",
                    },
                    {
                        id: "comida_procesada",
                        name: "Comida Procesada",
                        value: 2.5,
                        description: "2.5 kg CO₂",
                        icon: "📦",
                    },
                    {
                        id: "pollo_pescado",
                        name: "Pollo/Pescado",
                        value: 1.8,
                        description: "1.8 kg CO₂",
                        icon: "🐟",
                    },
                    {
                        id: "carne_roja",
                        name: "Carne Roja",
                        value: 6.5,
                        description: "6.5 kg CO₂",
                        icon: "🥩",
                    },
                    {
                        id: "comida_rapida",
                        name: "Comida Rápida",
                        value: 3.2,
                        description: "3.2 kg CO₂",
                        icon: "🍔",
                    },
                ],
            },
            residuos: {
                title: "Residuos",
                icon: "♻️",
                items: [
                    {
                        id: "reciclaje_completo",
                        name: "Recicié Todo",
                        value: -0.5,
                        description: "Reducción de 0.5 kg",
                        icon: "♻️",
                    },
                    {
                        id: "compostaje",
                        name: "Hice Compostaje",
                        value: -0.3,
                        description: "Reducción de 0.3 kg",
                        icon: "🌱",
                    },
                    {
                        id: "reutilizacion",
                        name: "Reutilicé Productos",
                        value: -0.2,
                        description: "Reducción de 0.2 kg",
                        icon: "🔄",
                    },
                    {
                        id: "residuos_minimos",
                        name: "Residuos Mínimos",
                        value: 0.5,
                        description: "0.5 kg CO₂",
                        icon: "🗂️",
                    },
                    {
                        id: "residuos_normales",
                        name: "Residuos Normales",
                        value: 1.2,
                        description: "1.2 kg CO₂",
                        icon: "🗑️",
                    },
                    {
                        id: "residuos_excesivos",
                        name: "Muchos Residuos",
                        value: 2.0,
                        description: "2.0 kg CO₂",
                        icon: "💀",
                    },
                ],
            },
        },

        tips: {
            transporte:
                "Intenta usar la bicicleta o caminar para distancias cortas. ¡Cada paso cuenta para el planeta!",
            energia:
                "Apaga las luces y desconecta aparatos que no uses. Son verdaderos vampiros de energía.",
            alimentacion:
                "Reducir el consumo de carne roja una vez a la semana hace una gran diferencia ambiental.",
            residuos:
                "Separar los residuos y compostar orgánicos puede reducir significativamente tu huella.",
            general:
                "¡Buen trabajo! Sigue así y comparte tus logros para inspirar a otros.",
        },

        thresholds: {
            excellent: 2.0,
            good: 4.0,
            warning: 7.0,
        },
    },

    // =============================================================================
    // INICIALIZACIÓN DE LA APLICACIÓN
    // =============================================================================
    async init() {
        console.log("✅ Iniciando Rastreador de Huella de Carbono...");

        // Agregar clase para el estado de splash screen
        document.body.classList.add("splash-active");

        // Mostrar splash screen
        this.showSplashScreen();

        // Cargar estado guardado
        this.loadState();

        // Configurar eventos
        this.setupEventListeners();

        // Obtener datos de clima
        await this.fetchWeatherData();

        console.log("👍 Aplicación lista.");
    },

    // =============================================================================
    // PANTALLAS DE INICIO
    // =============================================================================
    showSplashScreen() {
        setTimeout(() => {
            document.getElementById("splash-screen").style.display = "none";
            
            if (this.state.isFirstVisit) {
                this.showWelcomeScreen();
            } else {
                this.showMainApp();
            }
        }, 3000);
    },

    showWelcomeScreen() {
        document.getElementById("welcome-screen").classList.remove("hidden");

        document
            .getElementById("start-button")
            .addEventListener("click", () => {
                document
                    .getElementById("welcome-screen")
                    .classList.add("hidden");
                this.state.isFirstVisit = false;
                this.saveState();
                this.showMainApp();
            });
    },

    showMainApp() {
        // Quitar clase de splash y agregar clase de app lista
        document.body.classList.remove("splash-active");
        document.body.classList.add("app-ready");

        document.getElementById("main-app").classList.remove("hidden");
        document.getElementById("bottom-nav").classList.remove("hidden");

        // Renderizar contenido inicial
        this.renderActivities();
        this.updateDailySummary();
        this.updateStreakBadge();
        this.checkForAchievements();
        this.updateCurrentDate();

        // Mostrar consejo del día
        this.showDailyTip();
    },

    // =============================================================================
    // RENDERIZADO DE ACTIVIDADES
    // =============================================================================
    renderActivities() {
        const container = document.getElementById("activities-container");
        container.innerHTML = "";

        Object.keys(this.data.activities).forEach((categoryKey) => {
            const category = this.data.activities[categoryKey];

            // Crear sección de categoría
            const categoryDiv = document.createElement("div");
            categoryDiv.className = "mb-6";
            categoryDiv.innerHTML = `
                <h4 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <span class="text-2xl">${category.icon}</span>
                    ${category.title}
                </h4>
                <div class="space-y-3" id="${categoryKey}-items"></div>
            `;
            container.appendChild(categoryDiv);

            // Agregar items de la categoría
            const itemsContainer = document.getElementById(
                `${categoryKey}-items`,
            );
            category.items.forEach((item) => {
                const isSelected = this.state.dailyData.activities.has(item.id);
                const itemDiv = document.createElement("div");
                itemDiv.className = `activity-item ${isSelected ? "selected" : ""}`;
                itemDiv.dataset.id = item.id;
                itemDiv.dataset.value = item.value;
                itemDiv.dataset.category = categoryKey;

                itemDiv.innerHTML = `
                    <div class="activity-icon">
                        ${item.icon || category.icon}
                    </div>
                    <div class="activity-content">
                        <div class="activity-name">${item.name}</div>
                        <div class="activity-value">${item.description}</div>
                    </div>
                    <div class="checkmark">
                        ${isSelected ? '<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>' : ""}
                    </div>
                `;

                itemsContainer.appendChild(itemDiv);
            });
        });
    },

    // =============================================================================
    // MANEJO DE ACTIVIDADES
    // =============================================================================
    toggleActivity(id, value, category) {
        if (this.state.dailyData.activities.has(id)) {
            this.state.dailyData.activities.delete(id);
        } else {
            this.state.dailyData.activities.add(id);
        }

        this.updateDailySummary();
        this.renderActivities();
        this.saveState();
        this.checkForAchievements();
    },

    // *** FUNCIÓN CORREGIDA ***
    updateDailySummary() {
        let total = 0;
        const byCategory = { transporte: 0, energia: 0, alimentacion: 0, residuos: 0 };

        this.state.dailyData.activities.forEach((activityId) => {
            Object.keys(this.data.activities).forEach((categoryKey) => {
                const category = this.data.activities[categoryKey];
                const item = category.items.find((i) => i.id === activityId);
                if (item) {
                    total += item.value;
                    byCategory[categoryKey] += item.value;
                }
            });
        });

        total = Math.max(0, total);
        this.state.dailyData.total = total;
        this.state.dailyData.byCategory = byCategory;

        document.getElementById("daily-total").textContent = `${total.toFixed(1)} kg`;

        const statusElement = document.getElementById("daily-status");
        let statusClass = "";
        let statusText = "";

        if (total <= this.data.thresholds.excellent) {
            statusClass = "status-excellent";
            statusText = "¡Excelente día verde!";
        } else if (total <= this.data.thresholds.good) {
            statusClass = "status-good";
            statusText = "¡Buen trabajo!";
        } else if (total <= this.data.thresholds.warning) {
            statusClass = "status-warning";
            statusText = "Se puede mejorar";
        } else {
            statusClass = "status-danger";
            statusText = "Día desafiante";
        }
        statusElement.className = `text-sm px-4 py-2 rounded-full ${statusClass}`;
        statusElement.textContent = statusText;

        // LÓGICA CORREGIDA: Guarda el total del día actual en el historial.
        // Se actualiza con cada cambio para no perder datos si se cierra la app.
        if (this.state.dailyData.activities.size > 0) {
            this.state.weeklyData[this.state.currentDate] = this.state.dailyData.total;
        } else {
            // Si el usuario quita todas las actividades, se elimina el registro de ese día
            // para que no cuente como un día registrado con 0.0 de huella.
            delete this.state.weeklyData[this.state.currentDate];
        }
    },


    // =============================================================================
    // NAVEGACIÓN
    // =============================================================================
    handleNavigation(view) {
        // Actualizar estado
        this.state.currentView = view;

        // Ocultar todas las vistas
        document.querySelectorAll(".view-content").forEach((content) => {
            content.classList.add("hidden");
        });

        // Mostrar vista seleccionada
        document.getElementById(`${view}-view`).classList.remove("hidden");

        // Actualizar navegación
        document.querySelectorAll(".nav-button").forEach((btn) => {
            btn.classList.remove("active");
        });
        document.querySelector(`[data-view="${view}"]`).classList.add("active");

        // Renderizar contenido específico
        if (view === "stats") {
            this.renderStats();
        } else if (view === "achievements") {
            this.renderAchievements();
        }
    },

    // =============================================================================
    // CONFIGURACIÓN DE EVENTOS
    // =============================================================================
    setupEventListeners() {
        // Navegación
        document.querySelectorAll(".nav-button").forEach((button) => {
            button.addEventListener("click", () => {
                this.handleNavigation(button.dataset.view);
            });
        });

        // Actividades (delegación de eventos)
        document
            .getElementById("activities-container")
            .addEventListener("click", (e) => {
                const activityItem = e.target.closest(".activity-item");
                if (activityItem) {
                    const { id, value, category } = activityItem.dataset;
                    this.toggleActivity(id, parseFloat(value), category);
                }
            });

        // Botón de compartir
        document.getElementById("share-btn").addEventListener("click", () => {
            this.shareResult();
        });

        // Botón de logros
        document
            .getElementById("achievements-btn")
            .addEventListener("click", () => {
                this.handleNavigation("achievements");
            });

        // Modal de logros
        document
            .getElementById("modal-close-button")
            .addEventListener("click", () => {
                document
                    .getElementById("achievement-modal")
                    .classList.add("hidden");
            });

        // Period selector en estadísticas
        document.addEventListener("click", (e) => {
            if (e.target.classList.contains("period-btn")) {
                document
                    .querySelectorAll(".period-btn")
                    .forEach((btn) => btn.classList.remove("active"));
                e.target.classList.add("active");
                this.renderStats(e.target.dataset.period);
            }
        });
    },

    // =============================================================================
    // FUNCIONALIDADES AUXILIARES
    // =============================================================================
    showDailyTip() {
        const categories = Object.keys(this.data.tips);
        const randomCategory =
            categories[Math.floor(Math.random() * categories.length)];
        const tip = this.data.tips[randomCategory];
        document.getElementById("daily-tip").textContent = tip;
    },

    updateStreakBadge() {
        const badge = document.getElementById("streak-badge");
        badge.textContent = `🔥 ${this.state.greenDayStreak} días`;
    },

    updateCurrentDate() {
        const now = new Date();
        const options = {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        };
        const formattedDate = now.toLocaleDateString("es-ES", options);
        document.getElementById("current-date").textContent = formattedDate;
    },

    async fetchWeatherData() {
        try {
            // Intentar obtener ubicación
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        const { latitude, longitude } = position.coords;
                        console.log(
                            `📍 Ubicación obtenida: ${latitude}, ${longitude}`,
                        );
                        await Promise.all([
                            this.getMeteoBlueData(latitude, longitude),
                            this.getAirQualityData(latitude, longitude),
                        ]);
                    },
                    () => {
                        console.log(
                            "📍 No se pudo obtener ubicación. Usando ubicación por defecto.",
                        );
                        // Usar coordenadas de Lima, Perú como fallback
                        this.getMeteoBlueData(-12.0464, -77.0428);
                        this.getAirQualityData(-12.0464, -77.0428);
                    },
                );
            } else {
                // Usar coordenadas de Lima, Perú como fallback
                this.getMeteoBlueData(-12.0464, -77.0428);
                this.getAirQualityData(-12.0464, -77.0428);
            }
        } catch (error) {
            console.error("Error al obtener datos de clima:", error);
            this.showWeatherTipFallback();
        }
    },

    async getMeteoBlueData(lat, lon) {
        try {
            const API_KEY = "fEdDgLatFVK4302z";
            const url = `https://my.meteoblue.com/packages/current?lat=${lat}&lon=${lon}&asl=100&format=json&apikey=${API_KEY}`;

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            this.showWeatherTip(data);
        } catch (error) {
            console.error("Error al obtener datos de Meteoblue:", error);
            this.showWeatherTipFallback();
        }
    },

    showWeatherTip(weatherData = null) {
        let tip = "";

        if (weatherData && weatherData.current) {
            const current = weatherData.current;
            const temp = Math.round(current.temperature || 20);
            const windSpeed = Math.round(current.windspeed || 0);
            const humidity = Math.round(current.relativehumidity || 50);
            const precipitation = current.precipitation || 0;

            // Determinar condiciones del clima
            let weatherIcon = "🌤️";
            let weatherCondition = "";
            let ecoTip = "";

            if (precipitation > 0.5) {
                weatherIcon = "🌧️";
                weatherCondition = "lluvioso";
                ecoTip =
                    "Considera el transporte público para mantenerte seco y reducir emisiones.";
            } else if (temp > 25) {
                if (humidity > 70) {
                    weatherIcon = "☁️";
                    weatherCondition = "cálido y húmedo";
                    ecoTip =
                        "Día húmedo, perfecto para actividades en interiores con ventilación natural.";
                } else {
                    weatherIcon = "☀️";
                    weatherCondition = "soleado";
                    ecoTip =
                        "Perfecto para caminar, andar en bici o usar energía solar.";
                }
            } else if (temp < 15) {
                weatherIcon = "❄️";
                weatherCondition = "frío";
                ecoTip = "Abrígate bien para evitar usar calefacción extra.";
            } else {
                weatherIcon = "🌤️";
                weatherCondition = "agradable";
                ecoTip =
                    "Temperatura ideal para actividades al aire libre sin emisiones.";
            }

            if (windSpeed > 15) {
                weatherIcon = "🌬️";
                ecoTip = `Día ventoso (${windSpeed} km/h). ¡Perfecto para generar energía eólica!`;
            }

            tip = `${weatherIcon} ¡Día ${weatherCondition} con ${temp}°C! ${ecoTip}`;
        } else {
            this.showWeatherTipFallback();
            return;
        }

        document.getElementById("weather-tip").innerHTML =
            `<p class="text-blue-800 text-sm">${tip}</p>`;
        console.log("🌤️ Datos de clima reales cargados desde Meteoblue");
    },

    async getAirQualityData(lat, lon) {
        try {
            const API_KEY = "8104a9b6-d1dc-46b4-8d7c-d9553d4840b6";
            const url = `https://api.airvisual.com/v2/nearest_city?lat=${lat}&lon=${lon}&key=${API_KEY}`;

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            this.showAirQualityInfo(data);
        } catch (error) {
            console.error("Error al obtener datos de calidad del aire:", error);
            this.showAirQualityFallback();
        }
    },

    showAirQualityInfo(airData) {
        if (
            airData &&
            airData.data &&
            airData.data.current &&
            airData.data.current.pollution
        ) {
            const pollution = airData.data.current.pollution;
            const aqi = pollution.aqius; // US AQI
            const mainPollutant = pollution.mainus;
            const city = airData.data.city;

            let aqiColor = "";
            let aqiLevel = "";
            let transportTip = "";
            let icon = "";

            if (aqi <= 50) {
                aqiColor = "text-green-800 bg-green-50 border-green-400";
                aqiLevel = "Buena";
                transportTip =
                    "Perfecto para caminar, correr o andar en bicicleta al aire libre.";
                icon = "🌿";
            } else if (aqi <= 100) {
                aqiColor = "text-yellow-800 bg-yellow-50 border-yellow-400";
                aqiLevel = "Moderada";
                transportTip =
                    "Considera usar transporte público o bicicleta en rutas menos transitadas.";
                icon = "🌤️";
            } else if (aqi <= 150) {
                aqiColor = "text-orange-800 bg-orange-50 border-orange-400";
                aqiLevel = "Dañina para grupos sensibles";
                transportTip =
                    "Usa transporte público cerrado o auto compartido.";
                icon = "⚠️";
            } else if (aqi <= 200) {
                aqiColor = "text-red-800 bg-red-50 border-red-400";
                aqiLevel = "Dañina";
                transportTip =
                    "Evita actividades al aire libre. Usa transporte cerrado.";
                icon = "🚨";
            } else {
                aqiColor = "text-purple-800 bg-purple-50 border-purple-400";
                aqiLevel = "Muy dañina";
                transportTip =
                    "Permanece en interiores. Si debes salir, usa transporte cerrado.";
                icon = "☠️";
            }

            // Crear o actualizar el contenedor de calidad del aire
            this.createAirQualityWidget(
                city,
                aqi,
                aqiLevel,
                aqiColor,
                transportTip,
                icon,
                mainPollutant,
            );

            console.log(
                "🌬️ Datos de calidad del aire cargados desde AirVisual",
            );
        } else {
            this.showAirQualityFallback();
        }
    },

    createAirQualityWidget(city, aqi, level, colorClass, tip, icon, pollutant) {
        // Buscar si ya existe el widget
        let airWidget = document.getElementById("air-quality-widget");

        if (!airWidget) {
            // Crear el widget después del weather-tip
            const weatherTip = document.getElementById("weather-tip");
            airWidget = document.createElement("div");
            airWidget.id = "air-quality-widget";
            airWidget.className = `border-l-4 p-4 mx-4 mt-4 rounded-r-xl ${colorClass}`;
            weatherTip.parentNode.insertBefore(
                airWidget,
                weatherTip.nextSibling,
            );
        } else {
            // Actualizar la clase de color
            airWidget.className = `border-l-4 p-4 mx-4 mt-4 rounded-r-xl ${colorClass}`;
        }

        airWidget.innerHTML = `
            <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-2">
                    <span class="text-lg">${icon}</span>
                    <span class="font-semibold text-sm">Calidad del Aire - ${city}</span>
                </div>
                <div class="text-right">
                    <div class="font-bold text-lg">${aqi}</div>
                    <div class="text-xs opacity-75">${level}</div>
                </div>
            </div>
            <p class="text-sm mb-1"><strong>Contaminante principal:</strong> ${pollutant}</p>
            <p class="text-sm"><strong>Recomendación:</strong> ${tip}</p>
        `;
    },

    showAirQualityFallback() {
        // Crear widget básico sin datos
        this.createAirQualityWidget(
            "Tu ciudad",
            "--",
            "Sin datos",
            "text-gray-800 bg-gray-50 border-gray-400",
            "No hay datos disponibles. Considera usar transporte sostenible.",
            "🌍",
            "N/A",
        );
    },

    showWeatherTipFallback() {
        const tips = [
            `🌤️ ¡Día perfecto para actividades ecológicas!`,
            `♻️ Recuerda: cada pequeña acción cuenta para el planeta.`,
            `🌱 Día ideal para caminar o usar la bicicleta.`,
            `🌍 ¡Convierte hoy en un día verde!`,
        ];

        const randomTip = tips[Math.floor(Math.random() * tips.length)];
        document.getElementById("weather-tip").innerHTML =
            `<p class="text-blue-800 text-sm">${randomTip}</p>`;
    },

    async shareResult() {
        const total = this.state.dailyData.total.toFixed(1);
        let statusEmoji = "";

        if (total <= this.data.thresholds.excellent) statusEmoji = "🌱";
        else if (total <= this.data.thresholds.good) statusEmoji = "♻️";
        else if (total <= this.data.thresholds.warning) statusEmoji = "🌍";
        else statusEmoji = "🌎";

        const shareText = `${statusEmoji} ¡Hoy mi huella de carbono fue de ${total} kg de CO₂! Únete al reto verde y mide la tuya. #HuellaDeCarbono #PlanetaVerde #EcoChallenge`;

        try {
            if (navigator.share) {
                await navigator.share({
                    title: "Mi Huella de Carbono",
                    text: shareText,
                    url: window.location.href,
                });
                console.log("Resultado compartido exitosamente.");
            } else {
                // Fallback para navegadores sin Web Share API
                await navigator.clipboard.writeText(shareText);
                this.showToast("¡Resultado copiado al portapapeles!");
            }
        } catch (err) {
            console.error("Error al compartir:", err);
            this.showToast("No se pudo compartir el resultado.");
        }
    },

    showToast(message) {
        const toast = document.getElementById("toast-notification");
        toast.textContent = message;
        toast.classList.remove("opacity-0");
        toast.classList.add("opacity-100", "show");

        setTimeout(() => {
            toast.classList.remove("opacity-100", "show");
            toast.classList.add("opacity-0");
        }, 3000);
    },

    checkForAchievements() {
        const total = this.state.dailyData.total;

        // Verificar y desbloquear logros
        if (
            total <= this.data.thresholds.excellent &&
            !this.state.achievementsUnlocked.has("first_green_day")
        ) {
            this.unlockAchievement("first_green_day");
        }

        // Actualizar racha verde
        if (total <= this.data.thresholds.excellent) {
            this.state.greenDayStreak++;
            this.updateStreakBadge();

            if (
                this.state.greenDayStreak >= 3 &&
                !this.state.achievementsUnlocked.has("green_streak_3")
            ) {
                this.unlockAchievement("green_streak_3");
            }

            if (
                this.state.greenDayStreak >= 7 &&
                !this.state.achievementsUnlocked.has("green_streak_7")
            ) {
                this.unlockAchievement("green_streak_7");
            }
        }
    },

    unlockAchievement(id) {
        if (this.state.achievementsUnlocked.has(id)) return;

        this.state.achievementsUnlocked.add(id);
        this.saveState();

        // Mostrar modal de logro desbloqueado
        const achievements = window.achievementsManager.getAchievements();
        const achievement = achievements[id];

        if (achievement) {
            document.getElementById("modal-badge").textContent =
                achievement.badge;
            document.getElementById("modal-title").textContent =
                achievement.title;
            document.getElementById("modal-text").textContent =
                achievement.description;
            document
                .getElementById("achievement-modal")
                .classList.remove("hidden");
        }

        console.log(`🏆 Logro desbloqueado: ${id}`);
    },

    // =============================================================================
    // PERSISTENCIA DE DATOS
    // =============================================================================
    saveState() {
        const stateToSave = {
            currentDate: this.state.currentDate,
            dailyData: {
                activities: Array.from(this.state.dailyData.activities),
                total: this.state.dailyData.total,
                byCategory: this.state.dailyData.byCategory,
            },
            weeklyData: this.state.weeklyData,
            monthlyData: this.state.monthlyData,
            achievementsUnlocked: Array.from(this.state.achievementsUnlocked),
            greenDayStreak: this.state.greenDayStreak,
            isFirstVisit: this.state.isFirstVisit,
        };

        localStorage.setItem("carbonTrackerState", JSON.stringify(stateToSave));
        console.log("💾 Estado guardado en localStorage.");
    },

    // *** FUNCIÓN TOTALMENTE REESCRITA PARA MANEJAR LÓGICA DE DÍAS ***
    loadState() {
        const savedStateJSON = localStorage.getItem("carbonTrackerState");
        const today = new Date();
        const todayString = today.toISOString().split("T")[0];

        // 1. Establecer el estado por defecto para el día de hoy.
        // Esto asegura que si es un nuevo día, empecemos de cero.
        this.state.currentDate = todayString;
        this.state.dailyData = {
            activities: new Set(),
            total: 0,
            byCategory: { transporte: 0, energia: 0, alimentacion: 0, residuos: 0 },
        };

        if (!savedStateJSON) {
            console.log("📦 No hay estado guardado, iniciando desde cero.");
            // No hay nada más que hacer, se usarán los valores por defecto.
            return;
        }

        try {
            const parsedState = JSON.parse(savedStateJSON);
            const lastDateString = parsedState.currentDate;

            // 2. Cargar siempre los datos históricos y de configuración.
            this.state.weeklyData = parsedState.weeklyData || {};
            this.state.monthlyData = parsedState.monthlyData || {};
            this.state.achievementsUnlocked = new Set(parsedState.achievementsUnlocked || []);
            this.state.greenDayStreak = parsedState.greenDayStreak || 0;
            this.state.isFirstVisit = parsedState.isFirstVisit !== undefined ? parsedState.isFirstVisit : true;

            if (!lastDateString) {
                console.log("📦 No se encontró fecha en estado guardado. Iniciando día nuevo.");
                return;
            }

            // 3. Comparar la fecha guardada con la de hoy.
            if (lastDateString === todayString) {
                // 3a. Si es el mismo día, cargar el progreso guardado.
                console.log("📦 Mismo día. Cargando datos de la sesión.");
                this.state.dailyData = {
                    activities: new Set(parsedState.dailyData?.activities || []),
                    total: parsedState.dailyData?.total || 0,
                    byCategory: parsedState.dailyData?.byCategory || this.state.dailyData.byCategory,
                };
            } else {
                // 3b. Si es un nuevo día, procesar los datos del día anterior.
                console.log(`🌅 Nuevo día detectado. Finalizando datos de ${lastDateString}.`);

                const lastDayData = parsedState.dailyData;
                const lastDate = new Date(lastDateString + 'T12:00:00Z'); // Usar T12:00:00Z para evitar problemas de zona horaria
                const yesterday = new Date(today);
                yesterday.setDate(today.getDate() - 1);

                // 4. Lógica de Rachas (Streaks)
                // Comprobar si el último uso fue ayer para continuar la racha.
                if (lastDate.toDateString() === yesterday.toDateString()) {
                    // Si el día anterior tuvo actividades y fue un "día verde", aumentar la racha.
                    if (lastDayData.total > 0 && lastDayData.total <= this.data.thresholds.excellent) {
                        this.state.greenDayStreak++;
                        console.log(`🔥 Racha de días verdes aumentada a: ${this.state.greenDayStreak}`);
                    } else {
                        // Si no fue un día verde, la racha se rompe.
                        console.log(`Racha rota. Total de ayer: ${lastDayData.total}`);
                        this.state.greenDayStreak = 0;
                    }
                } else {
                    // Si se saltó uno o más días, la racha se rompe.
                    console.log("Racha rota. Se saltó uno o más días.");
                    this.state.greenDayStreak = 0;
                }
                
                // Los datos del día de hoy ya están reiniciados por el paso 1.
                // Los datos históricos (`weeklyData`) ya fueron guardados por `updateDailySummary` y cargados en el paso 2.
            }
        } catch (error) {
            console.error("Error al cargar el estado. Reiniciando para hoy.", error);
            // El estado para hoy ya está reiniciado por defecto, así que la app puede continuar.
        }
    },

    renderStats(period = "week") {
        if (window.statsManager) {
            window.statsManager.render(period, this.state, this.data);
        }
    },

    renderAchievements() {
        if (window.achievementsManager) {
            window.achievementsManager.render(this.state.achievementsUnlocked);
        }
    },
};

// =============================================================================
// INICIALIZACIÓN GLOBAL
// =============================================================================
document.addEventListener("DOMContentLoaded", () => {
    app.init();
});

// Exponer app globalmente para debugging
window.carbonApp = app;
