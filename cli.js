const readline = require("readline");
const { autoQuery } = require("./core");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on("line", (input) => {
  const str = input.trim().toLowerCase();
  if(str === "exit" || str === "quit"){
    process.exit(0);
  }
  const ret = autoQuery(input);
  console.log(JSON.stringify(ret));
});
