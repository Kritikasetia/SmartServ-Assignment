let parsedData = [];

function captureFileDetails() {
    const fileUploadSection = document.getElementById('file-upload-section');
    const fileDetailsSection = document.getElementById('file-details-section');
    const fileType = document.getElementById('fileType').value;
    const fileInput = document.getElementById('inputFile');

    if (!(fileInput && fileInput.files && fileInput.files.length > 0)) {
        alert('Please select a file.');
        return;
    }

    const fileName = fileInput.files[0].name;
    const fileExtension = fileName.split('.').pop().toLowerCase();

    if (fileExtension != fileType) {
        alert('Please upload file in selected format');
        return;
    }

    // Display delimiter only for CSV
    const delimiterLabel = document.getElementById('delimiterLabel');
    const delimiterInput = document.getElementById('delimiter');

    if (fileType === 'csv') {
        delimiterLabel.style.display = 'inline-block';
        delimiterInput.style.display = 'inline-block';
    } else {
        delimiterLabel.style.display = 'none';
        delimiterInput.style.display = 'none';
    }

    fileDetailsSection.style.display = 'block';
}


async function importData() {
    const fileDetailsSection = document.getElementById('file-details-section');
    const displayOptionsSection = document.getElementById('display-options');
    const productTable = document.getElementById('productTable');
    const availableFieldsSelect = document.getElementById('availableFields');
    const displayFieldsSelect = document.getElementById('displayFields');

    // Reset display fields, available fields, and table
    availableFieldsSelect.innerHTML = '';
    displayFieldsSelect.innerHTML = '';
    productTable.innerHTML = '';

    const fileType = document.getElementById('fileType').value;
    const charEncoding = document.getElementById('charEncoding').value;
    const delimiter = document.getElementById('delimiter').value;

    try {
        const fileContent = await readFile(fileType, charEncoding);
        const products = parseFileContent(fileContent, fileType, delimiter);

        // Populate available fields based on the keys in the first product
        const firstProductKeys = Object.keys(products[0]);
        firstProductKeys.forEach(field => {
            const option = document.createElement('option');
            option.value = field;
            option.text = field;
            availableFieldsSelect.add(option);
        });

        // Sort products based on descending popularity
        products.sort((a, b) => parseInt(b.popularity) - parseInt(a.popularity));
        parsedData = products

        // Display table headers
        const headerRow = productTable.insertRow(0);
        displayFieldsSelect.querySelectorAll('option:checked').forEach(selectedField => {
            const th = document.createElement('th');
            th.textContent = selectedField.value;
            headerRow.appendChild(th);
        });

        // Display selected fields in the table
        products.forEach(product => {
            const row = productTable.insertRow(-1);
            displayFieldsSelect.querySelectorAll('option:checked').forEach(selectedField => {
                const cell = row.insertCell(-1);
                cell.textContent = product[selectedField.value];
            });
        });

        // Show the display options section
        fileDetailsSection.style.display = 'none';
        displayOptionsSection.style.display = 'block';
    } catch (error) {
        alert(`Error: ${error.message}`);
        console.error(error);
    }
}

function addSelectedFields() {
    moveOptions('availableFields', 'displayFields');
}

function removeSelectedFields() {
    moveOptions('displayFields', 'availableFields');
}

function moveOptions(sourceId, targetId) {
    const sourceSelect = document.getElementById(sourceId);
    const targetSelect = document.getElementById(targetId);

    sourceSelect.querySelectorAll('option:checked').forEach(option => {
        targetSelect.add(option);
        option.selected = false;
    });
}

function readFile(fileType, charEncoding) {
    return new Promise((resolve, reject) => {
        const fileInput = document.getElementById('inputFile');
        const reader = new FileReader();

        reader.onload = function(event) {
            resolve(event.target.result);
        };

        reader.onerror = function(event) {
            reject(new Error('Error reading the file.'));
        };

        if (fileType === 'json') {
            reader.readAsText(fileInput.files[0], charEncoding);
        } else if (fileType === 'csv') {
            reader.readAsText(fileInput.files[0], charEncoding);
        } else {
            reject(new Error('Unsupported file type.'));
        }
    });
}

function parseFileContent(content, fileType, delimiter) {
    if (fileType === 'json') {
        // For JSON, parse the content directly
        const jsonData = JSON.parse(content);
        return Object.values(jsonData.products);
    } else if (fileType === 'csv') {
        return parseCsv(content, delimiter);
    } else {
        throw new Error('Unsupported file type.');
    }
}

function parseCsv(content, delimiter) {
    const lines = content.split('\n');
    const header = lines[0].split(delimiter);
    const products = [];

    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(delimiter);
        const product = {};

        for (let j = 0; j < header.length; j++) {
            product[header[j]] = values[j];
        }

        products.push(product);
    }

    return products;
}

function showSelectedData() {
    const displayOptionsSection = document.getElementById('display-options');
    const productTable = document.getElementById('productTable');
    const displayFieldsSelect = document.getElementById('displayFields');

    // Make the table visible
    productTable.style.display = 'table';

    // Reset the table
    productTable.innerHTML = '';

    // Display table headers
    const headerData = Array.from(displayFieldsSelect.options).map(option => option.value);
    const headerRow = productTable.insertRow(0);
    headerData.forEach((headerText, index) => {
        const headerCell = headerRow.insertCell(index);
        headerCell.textContent = headerText;
    });

    // Display selected fields in the table
    const selectedData = getSelectedData();
    selectedData.forEach((product, rowIndex) => {
        const row = productTable.insertRow(rowIndex + 1);
        Object.values(product).forEach((value, cellIndex) => {
            const cell = row.insertCell(cellIndex);
            cell.textContent = value;
        });
    });

}


function getSelectedData() {
    const displayFieldsSelect = document.getElementById('displayFields');
    const selectedFields = Array.from(displayFieldsSelect.options).map(option => option.value);
    const selectedData = parsedData.map(product => {
        const selectedProduct = {};
        selectedFields.forEach(selectedField => {
            selectedProduct[selectedField] = product[selectedField];
        });
        return selectedProduct;
    });
    return selectedData;
}