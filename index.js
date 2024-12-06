const tambahan_Y_A1 = 320;
const north = document.getElementById("north");
var gCanvasOffset;
var gctx = gCanvas.getContext("2d");
var CANVAS_WIDTH = canvas.width;
var CANVAS_HEIGHT = canvas.height;
var startValue;
var endValue;
var scale = 1; //0.6;
var dir;
var path;
var openSet = new Set();
var closedSet = new Set();
var gridPointsByPos = [];
var gridPoints = [];
var streetSet = new Set();
var startPoint;
var endPoint;
var mode = null;
var clickTenant;

class Vec2 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

var localData = window.localStorage.getItem("data");
var localStreet = JSON.parse(window.localStorage.getItem("street"));

if (!localStreet) {
  localStreet = [];
  window.localStorage.setItem("street", JSON.stringify([]));
}

if (!localData) {
  var DeclareTenant = JSON.parse([]);
} else {
  DeclareTenant = JSON.parse(localData);
}

dataTenant.value = JSON.stringify(DeclareTenant);
dataStreet.value = JSON.stringify(localStreet);

// gCanvas.style.transform = "scale(" + scale + ")";

startPoint = new Vec2(260, 560);
endPoint = new Vec2(80, 80);

// HANDLE TENANT
function Tenant(context) {
  DeclareTenant = JSON.parse(dataTenant.value);

  DeclareTenant.forEach((e) => {
    HandleTenant(
      context,
      e.color,
      e.type,
      e.x,
      e.y,
      e.x2,
      e.y2,
      e.width,
      e.height,
      e.width2,
      e.height2,
      e.text,
      e?.border,
      e?.fontSize,
      e?.image,
      e?.code,
      scale
    );
  });
}

gCanvasOffset = new Vec2(gCanvas.offsetLeft, gCanvas.offsetTop);

class Node {
  constructor(id, size, posx, posy, walkable, path, direction = "all", color) {
    var F;
    var parent;
    this.inPath = false;
    this.getGCost = this.getValueG;
    this.getHCost = this.getValueH;

    this.size = size;
    this.posx = posx;
    this.posy = posy;
    this.walkable = walkable;
    this.path = path;
    this.direction = direction;
    this.color = "white";
    this.id = id;
  }

  createStartNode() {
    // iconUser(gctx, this);
    iconEndNode(gctx, this, 6, "green", "green");
  }

  createEndNode() {
    iconEndNode(gctx, this, 6, "#E72929", "#E72929");
  }

  toggleWalkable() {
    this.walkable = !this.walkable;
  }
  getValueF() {
    //this is a problem
    var fValue = this.getValueH() + this.getValueG();

    return fValue;
  }
  getValueH() {
    var endNodePosition = {
      posx: endPoint.x,
      posy: endPoint.y,
    };

    return getDistance(this, endNodePosition);
  }
  getValueG() {
    var startPointPosition = {
      posx: endPoint.x,
      posy: endPoint.y,
    };
    return getDistance(this, startPointPosition);
  }
  createWall() {
    nodeDrawer(gctx, this, 2, "black", "transparent");
  }

  createStreet() {
    nodeDrawer(gctx, this, 2, "white", "white");
  }

  createTenant() {
    Tenant(gctx);
  }
  drawOpenNode() {
    nodeDrawer(gctx, this, 2, "black", "green");
  }
  drawClosedNode() {
    nodeDrawer(gctx, this, 2, "black", "pink");
  }

  drawPath() {
    drawerPath(gctx, this, 4, "green", "green");
  }

  drawNode() {
    gctx.beginPath();
    gctx.lineWidth = "2";
    gctx.strokeStyle = this.color === "white" ? "black" : "black";
    gctx.fillStyle = this.color === "white" ? "transparent" : this.color;
    gctx.fillRect(this.posx, this.posy, this.size, this.size);
    gctx.rect(this.posx, this.posy, this.size, this.size);
    gctx.closePath();
    gctx.stroke();

    if (this.posx == startPoint.x && this.posy == startPoint.y) {
      // console.log("hit the startNode");

      this.createStartNode();

      return;
    }
    if (this.inPath === true) {
      this.drawPath();
    }

    if (this.walkable === false) {
      this.createWall();

      return;
    }

    if (this.posx == endPoint.x && this.posy == endPoint.y) {
      this.createEndNode();
    }
  }
}

class PathFindingAlg {
  constructor(grid, startNode, endNode) {
    this.grid = grid;
    this.startNode = gridPointsByPos[startNode.x][startNode.y];
    this.endNode = gridPointsByPos[endNode.x][endNode.y];
    this.currentNode = null;

    this.openSet = new Set();
    this.closedSet = new Set();
  }

  findPath() {
    openSet.clear();
    closedSet.clear();

    var currentNode = this.startNode; // the currentNode, defaults to inputStart node for now

    var endNode = gridPoints[this.endNode]; //the target node
    var startNode = gridPoints[this.startNode];

    var tempArray;

    var newMovementCost; //the new movement cost to neighbor

    openSet.add(gridPoints[currentNode]);

    // console.log("begin");

    while (openSet.size > 0) {
      tempArray = Array.from(openSet);

      currentNode = tempArray[0];

      // for (var i = 1; i < tempArray.length; i++) {
      //   //this if statement is solely to build the starting walls.
      //   if (
      //     tempArray[i].getValueF() < currentNode.getValueF() ||
      //     (tempArray[i].getValueF() == currentNode.getValueF() &&
      //       tempArray[i].getValueH() < currentNode.getValueH())
      //   ) {
      //     currentNode = tempArray[i]; //sets the currentNode to openSetI if it has a lower F value, or an = F value with a lower HCost.
      //   }
      // }

      //exits for loop with either lowest F value or combined H value and F value

      openSet.delete(currentNode);

      // currentNode.drawClosedNode();

      closedSet.add(currentNode);

      //might need to put this after getNighbors.... then replace closedSet.hasIn(neighborNode with currentNode
      if (currentNode.id == startNode.id) {
        currentNode.drawNode();
      }
      if (currentNode.id == endNode.id) {
        currentNode.drawNode();
      }

      if (currentNode.path == false) {
        currentNode.drawNode();
      }

      if (currentNode.id == endNode.id) {
        retracePath(startNode, endNode);
        //hit the last point, exit's the loop.

        return; //exits loop
      }

      getNeighbors(currentNode).forEach(function (neighbor, i) {
        var neighborNode = gridPoints[neighbor];
        var neighborH = neighborNode.getHCost();
        var neighborG = neighborNode.getGCost();

        var currentG = currentNode.getGCost();
        var currentH = currentNode.getHCost();

        if (!neighborNode.walkable || closedSet.has(neighborNode)) {
          // console.log(neighborNode.posx, neighborNode.posy);

          return; //acts as a continue, no need to continue if the wall was already checked.
        }

        newMovementCost = currentG + getDistance(currentNode, neighborNode);

        if (newMovementCost < neighborG || !openSet.has(neighborNode)) {
          neighborNode.gCost = newMovementCost;
          neighborNode.hCost = neighborH;
          neighborNode.parent = currentNode;

          if (!openSet.has(neighborNode)) {
            //push the neighborNode to the openSet, to check against other open values
            openSet.add(neighborNode);

            // neighborNode.drawOpenNode();
          }
        }
      });
    }
  }
}

class Grid {
  constructor(width, height, posx, posy, gridPoints) {
    this.width = width;
    this.height = height;
    this.posx = posx;
    this.posy = posy;
    this.gridPoints = gridPoints;
  }

  createGrid() {
    var tempNode; // Variabel sementara untuk menyimpan informasi node selama pembuatan
    var countNodes = 0; // Penghitung untuk melacak jumlah total node yang dibuat
    localStreet = JSON.parse(window.localStorage.getItem("street"));

    // Loop melalui lebar grid, membuat node-node sepanjang sumbu X
    for (var i = 0; i < CANVAS_WIDTH; i += NODESIZE) {
      // Inisialisasi sebuah array untuk menyimpan titik-titik grid berdasarkan posisi sepanjang sumbu X
      gridPointsByPos[i] = [];

      // Loop melalui tinggi grid, membuat node-node sepanjang sumbu Y
      for (var j = 0; j < CANVAS_HEIGHT; j += NODESIZE) {
        // Berikan sebuah indeks unik pada setiap titik grid berdasarkan posisinya
        gridPointsByPos[i][j] = countNodes;

        // Buat sebuah node baru dengan indeks, posisi, dan kemampuan berjalan default yang ditetapkan menjadi true
        tempNode = new Node(countNodes, NODESIZE, i, j, true, true);

        tempNode.walkable = false; // Set it to false initially

        localStreet.forEach((e) => {
          switch (e.position) {
            case "x":
              if (
                (countNodes - e.titikAwal) % perkalianNodeY === 0 &&
                countNodes >= e.titikAwal &&
                countNodes <= e.titikAwal + perkalianNodeY * e.tambahKotak
              ) {
                tempNode.color = "#fff";
                tempNode.walkable = true; // Only set to true if condition is met
                tempNode.direction = e.direction;
              }
              break;
            case "y":
              if (
                countNodes >= e.titikAwal &&
                countNodes <= e.titikAwal + e.tambahKotak
              ) {
                tempNode.color = "#fff";
                tempNode.walkable = true;
                tempNode.direction = e.direction;
              }
              break;
          }

          if (e.titikAwal === countNodes) {
            tempNode.color = "green";
          }
        });

        tempNode.drawNode();

        // Hitung dan tetapkan nilai heuristik untuk node
        tempNode.F = tempNode.getValueF();

        // Masukkan node yang dibuat ke dalam array gridPoints
        gridPoints.push(tempNode);

        // Inkrementasi penghitung node
        countNodes++;
      }
    }

    Tenant(gctx);
  }
}

var grid = new Grid(CANVAS_WIDTH, CANVAS_HEIGHT, 0, 0);

grid.createGrid();

// gCanvas.addEventListener("click", canvasClickHandler);

let isDragging = false;
let offsetX, offsetY;
let isMouseDown = false;
let mouseDownTime;

canvas.addEventListener("mousedown", function (e) {
  isMouseDown = true;
  flag = false;
  mouseDownTime = Date.now();
  const rectCanvas = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rectCanvas.left;
  const mouseY = e.clientY - rectCanvas.top;

  DeclareTenant = JSON.parse(dataTenant.value);

  DeclareTenant.forEach((rect) => {
    // Check the main rectangle area
    const mainRectContainsMouse =
      mouseX >= rect.x &&
      mouseX <= rect.x + rect.width &&
      mouseY >= rect.y &&
      mouseY <= rect.y + rect.height;

    // Check the secondary rectangle area
    const secondaryRectContainsMouse =
      mouseX >= rect.x2 &&
      mouseX <= rect.x2 + rect.width2 &&
      mouseY >= rect.y2 &&
      mouseY <= rect.y2 + rect.height2;

    if (mainRectContainsMouse || secondaryRectContainsMouse) {
      isDragging = true;
      offsetX = mouseX - rect.x;
      offsetY = mouseY - rect.y;
      rect.isDragging = true;
    }
  });
});

canvas.addEventListener("mousemove", function (e) {
  if (isDragging) {
    const rectCanvas = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rectCanvas.left;
    const mouseY = e.clientY - rectCanvas.top;

    // DeclareTenant = JSON.parse(dataTenant.value);

    DeclareTenant.forEach((rect) => {
      if (rect.isDragging) {
        // Calculate the new position
        let newX = mouseX - offsetX;
        let newY = mouseY - offsetY;

        // Snap to the nearest grid point
        newX = Math.round(newX / NODESIZE) * NODESIZE;
        newY = Math.round(newY / NODESIZE) * NODESIZE;

        // Boundary check to prevent moving out of canvas
        if (newX < 0) newX = 0;
        if (newY < 0) newY = 0;
        if (newX + rect.width > canvas.width) newX = canvas.width - rect.width;
        if (newY + rect.height > canvas.height)
          newY = canvas.height - rect.height;

        // Check for collision with other rectangles
        let collision = false;

        DeclareTenant.forEach((otherRect) => {
          if (otherRect !== rect) {
            const mainRectContainsMouse =
              newX < otherRect.x + otherRect.width &&
              newX + rect.width > otherRect.x &&
              newY < otherRect.y + otherRect.height &&
              newY + rect.height > otherRect.y;

            // Check the secondary rectangle area
            // const secondaryRectContainsMouse =
            //   newX < otherRect.x2 + otherRect.width2 &&
            //   newX + rect.width2 > otherRect.x2 &&
            //   newY < otherRect.y2 + otherRect.height2 &&
            //   newY + rect.height2 > otherRect.y2;

            if (mainRectContainsMouse) {
              collision = true;
            }
          }
        });

        // Only update position if there is no collision
        if (!collision) {
          var slX = newX - rect.x;
          var slY = newY - rect.y;

          rect.x = newX;
          rect.y = newY;
          rect.x2 = rect.x2 + slX;
          rect.y2 = rect.y2 + slY;

          dataTenant.value = JSON.stringify(DeclareTenant);
          pushData(dataTenant.value);
          reset();
        }
      }
    });
  }
});

canvas.addEventListener("mouseup", function (e) {
  isDragging = false;
  isMouseDown = false;
  DeclareTenant.forEach((rect) => {
    rect.isDragging = false;
  });

  pushData(JSON.stringify(DeclareTenant));
  dataTenant.value = JSON.stringify(DeclareTenant);
});

var currentRect = null;
var currentStreet = null;

var street = [];

canvas.addEventListener("click", function (e) {
  flag = false;
  const clickDuration = Date.now() - mouseDownTime;
  if (clickDuration > 200) return; // Ignore long clicks

  if (!isDragging && !isMouseDown) {
    const rectCanvas = canvas.getBoundingClientRect();
    console.log(e.clientX, rectCanvas.left);
    const mouseX = e.clientX - rectCanvas.left;
    const mouseY = e.clientY - rectCanvas.top;
    const gridX = Math.floor(mouseX / NODESIZE) * NODESIZE;
    const gridY = Math.floor(mouseY / NODESIZE) * NODESIZE;
    var x = e.pageX - rectCanvas.left;
    var y = e.pageY - rectCanvas.top;

    if (mode === "startPoint") {
      console.log(gridX, gridY);
      startPoint = new Vec2(gridX, gridY);
      reset();
      myPath = new PathFindingAlg(grid, startPoint, endPoint);
      myPath.findPath();
    }

    if (mode === "street") {
      gridPoints.forEach(function (element) {
        if (
          y > element.posy &&
          y < element.posy + element.size &&
          x > element.posx &&
          x < element.posx + element.size
        ) {
          console.log(element.id);
          let localStreet =
            JSON.parse(window.localStorage.getItem("street")) || [];

          let alreadyExists = localStreet.findIndex(
            (item) =>
              item.titikAwal === element.id || item.member.includes(element.id)
          );

          if (alreadyExists >= 0) {
            handleViewFormStreet(localStreet[alreadyExists]);
            currentStreet = localStreet[alreadyExists];
          } else {
            const cekStreet = {
              id: JSON.parse(dataStreet.value).length,
              titikAwal: element.id,
              position: "x",
              tambahKotak: 0,
              direction: "all",
              member: [],
            };

            const hasilStreet = JSON.parse(dataStreet.value);
            localStreet.push(cekStreet);

            currentStreet = cekStreet;
            handleViewFormStreet(cekStreet);

            dataStreet.value = JSON.stringify(localStreet);
            window.localStorage.setItem("street", dataStreet.value);

            drawRectangle(gridX, gridY, 20, 20, "white");
          }
        }
      });
    }

    // Check if the click position overlaps with any existing rectangle
    let clickOverlapsExisting = false;

    DeclareTenant = JSON.parse(dataTenant.value);

    DeclareTenant.forEach((rect) => {
      if (
        (mouseX >= rect.x &&
          mouseX <= rect.x + rect.width &&
          mouseY >= rect.y &&
          mouseY <= rect.y + rect.height) ||
        (mouseX >= rect.x2 &&
          mouseX <= rect.x2 + rect.width2 &&
          mouseY >= rect.y2 &&
          mouseY <= rect.y2 + rect.height2)
      ) {
        clickOverlapsExisting = true;

        containerEdit.classList.remove("hidden");
        form.scrollTo(0, 0);
        handleViewForm(rect);

        namaTenant.value = rect.text || "";

        currentRect = rect;
      }
    });

    if (!clickOverlapsExisting && mode === "tenant") {
      drawRectangle(gridX, gridY, 60, 60);
      const uid = generate_uid();

      const dataKotak = {
        unique_id: uid,
        color: `#ffff99`,
        border: true,
        type: "kotak",
        x: gridX,
        y: gridY,
        x2: gridX + 60,
        y2: gridY,
        width: 60,
        height: 60,
        width2: 0,
        height2: 0,
        code: ``,
        text: ``,
        categori: "tenant",
        image: "",
        pointX: 0,
        pointY: 0,
      };

      const tenant = JSON.parse(dataTenant.value);
      tenant.push(dataKotak);

      dataTenant.value = JSON.stringify(tenant);
      pushData(dataTenant.value);
    }
  }
});
