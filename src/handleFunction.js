var scrollCanvas;
var data;
var tambahan_Y;
var url = window.location.href;
var hall = url.split("/")[3];
var cekHall = hall.split("_")[0].toUpperCase();

readPameran();
setTimeout(() => {
  document.getElementById("loading").classList.add("hidden");
  readPameranByName(selectPameran.value);
}, 1000);

switch (cekHall) {
  case "B1":
    // data = dataTenant_b1_c2;
    tambahan_Y = 320 + 40;
    break;
  case "B3":
    // data = dataTenant_b3_c3;
    tambahan_Y = 320 + 60;

    break;

  default:
    // data = dataTenant;
    tambahan_Y = 320;
    break;
}

containerCanvas.addEventListener("scroll", () => {
  scrollCanvas = containerCanvas.scrollLeft;
});

var userAgent = navigator.userAgent;

function zoomIn() {
  // console.log(scale);

  if (scale <= 0.9) {
    scale += 0.1;
    gCanvas.style.transform = "scale(" + scale + ")";
  }
  containerCanvas.scrollLeft = scrollCanvas;

  reset();

  myPath = new PathFindingAlg(grid, startPoint, endPoint);
  myPath.findPath();
}

function zoomOut() {
  if (scale > 0.4) {
    scale -= 0.1;
    // console.log(scale);

    gCanvas.style.transform = "scale(" + scale + ")";
    containerCanvas.scrollLeft = scrollCanvas - 300;

    reset();

    myPath = new PathFindingAlg(grid, startPoint, endPoint);
    myPath.findPath();
  }
}

// FOR MAP
function iconUser(context, target, rotateDegrees = 0, scaleFactor = 1.6) {
  // var img = new Image();
  const img = document.getElementById("icon-user");
  // gctx.drawImage(img, 10, 10);
  var scaledSize = target?.size * scaleFactor;

  // gctx.clearRect(target.posx - 15, target.posy - 15, 60, 60);

  // img.onload = function () {
  gctx.save(); // Simpan status konteks gambar
  gctx.translate(
    target?.posx + target?.size / 2,
    target?.posy + target?.size / 2
  );

  // gctx.rotate((rotateDegrees * Math.PI) / 180);
  gctx.rotate(((-dir + 85) * Math.PI) / 180);

  //   // Mengubah ukuran gambar sesuai faktor perbesaran
  gctx.drawImage(img, -scaledSize / 2, -scaledSize / 2, scaledSize, scaledSize);

  // Pusat rotasi
  gctx.restore(); // Pulihkan status konteks gambar
  gctx.closePath(); // Menutup jalur gambar
  // };

  // img.src = "./images/arrow.png";
}

function nodeDrawer(context, target, lineW, strokeS, fillS) {
  context.beginPath();
  context.lineWidth = lineW;
  context.strokeStyle = strokeS;
  context.fillStyle = fillS;

  context.fillRect(target.posx, target.posy, target.size, target.size);
  context.rect(target.posx, target.posy, target.size, target.size);
  context.closePath();
  context.stroke();
}

function iconEndNode(context, target, lineW, strokeS, fillS) {
  context.beginPath();
  context.lineWidth = lineW;
  context.strokeStyle = strokeS;
  context.fillStyle = fillS;

  // Menggunakan arc() untuk menggambar lingkaran
  context.arc(
    target.posx + target.size / 2,
    target.posy + target.size / 2,
    lineW,
    0,
    Math.PI * 2
  );
  context.closePath();
  context.fill(); // Mengisi lingkaran dengan warna fillS
  context.stroke(); // Menggambar lingkaran dengan warna strokeS
}

function drawerPath(context, target, lineW, strokeS) {
  context.beginPath();
  context.lineWidth = lineW;
  context.strokeStyle = strokeS;

  context.moveTo(target.posx + 10, target.posy + 10);
  context.lineTo(target.parent.posx + 10, target.parent.posy + 10);

  context.stroke();
}

//clears the path WITHOUT clearing the walls
function reset() {
  gridPoints = []; // resets the gridPoints so that it clears the walls etc. on reset.
  gridPointsByPos = [];
  openSet.clear();
  closedSet.clear();
  gctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  grid.createGrid();
}

//resets everything INCLUDING walls
function resetWalls() {
  wallSet.clear();
  reset();
}

function HandleSearch(point) {
  var cekSearch = document.getElementById("dataSearch");

  if (cekSearch) {
    cekSearch.remove();
  }

  const filter =
    point === "start"
      ? inputStart.value.replace(/\s+/g, " ").toUpperCase()
      : inputEnd.value.replace(/\s+/g, " ").toUpperCase();
  const trimmedFilter = filter.trim();

  const search = document.createElement("div");
  search.id = "dataSearch";

  const ul = document.createElement("ul");

  search.className = `w-screen h-screen fixed top-0 left-0 bg-white  pt-32 pb-10`;

  ul.className = "px-5 py-2 space-y-2  overflow-scroll h-full";

  for (let i = 0; i < data.length; i++) {
    const info = data[i];

    if (
      info.text.replace(/\s+/g, " ").toUpperCase().indexOf(trimmedFilter) >
        -1 ||
      info.code.toUpperCase().indexOf(trimmedFilter) > -1
    ) {
      const li = document.createElement("li");
      li.textContent =
        info.text.toUpperCase() == info.code.toUpperCase()
          ? `${info.text.toUpperCase()} `
          : `${info.text.toUpperCase()} | ${info.code} `;

      li.classList.add(
        "px-4",
        "py-2",
        "bg-white",
        "border",
        "border-gray-300",
        "rounded-md",
        "cursor-pointer"
      );

      if (info.text.length > 0) {
        ul.appendChild(li);
      }

      li.addEventListener("click", (event) => {
        var name = info.text.replace(/\s+/g, " ");
        if (point === "start") {
          inputStart.value =
            name.toUpperCase() == info.code.toUpperCase()
              ? `${name.toUpperCase()} `
              : `${name.toUpperCase()} | ${info.code} `;
          removeStartPoint.classList.remove("hidden");
          startPoint = "";
          startPoint = new Vec2(info.pointx, info.pointy);
        } else {
          inputEnd.value =
            name.toUpperCase() == info.code.toUpperCase()
              ? `${name.toUpperCase()} `
              : `${name.toUpperCase()} | ${info.code} `;
          removeEndPoint.classList.remove("hidden");

          endPoint = "";
          endPoint = new Vec2(info.pointx, info.pointy);

          const push = PushDatabase(info.code, "visit");
        }

        scale = 0.6;
        gCanvas.style.transform = "scale(" + scale + ")";

        point === "start"
          ? updatePoint("start", info.pointx, info.pointy)
          : updatePoint("end", info.pointx, info.pointy);

        search.remove();
        ul.remove();

        // showModal(info);

        changeColorOnClick(info);
      });
    }
  }

  const cancel = document.createElement("div");
  cancel.id = "cancelSearch";
  cancel.className = `w-screen  fixed bottom-0 left-0   bg-red-500 text-3xl text-center p-15 cursor-pointer`;
  cancel.innerHTML = "<i class='fa fa-times'></i>";

  cancel.addEventListener("click", () => {
    search.remove();
    ul.remove();
  });

  search.appendChild(cancel);
  search.appendChild(ul);

  document.body.appendChild(search);
}

// jarak dari satu node ke node lainnya
function getDistance(nodeA, nodeB) {
  var distX = Math.abs(nodeA.posx - nodeB.posx);
  var distY = Math.abs(nodeA.posy - nodeB.posy);

  if (distX > distY) {
    return 24 * distY + 10 * (distX - distY);
  }

  return 24 * distX + 10 * (distY - distX);
}

// BUAT JALUR ARAH (DIRECTION)
function retracePath(startNode, endNode) {
  path = new Set();
  var currentNode = endNode;
  var reverseArray;
  while (currentNode != startNode) {
    path.add(currentNode);
    currentNode = currentNode.parent;
    currentNode.inPath = true;

    if (currentNode != startNode) currentNode.drawPath();
  }

  reverseArray = Array.from(path);

  reverseArray.reverse();
  path = new Set(reverseArray);
}

//daftar tetangga
function getNeighbors(node) {
  var checkX;
  var checkY;
  var neighborList = [];
  var tempList = [];
  for (var x = -NODESIZE; x <= NODESIZE; x += NODESIZE) {
    for (var y = -NODESIZE; y <= NODESIZE; y += NODESIZE) {
      if (x == 0 && y == 0) {
        continue;
      }
      checkX = node.posx + x;
      checkY = node.posy + y;

      if (
        checkX >= 0 &&
        checkX <= CANVAS_WIDTH - NODESIZE &&
        checkY >= 0 &&
        checkY <= CANVAS_HEIGHT - NODESIZE
      ) {
        if (checkX === node.posx || checkY === node.posy) {
          // untuk satu arah y
          if (
            (checkY >= node.posy && node.direction == "down") ||
            node.direction === "all"
          ) {
            tempList.push(gridPointsByPos[checkX][checkY]);
          } else if (
            (checkY <= node.posy && node.direction == "up") ||
            node.direction === "all"
          ) {
            tempList.push(gridPointsByPos[checkX][checkY]);
          }
          // untuk satu arah x
          else if (
            (checkX >= node.posx && node.direction == "right") ||
            node.direction === "all"
          ) {
            tempList.push(gridPointsByPos[checkX][checkY]);
          } else if (
            (checkX <= node.posx && node.direction == "left") ||
            node.direction === "all"
          ) {
            tempList.push(gridPointsByPos[checkX][checkY]);
          } else if (node.direction === "all") {
            tempList.push(gridPointsByPos[checkX][checkY]);
          }
        }
      }
    }
  }
  neighborList = tempList;

  return neighborList;
}

// update titik
function updatePoint(point, x, y, move = true) {
  clickTenant = false;

  if (point === "start") {
    startPoint = "";
    startPoint = new Vec2(x, y);
  } else {
    endPoint = "";
    endPoint = new Vec2(x, y);
  }

  if (move) {
    containerCanvas.scrollLeft = (x - 400) * scale;
    window.scroll(0, (y - 400) * scale);
  }

  reset();

  myPath = new PathFindingAlg(grid, startPoint, endPoint);
  myPath.findPath();
}

function canvasClickHandler(event) {
  var x = event.pageX - $(gCanvas).position().left;
  var y = event.pageY - $(gCanvas).position().top;

  var clickedElement = gridPoints.find(function (element) {
    return (
      y > element.posy * scale &&
      y < (element.posy + element.size) * scale &&
      x > element.posx * scale &&
      x < (element.posx + element.size) * scale
    );
  });

  if (clickedElement) {
    var posx = clickedElement.posx;
    var posy = clickedElement.posy;

    if (clickedElement.walkable === true) {
      // updatePoint("start", posx, posy, false);
    } else {
      var tenant = DeclareTenant.find(function (element) {
        return (
          y > (element.y + tambahan_Y) * scale &&
          y < (element.y + element.height + tambahan_Y) * scale &&
          x > element.x * scale &&
          x < (element.x + element.width) * scale
        );
      });

      if (tenant?.text.length > 0) {
        tenantWidth.innerText = tenant.width;
        tenantHeight.innerText = tenant.height;
        clickTenant = true;
      }
    }
  }
}

function drawPolygon(
  context,
  text = "",
  type,
  y2,
  height2,
  change = false,
  points = []
) {
  context.fillStyle = change ? "#7CFC00" : "#ff9"; // Set fill color to yellow
  context.strokeStyle = "black"; // Set stroke color to black

  context.beginPath();
  context.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    context.lineTo(points[i].x, points[i].y);
  }
  context.closePath();
  context.fill();
  context.stroke();

  if (text) {
    context.fillStyle = "black"; // Set text color
    context.font = "20px Arial"; // Set font size and family

    // Determine text position based on textPosition parameter
    let minX = points[0].x;
    let maxY = type === "l_down" ? y2 + height2 : points[0].y;
    var handlex = points[0].x;
    var handley = type === "l_down" ? points[0].y2 : points[0].y;

    // for (let i = 1; i < points.length; i++) {
    //   if (points[i].x < minX) minX = points[i].x;
    //   if (points[i].y > maxY) maxY = points[i].y;
    // }

    const textWidth = context.measureText(text).width;
    const textHeight = 0; // approximate text height

    let textX, textY;

    if (type === "l_down") {
      const padding = 25; // padding around the text

      textX = minX + textWidth / 2 + padding;
      textY = maxY - textHeight - padding; // add padding below the top edge
    } else if (type === "l_up") {
      const padding = 25; // padding around the text

      textX = minX + textWidth / 2 + padding;
      textY = points[0].y + textHeight + padding; // add padding below the top edge
    }

    context.textAlign = "center";
    context.fillText(text, textX, textY);
  }
}

const HandleTenant = (
  context,
  color,
  type,
  x,
  y,
  x2,
  y2,
  width,
  height,
  width2,
  height2,
  text,
  border,
  fontSize,
  image,
  code,
  scale
) => {
  if (type === "kotak") {
    context.beginPath();

    var tenantName = text.replace(/\s+/g, " ").toUpperCase().split(" ");
    var codeTenant = code.replace(/\s+/g, " ").toUpperCase().split(" ");

    context.fillStyle = color;

    context.strokeStyle = border ? "black" : color;
    context.font = fontSize ? `bold 22px Arial` : "bold 12px Arial"; // Font dan ukuran teks awal
    context.fillRect(x, y, width, height);
    context.strokeRect(x, y, width, height);
    context.lineWidth = 1;

    const maxWidth = width - 10; // Lebar maksimum teks
    const lineHeight = 12; // Tinggi baris teks

    let words = codeTenant;
    if (scale > 0.6) {
      words = tenantName;
      context.font = fontSize ? `bold 22px Arial` : "bold 10px Arial"; // Font dan ukuran teks awal
    }
    let line = "";
    let lines = [];

    // Membagi teks menjadi beberapa baris
    for (let i = 0; i < words.length; i++) {
      let testLine = line + words[i] + " ";
      let testWidth = context.measureText(testLine).width;
      if (testWidth > maxWidth) {
        lines.push(line);
        line = words[i] + " ";
      } else {
        line = testLine;
      }
    }
    lines.push(line);

    // Mengatur posisi teks
    let textX = x + width / 2; // Koordinat X untuk teks
    let textY = y + height / 2 - (lines.length / 2) * lineHeight;

    // Menambahkan teks ke canvas
    context.fillStyle = "black"; // Warna teks
    context.textAlign = "center"; // Posisi teks
    context.textBaseline = "middle"; // Posisi teks
    for (let i = 0; i < lines.length; i++) {
      context.fillText(lines[i], textX, textY);
      textY += lineHeight;
    }
  } else if (type === "l_up" || type === "l_down") {
    drawPolygon(context, text, type, y2, height2, false, [
      { x: x, y: y },
      { x: x + width, y: y },
      { x: x2, y: y2 },
      { x: x2 + width2, y: y2 },
      { x: x2 + width2, y: y2 + height2 },
      { x: x2, y: y2 + height2 },
      { x: x + width, y: y + height },
      { x: x, y: y + height },
    ]);
  }
};

function changeColorOnClick(data) {
  Tenant(gctx);

  console.log(data);

  if (data.text.split(" ")[0] === "HALL") {
    return false;
  }

  gctx.fillStyle = "#7CFC00";
  gctx.fillRect(data.x, data.y, data.width, data.height);
  gctx.strokeRect(data.x, data.y, data.width, data.height);
  gctx.lineWidth = 1;

  const maxWidth = data.width - 10; // Lebar maksimum teks
  const lineHeight = 12; // Tinggi baris teks

  let words = data.text.replace(/\s+/g, " ").toUpperCase().split(" ");
  let line = "";
  let lines = [];

  // Membagi teks menjadi beberapa baris
  for (let i = 0; i < words.length; i++) {
    let testLine = line + words[i] + " ";
    let testWidth = gctx.measureText(testLine).width;
    if (testWidth > maxWidth) {
      lines.push(line);
      line = words[i] + " ";
    } else {
      line = testLine;
    }
  }
  lines.push(line);

  // Mengatur posisi teks
  let textX = data.x + data.width / 2; // Koordinat X untuk teks
  let textY = data.y + data.height / 2 - (lines.length / 2) * lineHeight;

  // Menambahkan teks ke canvas
  gctx.fillStyle = "black"; // Warna teks
  gctx.textAlign = "center"; // Posisi teks
  gctx.textBaseline = "middle"; // Posisi teks
  for (let i = 0; i < lines.length; i++) {
    gctx.fillText(lines[i], textX, textY);
    textY += lineHeight;
  }

  if (data.type === "l_down" || data.type === "l_up") {
    drawPolygon(gctx, data.text, data.type, data.y2, data.height2, true, [
      { x: data.x, y: data.y },
      { x: data.x + data.width, y: data.y },
      { x: data.x2, y: data.y2 },
      { x: data.x2 + data.width2, y: data.y2 },
      { x: data.x2 + data.width2, y: data.y2 + data.height2 },
      { x: data.x2, y: data.y2 + data.height2 },
      { x: data.x + data.width, y: data.y + data.height },
      { x: data.x, y: data.y + data.height },
    ]);
  }
}

// UNTUK LIST SEARCH
function displayData(data) {
  const dataContent = data
    .map(
      (item, index) =>
        `<li class="p-2 cursor-pointer border border-black w-96 rounded uppercase  flex justify-between" data-index="${index}">${item.text} </li>`
    )
    .join("");

  containerHandleData.innerHTML = `<ul class='space-y-2 py-2 px-5'>${dataContent}</ul>`;

  containerHandleData.querySelectorAll("li").forEach((item) => {
    item.addEventListener("click", function () {
      const itemIndex = this.getAttribute("data-index");

      console.log(itemIndex);
      const cek = data[itemIndex];

      console.log(cek);

      containerCanvas.scrollTo(cek.x - 400, cek.y);
      changeColorOnClick(cek);

      containerHandleData.classList.add("hidden");
      batalSearch.classList.add("hidden");
    });
  });
}

function changeBackgroundButtton(event, cek) {
  console.log(mode, cek);

  // Remove green background from all buttons
  document.querySelectorAll("button").forEach((button) => {
    button.style.backgroundColor = "";
    button.style.color = "";
  });

  // Add green background to the clicked button
  event.target.style.backgroundColor = "green";
  event.target.style.color = "white";
}

// FOR MAP END

function pushData(data) {
  var localData = window.localStorage.setItem("data", data);
  dataTenant.value = data;
}

function drawRectangle(x, y, width, height, color = "#ff9") {
  gctx.fillStyle = color; // Fill color
  gctx.fillRect(x, y, width, height);

  gctx.strokeStyle = "#000"; // Border color
  gctx.lineWidth = 2; // Border width
  gctx.strokeRect(x, y, width, height);
}

function compareArrays(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false;
  }

  for (let i = 0; i < arr1.length; i++) {
    const obj1 = arr1[i];
    const obj2 = arr2[i];

    if (JSON.stringify(obj1) !== JSON.stringify(obj2)) {
      return false;
    }
  }

  return true;
}

// handle view type l
function ViewFormTypeL(data, onchange = false) {
  var cek = onchange ? typeTenant.value : data.type;
  if (cek === "l_down" || cek === "l_up") {
    groupwidth2Tenant.classList.remove("hidden");
    groupheight2Tenant.classList.remove("hidden");
    groupx2Tenant.classList.remove("hidden");
    groupy2Tenant.classList.remove("hidden");
    width2Tenant.value = data.width2;
    height2Tenant.value = data.height2;
    x2Tenant.value = data.x2;
    y2Tenant.value = data.y2;
  } else {
    groupwidth2Tenant.classList.add("hidden");
    groupheight2Tenant.classList.add("hidden");
    groupx2Tenant.classList.add("hidden");
    groupy2Tenant.classList.add("hidden");
  }
}

function handleViewForm(dataTenant) {
  namaTenant.value = dataTenant.text;
  codeTenant.value = dataTenant.code;
  categoriTenant.value = dataTenant.categori;
  colorTenant.value = dataTenant.color;
  typeTenant.value = dataTenant.type;
  resultColorTenant.value = dataTenant.color;
  widthTenant.value = dataTenant.width;
  heightTenant.value = dataTenant.height;
  pointX.value = dataTenant.pointx;
  pointY.value = dataTenant.pointy;
  linkImage.value = dataTenant.image;

  ViewFormTypeL(dataTenant);

  if (dataTenant.image.length > 0) {
    previewImage.src = dataTenant.image;
  } else {
    previewImage.src =
      "https://static.vecteezy.com/system/resources/previews/005/337/799/original/icon-image-not-found-free-vector.jpg";
  }
}

function handleViewFormStreet(data) {
  containerStreetEdit.classList.remove("hidden");

  titikAwal.value = data.titikAwal;
  position.value = data.position;
  tambahKotak.value = data.tambahKotak;
}

function handleHapusTenant(rect, e) {
  e.preventDefault();

  let cek = confirm(`Yakin hapus tenant ? ${JSON.stringify(rect.text)}`);

  if (cek) {
    const index = DeclareTenant.indexOf(rect);
    if (index > -1) {
      DeclareTenant.splice(index, 1);
      pushData(JSON.stringify(DeclareTenant));

      reset();
    }

    containerEdit.classList.add("hidden");
  }
}

// edit tenant
function handleEditName(rect, e) {
  e.preventDefault();

  const newName = namaTenant.value.trim();
  var y = rect.y;
  var newHeight = parseInt(heightTenant.value);
  var newHeight2 = parseInt(height2Tenant.value);
  var y2 = rect.y;
  var x2 = rect.x + parseInt(widthTenant.value);

  if (typeTenant.value === "l_down") {
    var yh = newHeight;
    var yh2 = newHeight2;

    if (yh > yh2) {
      sl = newHeight - newHeight2;
      y2 = rect.y + sl;
    } else {
      sl = newHeight2 - newHeight;
      y = y2 + sl;
    }
  }

  rect.text = newName;
  rect.code = codeTenant.value;
  rect.categori = categoriTenant.value;
  rect.color = resultColorTenant.value;
  rect.type = typeTenant.value;
  rect.width = parseInt(widthTenant.value);
  rect.height = parseInt(heightTenant.value);
  rect.width2 = parseInt(width2Tenant.value);
  rect.height2 = parseInt(height2Tenant.value);
  rect.y = y;
  rect.x2 = parseInt(x2);
  rect.y2 = parseInt(y2);
  rect.pointx = parseInt(pointX.value);
  rect.pointy = parseInt(pointY.value);
  rect.image = linkImage.value;

  pushData(JSON.stringify(DeclareTenant));
  reset();

  containerEdit.classList.add("hidden");
}

function handleEditStreet(data, e) {
  e.preventDefault();
  localStreet = JSON.parse(dataStreet.value);
  data.titikAwal = parseInt(titikAwal.value);
  data.position = position.value;
  data.direction = direction.value;
  data.tambahKotak = parseInt(tambahKotak.value);
  var member = [];

  switch (data.position) {
    case "x":
      for (let index = 0; index < data.tambahKotak; index++) {
        var hasil = data.titikAwal + (index + 1) * perkalianNodeY;
        member.push(hasil);
      }

      data.member = member;

      break;
    case "y":
      for (let index = 0; index < data.tambahKotak; index++) {
        var hasil = data.titikAwal + (index + 1) * 1;
        member.push(hasil);
      }

      data.member = member;
      break;
    default:
      break;
  }

  localStreet[data.id] = data;

  dataStreet.value = JSON.stringify(localStreet);

  window.localStorage.setItem("street", JSON.stringify(localStreet));

  reset();

  containerStreetEdit.classList.add("hidden");
}

function handleHapusStreet(rect, e) {
  e.preventDefault();

  if (confirm(`Yakin hapus titik awal ${JSON.stringify(rect.titikAwal)} ?`)) {
    let localStreet = JSON.parse(dataStreet.value);

    const index = localStreet.findIndex((item) => item.id === rect.id);

    if (index > -1) {
      localStreet.splice(index, 1);

      // Kurangi ID semua elemen yang tersisa sebesar 1
      localStreet = localStreet.map((item) => {
        if (item.id > rect.id) {
          item.id -= 1;
        }
        return item;
      });

      console.log(localStreet);

      dataStreet.value = JSON.stringify(localStreet);
      window.localStorage.setItem("street", JSON.stringify(localStreet));
      reset();
    }

    containerStreetEdit.classList.add("hidden");
  }
}

function handleData(data) {
  idLocation.value = data.id;
  width.value = data.width;
  height.value = data.height;
  dataTenant.value = JSON.stringify(data.data_tenant);
  dataStreet.value = JSON.stringify(data.data_street);

  window.localStorage.setItem("data", JSON.stringify(data.data_tenant));
  window.localStorage.setItem("street", JSON.stringify(data.data_street));
  window.localStorage.setItem("location", data.name);

  canvas.width = parseInt(data.width);
  canvas.height = parseInt(data.height);
  reset();
}

function generate_uid(length = 16) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
