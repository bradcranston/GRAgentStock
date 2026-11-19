window.renderGasketTable = function(json,name) {
  const data = JSON.parse(json);


  // Remove existing table if present
  const existing = document.getElementById('gasket-table');
  if (existing) existing.remove();

  // Create table and header
  const table = document.createElement('table');
  table.id = 'gasket-table';
  table.className = 'display';
  table.style.width = '100%';

  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  ['Rep','Order','Gasket Profile', 'Width', 'Height', 'Gasket Id'].forEach(col => {
    const th = document.createElement('th');
    th.textContent = col;
    headerRow.appendChild(th);
  });
  // Add button column header
  const btnHeader = document.createElement('th');
  btnHeader.textContent = '';
  headerRow.appendChild(btnHeader);
  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Create table body
  const tbody = document.createElement('tbody');
  (data.value || []).forEach(row => {
    const tr = document.createElement('tr');
    ['cRepList','_kf_Order','Gasket_Profile', 'Width', 'Height', 'GasketId'].forEach(key => {
      const td = document.createElement('td');
      td.textContent = row[key] !== null && row[key] !== undefined ? row[key] : '';
      tr.appendChild(td);
    });
    // Add Remove from Stock button
    const btnTd = document.createElement('td');
    const btn = document.createElement('button');
    const build = {};
    build.row = row;
    build.mode = 'removeFromStock';
    btn.textContent = 'Remove from Stock';
    btn.onclick = function() {
      if (window.FileMaker && typeof window.FileMaker.PerformScript === 'function') {
        window.FileMaker.PerformScript('Manage Report: Canceled Orders', JSON.stringify(build));
      } else {
        alert('FileMaker.PerformScript not available. Row data: ' + JSON.stringify(build));
      }
      // Remove the row from the table
      tr.remove();
    };
    btnTd.appendChild(btn);
    tr.appendChild(btnTd);
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);

  // Insert into container
  const container = document.getElementById('gasket-table-container') || document.body;
  container.innerHTML = '';

  // Add header with name parameter if provided
  if (name) {
    const header = document.createElement('h2');
    header.textContent = name + ' Agent Stock';
    header.style.marginBottom = '12px';
    container.appendChild(header);
  }

  container.appendChild(table);

  // Initialize DataTable using global jQuery/DataTables from CDN
  if (window.jQuery && window.jQuery.fn.DataTable) {
    window.jQuery(table).DataTable({
      searching: true, // search bar
      ordering: true,  // column sorting
      paging: false,
      info: false,
      autoWidth: false
    });
  }
};