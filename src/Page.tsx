import axios from "axios";
import { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";

interface Row {
  id: number;
  title: string;
  placeOfOrigin: string;
  artistDisplay: string;
  inscriptions: string;
  dateStart: Date;
  dateEnd: Date;
}

export default function LazyPage() {
  // Load the page data and display the content

  const [pageNumber, setPageNumber] = useState<number>(1);
  const [rowData, setRowData] = useState<Row[]>([]);

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
    console.log(rowData.length);
  }, [rowData]);

  return (
    <div>
      <DataTable></DataTable>
    </div>
  );
}
