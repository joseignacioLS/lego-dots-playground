export const loadFile = (inputSelector, callback) => {

  const fileInput = document.querySelector(inputSelector);
  const file = fileInput.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (e) {
    const fileContents = e.target.result;
    try {
      const parsed = JSON.parse(fileContents);
      if (!Array.isArray(parsed)) return [];
      callback(parsed)
    } catch (err) {
      console.log(err);
    }
  };
  reader.readAsText(file);
}

export const saveToFile = (filename, content) => {

  const data = JSON.stringify(content);
  let element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(data)
  );
  element.setAttribute("download", filename);
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}