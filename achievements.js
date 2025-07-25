// =================================================================================
// MÓDULO DE LOGROS - RASTREADOR DE HUELLA DE CARBONO
// =================================================================================

window.achievementsManager = {
    // =============================================================================
    // DEFINICIÓN DE LOGROS
    // =============================================================================
    achievements: {
        first_green_day: {
            id: "first_green_day",
            badge: "🌱",
            title: "Primer Día Verde",
            description:
                "¡Lograste tu primer día con huella baja! Este es el comienzo de algo grande.",
            difficulty: "easy",
            category: "daily",
            points: 10,
        },
        green_streak_3: {
            id: "green_streak_3",
            badge: "🥉",
            title: "Racha de Bronce",
            description:
                "Mantuviste una huella baja por 3 días seguidos. ¡Increíble!",
            difficulty: "medium",
            category: "streak",
            points: 25,
        },
        green_streak_7: {
            id: "green_streak_7",
            badge: "🥈",
            title: "Racha de Plata",
            description:
                "¡Una semana completa con huella baja! Eres un campeón del clima.",
            difficulty: "hard",
            category: "streak",
            points: 50,
        },
        green_streak_30: {
            id: "green_streak_30",
            badge: "🥇",
            title: "Racha de Oro",
            description:
                "¡30 días consecutivos! Eres una inspiración para todos.",
            difficulty: "legendary",
            category: "streak",
            points: 100,
        },
        zero_emissions_day: {
            id: "zero_emissions_day",
            badge: "⭐",
            title: "Día Sin Emisiones",
            description:
                "¡Solo caminaste y usaste bicicleta! Día perfecto para el planeta.",
            difficulty: "medium",
            category: "special",
            points: 30,
        },
        eco_warrior: {
            id: "eco_warrior",
            badge: "🏆",
            title: "Guerrero Ecológico",
            description:
                "Completaste tu primera semana de seguimiento. ¡Sigue así!",
            difficulty: "easy",
            category: "milestone",
            points: 15,
        },
        carbon_reducer: {
            id: "carbon_reducer",
            badge: "📉",
            title: "Reductor de Carbono",
            description:
                "Lograste reducir tu huella comparado con la semana anterior.",
            difficulty: "medium",
            category: "improvement",
            points: 20,
        },
        public_transport_hero: {
            id: "public_transport_hero",
            badge: "🚌",
            title: "Héroe del Transporte Público",
            description:
                "Usaste solo transporte público durante toda una semana.",
            difficulty: "medium",
            category: "transport",
            points: 25,
        },
        renewable_energy_champion: {
            id: "renewable_energy_champion",
            badge: "⚡",
            title: "Campeón de Energía Renovable",
            description:
                "Usaste solo energías renovables durante una semana completa.",
            difficulty: "hard",
            category: "energy",
            points: 40,
        },
        plant_based_warrior: {
            id: "plant_based_warrior",
            badge: "🥗",
            title: "Guerrero Plant-Based",
            description:
                "Solo comiste alimentos vegetarianos/veganos durante una semana.",
            difficulty: "medium",
            category: "food",
            points: 35,
        },
        recycling_master: {
            id: "recycling_master",
            badge: "♻️",
            title: "Maestro del Reciclaje",
            description:
                "Reciclaste y redujiste residuos durante toda una semana.",
            difficulty: "easy",
            category: "waste",
            points: 20,
        },
        monthly_champion: {
            id: "monthly_champion",
            badge: "🎯",
            title: "Campeón Mensual",
            description:
                "Mantuviste una huella baja durante todo un mes. ¡Extraordinario!",
            difficulty: "legendary",
            category: "milestone",
            points: 150,
        },
    },

    // =============================================================================
    // RENDERIZADO DE LOGROS
    // =============================================================================
    render(unlockedAchievements) {
        const container = document.getElementById("achievements-container");
        container.innerHTML = "";

        // Crear secciones por categoría
        const categories = this.groupAchievementsByCategory();

        Object.keys(categories).forEach((categoryName) => {
            this.renderCategory(
                container,
                categoryName,
                categories[categoryName],
                unlockedAchievements,
            );
        });

        // Mostrar estadísticas de logros
        this.renderAchievementStats(container, unlockedAchievements);
    },

    renderCategory(
        container,
        categoryName,
        achievements,
        unlockedAchievements,
    ) {
        const categoryDiv = document.createElement("div");
        categoryDiv.className = "mb-8";

        const categoryTitle = this.getCategoryTitle(categoryName);
        categoryDiv.innerHTML = `
            <h4 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span class="text-2xl">${this.getCategoryIcon(categoryName)}</span>
                ${categoryTitle}
            </h4>
            <div class="space-y-3" id="${categoryName}-achievements"></div>
        `;

        container.appendChild(categoryDiv);

        const achievementsContainer = document.getElementById(
            `${categoryName}-achievements`,
        );

        achievements.forEach((achievement) => {
            const isUnlocked = unlockedAchievements.has(achievement.id);
            const achievementDiv = document.createElement("div");
            achievementDiv.className = `achievement-item hover-lift ${isUnlocked ? "unlocked" : "locked"}`;

            achievementDiv.innerHTML = `
                <div class="achievement-badge ${isUnlocked ? "unlocked" : "locked"}">
                    ${isUnlocked ? achievement.badge : "🔒"}
                </div>
                <div class="flex-1">
                    <div class="font-semibold text-gray-800 mb-1">${achievement.title}</div>
                    <div class="text-sm text-gray-600 mb-2">${achievement.description}</div>
                    <div class="flex items-center gap-4">
                        <div class="flex items-center gap-1">
                            <span class="text-yellow-500">⭐</span>
                            <span class="text-sm font-medium">${achievement.points} pts</span>
                        </div>
                        <div class="text-xs px-2 py-1 rounded-full ${this.getDifficultyClass(achievement.difficulty)}">
                            ${this.getDifficultyLabel(achievement.difficulty)}
                        </div>
                    </div>
                </div>
                ${isUnlocked ? '<div class="text-2xl">✅</div>' : '<div class="text-2xl opacity-30">⏳</div>'}
            `;

            achievementsContainer.appendChild(achievementDiv);
        });
    },

    renderAchievementStats(container, unlockedAchievements) {
        const totalAchievements = Object.keys(this.achievements).length;
        const unlockedCount = unlockedAchievements.size;
        const totalPoints = this.calculateTotalPoints(unlockedAchievements);
        const completionPercentage = (unlockedCount / totalAchievements) * 100;

        const statsDiv = document.createElement("div");
        statsDiv.className =
            "bg-gradient-to-r from-eco-green to-green-600 text-white p-6 rounded-3xl shadow-lg";
        statsDiv.innerHTML = `
            <h4 class="text-xl font-bold mb-4 text-center">🏆 Tu Progreso</h4>
            <div class="grid grid-cols-2 gap-4 mb-4">
                <div class="text-center">
                    <div class="text-3xl font-bold">${unlockedCount}</div>
                    <div class="text-sm opacity-90">Logros Desbloqueados</div>
                </div>
                <div class="text-center">
                    <div class="text-3xl font-bold">${totalPoints}</div>
                    <div class="text-sm opacity-90">Puntos Totales</div>
                </div>
            </div>
            <div class="mb-2">
                <div class="text-sm opacity-90 mb-1">Completado ${completionPercentage.toFixed(1)}%</div>
                <div class="bg-white/20 h-3 rounded-full overflow-hidden">
                    <div class="bg-white h-full rounded-full transition-all duration-500" style="width: ${completionPercentage}%"></div>
                </div>
            </div>
            <div class="text-center text-sm opacity-90">
                ${totalAchievements - unlockedCount} logros por desbloquear
            </div>
        `;

        container.appendChild(statsDiv);
    },

    // =============================================================================
    // UTILIDADES Y HELPERS
    // =============================================================================
    groupAchievementsByCategory() {
        const categories = {};

        Object.values(this.achievements).forEach((achievement) => {
            const category = achievement.category;
            if (!categories[category]) {
                categories[category] = [];
            }
            categories[category].push(achievement);
        });

        return categories;
    },

    getCategoryTitle(categoryName) {
        const titles = {
            daily: "Logros Diarios",
            streak: "Rachas",
            special: "Especiales",
            milestone: "Hitos",
            improvement: "Mejoras",
            transport: "Transporte",
            energy: "Energía",
            food: "Alimentación",
            waste: "Residuos",
        };
        return titles[categoryName] || categoryName;
    },

    getCategoryIcon(categoryName) {
        const icons = {
            daily: "📅",
            streak: "🔥",
            special: "⭐",
            milestone: "🎯",
            improvement: "📈",
            transport: "🚗",
            energy: "⚡",
            food: "🍽️",
            waste: "♻️",
        };
        return icons[categoryName] || "🏆";
    },

    getDifficultyClass(difficulty) {
        const classes = {
            easy: "bg-green-100 text-green-800",
            medium: "bg-yellow-100 text-yellow-800",
            hard: "bg-orange-100 text-orange-800",
            legendary: "bg-purple-100 text-purple-800",
        };
        return classes[difficulty] || "bg-gray-100 text-gray-800";
    },

    getDifficultyLabel(difficulty) {
        const labels = {
            easy: "Fácil",
            medium: "Medio",
            hard: "Difícil",
            legendary: "Legendario",
        };
        return labels[difficulty] || difficulty;
    },

    calculateTotalPoints(unlockedAchievements) {
        let totalPoints = 0;
        unlockedAchievements.forEach((achievementId) => {
            const achievement = this.achievements[achievementId];
            if (achievement) {
                totalPoints += achievement.points;
            }
        });
        return totalPoints;
    },

    // =============================================================================
    // LÓGICA DE VERIFICACIÓN DE LOGROS
    // =============================================================================
    checkAchievements(state, data) {
        const newlyUnlocked = [];

        // Verificar cada logro
        Object.values(this.achievements).forEach((achievement) => {
            if (!state.achievementsUnlocked.has(achievement.id)) {
                if (this.isAchievementUnlocked(achievement, state, data)) {
                    newlyUnlocked.push(achievement.id);
                }
            }
        });

        return newlyUnlocked;
    },

    isAchievementUnlocked(achievement, state, data) {
        const total = state.dailyData.total;
        const activities = state.dailyData.activities;

        switch (achievement.id) {
            case "first_green_day":
                return total <= data.thresholds.excellent && total > 0;

            case "green_streak_3":
                return state.greenDayStreak >= 3;

            case "green_streak_7":
                return state.greenDayStreak >= 7;

            case "green_streak_30":
                return state.greenDayStreak >= 30;

            case "zero_emissions_day":
                return this.hasOnlyZeroEmissionTransport(activities, data);

            case "eco_warrior":
                return Object.keys(state.weeklyData).length >= 7;

            case "public_transport_hero":
                return this.usedOnlyPublicTransport(state, data);

            case "renewable_energy_champion":
                return this.usedOnlyRenewableEnergy(activities);

            case "plant_based_warrior":
                return this.ateOnlyPlantBased(activities);

            case "recycling_master":
                return this.recycledAndReduced(activities);

            case "monthly_champion":
                return this.maintainedLowFootprintForMonth(state, data);

            default:
                return false;
        }
    },

    // =============================================================================
    // VERIFICACIONES ESPECÍFICAS
    // =============================================================================
    hasOnlyZeroEmissionTransport(activities, data) {
        const transportActivities = ["caminar", "bicicleta"];
        const userTransportActivities = Array.from(activities).filter(
            (activityId) => {
                return Object.values(data.activities.transporte.items).some(
                    (item) => item.id === activityId,
                );
            },
        );

        return (
            userTransportActivities.length > 0 &&
            userTransportActivities.every((activity) =>
                transportActivities.includes(activity),
            )
        );
    },

    usedOnlyPublicTransport(state, data) {
        // Verificar última semana de datos
        const lastWeekDates = this.getLastWeekDates();
        return lastWeekDates.every((date) => {
            const dayData = state.weeklyData[date];
            return dayData !== undefined && dayData <= data.thresholds.good;
        });
    },

    usedOnlyRenewableEnergy(activities) {
        const renewableActivities = ["energia_renovable", "luces_apagadas"];
        return Array.from(activities).some((activity) =>
            renewableActivities.includes(activity),
        );
    },

    ateOnlyPlantBased(activities) {
        const plantBasedActivities = [
            "comida_vegana",
            "comida_vegetariana",
            "comida_local",
        ];
        const foodActivities = Array.from(activities).filter((activity) =>
            [
                "comida_vegana",
                "comida_vegetariana",
                "comida_local",
                "comida_casera",
                "comida_procesada",
                "pollo_pescado",
                "carne_roja",
                "comida_rapida",
            ].includes(activity),
        );

        return (
            foodActivities.length > 0 &&
            foodActivities.every((activity) =>
                plantBasedActivities.includes(activity),
            )
        );
    },

    recycledAndReduced(activities) {
        const ecoWasteActivities = [
            "reciclaje_completo",
            "compostaje",
            "reutilizacion",
            "residuos_minimos",
        ];
        return Array.from(activities).some((activity) =>
            ecoWasteActivities.includes(activity),
        );
    },

    maintainedLowFootprintForMonth(state, data) {
        const monthDates = this.getLastMonthDates();
        const validDates = monthDates.filter(
            (date) => state.weeklyData[date] !== undefined,
        );

        return (
            validDates.length >= 25 && // Al menos 25 días del mes
            validDates.every(
                (date) => state.weeklyData[date] <= data.thresholds.excellent,
            )
        );
    },

    // =============================================================================
    // UTILIDADES DE FECHA
    // =============================================================================
    getLastWeekDates() {
        const dates = [];
        const today = new Date();

        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            dates.push(date.toISOString().split("T")[0]);
        }

        return dates;
    },

    getLastMonthDates() {
        const dates = [];
        const today = new Date();

        for (let i = 29; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            dates.push(date.toISOString().split("T")[0]);
        }

        return dates;
    },

    // =============================================================================
    // MÉTODOS PÚBLICOS
    // =============================================================================
    getAchievements() {
        return this.achievements;
    },

    getAchievement(id) {
        return this.achievements[id];
    },

    getUnlockedAchievements(unlockedSet) {
        return Array.from(unlockedSet)
            .map((id) => this.achievements[id])
            .filter(Boolean);
    },

    getNextAchievements(unlockedSet, state, data) {
        const locked = Object.values(this.achievements).filter(
            (achievement) => !unlockedSet.has(achievement.id),
        );

        // Ordenar por dificultad y progreso
        return locked
            .sort((a, b) => {
                const difficultyOrder = {
                    easy: 1,
                    medium: 2,
                    hard: 3,
                    legendary: 4,
                };
                return (
                    difficultyOrder[a.difficulty] -
                    difficultyOrder[b.difficulty]
                );
            })
            .slice(0, 3);
    },
};

console.log("🏆 Módulo de logros cargado.");