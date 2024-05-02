const useDate = ({ settings }) => {
  const { brava-sales_app_date_format } = settings;

  const dateFormat = brava-sales_app_date_format;

  return {
    dateFormat,
  };
};

module.exports = useDate;
