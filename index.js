const a = document.getElementById("tableBody");
var data = [
  {
    id: 1,
    chemical_name: "Ammonium Persulfate",
    vender: "LG Chem",
    density: 3525.92,
    viscosity: 60.63,
    packaging: "Bag",
    pack_size: 100.0,
    unit: "kg",
    quantity: 6495.18,
  },
  {
    id: 2,
    chemical_name: "Caustic Potash",
    vender: "Formasa",
    density: 3172.15,
    viscosity: 48.22,
    packaging: "Bag",
    pack_size: 100.0,
    unit: "kg",
    quantity: 8751.9,
  },
  {
    id: 3,
    chemical_name: "Dimethylaminopropylamino",
    vender: "LG Chem",
    density: 8435.37,
    viscosity: 12.62,
    packaging: "Barrel",
    pack_size: 75.0,
    unit: "L",
    quantity: 5964.61,
  },
  {
    id: 4,
    chemical_name: "Mono Ammonium Phosphate",
    vender: "Sinopec",
    density: 1597.65,
    viscosity: 76.51,
    packaging: "Bag",
    pack_size: 105.0,
    unit: "Kg",
    quantity: 8183.73,
  },
  {
    id: 5,
    chemical_name: "Ferric Nitrate",
    vender: "DowDuPont",
    density: 364.04,
    viscosity: 14.9,
    packaging: "Bag",
    pack_size: 105.0,
    unit: "kg",
    quantity: 4154.33,
  },
  {
    id: 6,
    chemical_name: "n-Pentane",
    vender: "Sinopec",
    density: 4535.26,
    viscosity: 66.76,
    packaging: "N/A",
    pack_size: "N/A",
    unit: "t",
    quantity: 6272.34,
  },
  {
    id: 7,
    chemical_name: "Glycol Ether PM",
    vender: "LG Chem",
    density: 6495.18,
    viscosity: 72.12,
    packaging: "Bag",
    pack_size: 250.0,
    unit: "Kg",
    quantity: 8749.54,
  },
];

let sortOrder = {
  id: "default",
  chemical_name: "default",
  vender: "default",
  density: "default",
  viscosity: "default",
  packaging: "default",
  pack_size: "default",
  unit: "default",
  quantity: "default",
};

let selectedRow = {};
let isAdding = false;
let selectedRowIndex = null;
let isEditing = false;
let originalRowData = {};
let originalData = [...data];

function selectRow(index) {
  const selectedRowElement = document.querySelector(
    `tr[data-index='${index}']`
  );

  if (selectedRowElement.classList.contains("selected")) {
    selectedRowElement.classList.remove("selected");
    selectedRowIndex = null;
  } else {
    const previousSelectedRow = document.querySelector(".selected");
    if (previousSelectedRow) {
      previousSelectedRow.classList.remove("selected");
    }

    selectedRowElement.classList.add("selected");
    selectedRowIndex = index;
  }
  console.log("selectedRowIndex", selectedRowIndex);
  document.getElementById("move-up-btn").disabled =
    selectedRowIndex === 0 || selectedRowIndex === null;
  document.getElementById("move-down-btn").disabled =
    selectedRowIndex === data.length - 1 || selectedRowIndex === null;

  document.getElementById("deleteRow").disabled = selectedRowIndex === null;
  document.getElementById("edit-row-btn").disabled = selectedRowIndex === null;
}

function renderTable(data) {
  tableBody.innerHTML = "";
  data.forEach((item, index) => {
    const row = document.createElement("tr");
    row.setAttribute("data-index", index);
    const tickCell = document.createElement("td");
    tickCell.classList.add("tick");
    row.appendChild(tickCell);
    selectedRow[item.id] = false;
    Object.values(item).forEach((value) => {
      const cell = document.createElement("td");
      cell.textContent = value;
      row.appendChild(cell);
    });
    console.log(selectedRow);
    tableBody.appendChild(row);
    row.firstChild.addEventListener("click", () => {
      selectRow(index);
    });
  });
}

function updateIconStyle(key) {
  const icons = document.querySelectorAll(".icon");
  icons.forEach((icon) => {
    icon.classList.add("hidden");
    icon.classList.remove("asc", "desc");
  });

  if (key) {
    const iconElement = document.getElementById(`icon-${key}`);
    iconElement.classList.remove("hidden");

    if (sortOrder[key] === "asc") {
      iconElement.classList.add("asc");
    } else if (sortOrder[key] === "desc") {
      iconElement.classList.add("desc");
    } else {
      iconElement.classList.add("hidden");
    }
  }
}
renderTable(data);

const tableHeader = document.getElementById("table-header");

tableHeader.addEventListener("click", function (event) {
  let target = event.target;
  while (target && target.tagName !== "TH" && target !== tableHeader) {
    target = target.parentElement;
  }

  if (target && target.tagName === "TH") {
    const key = target.getAttribute("data-key");
    console.log("key", key);
    if (key) {
      if (sortOrder[key] === "default") {
        sortOrder[key] = "asc";
      } else if (sortOrder[key] === "asc") {
        sortOrder[key] = "desc";
      } else {
        sortOrder[key] = "default";
      }

      const sortedData = [...data].sort((a, b) => {
        const aValue = a[key];
        const bValue = b[key];

        if (sortOrder[key] === "default") {
          return 0;
        }

        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortOrder[key] === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        } else {
          return sortOrder[key] === "asc" ? aValue - bValue : bValue - aValue;
        }
      });

      renderTable(sortedData);
      updateIconStyle(key);
    }
  }
});

document.getElementById("add-row-btn").addEventListener("click", function () {
  if (isAdding) {
    const currentInputRow = document.querySelector("#tableBody tr.input-row");
    if (currentInputRow) {
      currentInputRow.remove();
    }
    isAdding = false;
    document.getElementById("save-row-btn").disabled = true;
    return;
  }

  isAdding = true;

  const tableBody = document.getElementById("tableBody");
  const row = document.createElement("tr");
  row.classList.add("input-row");

  const inputFields = [
    "tick",
    "id",
    "chemical_name",
    "vender",
    "density",
    "viscosity",
    "packaging",
    "pack_size",
    "unit",
    "quantity",
  ];
  inputFields.forEach((field) => {
    if (field === "tick") {
      const cell = document.createElement("td");
      cell.classList.add("tick");
      row.appendChild(cell);
    } else {
      const cell = document.createElement("td");
      const input = document.createElement("input");
      input.type = "text";
      input.placeholder = field;
      input.id = `input-${field}`;
      input.style.width = "100px";
      cell.appendChild(input);
      row.appendChild(cell);
    }
  });

  tableBody.appendChild(row);

  document.getElementById("save-row-btn").disabled = false;
});

document
  .getElementById("deleteRow")
  .addEventListener("click", function (event) {
    if (selectedRowIndex !== null) {
      data.splice(selectedRowIndex, 1);
      renderTable(data);
    }
  });

document
  .getElementById("move-up-btn")
  .addEventListener("click", function (event) {
    if (selectedRowIndex > 0) {
      const temp = data[selectedRowIndex - 1];
      data[selectedRowIndex - 1] = data[selectedRowIndex];
      data[selectedRowIndex] = temp;
      selectedRowIndex--;
      renderTable(data);
      selectRow(selectedRowIndex);
    }
  });

document
  .getElementById("move-down-btn")
  .addEventListener("click", function (event) {
    if (selectedRowIndex < data.length - 1) {
      const temp = data[selectedRowIndex + 1];
      data[selectedRowIndex + 1] = data[selectedRowIndex];
      data[selectedRowIndex] = temp;
      selectedRowIndex++;
      renderTable(data);
      selectRow(selectedRowIndex);
    }
  });

document.getElementById("save-row-btn").addEventListener("click", function () {
  const newRow = {
    id: parseInt(document.getElementById("input-id").value),
    chemical_name: document.getElementById("input-chemical_name").value,
    vender: document.getElementById("input-vender").value,
    density: parseFloat(document.getElementById("input-density").value),
    viscosity: parseFloat(document.getElementById("input-viscosity").value),
    packaging: document.getElementById("input-packaging").value,
    pack_size: parseFloat(document.getElementById("input-pack_size").value),
    unit: document.getElementById("input-unit").value,
    quantity: parseFloat(document.getElementById("input-quantity").value),
  };

  if (isEditing) {
    data[selectedRowIndex] = newRow;
    isEditing = false;
  } else {
    data.push(newRow);
  }

  renderTable(data);
  document.getElementById("save-row-btn").disabled = true;
  isAdding = false;
  isEditing = false;
});
