<template>
  <div id="app">
    <ul class="nav">
      <li><router-link :to="{ name: 'home' }">Weights</router-link></li>
      <li><router-link :to="{ name: 'measurements' }">Measurements</router-link></li>
    </ul>
    <router-view />
    <p class="footer">
      Created by Paddy. The project is on <a href="https://github.com/paddyohanlon/happy-body-tools">GitHub</a>.
    </p>
  </div>
</template>

<style lang="scss">
@import "~normalize.css/normalize.css";

:root {
  --color-heading: #504d40;
  --color-th-bg-col: #5f5e5c;
  --color-th-bg-row: #808080;
  --color-td-bg-a: #aaa9a9;
  --color-td-bg-b: #6c6b64;
}

body {
  color: #333;
  font-family: georgia, serif;
  padding: 1em;
  text-align: center;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  color: var(--color-heading);
  font-family: sans-serif;
}

.footer {
  border-top: 1px solid var(--color-heading);
  margin-top: 2em;
  padding-top: 2em;
}

.nav {
  list-style: none;
}
</style>
