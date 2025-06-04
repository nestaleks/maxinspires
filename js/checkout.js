document.addEventListener('DOMContentLoaded', function() {
    // Элементы прогресса
    const progressSteps = document.querySelectorAll('.progress-step');

    // Разделы оформления заказа
    const customerInfoSection = document.getElementById('customer-info');
    const shippingMethodSection = document.getElementById('shipping-method');
    const paymentMethodSection = document.getElementById('payment-method');

    // Кнопки навигации
    const continueToShippingBtn = customerInfoSection.querySelector('.continue-button');
    const backToCustomerBtn = shippingMethodSection.querySelector('.back-button');
    const continueToPaymentBtn = shippingMethodSection.querySelector('.continue-button');
    const backToShippingBtn = paymentMethodSection.querySelector('.back-button');
    const completeOrderBtn = paymentMethodSection.querySelector('.complete-order');

    // Выбор способа оплаты
    const creditCardRadio = document.getElementById('credit-card');
    const paypalRadio = document.getElementById('paypal');
    const applePayRadio = document.getElementById('apple-pay');
    const creditCardForm = document.querySelector('.credit-card-form');

    // Переход к доставке
    continueToShippingBtn.addEventListener('click', function(e) {
        e.preventDefault();

        // Здесь можно добавить валидацию формы
        customerInfoSection.classList.add('hidden');
        shippingMethodSection.classList.remove('hidden');

        // Обновление прогресса
        progressSteps[0].classList.add('completed');
        progressSteps[1].classList.add('active');
    });

    // Возврат к информации о клиенте
    backToCustomerBtn.addEventListener('click', function() {
        shippingMethodSection.classList.add('hidden');
        customerInfoSection.classList.remove('hidden');

        // Обновление прогресса
        progressSteps[1].classList.remove('active');
        progressSteps[0].classList.remove('completed');
    });

    // Переход к оплате
    continueToPaymentBtn.addEventListener('click', function() {
        shippingMethodSection.classList.add('hidden');
        paymentMethodSection.classList.remove('hidden');

        // Обновление прогресса
        progressSteps[1].classList.add('completed');
        progressSteps[2].classList.add('active');
    });

    // Возврат к способу доставки
    backToShippingBtn.addEventListener('click', function() {
        paymentMethodSection.classList.add('hidden');
        shippingMethodSection.classList.remove('hidden');

        // Обновление прогресса
        progressSteps[2].classList.remove('active');
        progressSteps[1].classList.remove('completed');
    });

    // Обработка выбора способа оплаты
    creditCardRadio.addEventListener('change', function() {
        if (this.checked) {
            creditCardForm.classList.add('active');
        }
    });

    paypalRadio.addEventListener('change', function() {
        if (this.checked) {
            creditCardForm.classList.remove('active');
        }
    });

    applePayRadio.addEventListener('change', function() {
        if (this.checked) {
            creditCardForm.classList.remove('active');
        }
    });

    // Завершение заказа
    completeOrderBtn.addEventListener('click', function() {
        // Здесь можно добавить финальную валидацию и отправку заказа
        alert('Thank you for your order! It has been successfully placed.');
        window.location.href = './index.html'; // Перенаправление на главную страницу
    });
});
