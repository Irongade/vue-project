export default {
    async registerCoach(context, data) {
        const userId = context.rootGetters.userId;
        const token = context.rootGetters.token

        console.log(context)

        const coachData = {
            id: context.rootGetters.userId,
            firstName: data.first,
            lastName: data.last,
            description: data.desc,
            hourlyRate: data.rate,
            areas: data.areas
        }


        const response = await fetch(`https://crown-db-3b7f9.firebaseio.com/coaches/${userId}.json?auth=${token}`, {
            method: 'PUT',
            body: JSON.stringify(coachData),
        })

        // const responseData = await response.json();

        if(!response.ok) return null
         
        context.commit('registerCoach', {
            ...coachData,
            id: userId
        })
    },
    async loadCoaches(context, payload) {

        if(!payload.forceRefresh && !context.getters.shouldUpdate) return;

        const response = await fetch(`https://crown-db-3b7f9.firebaseio.com/coaches.json`);

        const responseData = await response.json();

        if(!response.ok) {
            const err = new Error(responseData.message || 'Failed to fetch')
            throw err;
        }

        const coaches = [];

        for(const key in responseData) {
            const coach = {
                id: key,
                firstName: responseData[key].firstName,
                lastName: responseData[key].lastName,
                description: responseData[key].description,
                hourlyRate: responseData[key].hourlyRate,
                areas: responseData[key].areas
            }

            coaches.push(coach);
        }
        context.commit('setCoaches', coaches)
        context.commit('setFetchTimeStamp');
    }
}