// =================================================================================
// MÓDULO DE ESTADÍSTICAS - RASTREADOR DE HUELLA DE CARBONO (MEJORADO)
// =================================================================================

window.statsManager = {
    // =============================================================================
    // RENDERIZADO PRINCIPAL DE ESTADÍSTICAS
    // =============================================================================
    render(period = "week", state, data) {
        console.log(`📊 Renderizando estadísticas para período: ${period}`);
        this.updateLabels(period); // 👈 ESTA LÍNEA FALTA AGREGARLA
        this.renderStatCards(period, state, data);
        this.renderCategoryStats(period, state, data);
        this.renderChart(period, state, data);
    },
    // =============================================================================
    // TARJETAS DE ESTADÍSTICAS
    // =============================================================================
    renderStatCards(period, state, data) {
        const stats = this.calculateStats(period, state, data);

        document.getElementById("avg-footprint").textContent = stats.avgFootprint.toFixed(1);
        document.getElementById("total-days").textContent = stats.totalDays;
        document.getElementById("best-day").textContent = stats.bestDay.toFixed(1);
        document.getElementById("worst-day").textContent = stats.worstDay.toFixed(1);
    },

    // =============================================================================
    // ESTADÍSTICAS POR CATEGORÍAS
    // =============================================================================
    renderCategoryStats(period, state, data) {
        const categoryStats = this.calculateCategoryStats(period, state, data);
        const container = document.getElementById("category-stats");
        container.innerHTML = "";

        const totalFootprintForDay = Object.values(state.dailyData.byCategory).reduce((a, b) => a + b, 0);

        if (totalFootprintForDay === 0) {
            container.innerHTML = `<p class="text-gray-500 text-sm">No hay actividades registradas hoy para mostrar el desglose por categoría.</p>`;
            return;
        }

        Object.keys(state.dailyData.byCategory).forEach((category) => {
            const categoryTotal = state.dailyData.byCategory[category];
            const percentage = (categoryTotal / totalFootprintForDay) * 100;
            const categoryData = data.activities[category];

            const div = document.createElement("div");
            div.className = "flex items-center justify-between mb-2";
            div.innerHTML = `
                <div class="flex items-center gap-3">
                    <span class="text-2xl">${categoryData.icon}</span>
                    <div>
                        <div class="font-medium text-gray-800">${categoryData.title}</div>
                        <div class="text-sm text-gray-600">${percentage.toFixed(1)}% del total de hoy</div>
                    </div>
                </div>
                <div class="text-right">
                    <div class="font-semibold text-gray-800">${categoryTotal.toFixed(1)} kg</div>
                </div>
            `;
            container.appendChild(div);
        });
    },

    // =============================================================================
    // GRÁFICO UNIVERSAL (SEMANAL, MENSUAL, ANUAL)
    // =============================================================================
    renderChart(period, state, data) {
        const chartContainer = document.getElementById("weekly-chart");
        chartContainer.innerHTML = ""; // Limpiar contenido previo

        const chartData = this.getChartData(period, state);

        if (chartData.values.every(v => v === 0)) {
            const emptyMessage = this.getEmptyMessage(period);
            chartContainer.innerHTML = `<p class="text-center text-gray-500 w-full">${emptyMessage}</p>`;
            return;
        }
        
        const maxValue = Math.max(...chartData.values, 1); // Evitar división por cero

        const chartDiv = document.createElement("div");
        chartDiv.className = "flex items-end justify-around h-full gap-2 w-full";

        chartData.labels.forEach((label, index) => {
            const value = chartData.values[index];
            const height = (value / maxValue) * 100;

            const barContainer = document.createElement("div");
            barContainer.className = "flex-1 flex flex-col items-center h-full justify-end";

            const bar = document.createElement("div");
            bar.className = `chart-bar w-3/4 transition-all duration-500`;
            bar.style.height = `${Math.max(height, 2)}%`; // Altura mínima para barras de 0
            if (value > 0) {
                bar.classList.add("active");
            }
            
            // Tooltip personalizado según el período
            const unit = this.getTooltipUnit(period);
            bar.title = `${label}: ${value.toFixed(1)} kg CO₂ ${unit}`;

            const labelDiv = document.createElement("div");
            labelDiv.className = "text-xs text-gray-600 text-center mt-1";
            labelDiv.textContent = label;

            barContainer.appendChild(bar);
            barContainer.appendChild(labelDiv);
            chartDiv.appendChild(barContainer);
        });

        chartContainer.appendChild(chartDiv);
        console.log(`📊 Gráfico ${period} renderizado correctamente.`);
    },

    // =============================================================================
    // CÁLCULOS DE ESTADÍSTICAS
    // =============================================================================
    calculateStats(period, state, data) {
        const relevantData = this.getRelevantData(period, state);
        const values = Object.values(relevantData).filter((v) => v !== undefined && v > 0);

        return {
            avgFootprint: values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0,
            totalDays: values.length,
            bestDay: values.length > 0 ? Math.min(...values) : 0,
            worstDay: values.length > 0 ? Math.max(...values) : 0,
            totalFootprint: values.reduce((a, b) => a + b, 0),
        };
    },

    calculateCategoryStats(period, state, data) {
        // Esta función ahora solo usa los datos del día actual para el desglose.
        return state.dailyData.byCategory;
    },

    // =============================================================================
    // OBTENCIÓN DE DATOS RELEVANTES
    // =============================================================================
    getRelevantData(period, state) {
        const now = new Date();
        switch (period) {
            case "week":
                return this.getWeekData(state, now);
            case "month":
                return this.getMonthData(state, now);
            case "year":
                return this.getYearData(state, now);
            default:
                return this.getWeekData(state, now);
        }
    },

    getWeekData(state, now) {
        const weekData = {};
        for (let i = 6; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(now.getDate() - i);
            const dateStr = date.toISOString().split("T")[0];
            weekData[dateStr] = state.weeklyData[dateStr];
        }
        return weekData;
    },

    getMonthData(state, now) {
        const monthData = {};
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const weeksInMonth = this.getWeeksInMonth(startOfMonth);

        weeksInMonth.forEach((weekInfo, index) => {
            const weekKey = `week_${index + 1}`;
            monthData[weekKey] = this.calculateWeekAverage(state, weekInfo.start, weekInfo.end);
        });

        return monthData;
    },

    getYearData(state, now) {
        const yearData = {};
        
        for (let month = 0; month < 12; month++) {
            const monthStart = new Date(now.getFullYear(), month, 1);
            const monthEnd = new Date(now.getFullYear(), month + 1, 0);
            const monthKey = `month_${month + 1}`;
            
            yearData[monthKey] = this.calculateMonthAverage(state, monthStart, monthEnd);
        }

        return yearData;
    },

    // =============================================================================
    // FUNCIONES AUXILIARES PARA CÁLCULOS
    // =============================================================================
    getWeeksInMonth(startOfMonth) {
        const weeks = [];
        const endOfMonth = new Date(startOfMonth.getFullYear(), startOfMonth.getMonth() + 1, 0);
        
        let currentWeekStart = new Date(startOfMonth);
        
        while (currentWeekStart <= endOfMonth) {
            const currentWeekEnd = new Date(currentWeekStart);
            currentWeekEnd.setDate(currentWeekStart.getDate() + 6);
            
            // Si el final de la semana excede el mes, ajustar al último día del mes
            if (currentWeekEnd > endOfMonth) {
                currentWeekEnd.setTime(endOfMonth.getTime());
            }
            
            weeks.push({
                start: new Date(currentWeekStart),
                end: new Date(currentWeekEnd)
            });
            
            currentWeekStart.setDate(currentWeekStart.getDate() + 7);
        }
        
        return weeks;
    },

    calculateWeekAverage(state, startDate, endDate) {
        let total = 0;
        let days = 0;
        
        const currentDate = new Date(startDate);
        while (currentDate <= endDate) {
            const dateStr = currentDate.toISOString().split("T")[0];
            if (state.weeklyData[dateStr] !== undefined) {
                total += state.weeklyData[dateStr];
                days++;
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }
        
        return days > 0 ? total / days : 0;
    },

    calculateMonthAverage(state, startDate, endDate) {
        let total = 0;
        let days = 0;
        
        const currentDate = new Date(startDate);
        while (currentDate <= endDate) {
            const dateStr = currentDate.toISOString().split("T")[0];
            if (state.weeklyData[dateStr] !== undefined) {
                total += state.weeklyData[dateStr];
                days++;
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }
        
        return days > 0 ? total / days : 0;
    },

    // =============================================================================
    // DATOS PARA GRÁFICOS (MEJORADO CON SOPORTE MENSUAL Y ANUAL)
    // =============================================================================
    getChartData(period, state) {
        switch (period) {
            case "week":
                return this.getWeekChartData(state);
            case "month":
                return this.getMonthChartData(state);
            case "year":
                return this.getYearChartData(state);
            default:
                return this.getWeekChartData(state);
        }
    },

    getWeekChartData(state) {
        const labels = [];
        const values = [];
        const now = new Date();

        for (let i = 6; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(now.getDate() - i);
            const dateStr = date.toISOString().split("T")[0];
            const dayName = date.toLocaleDateString("es-ES", { weekday: "short" });
            
            labels.push(dayName.charAt(0).toUpperCase() + dayName.slice(1).replace('.', ''));
            values.push(state.weeklyData[dateStr] || 0);
        }
        
        return { labels, values };
    },

    getMonthChartData(state) {
        const labels = [];
        const values = [];
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const weeksInMonth = this.getWeeksInMonth(startOfMonth);

        weeksInMonth.forEach((weekInfo, index) => {
            labels.push(`S${index + 1}`); // S1, S2, S3, S4...
            values.push(this.calculateWeekAverage(state, weekInfo.start, weekInfo.end));
        });

        return { labels, values };
    },

    getYearChartData(state) {
        const labels = [];
        const values = [];
        const now = new Date();
        const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", 
                           "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

        for (let month = 0; month < 12; month++) {
            const monthStart = new Date(now.getFullYear(), month, 1);
            const monthEnd = new Date(now.getFullYear(), month + 1, 0);
            
            labels.push(monthNames[month]);
            values.push(this.calculateMonthAverage(state, monthStart, monthEnd));
        }

        return { labels, values };
    },

    // =============================================================================
    // FUNCIONES AUXILIARES PARA UI
    // =============================================================================
    getEmptyMessage(period) {
        switch (period) {
            case "week":
                return "Registra tus actividades para ver tu progreso semanal aquí.";
            case "month":
                return "Registra tus actividades durante el mes para ver tu progreso mensual aquí.";
            case "year":
                return "Registra tus actividades durante el año para ver tu progreso anual aquí.";
            default:
                return "Registra tus actividades para ver tu progreso aquí.";
        }
    },

    getTooltipUnit(period) {
        switch (period) {
            case "week":
                return "(día)";
            case "month":
                return "(promedio semanal)";
            case "year":
                return "(promedio mensual)";
            default:
                return "";
        }
    },
    // Función que falta en tu stats.js
    updateLabels(period) {
        const labels = this.getLabelsForPeriod(period);
        const chartTitles = this.getChartTitles(period);
        
        document.getElementById("avg-footprint-label").textContent = labels.avgFootprint;
        document.getElementById("total-days-label").textContent = labels.totalDays;
        document.getElementById("best-day-label").textContent = labels.bestDay;
        document.getElementById("worst-day-label").textContent = labels.worstDay;
        document.getElementById("chart-title").textContent = chartTitles.main;
    },
    getLabelsForPeriod(period) {
        switch (period) {
            case "week":
                return {
                    avgFootprint: "Promedio kg/día",
                    totalDays: "Días registrados",
                    bestDay: "Mejor día",
                    worstDay: "Día a mejorar"
                };
            case "month":
                return {
                    avgFootprint: "Promedio kg/semana",
                    totalDays: "Semanas registradas",
                    bestDay: "Mejor semana",
                    worstDay: "Semana a mejorar"
                };
            case "year":
                return {
                    avgFootprint: "Promedio kg/mes",
                    totalDays: "Meses registrados",
                    bestDay: "Mejor mes",
                    worstDay: "Mes a mejorar"
                };
            default:
                return this.getLabelsForPeriod("week");
        }
    },
    getChartTitles(period) {
        switch (period) {
            case "week":
                return { main: "Tendencia Semanal" };
            case "month":
                return { main: "Tendencia Mensual" };
            case "year":
                return { main: "Tendencia Anual" };
            default:
                return { main: "Tendencia Semanal" };
            }
        }
};
console.log("📊 Módulo de estadísticas mejorado cargado.");

