const fields = [
  {
    label: "Mã nhân viên",
    key: "staff_id",
    fieldType: {
      type: "input",
    },
    validations: [
      {
        rule: "regex",
      },
    ],
  },
  {
    label: "Mã nhà cung cấp",
    key: "providers_id",
    fieldType: {
      type: "input",
    },
  },
  {
    label: "Mã sản phẩm",
    key: "products_id",
    fieldType: {
      type: "input",
    },
  },
  {
    label: "Trạng thái",
    key: "status",
    fieldType: {
      type: "input",
    },
  },
  {
    label: "Nội dung",
    key: "name",
    fieldType: {
      type: "input",
    },
  },
  {
    label: "Số lượng",
    key: "quantity",
    fieldType: {
      type: "input",
    },
  },
  {
    label: "Đơn vị tính",
    key: "unit",
    fieldType: {
      type: "input",
    },
    validations: [
      {
        rule: "/^[0-9]+$/",
      },
    ],
  },
  {
    label: "Đơn giá",
    key: "price",
    fieldType: {
      type: "input",
    },
  },
  {
    label: "Nội dung chi tiết",
    key: "description",
    fieldType: {
      type: "input",
    },
  },
] as const;

export default fields;
