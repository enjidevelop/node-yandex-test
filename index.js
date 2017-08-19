class Forms {
    constructor(form) {
        this.form = form;
    }

    validate() {
        const errorFields = [];
        let isValid = true;
        let {fio, email, phone} = this.getData();

        // fio = fio.split(' ');
        //
        // if (fio.length !== 3) {
        //     isValid = false;
        //     errorFields.push('fio');
        // }

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
        console.log(this.validate());
    }
}

const form = document.getElementById('myForm');
const MyForm = new Forms(form);
const formBtn = form.submitButton;

formBtn.addEventListener('click', (e) => MyForm.submit(e));
