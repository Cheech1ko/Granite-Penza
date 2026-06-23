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

// ===== PHONE MODAL =====
function openPhoneModal() {
    var overlay = document.getElementById('phoneModalOverlay');
    if (overlay) {
        overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    } else {
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

// ===== EMAIL MODAL =====
function openEmailModal() {
    var overlay = document.getElementById('emailModalOverlay');
    if (overlay) {
        overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
}
function closeEmailModal() {
    var overlay = document.getElementById('emailModalOverlay');
    if (overlay) {
        overlay.classList.remove('open');
        document.body.style.overflow = '';
    }
}
function closeEmailModalOutside(e) {
    var overlay = document.getElementById('emailModalOverlay');
    if (e.target === overlay) closeEmailModal();
}

function copyEmail() {
    var email = 'info@granitpenza.ru';
    navigator.clipboard.writeText(email).then(function() {
        var msg = document.getElementById('copyMessage');
        if (msg) {
            msg.textContent = '✅ Адрес скопирован!';
            msg.style.color = '#2e7d32';
        }
    }).catch(function() {
        var input = document.createElement('input');
        input.value = email;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
        var msg = document.getElementById('copyMessage');
        if (msg) {
            msg.textContent = '✅ Адрес скопирован!';
            msg.style.color = '#2e7d32';
        }
    });
}

function openGmail() {
    window.open('https://mail.google.com/mail/?view=cm&fs=1&to=info@granitpenza.ru', '_blank');
    closeEmailModal();
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

// ===== CALCULATOR =====
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

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', calculate);
} else {
    calculate();
}

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

// ===== УНИВЕРСАЛЬНАЯ ФОРМА (работает и для основной, и для модалки) =====
function submitForm(wrapId, successId) {
    var formWrap = document.getElementById(wrapId);
    if (!formWrap) {
        console.error('Форма с id "' + wrapId + '" не найдена');
        return;
    }

    // Определяем, модалка это или основная форма
    var isModal = wrapId === 'modalFormWrap';

    // Собираем данные
    var name, phone, interest, comment;

    if (isModal) {
        name = document.getElementById('mname')?.value?.trim() || '';
        phone = document.getElementById('mphone')?.value?.trim() || '';
        interest = document.getElementById('mtype')?.value || 'Не указано';
        comment = 'Заявка из модального окна';
    } else {
        name = document.getElementById('fname')?.value?.trim() || '';
        phone = document.getElementById('fphone')?.value?.trim() || '';
        interest = document.getElementById('ftype')?.value || 'Не указано';
        comment = document.getElementById('fcomment')?.value?.trim() || 'Без комментария';
    }

    // Валидация
    var errors = [];

    if (!name) {
        errors.push('Введите ваше имя');
        var nameField = isModal ? document.getElementById('mname') : document.getElementById('fname');
        if (nameField) showError(nameField, 'Введите ваше имя');
    }

    if (!phone) {
        errors.push('Введите номер телефона');
        var phoneField = isModal ? document.getElementById('mphone') : document.getElementById('fphone');
        if (phoneField) showError(phoneField, 'Введите номер телефона');
    } else {
        var digits = phone.replace(/\D/g, '');
        if (digits.length < 10) {
            errors.push('Введите полный номер телефона');
            var phoneField2 = isModal ? document.getElementById('mphone') : document.getElementById('fphone');
            if (phoneField2) showError(phoneField2, 'Введите полный номер телефона (10-11 цифр)');
        }
    }

    // Проверка чекбокса для основной формы
    if (!isModal) {
        var check = document.getElementById('fcheck');
        if (check && !check.checked) {
            errors.push('Необходимо согласие на обработку данных');
            showError(check, 'Необходимо согласие');
        }
    }

    if (errors.length > 0) {
        var firstError = formWrap.querySelector('.error-msg');
        if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
    }

    // ОТПРАВКА НА FORMSPREE (ID ПОДСТАВЛЕН)
    var formId = 'mwvdpbap';

    fetch('https://formspree.io/f/' + formId, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: name,
            phone: phone,
            interest: interest,
            comment: comment,
            source: isModal ? 'Модальное окно' : 'Основная форма'
        })
    })
    .then(function(response) {
        if (response.ok) {
            var success = document.getElementById(successId);
            if (success) {
                success.style.display = 'block';
                // Очищаем поля
                if (isModal) {
                    document.getElementById('mname').value = '';
                    document.getElementById('mphone').value = '';
                } else {
                    document.getElementById('fname').value = '';
                    document.getElementById('fphone').value = '';
                    document.getElementById('fcomment').value = '';
                    var check2 = document.getElementById('fcheck');
                    if (check2) check2.checked = false;
                }
                setTimeout(function() {
                    success.style.display = 'none';
                    if (isModal) closeModal();
                }, 5000);
            }
        } else {
            alert('Ошибка отправки. Попробуйте позже.');
        }
    })
    .catch(function(error) {
        console.error('Ошибка:', error);
        alert('Ошибка отправки. Проверьте интернет-соединение.');
    });
}
function submitFooterForm() {
    var name = document.getElementById('ffname')?.value?.trim() || '';
    var phone = document.getElementById('ffphone')?.value?.trim() || '';
    var interest = document.getElementById('fftype')?.value || 'Не указано';
    var comment = document.getElementById('ffcomment')?.value?.trim() || 'Без комментария';

    // Валидация
    if (!name) {
        alert('Пожалуйста, введите ваше имя');
        return;
    }
    if (!phone) {
        alert('Пожалуйста, введите номер телефона');
        return;
    }
    var digits = phone.replace(/\D/g, '');
    if (digits.length < 10) {
        alert('Введите полный номер телефона (10-11 цифр)');
        return;
    }

    // Отправка
    fetch('https://formspree.io/f/mwvdpbap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, interest, comment, source: 'Футер' })
    })
    .then(function(response) {
        if (response.ok) {
            document.getElementById('footerSuccess').style.display = 'block';
            document.getElementById('ffname').value = '';
            document.getElementById('ffphone').value = '';
            document.getElementById('ffcomment').value = '';
            setTimeout(function() {
                document.getElementById('footerSuccess').style.display = 'none';
            }, 5000);
        } else {
            alert('Ошибка отправки. Попробуйте позже.');
        }
    })
    .catch(function(error) {
        console.error('Ошибка:', error);
        alert('Ошибка отправки. Проверьте интернет.');
    });
}
function showError(input, message) {
    input.classList.add('error');
    input.style.borderColor = '#d32f2f';
    input.style.borderWidth = '2px';

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