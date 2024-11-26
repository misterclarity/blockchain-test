const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./.data/blockchain.db', (err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to blockchain database');
});

console.log('\nChecking Blocks table:');
db.all('SELECT * FROM blocks', [], (err, rows) => {
  if (err) {
    console.error('Error querying blocks:', err);
    return;
  }
  console.log('\nBlocks in database:');
  rows.forEach(row => {
    console.log('\nBlock ID:', row.id);
    console.log('Timestamp:', row.timestamp);
    console.log('Previous Hash:', row.previousHash);
    console.log('Hash:', row.hash);
    console.log('Data:', row.data);
    console.log('Nonce:', row.nonce);
  });
});

console.log('\nChecking Resources table:');
db.all('SELECT * FROM resources', [], (err, rows) => {
  if (err) {
    console.error('Error querying resources:', err);
    return;
  }
  console.log('\nResources in database:');
  rows.forEach(row => {
    console.log('\nResource ID:', row.id);
    console.log('Type:', row.type);
    console.log('Name:', row.name);
    console.log('Description:', row.description);
    console.log('Contact:', row.contact);
    console.log('Block ID:', row.blockId);
  });
  
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err);
      return;
    }
    console.log('\nDatabase connection closed.');
  });
});
