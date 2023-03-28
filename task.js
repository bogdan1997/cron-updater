const { default: axios } = require("axios");
require("dotenv").config();

var cron = require("node-cron");
const tlchainNetworkStats = process.env.TLCHAIN_NETWORK_STATS;
const baserowUrl = process.env.BASEROW_URL;
const apiKey = process.env.API_KEY;
const statsTableId = process.env.STATS_TABLE_ID;
const transactionsRowId = process.env.TRANSACTIONS_ROW_ID;
const accountsRowId = process.env.ACCOUNTS_ROW_ID;

const updateBaserow = async (data, row_id, table_id) => {
  try {
    await axios({
      method: "PATCH",
      url:
        baserowUrl +
        "/api/database/rows/table/" +
        table_id +
        "/" +
        row_id +
        "/",
      headers: {
        Authorization: "Token " + apiKey,
        "Content-Type": "application/json",
      },
      data: data,
    });
  } catch (error) {
    console.log(error.response.data);
  }
};

const worker = async () => {
  console.log("running a task every 30 seconds");
  const response = await axios.get(tlchainNetworkStats);
  console.log(response.data);
  const transactionsData = {
    field_612616: response.data.transactions,
  };
  const accountsData = {
    field_612616: response.data.accounts,
  };
  updateBaserow(transactionsData, transactionsRowId, statsTableId);
  updateBaserow(accountsData, accountsRowId, statsTableId);
};

cron.schedule("*/30 * * * * *", worker);
