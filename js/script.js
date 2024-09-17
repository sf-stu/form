function generateForm(data) {
    const container = document.getElementById('dynamicFormContainer');
    container.innerHTML = ''; // 既存のフォームをクリア

    const table = document.createElement('table');
    
    data.rows.forEach((row, rowIndex) => {
        const tr = document.createElement('tr');
        
        row.forEach((cell, colIndex) => {
            let td;

            // セルの結合タイプに基づく処理
            if (cell.type === 'merge') {
                if (cell.target === 'above') {
                    // 上の行のセルを結合
                    const aboveRow = table.rows[rowIndex - 1];
                    const aboveCell = aboveRow.cells[colIndex];
                    const rowspan = aboveCell.getAttribute('rowspan') || 1;
                    aboveCell.setAttribute('rowspan', parseInt(rowspan) + 1);
                    return; // 新たなセルを作らない
                } else if (cell.target === 'left') {
                    // 左隣のセルを結合対象にする
                    td = tr.lastElementChild;
                    const colspan = td.getAttribute('colspan') || 1;
                    td.setAttribute('colspan', parseInt(colspan) + 1);
                    return; // 新たなセルを作らない
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
