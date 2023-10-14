const data = [];

function submitData(event) {
  event.preventDefault();

  const title = document.getElementById("pName").value
  const s_date = document.getElementById("s-date").value
  const e_date = document.getElementById("e-date").value
  const content = document.getElementById("description").value
  const isUsingNodeJs = document.getElementById("tech1").checked
  const isUsingReactJs = document.getElementById("tech2").checked
  const isUsingNextJs = document.getElementById("tech3").checked
  const isUsingTypescript = document.getElementById("tech4").checked
  let image = document.getElementById("attachFile").files
  const p_duration = durationInDays(s_date, e_date)

  
  // Validation
  if (title === "") {
    alert("Project name must be filled");
    return;
  }
  if (s_date === "") {
    alert("Start date must be filled");
    return;
  }
  if (e_date === "") {
    alert("End date must be filled");
    return;
  }
  if (content === "") {
    alert("Description must be filled");
    return;
  } 
  if (image.length === 0) {
    alert("Must upload a picture");
    return;
  }
  if (p_duration <= 0) {
    alert("Start date cannot less than end date")
    return;
  }

  
  //display image
  image = URL.createObjectURL(image[0])

  //display duration
  const duration = durationInMonth(p_duration)

  const obj = {
    title,
    s_date,
    e_date,
    duration,
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
                <p style="font-size: 15px; color: gray;">Duration : ${data[i].duration}</p>

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

// add duration in days
function durationInDays(s_date, e_date) {
  // 1000 msec, 60 sec, 60 minutes, 24 hours
  const oneDay = 1000*60*60*24;

  const s_dateMs = new Date(s_date).getTime();
  const e_dateMs = new Date(e_date).getTime();
  const durationMs = e_dateMs - s_dateMs;

  // add 1 day if start & end is same day
  return Math.floor(durationMs/oneDay) +1;
}

// add duration in month
function durationInMonth(days) {
  monthDuration = Math.floor(days/30);
  daysDuration = days%30;

  // if less than a month return to days
  if (monthDuration == 0) {
    return `${daysDuration} Days`;
  }

  if (daysDuration > 20) {
    monthDuration ++;
  }
  else if (daysDuration <= 20 && daysDuration > 10) {
    monthDuration += 0.5;
  }

  return `${monthDuration} Months`
}