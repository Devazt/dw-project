const emailLink = document.getElementById('emailLink');
emailLink.addEventListener('click', function(event) {
    event.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").Value;
    const phone = document.getElementById("phone").Value;
    const subject = document.getElementById("subject").Value;
    const message = document.getElementById("message").Value;
    const mailto = "nandy.septiana@gmail.com"

    const emailUrl = `mailto:${mailto}?subject=${subject}&body=Halo nama saya ${name}, bisakah anda menghubungi saya di ${phone} atau di ${email} untuk membahas project ${message}?`

    window.location.href = emailUrl;

})

console.log(emailUrl);