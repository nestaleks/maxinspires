// 01. Country Selector Component
const CountrySelector = {
    init() {
        // Получаем все селекторы стран на странице (в шапке и футере)
        const countrySelectors = document.querySelectorAll('.country-selector');

        // Restore saved country selection
        this.restoreSavedCountry();

        // Setup event listeners для всех селекторов стран
        countrySelectors.forEach(selector => {
            const selectedCountry = selector.querySelector('.selected-country');
            if (selectedCountry) {
                this.setupEventListeners(selector, selectedCountry);
            }
        });
    },

    restoreSavedCountry() {
        const selectedCountries = document.querySelectorAll('.selected-country');
        const savedCountry = localStorage.getItem('selectedCountry');
        if (savedCountry && selectedCountries.length > 0) {
            const { flag, name, currency } = JSON.parse(savedCountry);

            // Применяем сохраненную страну ко всем селекторам на странице
            selectedCountries.forEach(selectedCountry => {
                const flagImg = selectedCountry.querySelector('img');
                const countryNameEl = selectedCountry.querySelector('.country-name');
                const countryCurrencyEl = selectedCountry.querySelector('.country-currency');

                if (flagImg) flagImg.src = flag;
                if (countryNameEl) countryNameEl.textContent = name;
                if (countryCurrencyEl) countryCurrencyEl.textContent = currency;
            });
        }
    },

    setupEventListeners(countrySelector, selectedCountry) {
        if (!countrySelector || !selectedCountry) return;

        // Определяем, находится ли селектор в футере
        const isFooterSelector = countrySelector.closest('.footer-country') !== null;

        // Toggle dropdown
        selectedCountry.addEventListener('click', (e) => {
            e.stopPropagation();
            // Закрываем все другие открытые селекторы перед открытием текущего
            document.querySelectorAll('.country-selector.active').forEach(selector => {
                if (selector !== countrySelector) {
                    selector.classList.remove('active');
                }
            });
            countrySelector.classList.toggle('active');
        });

        // Handle country selection
        const countryItems = document.querySelectorAll('.country-dropdown li');
        countryItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                this.updateSelectedCountry(item);
                countrySelector.classList.remove('active');
            });
        });

        // Close dropdown on outside click
        document.addEventListener('click', () => {
            countrySelector.classList.remove('active');
        });
    },

    updateSelectedCountry(countryElement) {
        const selectedCountries = document.querySelectorAll('.selected-country');
        const countryFlag = countryElement.querySelector('img').src;
        const countryName = countryElement.querySelector('.country-name').textContent;
        const countryCurrency = countryElement.querySelector('.country-currency').textContent;

        // Обновляем отображение во всех селекторах стран
        selectedCountries.forEach(selectedCountry => {
            const flagImg = selectedCountry.querySelector('img');
            const countryNameEl = selectedCountry.querySelector('.country-name');
            const countryCurrencyEl = selectedCountry.querySelector('.country-currency');

            if (flagImg) flagImg.src = countryFlag;
            if (countryNameEl) countryNameEl.textContent = countryName;
            if (countryCurrencyEl) countryCurrencyEl.textContent = countryCurrency;
        });

        // Save selection
        localStorage.setItem('selectedCountry', JSON.stringify({
            flag: countryFlag,
            name: countryName,
            currency: countryCurrency
        }));

        // Update prices
        this.updatePrices(countryCurrency);
    },

    updatePrices(currency) {
        // Price conversion logic will go here
        console.log(`Prices updated for currency: ${currency}`);
    }
};

// 02. Photo Slider Component
const PhotoSlider = {
    slides: null,
    btnPrev: null,
    btnNext: null,
    currentSlide: 0,
    sliderContainer: null,

    init() {
        // Находим слайдер на странице продукта, а не в hero slider
        this.sliderContainer = document.querySelector('.product_page .slider');
        if (!this.sliderContainer) return;

        this.slides = this.sliderContainer.querySelectorAll('.slide');
        this.btnPrev = this.sliderContainer.querySelector('.prev');
        this.btnNext = this.sliderContainer.querySelector('.next');

        if (this.slides.length === 0) return;

        this.initSlides();
        this.setupEventListeners();
    },

    initSlides() {
        this.slides.forEach((slide, index) => {
            slide.style.transform = `translateX(${100 * index}%)`;
        });
    },

    goToSlide(current) {
        this.slides.forEach((slide, index) => {
            slide.style.transform = `translateX(${100 * (index - current)}%)`;
        });
    },

    nextSlide() {
        this.currentSlide = this.currentSlide === this.slides.length - 1 ? 0 : this.currentSlide + 1;
        this.goToSlide(this.currentSlide);
    },

    prevSlide() {
        this.currentSlide = this.currentSlide === 0 ? this.slides.length - 1 : this.currentSlide - 1;
        this.goToSlide(this.currentSlide);
    },

    setupEventListeners() {
        if (this.btnNext && this.btnPrev) {
            this.btnNext.addEventListener('click', () => this.nextSlide());
            this.btnPrev.addEventListener('click', () => this.prevSlide());
        }
    }
};

// 03. Quantity Control Component
const QuantityControl = {
    init() {
        const quantityContainer = document.querySelector(".quantity");
        if (!quantityContainer) return;

        this.minusBtn = quantityContainer.querySelector(".minus");
        this.plusBtn = quantityContainer.querySelector(".plus");
        this.inputBox = quantityContainer.querySelector(".input-box");

        this.updateButtonStates();
        this.setupEventListeners();
    },

    updateButtonStates() {
        const value = parseInt(this.inputBox.value);
        this.minusBtn.disabled = value <= 1;
        this.plusBtn.disabled = value >= parseInt(this.inputBox.max);
    },

    handleQuantityChange() {
        let value = parseInt(this.inputBox.value);
        value = isNaN(value) ? 1 : value;
        this.updateButtonStates();
        // Execute your code here based on the updated quantity value
        console.log("Quantity changed:", value);
    },

    decreaseValue() {
        let value = parseInt(this.inputBox.value);
        value = isNaN(value) ? 1 : Math.max(value - 1, 1);
        this.inputBox.value = value;
        this.updateButtonStates();
        this.handleQuantityChange();
    },

    increaseValue() {
        let value = parseInt(this.inputBox.value);
        value = isNaN(value) ? 1 : Math.min(value + 1, parseInt(this.inputBox.max));
        this.inputBox.value = value;
        this.updateButtonStates();
        this.handleQuantityChange();
    },

    setupEventListeners() {
        this.minusBtn.addEventListener('click', () => this.decreaseValue());
        this.plusBtn.addEventListener('click', () => this.increaseValue());
        this.inputBox.addEventListener('input', () => this.handleQuantityChange());
    }
};

// 04. Navigation Component
const Navigation = {
    init() {
        this.setActiveMenuItem();
    },

    setActiveMenuItem() {
        const currentPath = window.location.pathname;
        const menuLinks = document.querySelectorAll('nav ul li a');

        menuLinks.forEach(link => {
            // Get path from link href
            const linkPath = new URL(link.href).pathname;
            
            // Remove any trailing slashes for comparison
            const normalizedCurrentPath = currentPath.replace(/\/$/, '');
            const normalizedLinkPath = linkPath.replace(/\/$/, '');
            
            // Compare paths and set active class
            if (normalizedCurrentPath === normalizedLinkPath || 
                (normalizedCurrentPath === '/' && normalizedLinkPath === '/index.html') ||
                (normalizedCurrentPath === '/index.html' && normalizedLinkPath === '/')) {
                link.classList.add('active');
            }
        });
    }
};

// 05. Checkout Process Component
const CheckoutProcess = {
    init() {
        console.log('Инициализация компонента CheckoutProcess');
        // Получаем все необходимые элементы
        this.progressSteps = document.querySelectorAll('.progress-step');
        this.checkoutSections = document.querySelectorAll('.checkout-section');
        this.continueButtons = document.querySelectorAll('.continue-button');
        this.backButtons = document.querySelectorAll('.back-button');

        // Инициализация, если элементы найдены
        if (this.progressSteps.length > 0 && this.checkoutSections.length > 0) {
            console.log('Элементы найдены, настраиваем обработчики событий');
            this.setupEventListeners();
        } else {
            console.warn('Элементы не найдены для CheckoutProcess');
        }
    },

    setupEventListeners() {
        // Обработчики для кнопок "Продолжить"
        this.continueButtons.forEach(button => {
            button.addEventListener('click', () => {
                const currentSection = button.closest('.checkout-section');
                const currentIndex = Array.from(this.checkoutSections).indexOf(currentSection);
                const nextIndex = currentIndex + 1;

                if (nextIndex < this.checkoutSections.length) {
                    this.goToStep(nextIndex);
                }
            });
        });

        // Обработчики для кнопок "Назад"
        this.backButtons.forEach(button => {
            button.addEventListener('click', () => {
                const currentSection = button.closest('.checkout-section');
                const currentIndex = Array.from(this.checkoutSections).indexOf(currentSection);
                const prevIndex = currentIndex - 1;

                if (prevIndex >= 0) {
                    this.goToStep(prevIndex);
                }
            });
        });

        // Обработчик для выбора способа доставки
        const shippingOptions = document.querySelectorAll('.shipping-option input[type="radio"]');
        shippingOptions.forEach(option => {
            option.addEventListener('change', () => {
                this.updateOrderSummary(option.id);
            });
        });

        // Обработчик для выбора способов оплаты
        const paymentMethods = document.querySelectorAll('.payment-method input[type="radio"]');
        paymentMethods.forEach(method => {
            method.addEventListener('change', () => {
                // Скрываем все формы оплаты
                document.querySelectorAll('.payment-form').forEach(form => {
                    form.classList.remove('active');
                });

                // Отображаем форму для выбранного метода
                const methodId = method.id;
                if (methodId === 'credit-card') {
                    document.querySelector('.credit-card-form').classList.add('active');
                } else if (methodId === 'paypal') {
                    document.querySelector('.paypal-form').classList.add('active');
                } else if (methodId === 'apple-pay') {
                    document.querySelector('.apple-pay-form').classList.add('active');
                }
            });
        });
    },

    goToStep(stepIndex) {
        // Обновляем активный шаг в прогресс-баре
        this.progressSteps.forEach((step, index) => {
            if (index <= stepIndex) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });

        // Показываем нужную секцию и скрываем остальные
        this.checkoutSections.forEach((section, index) => {
            if (index === stepIndex) {
                section.classList.remove('hidden');
            } else {
                section.classList.add('hidden');
            }
        });

        // Прокручиваем к верху страницы
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
};

// 06. Hero Slider Component (без внешних библиотек)
const HeroSlider = {
    slider: null,
    slides: null,
    indicators: null,
    prevBtn: null,
    nextBtn: null,
    currentIndex: 0,
    autoplayInterval: null,
    autoplayDelay: 5000,
    isAnimating: false, // Флаг для предотвращения множественных кликов
    touchStartX: 0,
    touchEndX: 0,
    isTouchDevice: ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0),
    isReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,

    init() {
        try {
            // Находим элементы слайдера
            this.slider = document.querySelector('.hero-slider .custom-slider');
            if (!this.slider) {
                console.warn('Слайдер не найден на странице');
                return;
            }

            // Простой прямой код для переключения слайдов
            const directSlides = this.slider.querySelectorAll('.slide');
            const directPrevBtn = document.createElement('button');
            directPrevBtn.className = 'slider-btn prev-btn';
            directPrevBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24"><path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

            const directNextBtn = document.createElement('button');
            directNextBtn.className = 'slider-btn next-btn';
            directNextBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24"><path d="M9 6L15 12L9 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

            this.slider.appendChild(directPrevBtn);
            this.slider.appendChild(directNextBtn);

            let directCurrentSlide = 0;

            directPrevBtn.addEventListener('click', () => {
                directSlides[directCurrentSlide].classList.remove('active');
                directCurrentSlide = directCurrentSlide === 0 ? directSlides.length - 1 : directCurrentSlide - 1;
                directSlides[directCurrentSlide].classList.add('active');
            });

            directNextBtn.addEventListener('click', () => {
                directSlides[directCurrentSlide].classList.remove('active');
                directCurrentSlide = directCurrentSlide === directSlides.length - 1 ? 0 : directCurrentSlide + 1;
                directSlides[directCurrentSlide].classList.add('active');
            });

            // Находим слайды
            this.slides = this.slider.querySelectorAll('.slide');
            if (!this.slides || this.slides.length === 0) {
                console.warn('Слайды не найдены в слайдере');
                return;
            }

            console.log(`Инициализация слайдера: найдено ${this.slides.length} слайдов`);

            // Создаем навигационные кнопки
            this.createNavButtons();

            // Создаем индикаторы
            this.createIndicators();

            // Инициализируем слайды
            this.initSlides();

            // Настраиваем обработчики событий
            this.setupEventListeners();

            // Запускаем автопрокрутку
            this.startAutoplay();

            // Добавляем WAI-ARIA атрибуты для доступности
            this.setupAccessibility();

            console.log('Слайдер успешно инициализирован');
        } catch (error) {
            console.error('Ошибка при инициализации слайдера:', error);
        }
    },

    createNavButtons() {
        // Удаляем существующие кнопки, если они есть
        const existingPrev = this.slider.querySelector('.prev-btn');
        const existingNext = this.slider.querySelector('.next-btn');
        if (existingPrev) existingPrev.remove();
        if (existingNext) existingNext.remove();

        // Создаем кнопку "Предыдущий"
        this.prevBtn = document.createElement('button');
        this.prevBtn.className = 'slider-btn prev-btn';
        this.prevBtn.setAttribute('aria-label', 'Предыдущий слайд');
        this.prevBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

        // Создаем кнопку "Следующий"
        this.nextBtn = document.createElement('button');
        this.nextBtn.className = 'slider-btn next-btn';
        this.nextBtn.setAttribute('aria-label', 'Следующий слайд');
        this.nextBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 6L15 12L9 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

        // Добавляем кнопки в слайдер
        this.slider.appendChild(this.prevBtn);
        this.slider.appendChild(this.nextBtn);
    },

    createIndicators() {
        // Удаляем существующие индикаторы, если они есть
        const existingContainer = this.slider.querySelector('.slider-indicators');
        if (existingContainer) existingContainer.remove();

        // Создаем новый контейнер для индикаторов
        const indicatorsContainer = document.createElement('div');
        indicatorsContainer.className = 'slider-indicators';

        // Создаем индикаторы для каждого слайда
        this.slides.forEach((_, index) => {
            const indicator = document.createElement('button');
            indicator.className = 'indicator';
            indicator.setAttribute('aria-label', `Перейти к слайду ${index + 1}`);
            indicator.setAttribute('data-slide-index', index);

            // Добавляем класс active первому индикатору
            if (index === 0) indicator.classList.add('active');

            // Добавляем индикатор в контейнер
            indicatorsContainer.appendChild(indicator);
        });

        // Добавляем контейнер в слайдер
        this.slider.appendChild(indicatorsContainer);

        // Сохраняем ссылку на индикаторы
        this.indicators = indicatorsContainer.querySelectorAll('.indicator');
    },

    initSlides() {
        // Удаляем все встроенные стили и классы active
        this.slides.forEach((slide, index) => {
            slide.removeAttribute('style');
            slide.classList.remove('active');

            // Настраиваем ленивую загрузку изображений для неактивных слайдов
            const img = slide.querySelector('img');
            if (img && index > 0) {
                // Сохраняем исходный src в data-атрибуте
                const originalSrc = img.getAttribute('src');
                if (originalSrc && !img.getAttribute('data-src')) {
                    img.setAttribute('data-src', originalSrc);

                    // Устанавливаем placeholder
                    img.setAttribute('src', 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E');

                    // Добавляем класс для стилизации
                    img.classList.add('lazy-load');
                }
            }
        });

        // Активируем первый слайд
        if (this.slides.length > 0) {
            this.slides[0].classList.add('active');
            this.currentIndex = 0;

            // Загружаем изображение первого слайда если оно отложено
            this.loadSlideImage(0);

            // Предзагружаем следующий слайд
            if (this.slides.length > 1) {
                this.loadSlideImage(1);
            }
        }
    },

    // Метод для загрузки изображения в слайде
    loadSlideImage(index) {
        if (index < 0 || index >= this.slides.length) return;

        const slide = this.slides[index];
        const img = slide.querySelector('img.lazy-load');

        if (img && img.hasAttribute('data-src')) {
            const originalSrc = img.getAttribute('data-src');
            img.setAttribute('src', originalSrc);
            img.classList.remove('lazy-load');

            // Опционально: можно удалить data-src после загрузки
            // img.removeAttribute('data-src');
        }
    },

    goToSlide(targetIndex, direction = null) {
        // Если анимация уже идет или индекс не изменился, не переключаем
        if (this.isAnimating || targetIndex === this.currentIndex) return;

        // Устанавливаем флаг анимации
        this.isAnimating = true;

        // Нормализуем индекс (для циклической прокрутки)
        if (targetIndex < 0) targetIndex = this.slides.length - 1;
        if (targetIndex >= this.slides.length) targetIndex = 0;

        // Получаем текущий и следующий слайды
        const currentSlide = this.slides[this.currentIndex];
        const nextSlide = this.slides[targetIndex];

        // Загружаем изображение следующего слайда если оно отложено
        this.loadSlideImage(targetIndex);

        // Предзагружаем следующий слайд для плавной прокрутки
        const nextNextIndex = targetIndex + 1 < this.slides.length ? targetIndex + 1 : 0;
        this.loadSlideImage(nextNextIndex);

        // Обновляем индикаторы
        this.updateIndicators(targetIndex);

        // Добавляем класс для определения направления анимации (опционально)
        if (direction) {
            this.slider.setAttribute('data-direction', direction);
        }

        // Удаляем класс active у текущего слайда
        currentSlide.classList.remove('active');

        // Подготавливаем следующий слайд
        nextSlide.classList.add('active');

        // Обновляем текущий индекс
        this.currentIndex = targetIndex;

        // Обновляем ARIA атрибуты
        this.updateAriaAttributes();

        // Сбрасываем флаг анимации после задержки, чтобы анимация успела произойти
        setTimeout(() => {
            this.isAnimating = false;
        }, 500);
    },

    updateIndicators(activeIndex) {
        if (!this.indicators) return;

        this.indicators.forEach((indicator, index) => {
            if (index === activeIndex) {
                indicator.classList.add('active');
                indicator.setAttribute('aria-current', 'true');
            } else {
                indicator.classList.remove('active');
                indicator.removeAttribute('aria-current');
            }
        });
    },

    setupEventListeners() {
        // Используем делегирование событий для кнопок навигации
        this.slider.addEventListener('click', (e) => {
            // Проверяем, является ли целью клика кнопка навигации
            if (e.target.closest('.prev-btn')) {
                this.goToSlide(this.currentIndex - 1, 'prev');
                this.resetAutoplay();
            } else if (e.target.closest('.next-btn')) {
                this.goToSlide(this.currentIndex + 1, 'next');
                this.resetAutoplay();
            }

            // Проверяем, является ли целью клика индикатор
            const indicator = e.target.closest('.indicator');
            if (indicator) {
                const targetIndex = parseInt(indicator.getAttribute('data-slide-index'));
                this.goToSlide(targetIndex);
                this.resetAutoplay();
            }
        });

        // Обработка паузы при наведении мыши или фокусе
        const pauseAutoplay = () => clearInterval(this.autoplayInterval);
        const resumeAutoplay = () => this.startAutoplay();

        this.slider.addEventListener('mouseenter', pauseAutoplay);
        this.slider.addEventListener('mouseleave', resumeAutoplay);
        this.slider.addEventListener('focusin', pauseAutoplay);
        this.slider.addEventListener('focusout', resumeAutoplay);

        // Используем подходящие обработчики в зависимости от устройства
        if (this.isTouchDevice) {
            // Для сенсорных устройств используем Touch Events
            this.slider.addEventListener('touchstart', (e) => {
                this.touchStartX = e.touches[0].clientX;
            }, { passive: true });

            this.slider.addEventListener('touchend', (e) => {
                this.touchEndX = e.changedTouches[0].clientX;
                this.handleSwipe();
            }, { passive: true });
        } else {
            // Для десктопов используем Pointer Events API
            this.slider.addEventListener('pointerdown', (e) => {
                if (e.pointerType === 'mouse' && e.button !== 0) return; // Только левая кнопка мыши
                this.touchStartX = e.clientX;
            }, { passive: true });

            this.slider.addEventListener('pointerup', (e) => {
                if (e.pointerType === 'mouse' && e.button !== 0) return;
                this.touchEndX = e.clientX;
                this.handleSwipe();
            }, { passive: true });
        }

        // Обработка клавиатурной навигации
        document.addEventListener('keydown', (e) => {
            // Проверяем, находится ли фокус в слайдере или есть hover
            if (!this.slider.contains(document.activeElement) && !this.slider.matches(':hover')) return;

            switch (e.key) {
                case 'ArrowLeft':
                    e.preventDefault(); // Предотвращаем прокрутку страницы
                    this.goToSlide(this.currentIndex - 1, 'prev');
                    this.resetAutoplay();
                    break;
                case 'ArrowRight':
                    e.preventDefault(); // Предотвращаем прокрутку страницы
                    this.goToSlide(this.currentIndex + 1, 'next');
                    this.resetAutoplay();
                    break;
                case 'Space':
                case 'Enter':
                    // Если фокус на кнопке или индикаторе, позволяем действовать по умолчанию
                    if (!e.target.classList.contains('slider-btn') && 
                        !e.target.classList.contains('indicator')) {
                        e.preventDefault();
                        this.goToSlide(this.currentIndex + 1, 'next');
                        this.resetAutoplay();
                    }
                    break;
            }
        });

        // Останавливаем автопрокрутку, когда страница не видна
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                clearInterval(this.autoplayInterval);
            } else {
                this.startAutoplay();
            }
        });
    },

    handleSwipe() {
        const swipeThreshold = 50;
        const swipeDistance = this.touchEndX - this.touchStartX;

        if (Math.abs(swipeDistance) < swipeThreshold) return;

        if (swipeDistance < 0) {
            // Свайп влево - следующий слайд
            this.goToSlide(this.currentIndex + 1, 'next');
        } else {
            // Свайп вправо - предыдущий слайд
            this.goToSlide(this.currentIndex - 1, 'prev');
        }

        this.resetAutoplay();
    },

    startAutoplay() {
        // Не запускаем автопрокрутку, если пользователь предпочитает уменьшенное движение
        if (this.isReducedMotion) {
            console.log('Автопрокрутка отключена из-за предпочтения уменьшенного движения');
            return;
        }

        // Проверяем, не сохранил ли пользователь настройку отключения автопрокрутки
        const autoplayDisabled = localStorage.getItem('sliderAutoplayDisabled') === 'true';
        if (autoplayDisabled) {
            console.log('Автопрокрутка отключена пользователем');
            return;
        }

        // Очищаем предыдущий интервал
        if (this.autoplayInterval) clearInterval(this.autoplayInterval);

        // Отменяем запланированное переключение слайда
        if (this.autoplayTimeout) cancelAnimationFrame(this.autoplayTimeout);

        // Используем requestAnimationFrame для более эффективного таймера
        let lastTime = performance.now();
        let elapsed = 0;

        const tick = (now) => {
            // Вычисляем прошедшее время
            elapsed += now - lastTime;
            lastTime = now;

            // Если прошло достаточно времени и страница активна, переключаем слайд
            if (elapsed >= this.autoplayDelay) {
                if (!document.hidden && !this.isAnimating) {
                    this.goToSlide(this.currentIndex + 1, 'next');
                }
                elapsed = 0;
            }

            // Продолжаем цикл только если автопрокрутка не отменена
            if (this.autoplayInterval) {
                this.autoplayTimeout = requestAnimationFrame(tick);
            }
        };

        // Запускаем цикл
        this.autoplayInterval = true; // Маркер активности автопрокрутки
        this.autoplayTimeout = requestAnimationFrame(tick);

        // Добавляем возможность остановки автопрокрутки кнопкой (если её ещё нет)
        if (!this.slider.querySelector('.slider-autoplay-toggle')) {
            this.addAutoplayToggle();
        }
    },

    // Метод для добавления кнопки включения/выключения автопрокрутки
    addAutoplayToggle() {
        const autoplayToggle = document.createElement('button');
        autoplayToggle.className = 'slider-autoplay-toggle';
        autoplayToggle.setAttribute('aria-label', 'Приостановить автопрокрутку');
        autoplayToggle.setAttribute('title', 'Приостановить автопрокрутку');
        autoplayToggle.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor"/>
                <rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor"/>
            </svg>
        `;

        // Проверяем текущее состояние
        const autoplayDisabled = localStorage.getItem('sliderAutoplayDisabled') === 'true';
        if (autoplayDisabled) {
            autoplayToggle.classList.add('paused');
            autoplayToggle.setAttribute('aria-label', 'Возобновить автопрокрутку');
            autoplayToggle.setAttribute('title', 'Возобновить автопрокрутку');
            autoplayToggle.innerHTML = `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M8 5.14v14.72a1 1 0 001.55.83l12-7.36a1 1 0 000-1.66l-12-7.36A1 1 0 008 5.14z" fill="currentColor"/>
                </svg>
            `;
        }

        // Добавляем обработчик события
        autoplayToggle.addEventListener('click', () => {
            const isPaused = autoplayToggle.classList.contains('paused');

            if (isPaused) {
                // Возобновляем автопрокрутку
                autoplayToggle.classList.remove('paused');
                autoplayToggle.setAttribute('aria-label', 'Приостановить автопрокрутку');
                autoplayToggle.setAttribute('title', 'Приостановить автопрокрутку');
                autoplayToggle.innerHTML = `
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor"/>
                        <rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor"/>
                    </svg>
                `;

                localStorage.setItem('sliderAutoplayDisabled', 'false');
                this.startAutoplay();
            } else {
                // Приостанавливаем автопрокрутку
                autoplayToggle.classList.add('paused');
                autoplayToggle.setAttribute('aria-label', 'Возобновить автопрокрутку');
                autoplayToggle.setAttribute('title', 'Возобновить автопрокрутку');
                autoplayToggle.innerHTML = `
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M8 5.14v14.72a1 1 0 001.55.83l12-7.36a1 1 0 000-1.66l-12-7.36A1 1 0 008 5.14z" fill="currentColor"/>
                    </svg>
                `;

                localStorage.setItem('sliderAutoplayDisabled', 'true');
                if (this.autoplayInterval) {
                    this.autoplayInterval = null;
                    if (this.autoplayTimeout) {
                        cancelAnimationFrame(this.autoplayTimeout);
                        this.autoplayTimeout = null;
                    }
                }
            }
        });

        // Добавляем кнопку в слайдер
        this.slider.appendChild(autoplayToggle);
    },

    resetAutoplay() {
        // Останавливаем текущую автопрокрутку
        this.autoplayInterval = null;
        if (this.autoplayTimeout) {
            cancelAnimationFrame(this.autoplayTimeout);
            this.autoplayTimeout = null;
        }

        // Запускаем новую автопрокрутку
        this.startAutoplay();
    },

    setupAccessibility() {
        // Добавляем ARIA роли и атрибуты для улучшения доступности
        this.slider.setAttribute('role', 'region');
        this.slider.setAttribute('aria-roledescription', 'карусель');
        this.slider.setAttribute('aria-label', 'Слайдер изображений');

        const slidesContainer = this.slider.querySelector('.slides-container');
        if (slidesContainer) {
            slidesContainer.setAttribute('role', 'presentation');
        }

        this.slides.forEach((slide, index) => {
            slide.setAttribute('role', 'group');
            slide.setAttribute('aria-roledescription', 'слайд');
            slide.setAttribute('aria-label', `Слайд ${index + 1} из ${this.slides.length}`);
            slide.setAttribute('aria-hidden', index === 0 ? 'false' : 'true');
        });

        this.updateAriaAttributes();
    },

    updateAriaAttributes() {
        // Обновляем ARIA атрибуты для текущего состояния слайдера
        this.slides.forEach((slide, index) => {
            slide.setAttribute('aria-hidden', index === this.currentIndex ? 'false' : 'true');
        });
    }
};

// Tabs functionality
const TabsComponent = {
    init() {
        const tabs = document.querySelectorAll('.tabs_item_link');
        const tabContents = document.querySelectorAll('.tabcontents > div');
        
        // Восстанавливаем сохраненный таб или показываем первый
        this.restoreSelectedTab(tabs, tabContents);
        
        // Устанавливаем обработчики событий
        this.setupEventListeners(tabs, tabContents);
    },

    restoreSelectedTab(tabs, tabContents) {
        const savedTab = localStorage.getItem('selectedTab');
        if (savedTab && document.querySelector(savedTab)) {
            this.activateTab(
                document.querySelector(`[href="${savedTab}"]`),
                tabs,
                tabContents
            );
        } else {
            // Активируем первый таб по умолчанию
            tabs[0].parentElement.classList.add('selected');
            tabContents[0].classList.add('active');
        }
    },

    activateTab(selectedTab, tabs, tabContents) {
        // Удаляем классы активности
        tabs.forEach(tab => tab.parentElement.classList.remove('selected'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        // Активируем выбранный таб
        selectedTab.parentElement.classList.add('selected');
        const tabId = selectedTab.getAttribute('href');
        document.querySelector(tabId).classList.add('active');
        
        // Сохраняем выбор
        localStorage.setItem('selectedTab', tabId);
    },

    setupEventListeners(tabs, tabContents) {
        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                this.activateTab(tab, tabs, tabContents);
            });
        });
    }
};

// Функционал корзины
document.addEventListener('DOMContentLoaded', () => {
    initializeCart();
});

function initializeCart() {
    const cartItems = document.querySelector('.cart-items');
    if (!cartItems) return;

    // Обработчики кнопок количества
    cartItems.addEventListener('click', (e) => {
        if (e.target.classList.contains('quantity-btn')) {
            const input = e.target.parentElement.querySelector('.quantity-input');
            const currentValue = parseInt(input.value);

            if (e.target.classList.contains('plus')) {
                input.value = currentValue + 1;
            } else if (e.target.classList.contains('minus') && currentValue > 1) {
                input.value = currentValue - 1;
            }

            updateCartTotals();
        }
    });

    // Обработчики изменения количества вручную
    cartItems.addEventListener('change', (e) => {
        if (e.target.classList.contains('quantity-input')) {
            const value = parseInt(e.target.value);
            if (value < 1) {
                e.target.value = 1;
            }
            updateCartTotals();
        }
    });

    // Обработчики удаления товаров
    cartItems.addEventListener('click', (e) => {
        if (e.target.closest('.cart-item-remove')) {
            const cartItem = e.target.closest('.cart-item');
            cartItem.remove();
            updateCartTotals();
            
            // Проверяем, остались ли товары в корзине
            if (document.querySelectorAll('.cart-item').length === 0) {
                showEmptyCart();
            }
        }
    });

    // Кнопка оформления заказа
    const checkoutButton = document.querySelector('.checkout-button');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', () => {
            // Здесь будет логика оформления заказа
            alert('Переход к оформлению заказа');
        });
    }

    updateCartTotals();
}

function updateCartTotals() {
    const cartItems = document.querySelectorAll('.cart-item');
    let subtotal = 0;

    cartItems.forEach(item => {
        const quantity = parseInt(item.querySelector('.quantity-input').value);
        // Извлекаем цену правильно, учитывая десятичные значения
        const priceText = item.querySelector('.price').textContent.replace('$', '').trim();
        const price = parseFloat(priceText);
        subtotal += quantity * price;
    });

    // Обновляем отображение сумм
    document.querySelector('.summary-subtotal').textContent = formatPrice(subtotal);
    document.querySelector('.total-price').textContent = formatPrice(subtotal);
}

function showEmptyCart() {
    const cartContent = document.querySelector('.cart-content');
    cartContent.innerHTML = `
        <div class="empty-cart">
            <p>Ваша корзина пуста</p>
            <a href="catalog.html" class="continue-shopping">Продолжить покупки</a>
        </div>
    `;
}

function formatPrice(price) {
    return '$' + price.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

// Product Slider Component
const ProductSlider = {
    currentSlide: 0,
    slides: null,
    thumbs: null,
    sliderContainer: null,

    init() {
        // Ищем слайдер только на странице продукта
        this.sliderContainer = document.querySelector('.product_page .slider-main');
        if (!this.sliderContainer) return;

        this.slides = this.sliderContainer.querySelectorAll('.slides-container .slide');
        this.thumbs = document.querySelectorAll('.slider-thumbs .thumb');

        if (!this.slides.length) return;

        this.setupEventListeners();
    },

    setupEventListeners() {
        // Кнопки навигации в контейнере слайдера продукта
        if (this.sliderContainer) {
            const prevBtn = this.sliderContainer.querySelector('.btn-slide.prev');
            const nextBtn = this.sliderContainer.querySelector('.btn-slide.next');

            if (prevBtn) prevBtn.addEventListener('click', () => this.showSlide(this.currentSlide - 1));
            if (nextBtn) nextBtn.addEventListener('click', () => this.showSlide(this.currentSlide + 1));
        }

        // Миниатюры
        if (this.thumbs && this.thumbs.length) {
            this.thumbs.forEach((thumb, index) => {
                thumb.addEventListener('click', () => this.showSlide(index));
            });
        }
    },

    showSlide(index) {
        // Проверяем наличие слайдов
        if (!this.slides || !this.slides.length) return;

        // Обработка граничных случаев
        if (index < 0) index = this.slides.length - 1;
        if (index >= this.slides.length) index = 0;

        // Убираем активный класс у текущих элементов
        this.slides[this.currentSlide].classList.remove('active');

        if (this.thumbs && this.thumbs.length > this.currentSlide) {
            this.thumbs[this.currentSlide].classList.remove('active');
        }

        // Устанавливаем новый индекс
        this.currentSlide = index;

        // Добавляем активный класс новым элементам
        this.slides[this.currentSlide].classList.add('active');

        if (this.thumbs && this.thumbs.length > this.currentSlide) {
            this.thumbs[this.currentSlide].classList.add('active');
        }
    }
};

// Инициализация всех компонентов
document.addEventListener('DOMContentLoaded', () => {
    // Загрузка изображений слайдера и предварительная проверка
    const preloadSliderImages = () => {
        const slider = document.querySelector('.hero-slider .custom-slider');
        if (!slider) return;

        const slides = slider.querySelectorAll('.slide');
        if (!slides.length) return;

        // Добавляем индикатор загрузки
        const loadingIndicator = document.createElement('div');
        loadingIndicator.className = 'slider-loading';
        loadingIndicator.innerHTML = `
            <div class="loading-spinner"></div>
            <div class="loading-text">Загрузка слайдера...</div>
        `;
        slider.appendChild(loadingIndicator);

        let loadedCount = 0;
        const totalImages = slides.length;

        // Функция для обновления прогресса загрузки
        const updateProgress = () => {
            const percent = Math.round((loadedCount / totalImages) * 100);
            loadingIndicator.querySelector('.loading-text').textContent = `Загрузка: ${percent}%`;
        };

        // Функция для завершения загрузки
        const finishLoading = () => {
            // Небольшая задержка для плавности
            setTimeout(() => {
                loadingIndicator.classList.add('fade-out');
                setTimeout(() => {
                    loadingIndicator.remove();
                    initializeSlider();
                }, 500);
            }, 300);
        };

        // Проверяем загрузку всех изображений
        slides.forEach(slide => {
            const img = slide.querySelector('img');
            if (!img) {
                loadedCount++;
                updateProgress();
                if (loadedCount === totalImages) finishLoading();
                return;
            }

            if (img.complete) {
                loadedCount++;
                updateProgress();
                if (loadedCount === totalImages) finishLoading();
            } else {
                img.addEventListener('load', () => {
                    loadedCount++;
                    updateProgress();
                    if (loadedCount === totalImages) finishLoading();
                });

                img.addEventListener('error', () => {
                    console.error(`Ошибка загрузки изображения: ${img.src}`);
                    loadedCount++;
                    updateProgress();
                    if (loadedCount === totalImages) finishLoading();
                });
            }
        });

        // Устанавливаем таймаут на случай, если что-то пойдет не так
        setTimeout(() => {
            if (loadedCount < totalImages) {
                console.warn('Превышено время ожидания загрузки изображений');
                finishLoading();
            }
        }, 10000); // 10 секунд максимум
    };

    // Инициализация слайдера
    const initializeSlider = () => {
        // Инициализируем слайдер только после загрузки всех изображений

        // Добавляем прямые обработчики на кнопки слайдера для надежности
        const prevBtn = document.querySelector('.hero-slider .prev-btn');
        const nextBtn = document.querySelector('.hero-slider .next-btn');
        const indicators = document.querySelectorAll('.hero-slider .indicator');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                HeroSlider.goToSlide(HeroSlider.currentIndex - 1, 'prev');
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                HeroSlider.goToSlide(HeroSlider.currentIndex + 1, 'next');
            });
        }

        if (indicators && indicators.length > 0) {
            indicators.forEach((indicator, index) => {
                indicator.addEventListener('click', () => {
                    HeroSlider.goToSlide(index);
                });
            });
        }
    };

    // Инициализируем другие компоненты
    CountrySelector.init();
    PhotoSlider.init();
    QuantityControl.init();
    Navigation.init();
    ProductSlider.init();
    TabsComponent.init();
    initializeCart();

    // Инициализация модальных окон
    if (typeof SearchModal !== 'undefined') SearchModal.init();
    if (typeof MobileMenu !== 'undefined') MobileMenu.init();

    // Запускаем предзагрузку изображений слайдера
    preloadSliderImages();
    CheckoutProcess.init();
});