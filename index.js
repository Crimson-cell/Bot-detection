var firebaseAPI = require('./firebase/firebase');
var processor = require('./log processor/ActionParser');

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
        logs = processor.cursorEventParser(logs);
        logs = logs.map((log) => processor.actionProcessor(log, 4));

        for (var log of logs) {
            console.log(JSON.stringify(log, null, 4));
        }
        
    })
    .catch((err) => console.log(err));
})();