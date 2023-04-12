let axios=require('axios')

function harperSaveRoom(room,password) {
    const dbUrl = process.env.HARPERDB_URL;
    const dbPw = process.env.HARPERDB_PW;
    if (!dbUrl || !dbPw) return null;
  
    let data = JSON.stringify({
      operation: 'insert',
      schema: 'realtime_chap_app',
      table: 'rooms',
      records: [
        {
          room,
          password
        },
      ],
    });
  
    let config = {
      method: 'post',
      url: dbUrl,
      headers: {
        'Content-Type': 'application/json',
        Authorization: dbPw,
      },
      data: data,
    };
  
    return new Promise((resolve, reject) => {
      axios(config)
        .then(function (response) {
          resolve(JSON.stringify(response.data));
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  
  module.exports = harperSaveRoom;