document.addEventListener("DOMContentLoaded", function () {
    const temperatureInput = document.getElementById("temperature");
    const fromUnitSelect = document.getElementById("fromUnit");
    const toUnitSelect = document.getElementById("toUnit");
    const convertBtn = document.getElementById("convertBtn");
    const printPdfBtn = document.getElementById("printPdfBtn");
    const resultElement = document.getElementById("result");
    const conversionHistoryTable = document.getElementById("conversionHistory").getElementsByTagName('tbody')[0];

    const conversionHistory = [];

    convertBtn.addEventListener("click", function () {
        const temperature = parseFloat(temperatureInput.value);
        const fromUnit = fromUnitSelect.value;
        const toUnit = toUnitSelect.value;

        if (!isNaN(temperature)) {
            let convertedTemperature;

            if (fromUnit === "celsius") {
                if (toUnit === "fahrenheit") {
                    convertedTemperature = (temperature * 9/5) + 32;
                } else if (toUnit === "kelvin") {
                    convertedTemperature = temperature + 273.15;
                } else {
                    convertedTemperature = temperature;
                }
            } else if (fromUnit === "fahrenheit") {
                if (toUnit === "celsius") {
                    convertedTemperature = (temperature - 32) * 5/9;
                } else if (toUnit === "kelvin") {
                    convertedTemperature = (temperature - 32) * 5/9 + 273.15;
                } else {
                    convertedTemperature = temperature;
                }
            } else if (fromUnit === "kelvin") {
                if (toUnit === "celsius") {
                    convertedTemperature = temperature - 273.15;
                } else if (toUnit === "fahrenheit") {
                    convertedTemperature = (temperature - 273.15) * 9/5 + 32;
                } else {
                    convertedTemperature = temperature;
                }
            }
            

            resultElement.textContent = `${temperature.toFixed(2)} ${fromUnit.toUpperCase()} is ${convertedTemperature.toFixed(2)} ${toUnit.toUpperCase()}`;

            if (conversionHistory.length >= 5) {
                conversionHistory.pop();
            }
            
            // Convert temperature values to strings with fixed precision
            conversionHistory.unshift({
                from: fromUnit,
                to: toUnit,
                temperature: convertedTemperature.toFixed(2).toString() // Convert to string
            });

            updateConversionHistoryTable();
        } else {
            resultElement.textContent = "Please enter a valid temperature.";
        }
    });

    printPdfBtn.addEventListener("click", function () {
        const pdfData = generatePdfData();

        if (pdfData) {
            pdfMake.createPdf(pdfData).download("temperature_conversion_history.pdf");
        }
    });

    function generatePdfData() {
        if (typeof pdfMake === 'undefined') {
            console.error("pdfmake library is not available.");
            return null;
        }

        const pdfContent = [];
        pdfContent.push({ text: "Temperature Conversion History", fontSize: 14, margin: [0, 0, 0, 10] });

        for (const entry of conversionHistory) {
            pdfContent.push(
                { text: `From: ${entry.from.toUpperCase()}`, margin: [0, 0, 0, 5] },
                { text: `To: ${entry.to.toUpperCase()}`, margin: [50, 0, 0, 5] },
                { text: `Temperature: ${entry.temperature}`, margin: [100, 0, 0, 10] },
            );

            if (entry !== conversionHistory[conversionHistory.length - 1]) {
                pdfContent.push({ canvas: [{ type: 'line', x1: 0, y1: 0, x2: 520, y2: 0, lineWidth: 0.5, lineColor: '#000000' }], margin: [0, 5, 0, 0] });
            }
        }

        return { content: pdfContent };
    }

    function updateConversionHistoryTable() {
        conversionHistoryTable.innerHTML = '';
        for (const conversion of conversionHistory) {
            const row = conversionHistoryTable.insertRow();
            const fromCell = row.insertCell(0);
            const toCell = row.insertCell(1);
            const temperatureCell = row.insertCell(2);
            fromCell.textContent = conversion.from.toUpperCase();
            toCell.textContent = conversion.to.toUpperCase();
            temperatureCell.textContent = conversion.temperature;
        }
    }
});