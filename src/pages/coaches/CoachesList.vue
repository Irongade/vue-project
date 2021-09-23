<template>
    <div>
        <base-dialog :show="!!error" title="'An error occurred" @close="handleError">
            <p> {{error}} </p>
        </base-dialog>
        <section>
            <coach-filter @change-filter="setFilters"></coach-filter>
        </section>
        <section>
            <base-card>
                <div class="controls">
                    <base-button mode="outline" @click="loadCoaches">Refresh</base-button>
                    <base-button link to="/auth?redirect=register" v-if="!isLoggedIn">Login to Register as Coach</base-button>
                    <base-button v-if="isLoggedIn && !isCoach && !isLoading" link to="/register">Register as Coach</base-button>
                </div>
                <div v-if="isLoading">
                    <base-spinner></base-spinner>
                </div>
                <ul v-else-if="!isLoading && hasCoaches">
                    <coach-item 
                        v-for="coach in filteredCoaches" 
                        :key="coach.id" 
                        :id="coach.id"
                        :first-name="coach.firstName"
                        :last-name="coach.lastName"
                        :rate="coach.hourlyRate"
                        :areas="coach.areas"
                    ></coach-item>
                </ul>
                <h3 v-else> No coaches found </h3>
            </base-card>
        </section>
    </div>
</template>


<script>
import CoachItem from '../../components/coaches/CoachItem.vue';
import CoachFilter from '../../components/coaches/CoachFilter.vue';
import BaseButton from '../../components/ui/BaseButton.vue';

export default {
    data() {
        return {
            activeFilters: {
                frontend: true,
                backend: true,
                career: true
            },
            isLoading: false,
            error: null
        }
    },
    components: {
        CoachItem,
        CoachFilter,
        BaseButton
    },
    computed: {
        isLoggedIn() {
            return this.$store.getters.isAuthenticated;
        },
        filteredCoaches() {
            const coaches = this.$store.getters['coaches/coaches'];
            return coaches.filter(coach => {
                if(this.activeFilters.frontend && coach.areas.includes('frontend')) {
                    return true;
                }
                if(this.activeFilters.backend && coach.areas.includes('backend')) {
                    return true;
                }
                if(this.activeFilters.career && coach.areas.includes('career')) {
                    return true;
                }
                return false
            })
        } ,
        hasCoaches() {
            return this.$store.getters['coaches/hasCoaches']
        },
        isCoach() {
            return this.$store.getters['coaches/isCoach']
        }
    },
    created(){
        // this.$store.dispatch('coaches/loadCoaches', {forceRefresh: false})
        this.loadCoaches(false)
    },
    methods: {
        setFilters(updatedFilters) {
            this.activeFilters = updatedFilters;
        },
        async loadCoaches(refresh = true) {
            this.isLoading = true;

            try {
                await this.$store.dispatch('coaches/loadCoaches', {forceRefresh: refresh});
            }catch(err) {
                this.error = err.message || 'Something went wrong'
            }
            this.isLoading = false
        },
        handleError() {
            this.error = null;
        }
    }
}
</script>

<style scoped>
ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.controls {
  display: flex;
  justify-content: space-between;
}
</style>