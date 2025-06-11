document.addEventListener('DOMContentLoaded', function() {
    const SpecialOfferTimer = {
        endDate: null,
        timerInterval: null,

        init() {
            try {
                // Получаем сохраненную дату окончания или создаем новую
                this.endDate = this.getSavedEndDate();
                this.startTimer();
            } catch (error) {
                console.error('SpecialOfferTimer: Ошибка инициализации', error);
            }
        },

        getSavedEndDate() {
            const saved = localStorage.getItem('specialOfferEndDate');
            if (saved) {
                const endDate = new Date(saved);
                // Проверяем, не истекло ли время
                if (endDate > new Date()) {
                    return endDate;
                }
            }
            // Если дата не сохранена или истекла, создаем новую
            const newEndDate = new Date();
            newEndDate.setDate(newEndDate.getDate() + 14);
            localStorage.setItem('specialOfferEndDate', newEndDate.toISOString());
            return newEndDate;
        },

        startTimer() {
            // Очищаем предыдущий интервал если есть
            if (this.timerInterval) {
                clearInterval(this.timerInterval);
            }

            const updateDisplay = () => {
                const now = new Date();
                const difference = this.endDate - now;

                if (difference <= 0) {
                    clearInterval(this.timerInterval);
                    this.handleTimerEnd();
                    return;
                }

                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((difference % (1000 * 60)) / 1000);

                // Обновляем отображение с ведущими нулями
                document.getElementById('days').textContent = days.toString().padStart(2, '0');
                document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
                document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
                document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
            };

            // Обновляем сразу и запускаем интервал
            updateDisplay();
            this.timerInterval = setInterval(updateDisplay, 1000);
        },

        handleTimerEnd() {
            // Обработка окончания таймера
            const timerElements = ['days', 'hours', 'minutes', 'seconds'];
            timerElements.forEach(id => {
                const element = document.getElementById(id);
                if (element) element.textContent = '00';
            });

            // Можно добавить дополнительные действия по окончании таймера
            const offerSection = document.querySelector('.special-offer-page');
            if (offerSection) {
                offerSection.classList.add('offer-ended');
            }
        }
    };

    // Инициализация таймера
    SpecialOfferTimer.init();
});
