document.addEventListener('DOMContentLoaded', () => {
    const predefinedTime = document.getElementById('predefinedTime');
    const customTime = document.getElementById('customTime');
    const addTimeBtn = document.getElementById('addTime');
    const totalTimeDisplay = document.getElementById('totalTime');
    const timeLog = document.getElementById('timeLog');
    const resetBtn = document.getElementById('reset');
    const progress = document.getElementById('progress');
    const progressText = document.getElementById('progressText');

    // Cargar datos guardados
    let totalTime = parseInt(localStorage.getItem('devopsTotalTime')) || 0;
    let logs = JSON.parse(localStorage.getItem('devopsTimeLogs')) || [];
    
    // Actualizar la UI al cargar
    updateUI();

    // Función para formato de hora (AM/PM)
    function formatTime(date) {
        let hours = date.getHours();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes} ${ampm}`;
    }

    // Agregar tiempo
    addTimeBtn.addEventListener('click', () => {
        const time = customTime.value ? parseInt(customTime.value) : parseInt(predefinedTime.value);
        
        if (time <= 0 || isNaN(time)) {
            alert("¡Ingresa un tiempo válido!");
            return;
        }
        
        if (totalTime + time > 540) {
            alert(`¡Solo faltan ${540 - totalTime} minutos para completar 9 horas!`);
            return;
        }
        
        totalTime += time;
        const now = new Date();
        logs.push({ 
            time, 
            timestamp: formatTime(now) 
        });
        
        // Guardar en localStorage
        localStorage.setItem('devopsTotalTime', totalTime);
        localStorage.setItem('devopsTimeLogs', JSON.stringify(logs));
        
        updateUI();
        customTime.value = '';
    });

    // Reiniciar día
    resetBtn.addEventListener('click', () => {
        if (confirm("¿Borrar todo el registro del día?")) {
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
        
        // Barra de progreso
        const percent = Math.round((totalTime / 540) * 100);
        progress.style.width = `${percent}%`;
        progressText.textContent = `${percent}% (${totalTime}/540 min)`;
        
        // Registro de actividades
        timeLog.innerHTML = logs.map(log => 
            `<li>
                <span>+${log.time} min</span>
                <span>${log.timestamp}</span>
            </li>`
        ).join('');
    }
});