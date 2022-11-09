<!-- Form for creating freets (block style) -->
<template>
  <form @submit.prevent="submit">
    <h3>{{title}}</h3>
    <textarea v-model="content"></textarea>
    <v-select label="label" :options="anonymityOptions" :reduce="(option) => option.value" v-model="anonymousTo">
    </v-select>
    <vue-tags-input
      v-model="tag"
      :tags="tags"
      @tags-changed="newTags => tags = newTags"
    />
    <button type="submit">Create Freet</button>
  </form>

</template>


<script>
// import BlockForm from '@/components/common/BlockForm.vue';
import Vue from 'vue';
import vSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';
import VueTagsInput from '@johmun/vue-tags-input';

Vue.component('v-select', vSelect)

export default {
  name: 'CreateFreetForm',
  components: {
    VueTagsInput,
  },
  data() {
    return {
      content: '',
      anonymousTo:'',
      anonymityOptions : [
        {label:"Not Anonymous(None)",
         value:"None"},
        {label:"Followers",
         value:"Followers"},
        {label:"Non-Followers",
        value:"NonFollowers"},
        {label:"Everyone",
        value:"All"
        }
      ],
      tag: '',
      tags: [],
      title: 'Create a freet',
      callback: () => {
        const message = 'Successfully created a freet!';
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  },
  methods: {
    async submit(){
      const options = {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        credentials: 'same-origin', // Sends express-session credentials with request
        body: JSON.stringify({
          content: this.content,
          anonymousTo: this.anonymousTo
        })
      }
      try {
        console.log("creating freet")
        const r = await fetch("/api/freets", options);
        if (!r.ok) {
          // If response is not okay, we throw an error and enter the catch block
          const res = await r.json();
          throw new Error(res.error);
        }
        const res = await r.json();
        for (const tag of this.tags){
          const options = {
          method: "POST",
          headers: {'Content-Type': 'application/json'},
          credentials: 'same-origin', // Sends express-session credentials with request
          body: JSON.stringify({
            freetId: res.freet._id,
            tagname: tag.text
          })
          }
          const response = await fetch("/api/hashtags", options);
          if (!response.ok){
            const otherResponse = await response.json();
            throw new Error(otherResponse.error);
          }
        }
        this.$store.commit('refreshFreets');
      } catch (e) {
          this.$set(this.alerts, e, 'error');
          setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  }
}
</script>
<style>
textarea{
  font-size: 16px;
  font-size: max(17px, 1.1em);
  font-family: inherit;
  color: inherit;
  padding: 0.25em 0.5em;
  background-color: #ffffff;
  border: 2px solid var black;
  border-radius: 4px;
  width: 80%;
  height: 150px;
  box-sizing: border-box;
  resize: vertical;
}
h3{
  font-size: 40px;
}
</style>