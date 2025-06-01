document.addEventListener('DOMContentLoaded', () => {
    const predefinedTime = document.getElementById('predefinedTime');
    const customTime = document.getElementById('customTime');
    const addTimeBtn = document.getElementById('addTime');
    const totalTimeDisplay = document.getElementById('totalTime');
    const timeLog = document.getElementById('timeLog');
    const resetBtn = document.getElementById('reset');
    const progress = document.getElementById('progress');
    const progressText = document.getElementById('progressText');
    const activityType = document.getElementById('activityType');
    const notification = document.getElementById('notification');

    // Cargar datos guardados
    let totalTime = parseInt(localStorage.getItem('devopsTotalTime')) || 0;
    let logs = JSON.parse(localStorage.getItem('devopsTimeLogs')) || [];
    
    updateUI();

    // Formato de hora AM/PM
    function formatTime(date) {
        let hours = date.getHours();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes} ${ampm}`;
    }

    // Mostrar notificación
    function showNotification(message) {
        notification.textContent = message;
        notification.classList.add('notification-show');
        setTimeout(() => {
            notification.classList.remove('notification-show');
        }, 2000);
    }

    // Agregar tiempo
    addTimeBtn.addEventListener('click', () => {
        const time = customTime.value ? parseInt(customTime.value) : parseInt(predefinedTime.value);
        const activity = activityType.value;
        
        if (time <= 0 || isNaN(time)) {
            alert("¡Tiempo inválido!");
            return;
        }
        
        totalTime += time;
        const now = new Date();
        logs.push({ 
            activity,
            time, 
            timestamp: formatTime(now) 
        });
        
        // Guardar en localStorage
        localStorage.setItem('devopsTotalTime', totalTime);
        localStorage.setItem('devopsTimeLogs', JSON.stringify(logs));
        
        // Notificación si supera 540 min
        if (totalTime >= 540) {
            showNotification("Misión cumplida  ✅");
        }
        
        updateUI();
        customTime.value = '';
    });

    // Reiniciar día
    resetBtn.addEventListener('click', () => {
        if (confirm("¿Reiniciar todo el registro?")) {
            totalTime = 0;
            logs = [];
            localStorage.removeItem('devopsTotalTime');
            localStorage.removeItem('devopsTimeLogs');
            updateUI();
        }
    });

    // Actualizar UI
    function updateUI() {
        totalTimeDisplay.textContent = totalTime;
        
        // Barra de progreso
        const percent = Math.min(Math.round((totalTime / 540) * 100), 100);
        progress.style.width = `${percent}%`;
        progressText.textContent = `${percent}% (${totalTime}/540 min)`;
        
        // Registro de actividades
        timeLog.innerHTML = logs.map(log => 
            `<li>
                <span>${log.activity} (+${log.time} min)</span>
                <span>${log.timestamp}</span>
            </li>`
        ).join('');
    }
});