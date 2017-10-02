let numbers = [];
let message = "";
let url = "";
let invalid = 0;
let count = 0;

window.alertMessage = (id, text) => {
    let p = document.createElement("p");
    p.innerHTML = text;
    document.getElementById(id).hidden = false;
    document.getElementById(id).appendChild(p);
}

window.closeAlert = (divId) => {
    const idButton = 'button-' + divId;
    let div = document.getElementById(divId);

    [...div.childNodes].map(e => {
        if (e.id != idButton) {
            return div.removeChild(e)
        }
    });

    div.hidden = true;
    document.getElementById("input-Message").className = "form-group";
    document.getElementById("input-Number").className = "form-group";
    invalid = 0;
}

const createLiElement = (num) => {
    let li = document.createElement("li");
    li.id = num;
    li.className = "list-group-item";
    li.innerHTML = `${num} <span class="pull-right button-group">
    <button type="button" class="close" aria-label="Close" onclick="deleteNumber(${num})">
    <span aria-hidden="true">&times;</span></button>
    </span>`

    return li;
}

window.deleteNumber = (num) => {
    let formatedNum = "+" + num;

    numbers = numbers.filter(number => {
        if (number != formatedNum) {
            return number;
        }
    });

    let ul = document.getElementById("numbers");
    let li = document.getElementById(newNum);
    ul.removeChild(li);
}

window.addNumber = () => {
    const number = document.getElementById("number").value;
    const patern = new RegExp(/^([0-9])*$/);

    if (patern.test(number) && number.length === 8) {
        const num = "+598" + number;
        numbers.push(num);
        let ul = document.getElementById("numbers");
        let li = createLiElement(num);
        ul.appendChild(li);

        document.getElementById("number").value = "";
    } else {
        document.getElementById("input-Number").className = "form-group has-error";
        alertMessage("alert-danger", "The number not respect the format: 8 numbers");
    }
}

window.postData = (message, url, count, numbers) => fetch("/mms", {
    method: "POST",
    headers: {
        "Accept": "application/json, text/plain, */*",
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        numbers: numbers,
        message: message,
        url: url,
        count: count
    })
}).then(response => {
    if (response.ok) {
        cancelMms();
        alertMessage("alert-success", "The messages sent it successfully.");
    } else {
        throw new Error("Something went wrong please check the numbers.");
    }
}).catch(error => {
    cancelMms();
    alertMessage("alert-danger", error);
});

window.getMediaUrl = () => {
    const radios = document.getElementsByName("image");
    const images = document.getElementsByTagName("img");

    const radioId = [...radios].find(e => e.checked);
    if (radioId) {
        const id = radioId.id;
        return [...images].find(e => e.getAttribute("alt") === id).src;
    } else {
        return "";
    }

}

window.sendMms = () => {
    validateFormMessage();
    validateFormNumbers();
    validateFormUrl();
    count = document.getElementById("messagesAmount").value;

    if (invalid === 0) {
        return postData(message, url, count, numbers);
        invalid = 0;
    }
}

window.cancelMms = () => {
    numbers = [];
    count = 0;
    document.getElementById("number").value = "";
    document.getElementById("message").value = "";

    const ul = document.getElementById("numbers");
    ul.innerHTML = "";

    const radios = document.getElementsByName("image");
    const radioId = [...radios].find(e => e.checked);
    if (radioId) {
        document.getElementById(radioId.id).checked = false;
    }
}

const validateFormMessage = () => {
    message = document.getElementById("message").value;
    const alert = document.getElementById("alert-danger");

    if (message.length > 120 && alert.hidden === true) {
        document.getElementById("input-Message").className = "form-group has-error";
        alertMessage("alert-danger", "The message cannot exceed the 120 characters.");
        invalid++;
    }
}

const validateFormNumbers = () => {
    const alert = document.getElementById("alert-danger");

    if (numbers.length === 0 && alert.hidden === true) {
        document.getElementById("input-Number").className = "form-group has-error";
        alertMessage("alert-danger", "You have to add at least one number.");
        invalid++;
    }
}

const validateFormUrl = () => {
    url = getMediaUrl();
    const alert = document.getElementById("alert-danger");

    if (url === "" && alert.hidden === true) {
        alertMessage("alert-danger", "You have to select a image.");
        invalid++;
    }
}