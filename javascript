// Primero verificamos que todos los elementos existan
document.addEventListener('DOMContentLoaded', function() {
    // Elementos de entrada
    const businessIdea = document.getElementById('business-idea');
    const initialInvestment = document.getElementById('initial-investment');
    const monthlyExpenses = document.getElementById('monthly-expenses');
    const productPrice = document.getElementById('product-price');
    const targetMarket = document.getElementById('target-market');
    const marketSize = document.getElementById('market-size');
    const competitionLevel = document.getElementById('competition-level');
    const innovationLevel = document.getElementById('innovation-level');
    const analyzeButton = document.getElementById('analyze-btn');

    // Elementos de resultado
    const results = document.getElementById('results');
    const categoryText = document.getElementById('category-text');
    const successBar = document.getElementById('success-bar');
    const successPercentage = document.getElementById('success-percentage');
    const roiBar = document.getElementById('roi-bar');
    const roiValue = document.getElementById('roi-value');

    // Verificar si los elementos existen antes de continuar
    if (!analyzeButton) {
        console.error('No se encontró el botón de análisis');
        return;
    }

    // Definición de tipos de negocio
    const businessTypes = {
        tech: {
            keywords: ['app', 'software', 'tecnología', 'digital', 'online', 'web', 'móvil'],
            icon: '💻',
            baseSuccess: 75
        },
        retail: {
            keywords: ['tienda', 'producto', 'venta', 'comercio', 'marca'],
            icon: '🏪',
            baseSuccess: 60
        },
        service: {
            keywords: ['servicio', 'consultoría', 'asesoría', 'atención'],
            icon: '🤝',
            baseSuccess: 70
        },
        food: {
            keywords: ['comida', 'restaurante', 'café', 'alimentos', 'bebidas'],
            icon: '🍽️',
            baseSuccess: 55
        }
    };

    // Función para calcular el score base
    function calculateBaseScore() {
        let score = 50; // Puntuación base

        // Factores del mercado
        const marketScores = {
            'local': 5,
            'regional': 10,
            'national': 15,
            'international': 20
        };

        const competitionScores = {
            'low': 20,
            'medium': 10,
            'high': 5
        };

        const innovationScores = {
            'incremental': 5,
            'moderate': 10,
            'disruptive': 15
        };

        // Sumar puntuaciones
        if (marketSize) score += marketScores[marketSize.value] || 0;
        if (competitionLevel) score += competitionScores[competitionLevel.value] || 0;
        if (innovationLevel) score += innovationScores[innovationLevel.value] || 0;

        return Math.min(score, 100); // Asegurar que no exceda 100
    }

    // Función para calcular ROI
    function calculateROI() {
        const investment = Number(initialInvestment.value) || 0;
        const monthly = Number(monthlyExpenses.value) || 0;
        const price = Number(productPrice.value) || 0;

        if (investment === 0) return 0;

        // Estimación simple de ROI
        const annualRevenue = monthly * 12;
        const roi = ((annualRevenue - investment) / investment) * 100;
        return Math.max(0, Math.min(roi, 100)); // Mantener entre 0 y 100
    }

    // Función principal de análisis
    function analyzeBusinessIdea() {
        try {
            console.log('Iniciando análisis...'); // Debug

            // Verificar que tenemos el texto de la idea
            if (!businessIdea || !businessIdea.value.trim()) {
                alert('Por favor, describe tu idea de negocio');
                return;
            }

            const idea = businessIdea.value.toLowerCase();
            let businessType = 'otros';
            let businessInfo = {
                icon: '🎯',
                baseSuccess: 65
            };

            // Detectar tipo de negocio
            for (const [type, info] of Object.entries(businessTypes)) {
                if (info.keywords.some(keyword => idea.includes(keyword))) {
                    businessType = type;
                    businessInfo = info;
                    break;
                }
            }

            // Calcular puntuaciones
            const baseScore = calculateBaseScore();
            const roiScore = calculateROI();

            // Actualizar interfaz
            if (results) results.classList.remove('hidden');
            if (categoryText) categoryText.textContent = businessType.toUpperCase();
            
            // Actualizar barras de progreso
            if (successBar) {
                successBar.style.width = `${baseScore}%`;
                successPercentage.textContent = `${baseScore}%`;
            }
            
            if (roiBar) {
                roiBar.style.width = `${roiScore}%`;
                roiValue.textContent = `${roiScore.toFixed(1)}%`;
            }

            // Actualizar otros elementos si existen
            updateFinancialMetrics();
            updateMarketAnalysis();
            updateRecommendations();

            // Scroll hacia resultados
            results.scrollIntoView({ behavior: 'smooth' });

        } catch (error) {
            console.error('Error en el análisis:', error);
            alert('Hubo un error al analizar la idea. Por favor, verifica los datos ingresados.');
        }
    }

    // Función para actualizar métricas financieras
    function updateFinancialMetrics() {
        const investment = Number(initialInvestment.value) || 0;
        const monthly = Number(monthlyExpenses.value) || 0;
        const price = Number(productPrice.value) || 0;

        // Actualizar punto de equilibrio
        const breakevenPoint = document.querySelector('#breakeven-point .value');
        if (breakevenPoint && price > 0) {
            const units = Math.ceil(monthly / price);
            breakevenPoint.textContent = `${units} unidades`;
        }

        // Actualizar ingreso mensual proyectado
        const monthlyRevenue = document.querySelector('#monthly-revenue .value');
        if (monthlyRevenue) {
            const revenue = monthly * 1.5; // Estimación simple
            monthlyRevenue.textContent = `$${revenue.toLocaleString()}`;
        }

        // Actualizar margen de beneficio
        const profitMargin = document.querySelector('#profit-margin .value');
        if (profitMargin && price > 0) {
            const margin = ((price - (monthly / 100)) / price) * 100;
            profitMargin.textContent = `${margin.toFixed(1)}%`;
        }
    }

    // Función para actualizar análisis de mercado
    function updateMarketAnalysis() {
        const marketPotential = document.querySelector('#market-potential p');
        const targetAnalysis = document.querySelector('#target-analysis p');
        const competitionAnalysis = document.querySelector('#competition-analysis p');

        if (marketPotential && marketSize) {
            const marketTexts = {
                'local': 'Mercado local con potencial limitado',
                'regional': 'Mercado regional con buen potencial',
                'national': 'Mercado nacional con alto potencial',
                'international': 'Mercado internacional con potencial expansivo'
            };
            marketPotential.textContent = marketTexts[marketSize.value] || 'Pendiente de análisis';
        }

        if (targetAnalysis && targetMarket) {
            const targetTexts = {
                'gen-z': 'Mercado joven con alto potencial digital',
                'millennials': 'Segmento con alto poder adquisitivo',
                'gen-x': 'Mercado maduro con estabilidad económica',
                'boomers': 'Segmento con alto poder adquisitivo',
                'business': 'Mercado B2B con alto valor por cliente'
            };
            targetAnalysis.textContent = targetTexts[targetMarket.value] || 'Pendiente de análisis';
        }

        if (competitionAnalysis && competitionLevel) {
            const competitionTexts = {
                'low': 'Baja competencia, buena oportunidad',
                'medium': 'Competencia moderada, requiere diferenciación',
                'high': 'Alta competencia, necesita ventaja competitiva'
            };
            competitionAnalysis.textContent = competitionTexts[competitionLevel.value] || 'Pendiente de análisis';
        }
    }

    // Función para actualizar recomendaciones
    function updateRecommendations() {
        const recommendationsList = document.getElementById('recommendations-list');
        if (!recommendationsList) return;

        const recommendations = [];
        const investment = Number(initialInvestment.value) || 0;
        const monthly = Number(monthlyExpenses.value) || 0;

        if (investment < 10000) {
            recommendations.push('Considerar buscar más inversión inicial');
        }
        if (monthly > investment * 0.3) {
            recommendations.push('Optimizar gastos mensuales');
        }
        if (competitionLevel && competitionLevel.value === 'high') {
            recommendations.push('Desarrollar estrategia de diferenciación clara');
        }

        recommendationsList.innerHTML = recommendations
            .map(rec => `<li>${rec}</li>`)
            .join('');
    }

    // Event Listeners
    if (analyzeButton) {
        analyzeButton.addEventListener('click', analyzeBusinessIdea);
        console.log('Botón de análisis configurado'); // Debug
    }

    // Validación de campos numéricos
    const numericInputs = [initialInvestment, monthlyExpenses, productPrice];
    numericInputs.forEach(input => {
        if (input) {
            input.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, '');
            });
        }
    });
});