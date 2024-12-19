import axios from "axios";
import "primeicons/primeicons.css";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Paginator } from "primereact/paginator";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-blue/theme.css";
import { useEffect, useState } from "react";

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
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [rowData, setRowData] = useState<Row[]>([]);

  // It serves as global state of each page selection
  // because we are maintaining a json object with pagenumber as key and page data array as value
  const [selectedRowIds, setSelectedRowIds] = useState<{
    [page: number]: number[];
  }>({});

  // Maintain current state of each page
  // Will be using it to update global state whenever we change page
  const [currentPageSelectionIds, setCurrentPageSelectionIds] = useState<
    number[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`https://api.artic.edu/api/v1/artworks?page=${pageNumber}`)
      .then((res) => {
        const datas = res.data.data;
        const tempRowData: Row[] = datas.map((data: any) => ({
          id: data.id,
          title: data.title,
          placeOfOrigin: data.place_of_origin,
          artistDisplay: data.artist_display,
          inscriptions: data.inscriptions,
          dateStart: data.start_date,
          dateEnd: data.end_date,
        }));
        setRowData(tempRowData);

        // update total pages
        if (res.data.pagination) {
          setTotalPages(res.data.pagination.total_pages);
        }

        // resstoring the selection for current page
        setCurrentPageSelectionIds(
          (selectedRowIds[pageNumber] || []).map((id) => id),
        );
      })
      .catch(() => {
        console.log("Error loading data");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [pageNumber]);

  const handleSelectionChange = (e: { value: Row[] }) => {
    // Update the selection state for the current page
    const selectedRowIdsForCurrentPage = e.value.map((row: Row) => row.id);
    setCurrentPageSelectionIds(selectedRowIdsForCurrentPage);

    // Update the global selection state
    setSelectedRowIds((previousSelection) => {
      // Copy previously selected rows for different pages
      const updatedSelection = { ...previousSelection };

      // Update the selection for the current page (store only IDs)
      updatedSelection[pageNumber] = selectedRowIdsForCurrentPage;

      return updatedSelection;
    });
  };
  const handlePageChange = (e: { page: number }) => {
    setPageNumber(e.page + 1); // updating page number each time a new page is clicked
  };
  return (
    <div className="card">
      <DataTable
        value={rowData}
        selectionMode="checkbox"
        selection={currentPageSelectionIds.map((id: number) =>
          rowData.find((row: Row) => row.id === id),
        )}
        onSelectionChange={handleSelectionChange}
        loading={loading}
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
      <Paginator
        first={(pageNumber - 1) * 12}
        rows={12}
        totalRecords={totalPages * 12}
        onPageChange={handlePageChange}
        pageLinkSize={10}
        template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
        currentPageReportTemplate={`Page {currentPage} of ${totalPages}`}
      />
    </div>
  );
}
