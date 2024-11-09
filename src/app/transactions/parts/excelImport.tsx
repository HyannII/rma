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
            required: true,
        },
        {
            name: "Đơn vị tính",
            key: "unit",
            required: true,
        },
        {
            name: "Đơn giá",
            key: "price",
            required: true,
        },
        {
            name: "Nội dung chi tiết",
            key: "description",
            required: true,
        },
    ],
};

export default csvTemplate;
