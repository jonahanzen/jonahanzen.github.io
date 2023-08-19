const app = Vue.createApp({
    data() {
        return {
            method: 'months',
            months: 0,
            startValue: 0,
            monthlyValue: 0,
            yearProfitPercentage: 0,
            profits: [],
            chart: null,
            dividendObjective: 0,
            useRule: false,
            showList: true,
            language: 'pt',
            translations: {}
        }
    },
    watch: {
        language(newLanguage) {
            this.loadTranslations();
        }
    },
    methods: {
        // Load translations based on the selected language
        loadTranslations() {
            const lang = this.language;
            fetch(`/i18n/${lang}.json`)
                .then(response => response.json())
                .then(data => {
                    this.translations = data;
                })
                .catch(error => console.error('Error loading translations:', error));
        },

        // Calculate investment and update the chart
        calculate() {
            this.profits = [];
            let currentValue = this.startValue;
            let totalInvested = this.startValue;
            let labels = [];
            let chartDataValue = [];
            let chartDataInvested = [];
            let chartDataProfit = [];
            let totalMonths = this.method === 'years' ? this.months * 12 : this.months;

            let i = 0;
            while ((['months', 'years'].includes(this.method) && i < totalMonths) || (this.method === 'dividend' && (this.useRule ? (currentValue * 0.03 / 12) : (currentValue * this.yearProfitPercentage / 100 / 12)) < this.dividendObjective)) {
                totalInvested += this.monthlyValue;
                currentValue += this.monthlyValue;
                currentValue *= (1 + this.yearProfitPercentage / 100 / 12);
                this.profits.push({ totalInvested, totalCompound: currentValue - totalInvested, value: currentValue });

                if (i % 12 === 0 || (this.method === 'dividend' && (this.useRule ? (currentValue * 0.03 / 12) : (currentValue * this.yearProfitPercentage / 100 / 12)) >= this.dividendObjective)) {
                    labels.push(`Year ${i / 12 + 1}`);
                    chartDataValue.push(currentValue);
                    chartDataInvested.push(totalInvested);
                    chartDataProfit.push(currentValue - totalInvested);
                }

                i++;
            }

            this.updateChart(labels, chartDataValue, chartDataInvested, chartDataProfit);
        },

        // Update or create the investment chart
        updateChart(labels, chartDataValue, chartDataInvested, chartDataProfit) {
            if (this.chart) {
                this.chart.destroy();
            }

            this.chart = new Chart(document.getElementById('chart'), {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: this.translations.totalValue,
                            data: chartDataValue,
                            backgroundColor: 'rgb(75, 192, 192)',
                            borderColor: 'rgb(75, 192, 192)',
                        },
                        {
                            label: this.translations.totalInvested,
                            data: chartDataInvested,
                            backgroundColor: 'rgb(54, 162, 235)',
                            borderColor: 'rgb(54, 162, 235)',
                        },
                        {
                            label: this.translations.totalCompound,
                            data: chartDataProfit,
                            backgroundColor: 'rgb(255, 99, 132)',
                            borderColor: 'rgb(255, 99, 132)',
                        },
                    ],
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                        },
                    },
                },
            });
        },
    },
    created() {
        this.loadTranslations();
    },
});

// Mount the app on the specified element
app.mount("#app");
