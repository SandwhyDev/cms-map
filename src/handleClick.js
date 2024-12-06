const canvas = document.getElementById("gCanvas");
const width = document.getElementById("widthCanvas");
const height = document.getElementById("heightCanvas");

const dataTenant = document.getElementById("dataTenant");
const containerEdit = document.getElementById("containerEdit");
const cancelEdit = document.getElementById("cancelEdit");
const submitEdit = document.getElementById("submitEdit");
const submitHapus = document.getElementById("submitHapus");
const namaTenant = document.getElementById("namaTenant");
const codeTenant = document.getElementById("codeTenant");
const form = document.getElementById("form");
const categoriTenant = document.getElementById("categoriTenant");
const typeTenant = document.getElementById("typeTenant");
const groupwidth2Tenant = document.getElementById("groupwidth2Tenant");
const groupheight2Tenant = document.getElementById("groupheight2Tenant");
const groupx2Tenant = document.getElementById("groupx2Tenant");
const groupy2Tenant = document.getElementById("groupy2Tenant");
const x2Tenant = document.getElementById("x2Tenant");
const y2Tenant = document.getElementById("y2Tenant");
const addNewPameran = document.getElementById("addNewPameran");
const selectPameran = document.getElementById("selectPameran");
const pameran = document.getElementById("pameran");
const idPameran = document.getElementById("idPameran");
const idLocation = document.getElementById("idLocation");
const locationPameran = document.getElementById("locationPameran");
const addNewLocation = document.getElementById("addNewLocation");
const selectLocation = document.getElementById("selectLocation");

const width2Tenant = document.getElementById("width2Tenant");
const height2Tenant = document.getElementById("height2Tenant");
const widthTenant = document.getElementById("widthTenant");
const heightTenant = document.getElementById("heightTenant");
const pointX = document.getElementById("pointX");
const pointY = document.getElementById("pointY");
const linkImage = document.getElementById("linkImage");
const previewImage = document.getElementById("previewImage");
const colorTenant = document.getElementById("colorTenant");
const resultColorTenant = document.getElementById("resultColorTenant");
const copyData = document.getElementById("copyData");
const editButton = document.getElementById("editButton");
const resetBtn = document.getElementById("reset");
const search = document.getElementById("search");
const containerHandleData = document.getElementById("containerHandleData");
const batalSearch = document.getElementById("batalSearch");
const modeTenant = document.getElementById("modeTenant");
const modeStreet = document.getElementById("modeStreet");
const startFinding = document.getElementById("startFinding");

// form edit street
const containerStreetEdit = document.getElementById("containerStreetEdit");
const dataStreet = document.getElementById("dataStreet");
const titikAwal = document.getElementById("titikAwal");
const position = document.getElementById("position");
const direction = document.getElementById("direction");
const tambahKotak = document.getElementById("tambahKotak");
const submitEditStreet = document.getElementById("submitEditStreet");
const submitHapusStreet = document.getElementById("submitHapusStreet");
const cancelEditStreet = document.getElementById("cancelEditStreet");

const getWidth = window.localStorage.getItem("width");
const getHeight = window.localStorage.getItem("height");
var localLocation = window.localStorage.getItem("location");
const localPameran = window.localStorage.getItem("pameran");

var flag = true;

canvas.width = getWidth ?? 540;
canvas.height = getHeight ?? 540;

width.value = canvas.width;
height.value = canvas.height;

var scale = 1;
var NODESIZE = 20;
let perkalianNodeY = canvas.height / NODESIZE;

editButton.addEventListener("click", () => {
  const widthInput = width.value;
  const heightInput = height.value;
  const pameranInput = pameran.value;
  const locationInput = locationPameran.value;

  canvas.width = widthInput;
  canvas.height = heightInput;

  CANVAS_WIDTH = widthInput;
  CANVAS_HEIGHT = heightInput;

  const saveWidth = window.localStorage.setItem("width", widthInput);
  const saveHeight = window.localStorage.setItem("height", heightInput);
  const savePameran = window.localStorage.setItem(
    "pameran",
    selectPameran.value
  );
  const saveLocation = window.localStorage.setItem(
    "location",
    selectLocation.value
  );

  const data = {
    id: idLocation.value,
    pameran_id: idPameran.value,
    name: selectLocation.value,
    data_tenant: JSON.parse(dataTenant.value),
    data_street: JSON.parse(dataStreet.value),
    width: parseInt(widthInput),
    height: parseInt(heightInput),
  };

  updateLocation(data, idLocation.value);

  reset();
});

// resetBtn.addEventListener("click", () => {
//   const cek = confirm("Yakin Ingin Reset ?");

//   if (!cek) return;

//   window.localStorage.clear();

//   window.location.reload();
// });

cancelEdit.addEventListener("click", () => {
  containerEdit.classList.add("hidden");
});

cancelEditStreet.addEventListener("click", () => {
  containerStreetEdit.classList.add("hidden");
});

// edit tenant
submitEdit.addEventListener("click", (e) => {
  if (currentRect) {
    handleEditName(currentRect, e);
  }
});

// hapus tenant
submitHapus.addEventListener("click", (e) => {
  if (currentRect) {
    handleHapusTenant(currentRect, e);
  }
});

copyData.addEventListener("click", function () {
  // Get the text from the textarea
  var dataTenantText = document.getElementById("dataTenant").value;

  // Use the Clipboard API to copy the text
  navigator.clipboard
    .writeText(dataTenantText)
    .then(function () {
      // Success feedback
      alert("Data tenant copied to clipboard");
    })
    .catch(function (error) {
      // Error feedback
      console.error("Error copying text: ", error);
    });
});

linkImage.addEventListener("keyup", (e) => {
  const inputValue = e.target.value;

  previewImage.src = inputValue;
});

colorTenant.addEventListener("input", (e) => {
  const inputValue = e.target.value;

  resultColorTenant.value = inputValue;
});

search.addEventListener("click", function () {
  data = JSON.parse(dataTenant.value);

  containerHandleData.classList.remove("hidden");
  batalSearch.classList.remove("hidden");

  displayData(data);
});

search.addEventListener("input", function () {
  const query = search.value.toLowerCase();
  const filteredData = data.filter(
    (item) =>
      item.text.toLowerCase().includes(query) ||
      item.categori.toLowerCase().includes(query)
  );
  displayData(filteredData);
});

batalSearch.addEventListener("click", function () {
  containerHandleData.classList.add("hidden");
  batalSearch.classList.add("hidden");
});

// klik button mode
modeTenant.addEventListener("click", (e) => {
  mode = "tenant";

  changeBackgroundButtton(e, "tenant");
});

modeStreet.addEventListener("click", (e) => {
  mode = "street";

  changeBackgroundButtton(e, "street");
});

startFinding.addEventListener("click", (e) => {
  mode = "startPoint";

  changeBackgroundButtton(e, mode);
});
// klik button mode end

submitEditStreet.addEventListener("click", (e) => {
  if (currentStreet) {
    handleEditStreet(currentStreet, e);
  }
});

submitHapusStreet.addEventListener("click", (e) => {
  if (currentStreet) {
    handleHapusStreet(currentStreet, e);
  }
});

startFinding.addEventListener("click", (e) => {
  reset();
  myPath = new PathFindingAlg(grid, startPoint, endPoint);
  myPath.findPath();
});

typeTenant.addEventListener("change", (e) => {
  ViewFormTypeL(currentRect, true);
});

pameran.addEventListener("input", (e) => {
  if (e.target.value.length > 0) {
    addNewPameran.classList.remove("hidden");
  } else {
    addNewPameran.classList.add("hidden");
  }
});

locationPameran.addEventListener("input", (e) => {
  if (e.target.value.length > 0) {
    addNewLocation.classList.remove("hidden");
  } else {
    addNewLocation.classList.add("hidden");
  }
});

addNewPameran.addEventListener("click", (e) => {
  const data = {
    name: pameran.value,
  };

  createPameran(data);
});

addNewLocation.addEventListener("click", (e) => {
  const data = {
    pameran_id: idPameran.value,
    name: locationPameran.value,
    data_tenant: [],
    data_street: [],
    width: 540,
    height: 540,
  };

  createLocation(data);
});

selectPameran.addEventListener("change", () => {
  console.log(flag);

  if (!flag) {
    let cek = confirm("data belum disave, ingin pindah ?");

    if (!cek) {
      selectPameran.value = localPameran;
      return;
    }
  }

  flag = true;

  window.localStorage.setItem("pameran", selectPameran.value);
  localLocation = "";

  readPameranByName(selectPameran.value);
});

selectLocation.addEventListener("change", () => {
  console.log(flag);
  if (!flag) {
    let cek = confirm("data belum disave, ingin pindah ?");

    if (!cek) {
      selectLocation.value = localLocation;
      return;
    }
  }

  flag = true;

  window.localStorage.setItem("location", selectLocation.value);
  localLocation = selectLocation.value;

  readLocationByName(selectLocation.value, idPameran.value);
});
