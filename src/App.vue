<template>
  <div id="app">
    <!-- Start navbar -->
    <nav class="navbar" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <a class="navbar-item" href="/">The Happy Body Tracker</a>

        <a
          role="button"
          class="navbar-burger"
          :class="{ 'is-active': isActive }"
          aria-label="menu"
          aria-expanded="false"
          data-target="nav"
          @click="isActive = !isActive"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div id="nav" class="navbar-menu" :class="{ 'is-active': isActive }">
        <div class="navbar-start">
          <router-link :to="{ name: 'home' }" class="navbar-item">Weights</router-link>
          <router-link :to="{ name: 'measurements' }" class="navbar-item">Measurements</router-link>
          <router-link :to="{ name: 'profile' }" class="navbar-item">Profile</router-link>
        </div>

        <div class="navbar-end">
          <div class="navbar-item">
            <div class="buttons">
              <a class="button is-primary">
                <strong>Sign up</strong>
              </a>
              <a class="button is-light">
                Log in
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
    <!-- End navbar -->
    <section class="section">
      <router-view class="container" />
    </section>
    <footer class="footer">
      <div class="content has-text-centered">
        Created by Paddy. The project is on <a href="https://github.com/paddyohanlon/happy-body-tools">GitHub</a>.
      </div>
    </footer>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class App extends Vue {
  isActive = false;
}
</script>

<style lang="scss">
@import "~normalize.css/normalize.css";

// Global variables loaded via config in vue.config.js

@import "~bulma/bulma.sass";
// @import "~bulma/sass/utilities/_all.sass";
// @import "~bulma/sass/base/_all.sass";
// @import "~bulma/sass/elements/button.sass";
// @import "~bulma/sass/elements/container.sass";
// @import "~bulma/sass/elements/title.sass";
// @import "~bulma/sass/form/_all.sass";
// @import "bulma/sass/grid/columns.sass";
// @import "~bulma/sass/components/navbar.sass";
// @import "~bulma/sass/components/card.sass";
// @import "~bulma/sass/layout/hero.sass";
// @import "~bulma/sass/layout/section.sass";

.navbar-brand {
  font-weight: bold;
}

body {
  background: #e3f2f6;
  // font-family: georgia, serif;
  // padding: 1em;
}

// h1,
// h2,
// h3,
// h4,
// h5,
// h6 {
//   color: var(--color-heading);
//   font-family: sans-serif;
// }

// th {
//   text-align: left;
// }

// th,
// td {
//   padding: 0.5em;
// }

// .footer {
//   border-top: 1px solid var(--color-heading);
//   margin-top: 2em;
//   padding-top: 2em;
// }

// .nav {
//   list-style: none;
// }
</style>
