const crypto = require("crypto");
const start = Date.now();

function differentSequence(name) {
 crypto.pbkdf2("a", "b", 100000, 512, "sha512", () => {
   console.log(`I'm ${name}`);
 });
}
differentSequence("seq1");
differentSequence("seq2");
differentSequence("seq3");
differentSequence("seq4");
