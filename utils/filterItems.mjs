const filterItems = (items, query) => {
  const { where, groupBy } = query;

  if (where) {
    const basicKeys = Object.keys(where).filter(
      (key) => where[key] && typeof where[key] !== "function"
    );
    const specialKeys = Object.keys(where).filter(
      (key) => typeof where[key] === "function"
    );
    items = items
      .filter((item) =>
        specialKeys.every((key) => {
          const checkFn = where[key];
          return checkFn(item);
        })
      )
      .filter((item) => basicKeys.every((key) => item[key] === where[key]));
  }

  if (groupBy?.key && groupBy?.reducer) {
    const groupKeys = [...new Set(items.map((item) => item[groupBy.key]))];
    return groupKeys.map((key) =>
      items
        .filter((item) => item[groupBy.key] === key)
        .reduce(groupBy.reducer, groupBy.getInitialData(key))
    );
  }

  return items;
};

export default filterItems;
