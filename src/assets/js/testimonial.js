const datatesti = [
    {
        name : "Beardy Jack",
        comment : "Mantap pisan jasanya!",
        rating : 5,
        image : "./assets/images/person1.jpg"
    },
    {
        name : "Amir Khan",
        comment : "Pelayanannya ramah!",
        rating : 4,
        image : "./assets/images/person2.jpg"
    },
    {
        name : "Julia",
        comment : "Rekomended banget!",
        rating : 5,
        image : "./assets/images/person3.jpg"
    },
    {
        name : "Earl Johnson",
        comment : "Yah Lumayan",
        rating : 3,
        image : "./assets/images/person4.jpg"
    },
    {
        name : "Jill",
        comment : "Tidak sesuai permintaan",
        rating : 1,
        image : "./assets/images/person5.jpg"
    },
]

function showTestimonial() {
    let testiForHtml = ""

    datatesti.forEach(item => {
        testiForHtml += `
        <div class="testimonial">
            <img src=${item.image} class="profile-testimonial" />
            <p class="quote">"${item.comment}"</p>
            <p class="author">- ${item.name}</p>
            <p class="rating-pt">${item.rating} <img src="./assets/images/star.png" width="15px"></p>
        </div>`
    })

    document.getElementById("testimonials").innerHTML = testiForHtml
}
showTestimonial()


// filtering function
function filterTesti(rating) {
    let testiForHtml = ""

    const dataFilter = datatesti.filter(data => data.rating === rating)

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
}