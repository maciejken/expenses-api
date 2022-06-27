const { filterItems } = require("./filterItems.mjs");

const mockData = [
  {
    "id": "iisDsxz4GhSzcHsRoPty2",
    "title": "czapka",
    "amount": 100,
    "category": "prezenty",
    "date": "2021-12-20T00:00:00.000Z"
  },
  {
    "id": "U3QYrR1iOLwY2-mJE722S",
    "title": "czekoladki",
    "amount": 50,
    "category": "prezenty",
    "date": "2022-02-14T00:00:00.000Z"
  },
  {
    "id": "6dEbNpul09xKvGMhF5F6b",
    "title": "biedronka",
    "amount": 200,
    "category": "jedzenie",
    "date": "2022-06-10T00:00:00.000Z"
  },
  {
    "id": "QPoCwW7cvYzsEApdVIhVo",
    "title": "lidl",
    "amount": 90,
    "category": "jedzenie",
    "date": "2022-06-20T00:00:00.000Z"
  },
  {
    "id": "0B_Xu4ZwLd2Fow14aTvns",
    "title": "bilet 30-dniowy",
    "amount": 110,
    "category": "transport",
    "date": "2022-05-30T00:00:00.000Z"
  },
  {
    "id": "mFdbKmKNuXTCg4nnOtFwy",
    "title": "taxi",
    "amount": 35,
    "category": "transport",
    "date": "2022-06-16T00:00:00.000Z"
  }
]

describe("filterItems", () => {
  it("returns all items if no query is provided", () => {
    const filteredItems = filterItems(mockData);
    expect(filteredItems.length).toBe(mockData.length);
  });

  it("only returns items with category 'prezenty'", () => {
    const category = "prezenty";
    const query = { where: { category }};
    const filteredItems = filterItems(mockData, query);
    expect(filteredItems.every(item => item.category === category)).toBe(true);
  });

  it("only returns items from year 2022", () => {
    const query = { where: { startDate: new Date('2022-01-01'), endDate: new Date('2023-01-01') }};
    const filteredItems = filterItems(mockData, query);
    filteredItems.forEach(item => {
      const year = new Date(item.date).getFullYear();
      expect(year).toBe(2022);
    });
  });

  it("returns items grouped by category", () => {
    const expectedResult = [
      {
        "name": "prezenty",
        "count": 2,
        "totalAmount": 150
      },
      {
        "name": "jedzenie",
        "count": 2,
        "totalAmount": 290
      },
      {
        "name": "transport",
        "count": 2,
        "totalAmount": 145
      }
    ];
    const query = { groupBy: "category" };
    const filteredItems = filterItems(mockData, query);
    expect(filteredItems).toEqual(expectedResult);
    // expect(filteredItems).not.toBe(expectedResult);
  });

  it("returns no items if none of the items match query", () => {
    const query = { where: { category: "wakacje" }};
    const filteredItems = filterItems(mockData, query);
    expect(filteredItems.length).toBe(0);
  });
});