const sheetURL = "PASTE_CSV_LINK_HERE";

fetch(sheetURL)
.then(res => res.text())
.then(csv => {
    const rows = csv.split("\n").slice(1);
    const table = document.querySelector("#dataTable tbody");

    rows.forEach(r=>{
        const cols = r.split(",");
        const tr = document.createElement("tr");

        cols.slice(0,6).forEach(c=>{
            const td = document.createElement("td");
            td.textContent = c;
            tr.appendChild(td);
        });

        table.appendChild(tr);
    });
});

// SEARCH
document.getElementById("search").addEventListener("keyup", e=>{
    let val = e.target.value.toLowerCase();
    document.querySelectorAll("#dataTable tbody tr")
    .forEach(row=>{
        row.style.display = row.textContent.toLowerCase().includes(val)
        ? "" : "none";
    });
});
