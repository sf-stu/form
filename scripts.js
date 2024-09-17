document.getElementById('import-btn').addEventListener('click', function() {
    document.getElementById('file-input').click();
});

document.getElementById('file-input').addEventListener('change', handleFileUpload);

function handleFileUpload(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        const data = JSON.parse(e.target.result);
        generateTable(data);
    };

    reader.readAsText(file);
}

function generateTable(data) {
    const container = document.getElementById('form-container');
    container.innerHTML = '';
    const table = document.createElement('table');

    // track rows for rowspan and columns for colspan
    let skipCells = [];

    data.forEach((row, rowIndex) => {
        if (!skipCells[rowIndex]) {
            skipCells[rowIndex] = [];
        }
        const tr = document.createElement('tr');

        row.forEach((cell, cellIndex) => {
            // Check if we should skip this cell due to previous col/row span
            if (skipCells[rowIndex][cellIndex]) return;

            const td = rowIndex === 0 ? document.createElement('th') : document.createElement('td');

            // Process special cell types
            switch (cell) {
                case "*1":
                    td.appendChild(createRadioGroup(rowIndex, cellIndex));
                    td.rowSpan = 2;
                    ensureRowSpan(skipCells, rowIndex + 1, cellIndex);
                    break;
                case "*2":
                    td.appendChild(createTextInput());
                    break;
                case "*3":
                    td.rowSpan = 2;
                    ensureRowSpan(skipCells, rowIndex + 1, cellIndex);
                    break;
                case "*4":
                    td.colSpan = 2;
                    ensureColSpan(skipCells, rowIndex, cellIndex + 1);
                    break;
                default:
                    td.textContent = cell;
            }

            if (cell !== "*4") { // Skip appending if colSpan is set
                tr.appendChild(td);
            }
        });

        table.appendChild(tr);
    });

    container.appendChild(table);
}

function createRadioGroup(rowIndex, cellIndex) {
    const radioBtnGroup = document.createElement('div');
    ["OK", "NG"].forEach(option => {
        const label = document.createElement('label');
        const radioBtn = document.createElement('input');
        radioBtn.type = 'radio';
        radioBtn.name = `radio-${rowIndex}-${cellIndex}`;
        radioBtn.value = option;
        label.appendChild(radioBtn);
        label.appendChild(document.createTextNode(option));
        radioBtnGroup.appendChild(label);
    });
    return radioBtnGroup;
}

function createTextInput() {
    const input = document.createElement('input');
    input.type = 'text';
    return input;
}

function ensureRowSpan(skipCells, rowIndex, cellIndex) {
    if (!skipCells[rowIndex]) {
        skipCells[rowIndex] = [];
    }
    skipCells[rowIndex][cellIndex] = true;
}

function ensureColSpan(skipCells, rowIndex, cellIndex) {
    skipCells[rowIndex][cellIndex] = true;
}

document.getElementById('export-btn').addEventListener('click', function() {
    const table = document.querySelector('table');
    const data = [];
    table.querySelectorAll('tr').forEach(row => {
        const rowData = [];
        row.querySelectorAll('th, td').forEach(cell => {
            const input = cell.querySelector('input[type="text"]');
            const radio = cell.querySelector('input[type="radio"]:checked');
            if (input) {
                rowData.push(input.value);
            } else if (radio) {
                rowData.push(radio.value);
            } else {
                rowData.push(cell.textContent);
            }
        });
        data.push(rowData);
    });

    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'exported_data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
});
