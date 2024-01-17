const $button  = document.querySelector('#sidebar-toggle');
const $wrapper = document.querySelector('#wrapper');

$button.addEventListener('click', (e) => {
  e.preventDefault();
  $wrapper.classList.toggle('toggled');
});


// img drag and drop

document.querySelectorAll(".drop-zone__input").forEach((inputElement) => {
  const dropZoneElement = inputElement.closest(".drop-zone");

  dropZoneElement.addEventListener("click", (e) => {
    inputElement.click();
  });

  inputElement.addEventListener("change", (e) => {
    if (inputElement.files.length) {
      updateThumbnails(dropZoneElement, inputElement.files);
    }
  });

  dropZoneElement.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZoneElement.classList.add("drop-zone--over");
  });

  ["dragleave", "dragend"].forEach((type) => {
    dropZoneElement.addEventListener(type, (e) => {
      dropZoneElement.classList.remove("drop-zone--over");
    });
  });

  dropZoneElement.addEventListener("drop", (e) => {
    e.preventDefault();

    if (e.dataTransfer.files.length) {
      inputElement.files = e.dataTransfer.files;
      updateThumbnails(dropZoneElement, e.dataTransfer.files);
    }

    dropZoneElement.classList.remove("drop-zone--over");
  });
});

/**
 * @param {HTMLElement} dropZoneElement
 * @param {FileList} files
 */
function updateThumbnails(dropZoneElement, files) {
  Array.from(files).forEach((file) => {
    let thumbnailElement = document.createElement("div");
    thumbnailElement.classList.add("drop-zone__thumb");

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      thumbnailElement.style.backgroundImage = `url('${reader.result}')`;
      dropZoneElement.appendChild(thumbnailElement);
    };
  });

  // Remove the prompt if it exists
  if (dropZoneElement.querySelector(".drop-zone__prompt")) {
    dropZoneElement.querySelector(".drop-zone__prompt").remove();
  }
}



// Sub menu script

 var themeCategorySelect = document.getElementById("theme-category");
 var subThemeCategorySelect = document.getElementById("sub-theme-category");

 subThemeCategorySelect.style.display = "none";

 themeCategorySelect.addEventListener("change", function () {
     if (themeCategorySelect.value === "Marriage") {
         subThemeCategorySelect.style.display = "inline-block";
     } else {
         subThemeCategorySelect.style.display = "none";
     }
 });