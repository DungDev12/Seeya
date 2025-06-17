const getTodayWithWeekday = () => {
  const days = [
    'Chủ Nhật',
    'Thứ Hai',
    'Thứ Ba',
    'Thứ Tư',
    'Thứ Năm',
    'Thứ Sáu',
    'Thứ Bảy',
  ];

  const today = new Date();
  const weekday = days[today.getDay()];
  const date = today.getDate();
  const month = today.getMonth() + 1; // Tháng bắt đầu từ 0
  const year = today.getFullYear();

  return `${weekday} - ${date}/${month}/${year}`;
};

const getDate = (format: string) => {
  const today = new Date();
  const date = today.getDate();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
  const year = today.getFullYear();

  switch (format) {
    case 'YYYY/MM/DD':
      return `${year}/${month}/${date}`;
    case 'YYYY-MM-DD':
      return `${year}-${month}-${date}`;
    case 'DD-MM-YYYY':
      return `${date}-${month}-${year}`;
    case 'DD/MM/YYYY':
      return `${date}/${month}/${year}`;
  }
};

export {getTodayWithWeekday, getDate};
