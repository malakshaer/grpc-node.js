const client = require("./client");
let newNote = {
  title: "New Note!",
  content: "Content of new note",
};

client.insert(newNote, (error, note) => {
  if (!error) {
    console.log("New note created successfully");
    console.log(note);
  } else {
    console.error(error);
  }
});
