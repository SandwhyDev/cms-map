// PAMERAN
function createPameran(value) {
  const data = {
    name: value.name,
  };

  let cek = "pameran_create";

  const requestBody = JSON.stringify(data);
  const url = "http://localhost:8000/api";

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: requestBody,
  };

  fetch(`${url}/${cek}`, requestOptions)
    .then((res) => {
      // Lakukan sesuatu dengan data respons yang diterima
      console.log("Data yang diterima:", res);

      if (res.status === 401) {
        alert(`pameran '${data.pameran}' sudah terdaftar`);
        return;
      } else if (res.status === 500) {
        alert(`Internal Server Error`);
        return;
      }

      alert("berhasil");
      window.location.reload();
    })
    .catch((error) => {
      // Tangani kesalahan jika ada
      console.error("Ada kesalahan:", error);
    });
}

function readPameran() {
  let cek = "pameran_read";

  const url = "http://localhost:8000/api";

  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  fetch(`${url}/${cek}`, requestOptions)
    .then((res) => {
      // Periksa apakah respons memiliki status OK (200)
      if (res.ok) {
        // Ubah respons ke dalam format JSON
        return res.json();
      }
      // Jika respons tidak OK, lempar error
      throw new Error("Network response was not ok.");
    })
    .then((value) => {
      const selectPameran = document.getElementById("selectPameran");

      if (value.data.length === 0) {
        selectPameran.classList.add("hidden");
        return;
      }

      selectPameran.value = value.data[0].name;

      idPameran.value = value.data[0].id;

      // Iterasi melalui data dan buat opsi untuk masing-masing
      value.data.forEach((item) => {
        var option = document.createElement("option");
        option.value = item.name; // Ganti dengan properti yang sesuai
        option.textContent = item.name; // Ganti dengan properti yang sesuai
        if (localPameran === item.name) {
          option.selected = true;
        }
        selectPameran.appendChild(option);
      });
    })
    .catch((error) => {
      // Tangani kesalahan jika ada
      console.error("Ada kesalahan:", error);
    });
}

function readPameranByName(name) {
  let cek = `pameran_read?name=${name}`;

  const url = "http://localhost:8000/api";

  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  fetch(`${url}/${cek}`, requestOptions)
    .then((res) => {
      // Periksa apakah respons memiliki status OK (200)
      if (res.ok) {
        // Ubah respons ke dalam format JSON
        return res.json();
      }
      // Jika respons tidak OK, lempar error
      throw new Error("Network response was not ok.");
    })
    .then((value) => {
      idPameran.value = value.data.id;

      if (value.data.location.length === 0) {
        selectLocation.classList.add("hidden");
        window.localStorage.setItem("location", "");
        window.localStorage.setItem("data", JSON.stringify([]));
        window.localStorage.setItem("street", JSON.stringify([]));
        dataTenant.value = JSON.stringify([]);
        dataStreet.value = JSON.stringify([]);
        reset();

        return;
      }

      selectLocation.classList.remove("hidden");

      selectLocation.innerHTML = "";

      // Cari kecocokan lokasi
      var matchFound = value.data.location.find(function (item) {
        return item.name === localLocation;
      });

      // Iterasi melalui data dan buat opsi untuk masing-masing
      value.data.location.forEach((item) => {
        let option = document.createElement("option");
        option.value = item.name;
        option.textContent = item.name;

        if (matchFound?.name === item.name) {
          option.selected = true;
        }

        selectLocation.appendChild(option);
      });

      // Panggil handleData sekali setelah loop selesai
      if (matchFound) {
        handleData(matchFound);
      } else {
        handleData(value.data.location[0]);
      }
    })
    .catch((error) => {
      // Tangani kesalahan jika ada
      console.error("Ada kesalahan:", error);
    });
}

//  LOCATION
function createLocation(value) {
  let cek = "location_create";

  console.log(value);

  const requestBody = JSON.stringify(value);
  const url = "http://localhost:8000/api";

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: requestBody,
  };

  fetch(`${url}/${cek}`, requestOptions)
    .then((res) => {
      // Lakukan sesuatu dengan data respons yang diterima
      console.log("Data yang diterima:", res);

      if (res.status === 500) {
        alert("server error");
        return;
      }

      alert("berhasil");
      window.location.reload();
    })
    .catch((error) => {
      // Tangani kesalahan jika ada
      console.error("Ada kesalahan:", error);
    });
}

function readLocationByName(name, id) {
  let cek = `location_read?name=${name}&id_pameran=${id}`;

  const url = "http://localhost:8000/api";

  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  fetch(`${url}/${cek}`, requestOptions)
    .then((res) => {
      // Periksa apakah respons memiliki status OK (200)
      if (res.ok) {
        // Ubah respons ke dalam format JSON
        return res.json();
      }
      // Jika respons tidak OK, lempar error
      throw new Error("Network response was not ok.");
    })
    .then((value) => {
      handleData(value.data);
    })
    .catch((error) => {
      // Tangani kesalahan jika ada
      console.error("Ada kesalahan:", error);
    });
}

function updateLocation(value) {
  let cek = `location_update`;

  console.log(value);
  const requestBody = JSON.stringify(value);
  const url = "http://localhost:8000/api";

  const requestOptions = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: requestBody,
  };

  fetch(`${url}/${cek}`, requestOptions)
    .then((res) => {
      // Lakukan sesuatu dengan data respons yang diterima
      console.log("Data yang diterima:", res);

      if (res.status === 201) {
        alert("berhasil");
        flag = true;
      } else {
        alert("error");
      }

      window.location.reload();
    })
    .catch((error) => {
      // Tangani kesalahan jika ada
      console.error("Ada kesalahan:", error);
    });
}
