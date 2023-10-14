let isOpen = false

function openBurger() {
    let burgerNav = document.getElementById("mobile-menu")
    if(!isOpen) {
        burgerNav.style.display= "block";
    isOpen = true
    } 
    else {
        burgerNav.style.display= "none";
    isOpen = false
    }
}