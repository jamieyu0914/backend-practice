const form = document.getElementById("form");
const contents = document.getElementById("contents");
const loading = document.getElementById("loading");

const model = {
  post: function (formdata) {
    (async () => {
      const request = {
        method: "POST",
        body: formdata,
      };
      try {
        const response = await fetch("/upload", request);
        const result = await response.json();
        if (result.ok === true) {
          view.toreload();
        }
      } catch (err) {
        console.log(err);
      }
    })();
  },

  get: function () {
    (async () => {
      const response = await fetch("/upload");
      const result = await response.json();
      view.toshow(result);
    })();
  },
};

const view = {
  tolist: function (data) {
    const contents = document.createElement("div");
    contents.className = "item";

    const contentsimage = document.createElement("img");
    contentsimage.className = "item-image";
    const contentsimageurl =
      "https://dsw5uvnrgz1b3.cloudfront.net/" + data.image;
    contentsimage.setAttribute("src", contentsimageurl);
    contents.append(contentsimage);

    const contentstext = document.createElement("div");
    contentstext.className = "item-text";
    contentstext.textContent = data.content;
    contents.append(contentstext);

    return contents;
  },

  toshow: function (result) {
    const contentsdata = result.data;
    const contentsfragment = document.createDocumentFragment();

    for (let i = 0; i < contentsdata.length; i++) {
      let contents = view.tolist(contentsdata[i]);
      contentsfragment.prepend(contents);
    }
    contents.appendChild(contentsfragment);
    view.toloading(false);
  },

  toloading: function (isLoading) {
    if (isLoading == false) {
      loading.style.cssText = "display:none";
      console.log(isLoading);
    } else {
      loading.style.cssText = "display:block";
      console.log(isLoading);
    }
  },

  toreload: function () {
    window.location.href = "/";
  },
};

const controller = {
  init: function () {
    model.get();
    form.addEventListener("submit", controller.send);
  },

  send: function (e) {
    e.preventDefault();
    let content = document.getElementById("content");
    let image = document.getElementById("image");
    let formdata = new FormData();
    formdata.append("content", content.value);
    formdata.append("image", image.files[0]);
    model.post(formdata);
  },
};

controller.init();
