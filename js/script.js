const sheetURL = "PASTE_CSV_LINK_HERE";

let tableData = [];

fetch(sheetURL)
.then(res=>res.text())
.then(csv=>{
    const rows = csv.split("\n").slice(1);
    const table = document.querySelector("#dataTable tbody");
    const cities = new Set();

    rows.forEach(r=>{
        if(!r.trim()) return;

        const cols = r.split(",");
        const birth = new Date(cols[2]);
        const age = new Date().getFullYear() - birth.getFullYear();

        const row = [
            cols[0],
            cols[1],
            cols[2],
            age,
            cols[3],
            cols[4],
            cols[5]
        ];

        tableData.push(row);
        cities.add(cols[3]);
    });

    renderTable(tableData);
    populateCities([...cities]);
    buildChart();
});

function renderTable(data){
    const table = document.querySelector("#dataTable tbody");
    table.innerHTML="";

    data.forEach(row=>{
        const tr=document.createElement("tr");
        row.forEach(cell=>{
            const td=document.createElement("td");
            td.textContent=cell;
            tr.appendChild(td);
        });
        table.appendChild(tr);
    });
}

function populateCities(cities){
    const select=document.getElementById("cityFilter");
    cities.sort().forEach(c=>{
        const opt=document.createElement("option");
        opt.value=c;
        opt.textContent=c;
        select.appendChild(opt);
    });
}

document.getElementById("cityFilter").addEventListener("change",e=>{
    const val=e.target.value.toLowerCase();
    renderTable(
        tableData.filter(r=>!val || r[4].toLowerCase()==val)
    );
});

document.getElementById("search").addEventListener("keyup",e=>{
    const val=e.target.value.toLowerCase();
    renderTable(
        tableData.filter(r=>r.join(" ").toLowerCase().includes(val))
    );
});

function sortTable(col){
    tableData.sort((a,b)=>{
        if(!isNaN(a[col])) return a[col]-b[col];
        return a[col].localeCompare(b[col]);
    });
    renderTable(tableData);
}

function exportCSV(){
    let csv="Name,Sex,Birthdate,Age,City,School,Average\n";
    tableData.forEach(r=> csv+=r.join(",")+"\n");

    const blob=new Blob([csv]);
    const a=document.createElement("a");
    a.href=URL.createObjectURL(blob);
    a.download="students.csv";
    a.click();
}

function buildChart(){
    const counts={};

    tableData.forEach(r=>{
        counts[r[4]] = (counts[r[4]]||0)+1;
    });

    new Chart(document.getElementById("chart"),{
        type:"bar",
        data:{
            labels:Object.keys(counts),
            datasets:[{
                label:"Students per City",
                data:Object.values(counts)
            }]
        }
    });
}
