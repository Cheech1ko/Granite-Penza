// ===== MOBILE MENU =====
function toggleMenu() {
    var nav = document.getElementById('mobileNav');
    if (nav) nav.classList.toggle('open');
}

// ===== MODAL (заявка) =====
function openModal() {
    var overlay = document.getElementById('modalOverlay');
    if (overlay) {
        overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
}
function closeModal() {
    var overlay = document.getElementById('modalOverlay');
    if (overlay) {
        overlay.classList.remove('open');
        document.body.style.overflow = '';
    }
}
function closeModalOutside(e) {
    var overlay = document.getElementById('modalOverlay');
    if (e.target === overlay) closeModal();
}
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeModal();
});

// ===== PHONE MODAL (исправлено) =====
function openPhoneModal() {
    var overlay = document.getElementById('phoneModalOverlay');
    if (overlay) {
        overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    } else {
        // Если модалки нет — просто звоним
        window.location.href = 'tel:+78412000000';
    }
}
function closePhoneModal() {
    var overlay = document.getElementById('phoneModalOverlay');
    if (overlay) {
        overlay.classList.remove('open');
        document.body.style.overflow = '';
    }
}
function closePhoneModalOutside(e) {
    var overlay = document.getElementById('phoneModalOverlay');
    if (e.target === overlay) closePhoneModal();
}

// ===== FAQ =====
function toggleFaq(btn) {
    var item = btn.parentElement;
    var isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(function(i) {
        i.classList.remove('open');
    });
    if (!isOpen) item.classList.add('open');
}

// ===== CALCULATOR (исправлен) =====
var BASE_PRICES = {
    granite_v: 18000,
    granite_h: 16000,
    marble_v: 14000,
    double: 36000,
    fence: 12000,
    socle: 22000
};
var MATERIAL_MULT = {
    gabbro: 1.0,
    red: 1.35,
    grey: 1.1,
    marble: 0.95
};

function calculate() {
    var typeEl = document.getElementById('calcType');
    var matEl = document.getElementById('calcMaterial');
    var heightEl = document.getElementById('calcHeight');
    var widthEl = document.getElementById('calcWidth');
    var resProduct = document.getElementById('resProduct');
    var resExtra = document.getElementById('resExtra');
    var resTotal = document.getElementById('resTotal');

    // Если элементов нет — выходим
    if (!typeEl || !matEl || !heightEl || !widthEl || !resProduct || !resExtra || !resTotal) {
        return;
    }

    var type = typeEl.value;
    var mat = matEl.value;
    var h = parseInt(heightEl.value) || 120;
    var w = parseInt(widthEl.value) || 60;

    var baseArea = 120 * 60;
    var userArea = h * w;
    var sizeMult = userArea / baseArea;

    var base = BASE_PRICES[type] || 18000;
    var matMult = MATERIAL_MULT[mat] || 1.0;
    var productPrice = Math.round(base * matMult * sizeMult / 100) * 100;

    var extra = 0;
    var chkPortrait = document.getElementById('chkPortrait');
    var chkText = document.getElementById('chkText');
    var chkInstall = document.getElementById('chkInstall');
    var chkDelivery = document.getElementById('chkDelivery');

    if (chkPortrait && chkPortrait.checked) extra += 3500;
    if (chkText && chkText.checked) extra += 1500;
    if (chkInstall && chkInstall.checked) extra += 5000;
    if (chkDelivery && chkDelivery.checked) extra += 2000;

    var fmt = function(n) {
        return n.toLocaleString('ru-RU') + ' ₽';
    };

    resProduct.textContent = fmt(productPrice);
    resExtra.textContent = extra > 0 ? fmt(extra) : '—';
    resTotal.textContent = fmt(productPrice + extra);
}

// Запускаем калькулятор при загрузке
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', calculate);
} else {
    calculate();
}

// Пересчёт при изменении параметров (onchange уже есть в HTML, но добавим дополнительно)
document.addEventListener('change', function(e) {
    if (e.target.id && ['calcType', 'calcMaterial', 'calcHeight', 'calcWidth', 'chkPortrait', 'chkText', 'chkInstall', 'chkDelivery'].indexOf(e.target.id) !== -1) {
        calculate();
    }
});

// ===== CATALOG FILTER =====
function filterCatalog(cat) {
    var items = document.querySelectorAll('#itemsGrid .item-card');
    var hasVisible = false;
    items.forEach(function(card) {
        if (card.dataset.cat === cat || cat === 'all') {
            card.style.display = 'flex';
            hasVisible = true;
        } else {
            card.style.display = 'none';
        }
    });
    if (!hasVisible) {
        items.forEach(function(c) { c.style.display = 'flex'; });
    }
    var grid = document.getElementById('itemsGrid');
    if (grid) grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ===== FORM SUBMIT С ВАЛИДАЦИЕЙ (исправлен) =====
function submitForm(wrapId, successId) {
    var formWrap = document.getElementById(wrapId);
    if (!formWrap) return;

    var inputs = formWrap.querySelectorAll('input[type="text"], input[type="tel"], input[type="email"], textarea, select');
    var isValid = true;

    // Убираем старые ошибки
    formWrap.querySelectorAll('.error-msg').forEach(function(el) {
        el.remove();
    });
    inputs.forEach(function(inp) {
        inp.classList.remove('error');
        inp.style.borderColor = '';
        inp.style.borderWidth = '';
    });

    // Проверяем каждое поле
    inputs.forEach(function(inp) {
        var val = inp.value ? inp.value.trim() : '';
        var label = inp.closest('.form-group') ? inp.closest('.form-group').querySelector('label') : null;
        var labelText = label ? label.textContent : '';
        var isRequired = labelText.indexOf('*') !== -1 || inp.id === 'fphone' || inp.id === 'mphone';

        // Если поле не обязательное и пустое — пропускаем
        if (!isRequired && val === '') return;

        // Пустое обязательное поле
        if (isRequired && val === '') {
            showError(inp, 'Заполните это поле');
            isValid = false;
            return;
        }

        // Проверка телефона
        if (inp.type === 'tel' && val) {
            var digits = val.replace(/\D/g, '');
            if (digits.length < 10) {
                showError(inp, 'Введите полный номер телефона (10-11 цифр)');
                isValid = false;
                return;
            }
        }

        // Проверка email
        if (inp.type === 'email' && val) {
            var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(val)) {
                showError(inp, 'Введите корректный email');
                isValid = false;
                return;
            }
        }
    });

    // Проверяем checkbox
    var checkboxes = formWrap.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(function(chk) {
        if (!chk.checked && chk.closest('.form-checkbox')) {
            showError(chk, 'Необходимо согласие на обработку данных');
            isValid = false;
        }
    });

    if (!isValid) {
        var firstError = formWrap.querySelector('.error-msg');
        if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
    }

    // Если всё ок — показываем успех
    var success = document.getElementById(successId);
    if (success) {
        success.style.display = 'block';
        // Очищаем поля
        inputs.forEach(function(inp) {
            if (inp.type !== 'select-one' && inp.type !== 'checkbox') {
                inp.value = '';
            }
            if (inp.type === 'checkbox') {
                inp.checked = false;
            }
        });
        // Через 5 секунд скрываем
        setTimeout(function() {
            success.style.display = 'none';
        }, 5000);
    }
}

function showError(input, message) {
    input.classList.add('error');
    input.style.borderColor = '#d32f2f';
    input.style.borderWidth = '2px';

    // Удаляем старую ошибку для этого поля
    var oldError = input.parentNode ? input.parentNode.querySelector('.error-msg') : null;
    if (oldError) oldError.remove();

    var errorDiv = document.createElement('div');
    errorDiv.className = 'error-msg';
    errorDiv.style.cssText = 'color:#d32f2f; font-size:12px; margin-top:4px; font-weight:600;';
    errorDiv.textContent = '⚠ ' + message;

    if (input.parentNode) {
        input.parentNode.appendChild(errorDiv);
    }
}