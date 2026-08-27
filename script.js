// MOBILE MENU

const menuBtn = document.getElementById("menuBtn");

const navLinks = document.getElementById("navLinks");


menuBtn.addEventListener("click", function () {

    navLinks.classList.toggle("active");

});


// CLOSE MENU AFTER CLICKING A LINK

const links = document.querySelectorAll(".nav-links a");

links.forEach(function (link) {

    link.addEventListener("click", function () {

        navLinks.classList.remove("active");

    });

});


// CURRENT YEAR

document.getElementById("year").textContent =
    new Date().getFullYear();


// CONTACT FORM

const contactForm =
    document.getElementById("contactForm");


contactForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const submitButton = contactForm.querySelector("button[type='submit']");
    const formStatus = document.getElementById("formStatus");
    const formData = new FormData(contactForm);
    const formValues = {};

    for (const [fieldName, fieldValue] of formData.entries()) {
        if (Object.prototype.hasOwnProperty.call(formValues, fieldName)) {
            formValues[fieldName] = Array.isArray(formValues[fieldName])
                ? formValues[fieldName].concat(fieldValue)
                : [formValues[fieldName], fieldValue];
        } else {
            formValues[fieldName] = fieldValue;
        }
    }

    const name = String(formValues.name || "").trim();

    submitButton.disabled = true;
    submitButton.textContent = "Sending...";
    formStatus.textContent = "";

    try {
        const response = await fetch("/api/contact", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formValues)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || "Unable to send your message.");
        }

        formStatus.textContent =
            "Thank you, " + name + "! Your message has been sent.";
        contactForm.reset();
    } catch (error) {
        formStatus.textContent =
            error.message || "Something went wrong. Please try again.";
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = "Send Message";
    }

});