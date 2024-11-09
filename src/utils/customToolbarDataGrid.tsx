import Box from "@mui/material/Box";
import {
    GridToolbarContainer,
    GridToolbarExport,
} from "@mui/x-data-grid-premium";

export default function CustomToolbar() {
    return (
        <GridToolbarContainer>
            <Box sx={{ flexGrow: 1 }}></Box>
            <GridToolbarExport
                excelOptions={{
                    allColumns: true, // Xuất tất cả các cột, bao gồm cả cột ẩn
                }}
                slots={{
                    tooltip: { title: "Export data" },
                    button: { variant: "outlined" },
                }}
            />
        </GridToolbarContainer>
    );
}
