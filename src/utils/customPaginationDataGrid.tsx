import { TablePaginationProps } from "@mui/material";
import {
  gridPageCountSelector,
  GridPagination,
  useGridApiContext,
  useGridSelector,
} from "@mui/x-data-grid-pro";
import MuiPagination from "@mui/material/Pagination";

function Pagination({
  page,
  onPageChange,
  className,
}: Pick<TablePaginationProps, "page" | "onPageChange" | "className">) {
  const apiRef = useGridApiContext();
  const pageCount = useGridSelector(apiRef, gridPageCountSelector);

  return (
    <MuiPagination
      color="primary"
      className={className}
      count={pageCount}
      page={page + 1}
      onChange={(event, newPage) => {
        onPageChange(event as any, newPage - 1);
      }}
    ></MuiPagination>
  );
}

export default function CustomPaginationDataGrid(props: any) {
    return <GridPagination ActionsComponent={Pagination} {...props} />
}
