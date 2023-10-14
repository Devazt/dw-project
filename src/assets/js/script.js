function getData() {
    //data collection
    const name = document.getElementById("name").value
    const email = document.getElementById("email").value
    const phone = document.getElementById("phone").value
    const subject = document.getElementById("subject").value
    const message = document.getElementById("message").value

    //data validation
    if(name == ""){
    return alert("Nama harus diisi")
    } 
    else if(email == ""){
    return alert("Email harus diisi")
    } 
    else if(phone == ""){
        return alert("Nomor telpon harus diisi")
    } 
    else if(subject == ""){
        return alert("Subject harus diisi")
    } 
    else if(message == ""){
        return alert("Message harus diisi")
    } 

    //execute to mail
    const mailtoReceiver = "nandy.septiana@gmail.com"
    let a = document.createElement("a")
    a.href = `mailto:${mailtoReceiver}?subject=${subject}&body= Halo nama saya ${name}, bisakah anda menghubungi saya di ${phone} untuk membahas project ${message}?`
    a.click()

    let data = {
        name,
        email,
        phone,
        subject,
        message
    }

    console.log(data)
}