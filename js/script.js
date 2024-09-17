let importedData;

function importJSON() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            importedData = JSON.parse(e.target.result);
            generateForm(importedData);
        };
        reader.readAsText(file);
    } else {
        alert("ファイルを選択してください");
    }
}

function generateForm(data) {
    const container = document.getElementById('dynamicFormContainer');
    container.innerHTML = ''; // 既存のフォームをクリア

    const table = document.createElement('table');
    
    data.rows.forEach((row) => {
        const tr = document.createElement('tr');
        
        row.forEach((cell) => {
            const td = document.createElement('td');
            td.setAttribute('colspan', cell.colspan || 1);

            if (cell.type === 'text') {
                const input = document.createElement('input');
                input.type = 'text';
                input.value = cell.value || '';
                td.appendChild(input);
            } else if (cell.type === 'radio') {
                cell.options.forEach(option => {
                    const label = document.createElement('label');
                    const input = document.createElement('input');
                    input.type = 'radio';
                    input.name = cell.name;
                    input.value = option.value;
                    label.appendChild(input);
                    label.appendChild(document.createTextNode(option.label));
                    td.appendChild(label);
                });
            } else {
                td.textContent = cell.value;
            }
            tr.appendChild(td);
        });

        table.appendChild(tr);
    });

    container.appendChild(table);
}

function exportJSON() {
    const rows = [];
    const table = document.querySelector('table');

    if (table) {
        const trs = table.querySelectorAll('tr');
        trs.forEach((tr) => {
            const row = [];
            const tds = tr.querySelectorAll('td');

            tds.forEach((td) => {
                const input = td.querySelector('input[type="text"]');
                const radio = td.querySelector('input[type="radio"]:checked');

                if (input) {
                    row.push({ type: 'text', value: input.value });
                } else if (radio) {
                    row.push({ type: 'radio', value: radio.value });
                } else {
                    row.push({ type: 'fixed', value: td.textContent });
                }
            });
            rows.push(row);
        });

        const jsonOutput = JSON.stringify({ rows: rows }, null, 2);
        downloadJSON(jsonOutput);
    }
}

function downloadJSON(data) {
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'exported_data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}
