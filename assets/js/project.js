const data = [];

function submitData(event) {
  event.preventDefault();

  let title = document.getElementById("pName").value
  let s_date = document.getElementById("s-date").value
  let e_date = document.getElementById("e-date").value
  let content = document.getElementById("description").value
  let isUsingNodeJs = document.getElementById("tech1").checked
  let isUsingReactJs = document.getElementById("tech2").checked
  let isUsingNextJs = document.getElementById("tech3").checked
  let isUsingTypescript = document.getElementById("tech4").checked
  let image = document.getElementById("attachFile").files

  
  // Validation
  if (title === "") {
    alert("Project name must be filled");
    return;
  }
  else if (s_date === "") {
    alert("Start date must be filled");
    return;
  }
  else if (e_date === "") {
    alert("End date must be filled");
    return;
  }
  else if (content === "") {
    alert("Description must be filled");
    return;
  } 
  else if (image.length === 0) {
    alert("Must upload a picture");
    return;
  }
  
  //display image
  image = URL.createObjectURL(image[0])

  const obj = {
    title,
    s_date,
    e_date,
    image,
    content,
    isUsingNodeJs,
    isUsingReactJs,
    isUsingNextJs,
    isUsingTypescript,
  }

  data.push(obj)
  renderProject()

}

function renderProject() {
  document.getElementById("project-li").innerHTML = ""
  for (let i = 0; i < data.length; i++) {

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
                        ${renderTechImages(data[i])}
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

//render tech images
function renderTechImages(Object) {
  let renderImages = "";

  if (Object.isUsingNodeJs) {
      renderImages += `<li><img src="./assets/images/nodejs.png" alt="node-js"></li>`;
  }
  if (Object.isUsingReactJs) {
      renderImages += `<li><img src="./assets/images/reactjs.png" alt="node-js"></li>`;
  }
  if (Object.isUsingNextJs) {
      renderImages += `<li><img src="./assets/images/nextjs.png" alt="next-js"></li>`;
  }
  if (Object.isUsingTypescript) {
      renderImages += `<li><img src="./assets/images/typescript.png" alt="typescript"></li>`;
  }

  return renderImages;
}