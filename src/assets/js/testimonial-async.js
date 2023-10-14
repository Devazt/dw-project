// buat promise untuk pengambilan data dari xhr
const datatesti = new Promise((resolve, reject) => {
    // buat request xhr
    const xhr = new XMLHttpRequest()

    // buka api external
    xhr.open("GET", "https://api.npoint.io/d9394854f516f8c83369", true) // http method, source from url or db, status async

    // load api dan parse
    xhr.onload = function () {
        if(xhr.status == 200) {
            resolve (JSON.parse(xhr.response))
        } else {
            reject ("Error Loading Data")
        }
    }
    // jika xhr error
    xhr.onerror = function () {
        reject ("Network Error")
    }
    // kirimkan setelah selesai load
    xhr.send()
})

// tambahkan fungsi async untuk eksekusi
async function showTestimonial() {
    // tambahkan method try
    try {
        const response = await datatesti        
        let testiForHtml = ""

    response.forEach(item => {
        testiForHtml += `
        <div class="testimonial">
            <img src=${item.image} class="profile-testimonial" />
            <p class="quote">"${item.comment}"</p>
            <p class="author">- ${item.name}</p>
            <p class="rating-pt">${item.rating} <img src="./assets/images/star.png" width="15px"></p>
        </div>`
    })

    document.getElementById("testimonials").innerHTML = testiForHtml
    // tambahkan method catch untuk menampung error
    } catch (error) {
        console.log(error);
    }
}
showTestimonial()


// filtering function
// lakukan hal yang sama dengan diatas
async function filterTesti(rating) {
    try {
        const response = await datatesti
        let testiForHtml = ""

        const dataFilter = response.filter(data => data.rating === rating)

    if(dataFilter.length === 0) {
        testiForHtml = `<h3>Data not found!</h3>`
    } else {
        dataFilter.forEach(item => {
            testiForHtml += `
            <div class="testimonial">
                <img src=${item.image} class="profile-testimonial" />
                <p class="quote">"${item.comment}"</p>
                <p class="author">- ${item.name}</p>
                <p class="rating-pt">${item.rating} <img src="./assets/images/star.png" width="15px"></p>
            </div>`
        })
    }
    document.getElementById("testimonials").innerHTML = testiForHtml
    } catch (error) {
        console.log(error);
    }
}