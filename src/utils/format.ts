const formatCurrency = (value: number): string => {
  return value.toLocaleString('vi-VN'); // hoặc dùng 'en-US' nếu cần
};

export {formatCurrency};
