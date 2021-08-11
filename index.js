var firebaseAPI = require('./firebase/firebase');

(async function myFunction(){
    await firebaseAPI.firestore.collection('cursorEvents').get()
    .then(snapshot => {
        let logs = [];
        snapshot.forEach(doc => {
            const data = doc.data()
            const _id = doc.id
            logs.push({_id, ...data });
        });
        return logs;
    })
    .then((logs) => {
        var initialLog = logs.findIndex(element => element.user_id === '0000000000');
        logs.splice(initialLog, 1);
        logs.forEach(log => {
            log.events.sort((a, b) => a.timestamp.localeCompare(b.timestamp));
            console.log(JSON.stringify(log, null, 4));
        }); 
        
    })
    .catch((err) => console.log(err));
})();