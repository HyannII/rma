import { Box } from "@mui/material";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid-premium";
import { useState, useEffect } from "react";
import { getStaffByIDApi } from "../../../../api/staff.api";
import { getProviderByIDApi } from "../../../../api/provider.api";
import { getProductByIDApi } from "../../../../api/product.api";

const staffNameCache: Record<number, string> = {}; // Cache tên nhân viên theo staff_id
const providerNameCache: Record<number, string> = {}; // Cache tên nhân viên theo staff_id
const productNameCache: Record<number, string> = {}; // Cache tên nhân viên theo staff_id

export const transactionColumns: GridColDef[] = [
    {
        field: "transactions_id",
        headerName: "Mã hoá đơn nhập",
        minWidth: 200,
        editable: false,
        flex: 1,
        headerAlign: "center",
        renderCell: (params: GridRenderCellParams) => (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                }}
            >
                {params.value}
            </Box>
        ),
    },
    {
        field: "status",
        headerName: "Trạng thái",
        minWidth: 100,
        editable: false,
        flex: 3,
        headerAlign: "center",
        renderCell: (params: GridRenderCellParams) => (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                }}
            >
                {params.value}
            </Box>
        ),
    },
    {
        field: "created_at",
        headerName: "Thời gian tạo",
        minWidth: 100,
        editable: false,
        flex: 3,
        headerAlign: "center",
        renderCell: (params: GridRenderCellParams) => (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                }}
            >
                {new Date(params.value).toLocaleDateString()}
            </Box>
        ),
    },
    {
        field: "staff_id",
        headerName: "Nhân viên tạo",
        minWidth: 100,
        editable: false,
        flex: 3,
        headerAlign: "center",
        renderCell: (params: GridRenderCellParams) => {
            const [staffName, setStaffName] = useState<string | null>(null);

            useEffect(() => {
                const fetchStaffName = async () => {
                    const staffId = params.value;
                    if (staffId) {
                        if (staffNameCache[staffId]) {
                            setStaffName(staffNameCache[staffId]);
                        } else {
                            try {
                                const response = await getStaffByIDApi(staffId);
                                const name = response.name; // Lấy trường name từ response
                                staffNameCache[staffId] = name;
                                setStaffName(name);
                            } catch (error) {
                                console.error(
                                    "Error fetching staff name:",
                                    error
                                );
                            }
                        }
                    }
                };
                fetchStaffName();
            }, [params.value]);

            return (
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                    }}
                >
                    {staffName || "Loading..."}
                </Box>
            );
        },
    },
    {
        field: "providers_id",
        headerName: "Nhà cung cấp",
        minWidth: 100,
        editable: false,
        flex: 3,
        headerAlign: "center",
        renderCell: (params: GridRenderCellParams) => {
            const [providerName, setProviderName] = useState<string | null>(
                null
            );

            useEffect(() => {
                const fetchProviderName = async () => {
                    const providerId = params.value;
                    if (providerId) {
                        if (providerNameCache[providerId]) {
                            setProviderName(providerNameCache[providerId]);
                        } else {
                            try {
                                const response = await getProviderByIDApi(
                                    providerId
                                );
                                const name = response.name; // Lấy trường name từ response
                                providerNameCache[providerId] = name;
                                setProviderName(name);
                            } catch (error) {
                                console.error(
                                    "Error fetching staff name:",
                                    error
                                );
                            }
                        }
                    }
                };
                fetchProviderName();
            }, [params.value]);

            return (
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                    }}
                >
                    {providerName || "Loading..."}
                </Box>
            );
        },
    },
    {
        field: "products_id",
        headerName: "Sản phẩm nhập vào",
        minWidth: 100,
        editable: false,
        flex: 3,
        headerAlign: "center",
        renderCell: (params: GridRenderCellParams) => {
            const [productName, setProductName] = useState<string | null>(null);

            useEffect(() => {
                const fetchProductName = async () => {
                    const productId = params.value;
                    if (productId) {
                        if (productNameCache[productId]) {
                            setProductName(productNameCache[productId]);
                        } else {
                            try {
                                const response = await getProductByIDApi(
                                    productId
                                );
                                const name = response.name; // Lấy trường name từ response
                                productNameCache[productId] = name;
                                setProductName(name);
                            } catch (error) {
                                console.error(
                                    "Error fetching staff name:",
                                    error
                                );
                            }
                        }
                    }
                };
                fetchProductName();
            }, [params.value]);

            return (
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                    }}
                >
                    {productName || "Loading..."}
                </Box>
            );
        },
    },
    {
        field: "name",
        headerName: "Nội dung",
        minWidth: 100,
        editable: false,
        flex: 3,
        headerAlign: "center",
        renderCell: (params: GridRenderCellParams) => (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                }}
            >
                {params.value}
            </Box>
        ),
    },
];

export const detailColumns: GridColDef[] = [
    {
        field: "quantity",
        headerName: "Số lượng",
        minWidth: 100,
        editable: false,
        flex: 3,
        headerAlign: "center",
        renderCell: (params: GridRenderCellParams) => (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                }}
            >
                {params.value}
            </Box>
        ),
    },
    {
        field: "unit",
        headerName: "Đơn vị tính",
        minWidth: 100,
        editable: false,
        flex: 3,
        headerAlign: "center",
        renderCell: (params: GridRenderCellParams) => (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                }}
            >
                {params.value}
            </Box>
        ),
    },
    {
        field: "price",
        headerName: "Đơn giá",
        minWidth: 100,
        editable: false,
        flex: 3,
        headerAlign: "center",
        renderCell: (params: GridRenderCellParams) => (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                }}
            >
                {params.value}
            </Box>
        ),
    },
    {
        field: "description",
        headerName: "Nội dung chi tiết",
        minWidth: 100,
        editable: false,
        flex: 3,
        headerAlign: "center",
        renderCell: (params: GridRenderCellParams) => (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                }}
            >
                {params.value}
            </Box>
        ),
    },
    {
        field: "created_at",
        headerName: "Thời gian tạo",
        minWidth: 100,
        editable: false,
        flex: 3,
        headerAlign: "center",
        renderCell: (params: GridRenderCellParams) => (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                }}
            >
                {params.value}
            </Box>
        ),
    },
];
