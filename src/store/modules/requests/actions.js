export default {
    contactCoach(context, payload) {
        const newReq = {
            id: new Date().toISOString(),
            coachId: payload.coachId,
            email: payload.email,
            message: payload.message
        }

        context.commit('addRequest', newReq);
    },
    async addRequest(context, payload) {
        console.log(payload);
        const newReq = {
            // coachId: payload.coachId,
            email: payload.email,
            message: payload.message
        }
        
        const response = await fetch(`https://crown-db-3b7f9.firebaseio.com/requests/${payload.coachId}.json`, {
            method: 'POST',
            body: JSON.stringify(newReq)
        })

        const responseData = await response.json();

        if(!response.ok) {
            const err = new Error(responseData.message || 'Failed to send request.');
            throw err;
        }

        newReq.id = responseData.name;
        newReq.coachId = payload.coachId

        context.commit('addRequests', newReq)
    },
    async fetchRequests(context) {
        const coachId = context.rootGetters.userId;
        const token = context.rootGetters.token

        const response = await fetch(`https://crown-db-3b7f9.firebaseio.com/requests/${coachId}.json?auth=${token}`);

        const responseData = await response.json();

        if(!response.ok) {
            const err = new Error(responseData.message || 'Failed to get request.');
            throw err;
        }

        const requests = [];

        for(const key in responseData) {
            const request = {
                id: key,
                coachId: coachId,
                email: responseData[key].email,
                message: responseData[key].message
            }

            requests.push(request)
        }

        context.commit('setRequests', requests)
    }
}