<!-- A basic navigation bar component -->
<!-- Example of a component which is included on all pages (via App.vue) -->
<!-- This navbar takes advantage of both flex and grid layouts for positioning elements; feel free to redesign as you see fit! -->

<template>
  <nav>
    <div class="left">
      <img src="../../public/logo.svg">
      <h1 class="title">
        Fritter
      </h1>
    </div>
    <div class="right">
      <router-link to="/">
        Home
      </router-link>
      <router-link 
      v-if="$store.state.username" 
        :to="`/profile/${$store.state.username}`">
        Profile
      </router-link>
      <router-link 
      v-if="$store.state.username" 
        to="/muteTopics"
        >
        Mute Topics
      </router-link>
      <router-link
        v-if="$store.state.username"
        to="/account"
      >
        Account
      </router-link>
      <router-link
        v-else
        to="/login"
      >
        Login
      </router-link>
    </div>
    <section class="alerts">
      <article
        v-for="(status, alert, index) in $store.state.alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
  </nav>
</template>

<style scoped>
nav {
    padding: 3vw 2vw;
    background-color: #5CDB95;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
}

.title {
    font-size: 40px;
    margin: 0 5px;
    font-family: Arial, Helvetica, sans-serif;
    color: #05386B
}

img {
    height: 40px;
}

.left {
	display: flex;
	align-items: center;
}

.right {
    font-size: 20px;
    display: grid;
    gap: 16px;
    grid-auto-flow: column;
    align-items: center;
    font-family: Arial, Helvetica, sans-serif;
    color: #05386B
}

.right a {
    margin-left: 5px;
}

.alerts {
    width: 25%;
}
</style>
