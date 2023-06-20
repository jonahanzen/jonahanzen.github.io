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
            language: 'english',
            translations: {
                method: { english: 'Calculation Method', portuguese: 'Método de Cálculo' },
                months: { english: 'Months', portuguese: 'Meses' },
                dividendObjective: { english: 'Dividend Objective', portuguese: 'Objetivo do Dividendo' },
                startValue: { english: 'Starting Value', portuguese: 'Valor Inicial' },
                monthlyValue: { english: 'Monthly Value', portuguese: 'Valor Mensal' },
                yearProfitPercentage: { english: 'Year Profit Percentage', portuguese: 'Percentual de Lucro Anual' },
                language: { english: 'Language', portuguese: 'Idioma' },
                english: { english: 'English', portuguese: 'Inglês' },
                portuguese: { english: 'Portuguese', portuguese: 'Português' },
                calculate: { english: 'Calculate', portuguese: 'Calcular' },
                hideList: { english: 'Hide List', portuguese: 'Esconder Lista' },
                showList: { english: 'Show List', portuguese: 'Mostrar Lista' },
                month: { english: 'Month', portuguese: 'Mês' },
                totalInvested: { english: 'Total Invested', portuguese: 'Total Investido' },
                totalCompound: { english: 'Total Compound', portuguese: 'Total Composto' },
                value: { english: 'Value', portuguese: 'Valor' },
                useRule: { english: 'Use 3% Rule', portuguese: 'Usar Regra de 3%' },
                years: { english: 'Years', portuguese: 'Anos' },
            }
        }
    },
    methods: {
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

            if (this.chart) {
                this.chart.destroy();
            }

            this.chart = new Chart(document.getElementById('chart'), {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Investment Value',
                        data: chartDataValue,
                        backgroundColor: 'rgb(75, 192, 192)',
                        borderColor: 'rgb(75, 192, 192)',
                    }, {
                        label: 'Total Invested',
                        data: chartDataInvested,
                        backgroundColor: 'rgb(54, 162, 235)',
                        borderColor: 'rgb(54, 162, 235)',
                    }, {
                        label: 'Total Compound',
                        data: chartDataProfit,
                        backgroundColor: 'rgb(255, 99, 132)',
                        borderColor: 'rgb(255, 99, 132)',
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }
    }
});

app.mount("#app");
