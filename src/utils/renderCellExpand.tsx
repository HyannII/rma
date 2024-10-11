import * as React from "react";
import { Paper, Popper } from "@mui/material";
import { styled } from "@mui/system";
import { GridRenderCellParams } from "@mui/x-data-grid";

interface CellExpandProps {
  value: string;
  width: number;
}

const CellExpandRoot = styled("div")({
  alignItems: "center",
  lineHeight: "24px",
  width: "100%",
  height: "100%",
  position: "relative",
  display: "flex",
  "& .MuiRating-root": {
    marginRight: 8, // spacing(1) equivalent
  },
  "& .cellValue": {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
});

// Utility function to check if an element is overflown
const isOverflown = (element: HTMLElement): boolean => {
  return (
    element.scrollHeight > element.clientHeight ||
    element.scrollWidth > element.clientWidth
  );
};

const CellExpand = React.memo(function CellExpand(props: CellExpandProps) {
  const { width, value } = props;
  const wrapper = React.useRef<HTMLDivElement | null>(null);
  const cellDiv = React.useRef<HTMLDivElement | null>(null);
  const cellValue = React.useRef<HTMLDivElement | null>(null);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const [showFullCell, setShowFullCell] = React.useState(false);
  const [showPopper, setShowPopper] = React.useState(false);

  const showCell = React.useCallback(() => {
    setShowFullCell(true);
  }, []);
  const hideCell = React.useCallback(() => {
    setShowFullCell(false);
  }, []);

  React.useEffect(() => {
    if (cellDiv.current) {
      setAnchorEl(cellDiv.current);
    }
  }, []);

  React.useEffect(() => {
    if (cellValue.current) {
      const isCurrentlyOverflown = isOverflown(cellValue.current);
      setShowPopper(isCurrentlyOverflown);
    }
  }, [width]);

  return (
    <CellExpandRoot
      ref={wrapper}
      onMouseEnter={showCell}
          onMouseLeave={hideCell}
          style={{width}}
    >
      <div
        ref={cellDiv}
        style={{
          height: 1,
          width,
          display: "block",
          position: "absolute",
          top: 0,
        }}
      />
      <div ref={cellValue} className="cellValue">
        {value}
      </div>
      {showPopper && (
        <Popper
          open={showFullCell && anchorEl != null}
          anchorEl={anchorEl}
          style={{ width, marginLeft: -17 }}
        >
          <Paper
            elevation={1}
            style={{ minHeight: wrapper.current!.offsetHeight - 2 }}
          >
            <div style={{ padding: 5 }}>{value}</div>
          </Paper>
        </Popper>
      )}
    </CellExpandRoot>
  );
});

export function RenderCellExpand(params: GridRenderCellParams) {
  const width = params.colDef.width!; // Ensure that the column width is passed
  return (
    <CellExpand
      value={params.value ? params.value.toString() : ""}
      width={width}
    />
  );
}
