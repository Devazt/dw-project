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
        <div class="container max-w-sm m-8 p-4 rounded-lg shadow-md shadow-black bg-white">
            <img src=${item.image} class="rounded-lg mx-auto" style="width:100%; height: 200px; object-fit: cover;"/>
            <p class="text-md font-semibold mt-4">"${item.comment}"</p>
            <p class="text-md font-semibold text-right mt-4">- ${item.name}</p>
            <p class="text-md font-semibold flex justify-end mt-4">${item.rating} <img src="/images/star.png" width="25px"></p>
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
        testiForHtml = `<p class="text-xl font-bold mt-20">Data not found!</p>`
    } else {
        dataFilter.forEach(item => {
            testiForHtml += `
            <div class="container max-w-sm m-8 p-4 rounded-lg shadow-md shadow-black bg-white">
            <img src=${item.image} class="rounded-lg mx-auto" style="width:100%; height: 200px; object-fit: cover;"/>
            <p class="text-md font-semibold mt-4">"${item.comment}"</p>
            <p class="text-md font-semibold text-right mt-4">- ${item.name}</p>
            <p class="text-md font-semibold flex justify-end mt-4">${item.rating} <img src="/images/star.png" width="25px"></p>
        </div>`
        })
    }
    document.getElementById("testimonials").innerHTML = testiForHtml
    } catch (error) {
        console.log(error);
    }
}