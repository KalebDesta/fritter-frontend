<template>
    <main>
        <h3>Mute Topics</h3>
        <vue-tags-input v-model="tag" :tags="tags" @tags-changed="newTags => tags = newTags" />
        <button @click="submit">Mute Topics</button>
        <div >
            <header>
                <h2>Muted Topics</h2>
            </header>
            <ul class="muted">
                <li class="elem" v-for="mutedTopic of this.$store.state.mutedTopics" >
                    <h4 class>{{ mutedTopic, text }}</h4>
                    <button @click="remove(mutedTopic)">unmute</button>
                </li>
            </ul>
        </div>
    </main>
</template>   

<script>
import Vue from 'vue';
import VueTagsInput from '@johmun/vue-tags-input';


export default {
    name: 'muteTopics',
    mounted() {
        this.$store.commit('refreshMuted');
    },
    data() {
        return {
            tag: '',
            tags: [],
        }
    },
    methods: {
        async submit() {

            for (const topic of this.tags) {
                if (!(topic.text in this.$store.state.mutedTopics)) {
                    const options = {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'same-origin',
                        body: JSON.stringify({ topic: topic.text }),
                        callback: () => {
                            this.$store.commit('refreshMuted');
                        }
                    }
                    try {
                        const r = await fetch("/api/mute-topics", options);
                        if (!r.ok) {
                            // If response is not okay, we throw an error and enter the catch block
                            const res = await r.json();
                            throw new Error(res.error);
                        }
                        const res = await r.json();
                        this.$store.commit('refreshMuted');
                    } catch (e) {
                        this.$set(this.alerts, e, 'error');
                        setTimeout(() => this.$delete(this.alerts, e), 3000);
                    }

                }

            }
            this.tags = []
        },
        async remove(topic) {
            if (confirm(`Are you sure you want to unmute ${topic}?`)) {
                const params = {
                    method: 'DELETE',
                    callback: () => {
                        this.$store.commit('alert', {
                            message: 'Successfully unmuted!', status: 'success'
                        });
                        this.$store.commit('refreshMuted');
                    }
                };
                try {
                    const r = await fetch(`/api/mute-topics/${topic}`, params);
                    if (!r.ok) {
                        // If response is not okay, we throw an error and enter the catch block
                        const res = await r.json();
                        throw new Error(res.error);
                    }
                    const res = await r.json();
                    this.$store.commit('refreshMuted');
                } catch (e) {
                    this.$set(this.alerts, e, 'error');
                    setTimeout(() => this.$delete(this.alerts, e), 3000);
                    this.$store.commit('refreshMuted');
                }
            }
        }

    }

}
</script>

<style>
.muted{
  border: 1px solid #111;
  padding: 10px 24px;
  border-radius: 22px;
  width: 80%;
}
.elem{
  display: grid;
  grid-template-columns: 0.5fr 0.5fr 0.5fr; 
}
button{
  border: 1px solid #111;
  padding: 10px 24px;
  border-radius: 22px;
  font-size: 17px;
  color: white;
  background-color:#001e1e;
}
</style>