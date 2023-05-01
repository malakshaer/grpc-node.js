const grpc = require("grpc");
const { v1: uuidv1 } = require("uuid");
const protoLoader = require("@grpc/proto-loader");
const packageDefinition = protoLoader.loadSync("notes.proto");
const notesProto = grpc.loadPackageDefinition(packageDefinition);

const notes = [
  { id: "1", title: "Note 1", content: "Content 1" },
  { id: "2", title: "Note 2", content: "Content 2" },
];

const server = new grpc.Server();
server.addService(notesProto.NoteService.service, {
  list: (_, callback) => {
    console.log("Received a list request");
    callback(null, notes);
  },
  get: (call, callback) => {
    let note = notes.find((n) => n.id == call.request.id);
    if (note) {
      callback(null, note);
    } else {
      callback({
        code: grpc.status.NOT_FOUND,
        details: "Not found",
      });
    }
  },
  insert: (call, callback) => {
    let note = call.request;
    note.id = uuidv1();
    notes.push(note);
    callback(null, note);
  },
  update: (call, callback) => {
    let existingNote = notes.find((n) => n.id == call.request.id);
    if (existingNote) {
      existingNote.title = call.request.title;
      existingNote.content = call.request.content;
      callback(null, existingNote);
    } else {
      callback({
        code: grpc.status.NOT_FOUND,
        details: "Not found",
      });
    }
  },
  delete: (call, callback) => {
    let existingNoteIndex = notes.findIndex((n) => n.id == call.request.id);
    if (existingNoteIndex != -1) {
      notes.splice(existingNoteIndex, 1);
      callback(null, {});
    } else {
      callback({
        code: grpc.status.NOT_FOUND,
        details: "Not found",
      });
    }
  },
});

// client side
const http = require("http");
const port = process.env.PORT || 3000;
const requestHandler = (request, response) => {
  response.end("Hello from Node.js server!");
};
const serverHttp = http.createServer(requestHandler);
serverHttp.listen(port, (err) => {
  if (err) {
    return console.log("Error: ", err);
  }
  console.log(`Web server running at http://localhost:${port}`);
});
// end

server.bind("127.0.0.1:50051", grpc.ServerCredentials.createInsecure());
console.log("Server running at http://127.0.0.1:50051");
server.start();
