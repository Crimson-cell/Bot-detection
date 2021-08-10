var firebaseAPI = require('./firebase/firebase');

(async function myFunction(){
    await firebaseAPI.firestore.collection('cursorEvents').get()
    .then(snapshot => {
        let events = [];
        snapshot.forEach(doc => {
            const data = doc.data()
            const _id = doc.id
            events.push({_id, ...data });
        });
        return events;
    })
    .then((events) => {
        events.sort((a, b) => a.timestamp.localeCompare(b.timestamp));
        events.splice(0, 1);
        
        console.log(events);
    })
    .catch((err) => console.log(err));
})();