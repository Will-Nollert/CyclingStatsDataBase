const axios = require("axios");
const cheerio = require("cheerio");
axios
  .get("https://www.procyclingstats.com/race/paris-roubaix/2018/results")
  .then((response) => {
    const $ = cheerio.load(response.data);
    const infoList = $("ul.infolist");
    const infoListData = {};
    infoList.find("li").each((index, element) => {
      const key = $(element)
        .find("div")
        .eq(0)
        .text()
        .trim()
        .replace(/\s+/g, "_")
        .toLowerCase();
      const value = $(element).find("div").eq(1).text().trim();
      infoListData[key] = value;
    });
    console.log(infoListData);

    const table = $("table.results > tbody");
    const tableData = [];

    table.find("tr").each((index, element) => {
      const position = $(element).find("td").eq(0).text().trim();
      const riderName = $(element)
        .find("td")
        .eq(3)
        .find("a")
        .first()
        .text()
        .trim();
      const teamName = $(element)
        .find("td")
        .eq(3)
        .find(".showIfMobile")
        .text()
        .trim();

      tableData.push({ position, riderName, teamName });
    });

    console.log(tableData);
  })
  .catch((error) => {
    console.log(error);
  });
