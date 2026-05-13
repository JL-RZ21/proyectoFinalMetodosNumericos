// ===============================
// 📦 VARIABLES GLOBALES
// ===============================
let historyList = [];
let comparisonList = [];

// ===============================
// 📥 INPUTS
// ===============================
const methodSelect =
    document.getElementById("method");

const functionInput =
    document.getElementById("function");

const x0Input =
    document.getElementById("x0");

const x1Input =
    document.getElementById("x1");

const x2Input =
    document.getElementById("x2");

const iterationsInput =
    document.getElementById("iterations");

const inputs = [
    functionInput,
    x0Input,
    x1Input,
    x2Input,
    iterationsInput
];

// ===============================
// ✅ VALIDACIÓN
// ===============================
function validateInput(input) {

    const value = input.value.trim();

    // función matemática
    if (input.id === "function") {

        if (value === "") {

            input.classList.add("error");

            return false;
        }

        input.classList.remove("error");

        return true;
    }

    // números
    if (value === "" || isNaN(value)) {

        input.classList.add("error");

        return false;
    }

    input.classList.remove("error");

    return true;
}

// ===============================
// 🔥 VALIDACIÓN EN TIEMPO REAL
// ===============================
inputs.forEach(input => {

    input.addEventListener("input", () => {

        validateInput(input);

        document.getElementById("output").innerHTML =
            "Aquí aparecerá el resultado...";
    });

    // seleccionar automáticamente
    input.addEventListener("focus", () => {

        input.select();
    });
});

// ===============================
// ⌨️ ENTER AUTOMÁTICO
// ===============================
inputs.forEach((input, index) => {

    input.addEventListener("keydown", (e) => {

        if (e.key === "Enter") {

            e.preventDefault();

            if (index < inputs.length - 1) {

                inputs[index + 1].focus();

            } else {

                document.querySelector("button").focus();
            }
        }
    });
});

// ===============================
// 🎯 INPUTS DINÁMICOS
// ===============================
function updateMethodInputs() {

    const method = methodSelect.value;

    // mostrar todos
    x0Input.style.display = "block";
    x1Input.style.display = "block";
    x2Input.style.display = "block";

    // Newton
    if (method === "newton") {

        x0Input.placeholder =
            "Valor inicial x₀";

        x1Input.style.display = "none";

        x2Input.style.display = "none";
    }

    // Secante
    else if (method === "secante") {

        x0Input.placeholder =
            "Primer valor x₀";

        x1Input.placeholder =
            "Segundo valor x₁";

        x2Input.style.display = "none";
    }

    // Müller
    else if (method === "muller") {

        x0Input.placeholder =
            "Primer valor x₀";

        x1Input.placeholder =
            "Segundo valor x₁";

        x2Input.placeholder =
            "Tercer valor x₂";
    }
}

methodSelect.addEventListener(
    "change",
    updateMethodInputs
);

updateMethodInputs();

// ===============================
// ⚙️ FUNCIÓN PRINCIPAL
// ===============================
function solve() {

    let firstError = null;

    // validar
    inputs.forEach(input => {

        if (input.style.display === "none") {
            return;
        }

        const valid =
            validateInput(input);

        if (!valid && !firstError) {

            firstError = input;
        }
    });

    // errores
    if (firstError) {

        document.getElementById("output").innerHTML = `
            <span style="color:#ff6b6b;">
                ⚠️ Corrige los campos antes de continuar
            </span>
        `;

        firstError.focus();

        firstError.select();

        return;
    }

    // ===============================
    // 📊 DATOS
    // ===============================
    const method =
        methodSelect.value;

    const func =
        functionInput.value;

    const iterations =
        parseInt(iterationsInput.value);

    // ===============================
    // 🔥 SIMULACIÓN
    // ===============================
    const result =
        (Math.random() * 10).toFixed(6);

    const time =
        (Math.random() * 0.01).toFixed(6) + "s";

    // ===============================
    // 📅 FECHA
    // ===============================
    const now = new Date();

    // ===============================
    // 📜 HISTORIAL
    // ===============================
    const record = {

        method,
        func,
        result,
        iterations,
        time,

        date: now.toLocaleDateString(),

        hour: now.toLocaleTimeString()
    };

    historyList.push(record);

    comparisonList.push(record);

    updateHistory();

    updateComparison();

    // ===============================
    // 📊 TABLA ITERACIONES
    // ===============================
    let tableHTML = `

        <table class="iteration-table">

            <tr>
                <th>Iteración</th>
                <th>x</th>
                <th>Error %</th>
            </tr>
    `;

    for (let i = 1; i <= iterations; i++) {

        const xValue =
            (Math.random() * 10).toFixed(6);

        const error =
            (Math.random() * 5).toFixed(4);

        tableHTML += `

            <tr>

                <td>${i}</td>

                <td>${xValue}</td>

                <td>${error}%</td>

            </tr>
        `;
    }

    tableHTML += `</table>`;

    // ===============================
    // 📤 RESULTADO
    // ===============================
    document.getElementById("output").innerHTML = `

        <div class="result-box">

            <div class="result-header">

                ${method.toUpperCase()}

            </div>

            <div class="result-info">

                <div class="result-item">

                    <span>Función</span>

                    <strong>${func}</strong>

                </div>

                <div class="result-item">

                    <span>Resultado</span>

                    <strong>${result}</strong>

                </div>

                <div class="result-item">

                    <span>Tiempo</span>

                    <strong>${time}</strong>

                </div>

                <div class="result-item">

                    <span>Iteraciones</span>

                    <strong>${iterations}</strong>

                </div>

            </div>

            ${tableHTML}

        </div>
    `;
}

// ===============================
// 📜 HISTORIAL
// ===============================
function updateHistory() {

    const historyDiv =
        document.getElementById("history");

    historyDiv.innerHTML = "";

    historyList
        .slice()
        .reverse()
        .forEach(item => {

            historyDiv.innerHTML += `

                <div class="history-item">

                    <strong>${item.method}</strong>

                    <br><br>

                    f(x): ${item.func}

                    <br>

                    Resultado: ${item.result}

                    <br>

                    Iteraciones: ${item.iterations}

                    <br>

                    ⏱️ ${item.time}

                    <br>

                    📅 ${item.date} - ${item.hour}

                </div>
            `;
        });
}

// ===============================
// 📊 COMPARACIÓN
// ===============================
function updateComparison() {

    const comparisonDiv =
        document.getElementById("comparison");

    comparisonDiv.innerHTML = "";

    comparisonList
        .slice()
        .reverse()
        .forEach(item => {

            comparisonDiv.innerHTML += `

                <div class="comparison-item">

                    <strong>${item.method}</strong>

                    <br>

                    Tiempo: ${item.time}

                    <br>

                    Iteraciones: ${item.iterations}

                </div>
            `;
        });
}

// ===============================
// 🔘 MOSTRAR / OCULTAR
// ===============================
function toggleSection(id) {

    const section =
        document.getElementById(id);

    section.classList.toggle("show");
}