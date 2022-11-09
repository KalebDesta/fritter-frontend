<!--Default page that displays the Profile page that can also be followed -->
<template>
    <main>
        <header class="profile">
            <h2>{{ $route.params.user }}</h2>
            <button v-if="!this.followed && this.user !== this.$store.state.username" @click="follow">Follow</button>
            <button v-if="this.followed && this.user !== this.$store.state.username" @click="unfollow">Unfollow</button>
        </header>
        <section>
            <h3>Freets</h3>
            <FreetComponent v-for="freet in this.freets" 
                :key="freet['freet'].id" 
                :freet="freet['freet']"
                :tags="freet['tags']" />
        </section>
    </main>
</template>

<script>
import FreetComponent from '@/components/Freet/FreetComponent.vue';

export default {
    name: 'ProfilePage',
    components: {FreetComponent},
    async mounted() {
        this.user = this.$route.params.user;
        this.$store.commit('refreshFollowing');
        this.followed = this.$store.state.following.includes(this.user);
        //change to load data from user
        this.freets = [];
        const res = await fetch(`/api/freets?author=${this.$route.params.user}`,{
                method: 'GET',
                credentials: 'same-origin'}).then(async r => r.json());
        for ( const freet of res ){
            const tags = await fetch(`/api/hashtags?freetId=${freet._id}`).then(async r => r.json());
            this.freets.push({freet:freet, tags:tags});
        }
    },
    data() {
        return {
            user: this.$route.params.user,
            followed: this.$store.state.following.includes(this.$route.params.user),
            freets: []
        };
    },
    methods: {
        async follow() {
            this.followed = true;
            const options = {
                method: 'POST',
                message: 'Successfully followed!',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'same-origin',
                body: JSON.stringify({ username: this.user }),
                callback: () => {
                    this.$set(this.alerts, params.message, 'success');
                    setTimeout(() => this.$delete(this.alerts, params.message), 3000);
                    this.$store.commit('refreshFollowing');
                }
            };
            try {
                const r = await fetch("/api/follow", options);
                if (!r.ok) {
                    // If response is not okay, we throw an error and enter the catch block
                    const res = await r.json();
                    throw new Error(res.error);
                }
                const res = await r.json();
                this.$store.commit('refreshFollowing');
            } catch (e) {
                this.$set(this.alerts, e, 'error');
                setTimeout(() => this.$delete(this.alerts, e), 3000);
            }
        },
        async unfollow() {
            if (confirm(`Are you sure you want to unfollow ${this.user}?`)) {
                this.followed = false;
                const params = {
                    method: 'DELETE',
                    callback: () => {
                        this.$store.commit('alert', {
                            message: 'Successfully unfollowed!', status: 'success'
                        });
                        this.$store.commit('refreshFollowing');
                    }
                };
                try {
                    const r = await fetch(`/api/follow/${this.user}`, params);
                    if (!r.ok) {
                        // If response is not okay, we throw an error and enter the catch block
                        const res = await r.json();
                        throw new Error(res.error);
                    }
                    const res = await r.json();
                    this.$store.commit('refreshFollowing');
                } catch (e) {
                    this.$set(this.alerts, e, 'error');
                    setTimeout(() => this.$delete(this.alerts, e), 3000);
                }
            }
        }
    }
}

</script>

<style>
h2{
  font-size: 40px;
}
.profile{
  border: 1px solid #111;
  padding: 10px 24px;
  border-radius: 22px;
}
button {
  border: 1px solid #111;
  padding: 10px 24px;
  border-radius: 22px;
  font-size: 17px;
  color: white;
  background-color:#001e1e;
}
</style>