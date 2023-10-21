document.getElementById('image').addEventListener('change', function () {
  const preview = document.getElementById('image-preview'); 
  const file = this.files[0];
  if (file.size < 2000000) {
    const reader = new FileReader();
    reader.onload = function (e) {
      preview.src = e.target.result;
    };
    reader.readAsDataURL(file);
  } else {
    alert("Image size more than 2MB")
    preview.src = '';
  }
});