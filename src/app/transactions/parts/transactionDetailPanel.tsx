import React from "react";
import { Grid, Grid2, Typography } from "@mui/material";
import { DataGridPremium } from "@mui/x-data-grid-premium";
import { ITransactionResponse } from "../../../../interfaces/transaction.interface";

interface TransactionDetailPanelProps {
    transaction: ITransactionResponse;
}

const TransactionDetailPanel: React.FC<TransactionDetailPanelProps> = ({ transaction }) => {

    return (
        <div className="p-6">
            <Typography variant="h5">
                Chi tiết hoá đơn # {transaction.transactions_id}
            </Typography>
            <div className="h-4"></div>
            <Grid2
                container
                sx={{
                    "--Grid-borderWidth": "1px",
                    borderTop: "var(--Grid-borderWidth) solid",
                    borderLeft: "var(--Grid-borderWidth) solid",
                    borderColor: "divider",
                    "& > div": {
                        borderRight: "var(--Grid-borderWidth) solid",
                        borderBottom: "var(--Grid-borderWidth) solid",
                        borderColor: "divider",
                    },
                }}
            >
                <Grid2 size={4}>
                    <Typography
                        variant="body1"
                        className="p-2"
                    >
                        Trạng thái
                    </Typography>
                </Grid2>
                <Grid2 size={8}>
                    <Typography
                        variant="body1"
                        className="p-2"
                    >
                        {transaction.status}
                    </Typography>
                </Grid2>
                <Grid2 size={4}>
                    <Typography
                        variant="body1"
                        className="p-2"
                    >
                        Số lượng
                    </Typography>
                </Grid2>
                <Grid2 size={8}>
                    <Typography
                        variant="body1"
                        className="p-2"
                    >
                        {transaction.quantity}
                    </Typography>
                </Grid2>
                <Grid2 size={4}>
                    <Typography
                        variant="body1"
                        className="p-2"
                    >
                        Đơn vị tính
                    </Typography>
                </Grid2>
                <Grid2 size={8}>
                    <Typography
                        variant="body1"
                        className="p-2"
                    >
                        {transaction.unit}
                    </Typography>
                </Grid2>
                <Grid2 size={4}>
                    <Typography
                        variant="body1"
                        className="p-2"
                    >
                        Đơn giá
                    </Typography>
                </Grid2>
                <Grid2 size={8}>
                    <Typography
                        variant="body1"
                        className="p-2"
                    >
                        {`${new Intl.NumberFormat("vi-VN").format(
                            parseFloat(transaction.price)
                        )} VND`}
                    </Typography>
                </Grid2>
                <Grid2 size={4}>
                    <Typography
                        variant="body1"
                        className="p-2"
                    >
                        Nội dung chi tiết
                    </Typography>
                </Grid2>
                <Grid2 size={8}>
                    <Typography
                        variant="body1"
                        className="p-2"
                    >
                        {transaction.description}
                    </Typography>
                </Grid2>
                <Grid2 size={4}>
                    <Typography
                        variant="body1"
                        className="p-2"
                    >
                        Thời gian tạo
                    </Typography>
                </Grid2>
                <Grid2 size={8}>
                    <Typography
                        variant="body1"
                        className="p-2"
                    >
                        {new Date(transaction.created_at).toLocaleDateString(
                            "vi-VN"
                        )}
                    </Typography>
                </Grid2>
            </Grid2>
        </div>
    );
};

export default TransactionDetailPanel;
