// Модуль для обработки процесса оформления заказа
document.addEventListener('DOMContentLoaded', function() {
    console.log('Checkout.js загружен');

    // Находим все необходимые элементы
    const progressSteps = document.querySelectorAll('.progress-step');
    const sections = document.querySelectorAll('.checkout-section');
    const continueButtons = document.querySelectorAll('.continue-button');
    const backButtons = document.querySelectorAll('.back-button');

    // Функция для перехода к определенному шагу
    function goToStep(stepIndex) {
        console.log(`Переход к шагу ${stepIndex}`);

        // Обновляем индикатор прогресса
        progressSteps.forEach((step, index) => {
            if (index <= stepIndex) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });

        // Показываем нужный раздел и скрываем остальные
        sections.forEach((section, index) => {
            if (index === stepIndex) {
                section.classList.remove('hidden');
            } else {
                section.classList.add('hidden');
            }
        });

        // Прокручиваем страницу вверх
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Устанавливаем обработчики для кнопок "Продолжить"
    continueButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Нажата кнопка Continue');

            const currentSection = this.closest('.checkout-section');
            const currentIndex = Array.from(sections).indexOf(currentSection);
            const nextIndex = currentIndex + 1;

            // Если есть следующий шаг, переходим к нему
            if (nextIndex < sections.length) {
                goToStep(nextIndex);
            }
        });
    });

    // Устанавливаем обработчики для кнопок "Назад"
    backButtons.forEach(button => {
        button.addEventListener('click', function() {
            console.log('Нажата кнопка Back');

            const currentSection = this.closest('.checkout-section');
            const currentIndex = Array.from(sections).indexOf(currentSection);
            const prevIndex = currentIndex - 1;

            // Если есть предыдущий шаг, переходим к нему
            if (prevIndex >= 0) {
                goToStep(prevIndex);
            }
        });
    });

    // Обработчики для выбора способа оплаты
    const paymentMethods = document.querySelectorAll('.payment-method input[type="radio"]');
    paymentMethods.forEach(method => {
        method.addEventListener('change', function() {
            // Скрываем все формы оплаты
            document.querySelectorAll('.payment-form').forEach(form => {
                form.classList.remove('active');
            });

            // Показываем форму для выбранного метода
            const methodId = this.id;
            if (methodId === 'credit-card') {
                document.querySelector('.credit-card-form').classList.add('active');
            } else if (methodId === 'paypal') {
                document.querySelector('.paypal-form').classList.add('active');
            } else if (methodId === 'apple-pay') {
                document.querySelector('.apple-pay-form').classList.add('active');
            }
        });
    });

    // Обработчики для выбора способа доставки
    const shippingOptions = document.querySelectorAll('.shipping-option input[type="radio"]');
    shippingOptions.forEach(option => {
        option.addEventListener('change', function() {
            // Обновляем информацию о стоимости доставки
            const shippingCostElement = document.querySelector('.summary-row:nth-child(2) span:last-child');
            const totalElement = document.querySelector('.total-price');

            // Базовые суммы
            const subtotal = 59.97;
            const taxes = 5.99;
            let shippingCost = 0;

            // Определяем стоимость доставки
            if (this.id === 'express') {
                shippingCost = 12.00;
                shippingCostElement.textContent = '$12.00';
            } else if (this.id === 'next-day') {
                shippingCost = 25.00;
                shippingCostElement.textContent = '$25.00';
            } else {
                shippingCostElement.textContent = 'Free';
            }

            // Обновляем итоговую сумму
            const total = subtotal + taxes + shippingCost;
            totalElement.textContent = `$${total.toFixed(2)}`;
        });
    });
});
