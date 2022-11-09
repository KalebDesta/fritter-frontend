<!--Default page that displays the hashtag page that can also be subscribed to-->
<template>
    <main>
        <header class="hashtag">
            <h2>{{ $route.params.tag }}</h2>
            <button id="sub" v-if="!this.subscribed" @click="subscribe">Subscribe</button>
            <button v-if="this.subscribed" @click="unsubscribe">Unsubscribe</button>
        </header>
        <section>
            <h3>Freets that contain: {{ $route.params.tag }}</h3>
            <FreetComponent v-for="freet in this.freets"
            :key="freet['freet'].id"
            :freet="freet['freet']"
            :tags="freet['tags']"/>
        </section>
    </main>
</template>

<script>
import FreetComponent from '@/components/Freet/FreetComponent.vue';

export default {
    name: 'HashtagPage',
    components: {FreetComponent},
    async mounted() {
        this.tag = this.$route.params.tag;
        this.$store.commit('refreshSubscriptions');
        this.subscribed = this.$store.state.subscribed.includes(this.tag);
        this.freets = [] 
        const res = await fetch(`/api/hashtags?tagname=${this.$route.params.tag}`,{
                method: 'GET',
                credentials: 'same-origin'}).then(async r => r.json());
        for ( const freet of res ){
            const tags = await fetch(`/api/hashtags?freetId=${freet._id}`).then(async r => r.json());
            this.freets.push({freet:freet, tags:tags});
        }
    },
    data() {
        return {
            tag: this.$route.params.tag,
            subscribed: this.$store.state.subscribed.includes(this.$route.params.tag),
            //this.$store.getters.isSubscribed(this.$route.params.tag)
            freets: []
        };
    },
    methods: {
        // async fetchData() {
        //     await fetch(`/api/hashtags?tagname=${this.$route.params.tag}`,{
        //         method: 'GET',
        //         credentials: 'same-origin',
        //     }).then(async r => r.json())
              
            
        // },
        async subscribe() {
            this.subscribed = true;
            const options = {
                method: 'POST',
                message: 'Successfully subscribed!',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'same-origin',
                body: JSON.stringify({ tagname: this.tag }),
                callback: () => {
                    this.$set(this.alerts, params.message, 'success');
                    setTimeout(() => this.$delete(this.alerts, params.message), 3000);
                    this.$store.commit('refreshSubscriptions');
                }
            };
            try {
                const r = await fetch("/api/subscribe", options);
                if (!r.ok) {
                    // If response is not okay, we throw an error and enter the catch block
                    const res = await r.json();
                    throw new Error(res.error);
                }
                const res = await r.json();
                this.$store.commit('refreshSubscriptions');
            } catch (e) {
                this.$set(this.alerts, e, 'error');
                setTimeout(() => this.$delete(this.alerts, e), 3000);
            }
        },
        async unsubscribe() {
            if (confirm("Are you sure you want to stop your subscription?")) {
                this.subscribed = false;
                const params = {
                    method: 'DELETE',
                    callback: () => {
                        this.$store.commit('alert', {
                            message: 'Successfully deleted freet!', status: 'success'
                        });
                        this.$store.commit('refreshSubscriptions');
                    }
                };
                try {
                    const r = await fetch(`/api/subscribe/${this.tag}`, params);
                    if (!r.ok) {
                        // If response is not okay, we throw an error and enter the catch block
                        const res = await r.json();
                        throw new Error(res.error);
                    }
                    const res = await r.json();
                    this.$store.commit('refreshSubscriptions');
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
.hashtag{
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