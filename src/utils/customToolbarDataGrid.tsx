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
                slotsProp={{
                    tooltip: { title: "Export data" },
                    button: { variant: "outlined" },
                }}
            />
        </GridToolbarContainer>
    );
}
