const client = require("./client");
client.delete({ id: "1" }, (error, _) => {
  if (!error) {
    console.log("Note deleted successfully");
  } else {
    console.error(error);
  }
});
