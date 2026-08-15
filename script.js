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


contactForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const name =
        document.getElementById("name").value;

    alert(
        "Thank you, " +
        name +
        "! Your message has been received."
    );

    contactForm.reset();

})