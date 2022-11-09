<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article
    class="freet"
  >
    <header>
      
        <h3 class="author">
          <router-link class = "nav-link" :event="this.clickable ? 'click' : ''"  :to="{ name: 'Profile', params: { user: freet.author }}">
            @{{ freet.author }}
        </router-link>
        </h3>
      <div
        v-if="$store.state.username === freet.author"
        class="actions"
      >
        <button
          v-if="editing"
          @click="submitEdit"
        >
          ✅ Save changes
        </button>
        <button
          v-if="editing"
          @click="stopEditing"
        >
          🚫 Discard changes
        </button>
        <button
          v-if="!editing"
          @click="startEditing"
        >
          ✏️ Edit
        </button>
        <button @click="deleteFreet">
          🗑️ Delete
        </button>
      </div>
    </header>
    <textarea
      v-if="editing"
      class="content"
      :value="draft"
      @input="draft = $event.target.value"
    />
    <v-select 
      v-if="editing" 
      label="label" 
      :options="anonymityOptions"
      :reduce="(option) => option.value"
      :value = 'anonymity'
      v-model = 'anonymity'
      ></v-select>
    <vue-tags-input
      v-if = "editing"
      v-model="tag"
      :tags="tags"
      @tags-changed="newTags => tags = newTags"
    />
    <p
      v-else
      class="content"
    >
      {{ freet.content }}
    </p>
    <p
      v-if = "!editing"
      class="anonymousTo">
      Anonymous to: {{freet.anonymousTo}}
    </p>
    <div id="tags">
      <template v-for = "tag in tags">
        <button @click="$router.push({ name:`Hashtags`, params : {tag} })" >{{tag}}</button>
      </template>
    </div>
    <p class="info">
      Posted at {{ freet.dateModified }}
      <i v-if="freet.edited">(edited)</i>
    </p>
    <section class="alerts">
      <article
        v-for="(status, alert, index) in alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
  </article>
</template>

<script>
import Vue from 'vue';
import vSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';
import VueTagsInput from '@johmun/vue-tags-input';

Vue.component('v-select', vSelect)

export default {
  name: 'FreetComponent',
  props: {
    // Data from the stored freet
    freet: {
      type: Object,
      required: true
    },
    tags:{
      type: Array,
      required: true
    }
  },
  data() {
    return {
      editing: false, // Whether or not this freet is in edit mode
      draft: this.freet.content, // Potentially-new content for this freet
      anonymity: this.freet.anonymousTo,
      clickable: this.freet.author !== 'Anonymous User',
      tag: '',
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
      alerts: {} // Displays success/error messages encountered during freet modification
    };
  },
  methods: {
    startEditing() {
      /**
       * Enables edit mode on this freet.
       */
      this.editing = true; // Keeps track of if a freet is being edited
      this.draft = this.freet.content; // The content of our current "draft" while being edited
      this.anonymity = this.freet.anonymousTo; //not sure if i should do this
    },
    stopEditing() {
      /**
       * Disables edit mode on this freet.
       */
      this.editing = false;
      this.draft = this.freet.content;
      this.anonymity = this.freet.anonymousTo; //not sure if i should do this
    },
    deleteFreet() {
      /**
       * Deletes this freet.
       */
      if(confirm("Are you sure you want to delete the Freet?")){
        const params = {
          method: 'DELETE',
          callback: () => {
            this.$store.commit('alert', {
              message: 'Successfully deleted freet!', status: 'success'
            });
          }
        };
        this.request(params);
      }
    },
    submitEdit() {
      /**
       * Updates freet to have the submitted draft content.
       */
      if (this.freet.content === this.draft && this.freet.anonymousTo === this.anonymity) {
        const error = 'Error: Edited freet should either contain different freet content or anonymity.';
        this.$set(this.alerts, error, 'error'); // Set an alert to be the error text, timeout of 3000 ms
        setTimeout(() => this.$delete(this.alerts, error), 3000);
        return;
      }
      if (this.freet.content !== this.draft){
        const params = {
        method: 'PATCH',
        message: 'Successfully edited freet!',
        body: JSON.stringify({content: this.draft}),
        callback: () => {
          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
          }
        };
        this.request(params);
      }
      if (this.freet.anonymousTo !== this.anonymity){
        if(confirm("Are you sure you want to modify the anonymity of this Freet")){
          const params = {
          method: 'PATCH',
          message: 'Successfully edited freet!',
          body: JSON.stringify({anonymousTo: this.anonymity}),
          callback: () => {
            this.$set(this.alerts, params.message, 'success');
            setTimeout(() => this.$delete(this.alerts, params.message), 3000);
            }
          };
          this.request(params);
        }
      }
    },
    async request(params) {
      /**
       * Submits a request to the freet's endpoint
       * @param params - Options for the request
       * @param params.body - Body for the request, if it exists
       * @param params.callback - Function to run if the the request succeeds
       */
      const options = {
        method: params.method, headers: {'Content-Type': 'application/json'}
      };
      if (params.body) {
        options.body = params.body;
      }

      try {
        const r = await fetch(`/api/freets/${this.freet._id}`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        this.editing = false;
        this.$store.commit('refreshFreets');

        params.callback();
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  }
};
</script>

<style scoped>
.freet {
    border: 1px solid rgb(255, 255, 255);
    padding: 20px;
    font-family: Arial, Helvetica, sans-serif;
    position: relative;
    color: #EDF5E1;
    background-color: #021e39;
    border-radius: 0.5em;
}
.nav-link {
  color: #b3feff;
  padding: 5px;
}

button {
  border: 1px solid #111;
  padding: 10px 24px;
  border-radius: 22px;
  font-size: 17px;
  background-color:#38b1b1;
}
</style>
