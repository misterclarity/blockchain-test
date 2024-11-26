const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./.data/choices.db', (err) => {
  if (err) {
    console.error(err.message);
    return;
  }
  console.log('Connected to the choices database.');
});

console.log('\nCurrent Poll Results:');
db.all('SELECT * FROM Choices', [], (err, rows) => {
  if (err) {
    throw err;
  }
  console.log('\nLanguage Votes:');
  rows.forEach((row) => {
    console.log(`${row.language}: ${row.picks} votes`);
  });
});

console.log('\nVoting History:');
db.all('SELECT * FROM Log ORDER BY time DESC', [], (err, rows) => {
  if (err) {
    throw err;
  }
  console.log('\nRecent Votes:');
  rows.forEach((row) => {
    console.log(`Vote for ${row.choice} at ${row.time}`);
  });
  
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('\nClosed the database connection.');
  });
});
