const validatorMap = {
  startDate: (startDate) => (item) =>
    new Date(item.date).getTime() > startDate.getTime(),
  endDate: (endDate) => (item) =>
    new Date(item.date).getTime() < endDate.getTime(),
};

const groupByMap = {
  category: {
    key: "category",
    getInitialData: (name) => ({
      name,
      count: 0,
      totalAmount: 0,
    }),
    reducer: (groupData, item) => ({
      ...groupData,
      count: groupData.count + 1,
      totalAmount: groupData.totalAmount + item.amount
    }),
  }
};

export const filterItems = (items, query = {}) => {
  const { where, groupBy } = query;

  if (where) {
    const basicKeys = Object.keys(where).filter(
      (key) => where[key] && !validatorMap[key]
    );
    const specialKeys = Object.keys(where).filter(
      (key) => where[key] && validatorMap[key]
    );
    items = items
      .filter((item) =>
        specialKeys.every((key) => {
          const checkFn = validatorMap[key];
          return checkFn(where[key])(item);
        })
      )
      .filter((item) => basicKeys.every((key) => item[key] === where[key]));
  }

  if (groupBy && groupByMap[groupBy]) {
    const { key: groupByKey, getInitialData, reducer } = groupByMap[groupBy];
    const groupKeys = [...new Set(items.map((item) => item[groupByKey]))];
    return groupKeys.map((key) =>
      items
        .filter((item) => item[groupByKey] === key)
        .reduce(reducer, getInitialData(key))
    );
  }

  return items;
};
