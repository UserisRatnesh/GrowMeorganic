import axios from "axios";
import { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

interface Row {
  id: number;
  title: string;
  placeOfOrigin: string;
  artistDisplay: string;
  inscriptions: string;
  dateStart: number;
  dateEnd: number;
}

export default function LazyPage() {
  // Load the page data and display the content

  const [pageNumber, setPageNumber] = useState<number>(1);
  const [rowData, setRowData] = useState<Row[]>([]);
  const [rowClick, setRowClick] = useState(true);
  const [selectedRow, setSelectedRow] = useState<Row[]>([]);

  useEffect(() => {
    axios
      .get(`https://api.artic.edu/api/v1/artworks?page=${pageNumber}`)
      .then((res) => {
        const datas = res.data.data;
        const tempRowData: Row[] = [];
        datas.forEach((data) => {
          const row = {
            id: data.id,
            title: data.title,
            placeOfOrigin: data.place_of_origin,
            artistDisplay: data.artist_display,
            inscriptions: data.inscriptions,
            dateStart: data.start_date,
            dateEnd: data.end_date,
          };
          tempRowData.push(row);
        });
        setRowData(tempRowData);
      })
      .catch(() => {
        console.log("Error loading data");
      });
  }, [pageNumber]);

  useEffect(() => {
    console.log(rowData);
  }, [rowData]);

  return (
    <div className="card">
      <DataTable
        value={rowData}
        selectionMode={rowClick ? null : "checkbox"}
        selection={selectedRow}
        onSelectionChange={(e) => {
          setSelectedRow(e.value);
        }}
        dataKey="id"
        tableStyle={{ minWidth: "40rem" }}
      >
        <Column
          selectionMode="multiple"
          headerStyle={{ width: "2rem" }}
        ></Column>
        <Column field="title" header="Title"></Column>
        <Column field="dateStart" header="Date start"></Column>
        <Column field="dateEnd" header="Date end"></Column>
        <Column field="placeOfOrigin" header="Place of origin"></Column>
        <Column field="artistDisplay" header="Artist Display"></Column>
        <Column field="inscriptions" header="Inscriptions"></Column>
      </DataTable>
    </div>
  );
}
