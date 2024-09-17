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
    data.forEach((row, rowIndex) => {
        const tr = document.createElement('tr');

        row.forEach((cell, cellIndex) => {
            const td = rowIndex === 0 ? document.createElement('th') : document.createElement('td');
            
            if (cell === "*3") {
                td.setAttribute('rowspan', '2');
            } else if (cell === "*4") {
                td.setAttribute('colspan', '2');
            } else if (cell === "*1") {
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
                td.appendChild(radioBtnGroup);
            } else if (cell === "*2") {
                const input = document.createElement('input');
                input.type = 'text';
                td.appendChild(input);
            } else {
                td.textContent = cell;
            }

            tr.appendChild(td);
        });

        table.appendChild(tr);
    });

    container.appendChild(table);
}

document.getElementById('export-btn').addEventListener('click', function() {
    const table = document.querySelector('table');
    const data = [];
    table.querySelectorAll('tr').forEach(row => {
        const rowData = [];
        row.querySelectorAll('th, td').forEach(cell => {
            const input = cell.querySelector('input');
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
