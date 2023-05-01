const client = require("./client");
client.list({}, (error, notes) => {
  if (!error) {
    console.log("successfully fetch list of notes");
    console.log(notes);
  } else {
    console.error(error);
  }
});
