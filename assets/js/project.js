// buat variable untuk menampung data 
const data = []

function submitData(event) {
  event.preventDefault();

  let title = document.getElementById("pName").value
  let s_date = document.getElementById("s-date").value
  let e_date = document.getElementById("e-date").value
  let content = document.getElementById("description").value
  let image = document.getElementById("attachFile").files
    // untuk menampung value yang sudah di centang
  let techCheck = document.querySelectorAll(`input[name="tech"]:checked`)
  let tech = Array.from(techCheck).map(checkbox => checkbox.value)

  image = URL.createObjectURL(image[0])

  const obj = {
    image,
    title,
    s_date,
    e_date,
    content,
    tech,
  }

  data.push(obj)
  renderProject()

}

function renderProject() {
  document.getElementById("project-li").innerHTML = ""
  for (let i = 0; i < data.length; i++) {

    // looping icon technologies
    let techImages = ""
    for (let j = 0; j < data[i].tech.length; j++) {
      if (data[i].tech[j] === "nodeJS") {
        techImages += '<li><img src="./assets/images/nodejs.png"></li>'
      } else if (data[i].tech[j] === "reactJS") {
        techImages += '<li><img src="./assets/images/reactjs.png"></li>'
      } else if (data[i].tech[j] === "nextJS") {
        techImages += '<li><img src="./assets/images/nextjs.png"></li>'
      } else if (data[i].tech[j] === "typeScript") {
        techImages += '<li><img src="./assets/images/typescript.png"></li>'
      }
    }

    // post content
    document.getElementById("project-li").innerHTML += `
        <div class="project-container" id="project-item">
                <a href="./project-details.html">
                <div class="project-image">
                    <img src="${data[i].image}">
                </div>
                <p style="font-weight: bold;">${data[i].title}</p>
                <p style="font-size: 15px; color: gray;">Duration : ${data[i].s_date} - ${data[i].e_date}</p>

                <div class="project-content">
                    <p>
                        ${data[i].content}
                    </p>
                </div>

               <div class="project-icon">                                           
                    <ul>
                        ${techImages}
                    </ul>
                </div>
                <div class="project-button">
                    <button class="edit" type="button">Edit</button>
                    <button class="delete" type="button">Delete</button>
                </div>
                </a>
            </div>`
  }
}
