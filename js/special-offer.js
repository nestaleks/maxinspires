document.addEventListener('DOMContentLoaded', function() {
    // Таймер обратного отсчета для специальных предложений
    function initCountdownTimer() {
        // Устанавливаем дату окончания (14 дней от текущей даты)
        const now = new Date();
        const endDate = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000); // +14 дней

        function updateTimer() {
            const currentTime = new Date();
            const difference = endDate - currentTime;

            // Расчет оставшегося времени
            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            // Обновление элементов на странице
            document.getElementById('days').textContent = days < 10 ? '0' + days : days;
            document.getElementById('hours').textContent = hours < 10 ? '0' + hours : hours;
            document.getElementById('minutes').textContent = minutes < 10 ? '0' + minutes : minutes;
            document.getElementById('seconds').textContent = seconds < 10 ? '0' + seconds : seconds;

            // Продолжаем обратный отсчет
            if (difference > 0) {
                setTimeout(updateTimer, 1000);
            }
        }

        // Запускаем таймер
        updateTimer();
    }

    // Инициализация таймера
    initCountdownTimer();
});
