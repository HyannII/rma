const csvTemplate = {
    columns: [
        {
            name: "Mã nhân viên",
            key: "staff_id",
            required: true,
        },
        {
            name: "Mã nhà cung cấp",
            key: "providers_id",
            required: true,
        },
        {
            name: "Mã sản phẩm",
            key: "products_id",
            required: true,
        },
        {
            name: "Trạng thái",
            key: "status",
            required: true,
        },
        {
            name: "Nội dung",
            key: "name",
            required: true,
        },
        {
            name: "Số lượng",
            key: "quantity",
            data_type: "number",
            required: true,
        },
        {
            name: "Đơn vị tính",
            key: "unit",
        },
        {
            name: "Đơn giá",
            key: "price",
            data_type: "number",
        },
        {
            name: "Nội dung chi tiết",
            key: "description",
        },
    ],
};

export default csvTemplate;
