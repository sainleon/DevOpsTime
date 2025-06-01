document.addEventListener('DOMContentLoaded', () => {
    const predefinedTime = document.getElementById('predefinedTime');
    const customTime = document.getElementById('customTime');
    const addTimeBtn = document.getElementById('addTime');
    const totalTimeDisplay = document.getElementById('totalTime');
    const timeLog = document.getElementById('timeLog');
    const resetBtn = document.getElementById('reset');

    // Cargar datos guardados
    let totalTime = localStorage.getItem('devopsTotalTime') || 0;
    let logs = JSON.parse(localStorage.getItem('devopsTimeLogs')) || [];
    
    // Actualizar la UI al cargar
    updateUI();

    // Agregar tiempo
    addTimeBtn.addEventListener('click', () => {
        const time = customTime.value ? parseInt(customTime.value) : parseInt(predefinedTime.value);
        
        if (time <= 0 || isNaN(time)) {
            alert("¡Ingresa un tiempo válido!");
            return;
        }
        
        if (totalTime + time > 540) {
            alert("¡Superarías las 9 horas (540 min)!");
            return;
        }
        
        totalTime += time;
        logs.push({ time, date: new Date().toLocaleTimeString() });
        
        // Guardar en localStorage
        localStorage.setItem('devopsTotalTime', totalTime);
        localStorage.setItem('devopsTimeLogs', JSON.stringify(logs));
        
        updateUI();
        customTime.value = ''; // Limpiar input personalizado
    });

    // Reiniciar día
    resetBtn.addEventListener('click', () => {
        if (confirm("¿Reiniciar el registro del día?")) {
            totalTime = 0;
            logs = [];
            localStorage.removeItem('devopsTotalTime');
            localStorage.removeItem('devopsTimeLogs');
            updateUI();
        }
    });

    // Actualizar la UI
    function updateUI() {
        totalTimeDisplay.textContent = totalTime;
        timeLog.innerHTML = logs.map(log => 
            `<li>+${log.time} min (${log.date})</li>`
        ).join('');
    }
});