class Forms {
    constructor(form) {
        this.form = form;
    }

    validate() {
        const errorFields = [];
        let isValid = true;
        let {fio, email, phone} = this.getData();

        // fio
        fio = trimAll(fio).split(' ');

        if (fio.length !== 3) {
            isValid = false;
            errorFields.push('fio');
        }

        // email
        if (!getEmailRegExp().test(email)) {
            isValid = false;
            errorFields.push('email');
        } else {
            let domain = email.split('@')[1];
            let isValidDomain = getValidDomain().some(validDomains => domain === validDomains);

            if (!isValidDomain) {
                isValid = false;
                errorFields.push('email');
            }
        }

        // phone
        if (!getPhoneRegExp().test(phone)) {
            isValid = false;
            errorFields.push('phone');
        } else {
            let sum = phone.replace(/\D+/g,'')
                .split('')
                .reduce((acc, cv) => {
                    return acc + parseInt(cv, 10);
                }, 0);

            if (sum > 30) {
                isValid = false;
                errorFields.push('phone');
            }
        }

        return {isValid, errorFields};
    }

    getData() {
        return {
            fio: this.form.fio.value,
            email: this.form.email.value,
            phone: this.form.phone.value,
        };
    }

    setData(data) {
        if (data.fio) {
            this.form.fio.value = data.fio;
        }

        if (data.email) {
            this.form.email.value = data.email;
        }

        if (data.phone) {
            this.form.phone.value = data.phone;
        }
    }

    submit(event) {
        event.preventDefault();

        let validation = this.validate();

        if (!validation.isValid) {
            validation.errorFields.forEach(i => {
                this.form[i].classList.add('error');
            });
        } else {
            this.form.querySelectorAll('.error').forEach(i => i.classList.remove('error'));

        }
    }
}

const form = document.getElementById('myForm');
const MyForm = new Forms(form);
const formBtn = form.submitButton;

formBtn.addEventListener('click', (e) => MyForm.submit(e));

// utils
function trimAll(s) {
    return s.replace(/\s+$/g, '')
            .replace(/^\s+/g, '')
            .replace(/\s\s+/g, ' ');
}

function getValidDomain() {
    return [
        'ya.ru',
        'yandex.ru',
        'yandex.ua',
        'yandex.by',
        'yandex.kz',
        'yandex.com',
    ];
}

function getEmailRegExp() {
    return /^([\w_\.\-\+])+\@([\w\-]+\.)+([\w]{2,10})+$/;
}

function getPhoneRegExp() {
    return /^(\+7)\(\d{3}\)\d{3}-\d{2}-\d{2}$/;
}
