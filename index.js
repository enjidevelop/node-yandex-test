(() => {
    class Forms {
        /**
         * Create a object with methods for working with a form
         * @param  {Object} form - DOM element form
         */
        constructor(form) {
            this.form = form;
        }

        /**
         * Validate forms fields
         * @return {Object} - with isValid - state of validation and array with error fields
         */
        validate() {
            const errorFields = [];
            let isValid = true;
            let {fio, email, phone} = this.getData();

            function setInvalid(input) {
                isValid = false;
                errorFields.push(input);
            }

            // fio
            fio = trimAll(fio).split(' ');

            if (fio.length !== 3) {
                setInvalid('fio');
            }

            // email
            if (!getEmailRegExp().test(email)) {
                setInvalid('email');
            } else {
                let domain = email.split('@')[1];
                let isValidDomain = getValidDomain().some(validDomains => domain === validDomains);

                if (!isValidDomain) {
                    setInvalid('email');
                }
            }

            // phone
            if (!getPhoneRegExp().test(phone)) {
                setInvalid('phone');
            } else {
                let sum = phone.replace(/\D+/g,'')
                .split('')
                .reduce((acc, cv) => {
                    return acc + parseInt(cv, 10);
                }, 0);

                if (sum > 30) {
                    setInvalid('phone');
                }
            }

            return {isValid, errorFields};
        }

        /**
         * Return object with form fields values
         * @return {Object}
         */
        getData() {
            return {
                fio: this.form.fio.value,
                email: this.form.email.value,
                phone: this.form.phone.value,
            };
        }

        /**
         * set values to form fields
         * @param {Object} data
         */
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

        /**
         * form submit
         * @param  {Object} event - object of event
         */
        submit(event) {
            event.preventDefault();

            let validation = this.validate();
            let url = this.form.action;

            for(let i = 0; i < this.form.length; i++) {
                if (validation.errorFields.indexOf(this.form[i].name) !== -1) {
                    this.form[i].classList.add('error');
                } else {
                    this.form[i].classList.remove('error');
                }
            }

            if (validation.isValid) {
                this.form.querySelectorAll('.error').forEach(i => i.classList.remove('error'));
                formBtn.setAttribute('disabled', 'disabled');

                let formData = this.getData();

                (function fetchData() {
                    fetch(url, {
                        method: 'POST',
                        body: JSON.stringify(formData),
                    }).then(res => {
                        if (res.status !== 200) {
                            formBtn.removeAttribute('disabled');
                            result.textContent = 'Упс, кажется что-то пошло не так. Попробуйте повторить позже.';
                            return;
                        }

                        res.json().then(data => {
                            switch(data.status) {
                                case 'success':
                                    result.classList.add(data.status);
                                    result.textContent = 'Success';
                                    break;
                                case 'error':
                                    result.classList.add(data.status);
                                    result.textContent = data.reason;
                                    break;
                                case 'progress':
                                    result.classList.add(data.status);
                                    setTimeout(fetchData, data.timeout);
                                    break;
                                default:
                                    return data;
                            }
                        });
                    }).catch(err => console.err(err));
                })()
            }
        }
    }

    const form = document.getElementById('myForm');
    const formBtn = form.submitButton;
    const result = document.getElementById('resultContainer');
    window.MyForm = new Forms(form);

    form.addEventListener('submit', (e) => MyForm.submit(e));

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
})();
