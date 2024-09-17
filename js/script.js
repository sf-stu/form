function generateForm(data) {
    const container = document.getElementById('dynamicFormContainer');
    container.innerHTML = ''; // 既存のフォームをクリア

    const table = document.createElement('table');
    
    data.rows.forEach((row) => {
        const tr = document.createElement('tr');
        
        row.forEach((cell) => {
            let td;

            // セルの結合タイプに基づく処理
            if (cell.type === 'merge') {
                if (cell.target === 'above') {
                    return; // 上のセルと結合されるため、新たにセルを作らない
                } else if (cell.target === 'left') {
                    td = tr.lastElementChild; // 左隣のセルを結合対象にする
                    td.setAttribute('rowspan', (parseInt(td.getAttribute('rowspan') || 1) + 1).toString());
                    return;
                }
            } else {
                td = document.createElement('td');
                td.setAttribute('colspan', cell.colspan || 1);
            }

            // 各タイプに応じた入力フィールドの生成
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
            } else if (cell.type === 'fixed') {
                td.textContent = cell.value;
            }
            tr.appendChild(td);
        });

        table.appendChild(tr);
    });

    container.appendChild(table);
}
