<template>
  <div class="home">
    <h1>The Happy Body Tools (unofficial)</h1>
    <h2>Exercise Weight Calculator</h2>
    <p>
      The following is an exercise weight calculator for the Happy Body Program. Despite the percentages seeming simple
      at first, I found it takes quite a bit of mental work to remember whether 100% is for one dumbbells or two (it's
      for one), which exercise use two dumbbells, which use one, and how many dumbbells and at what weights do I
      actually need.
    </p>
    <p>
      This simple calculator aims to make answering those questions easy. Just enter your starting 100% weight, for
      Sequence 1, Exercise 1 (1:1), and the rest will automatically be calulated for you.
    </p>

    <div class="base-weight-wrap">
      <div>
        <label for="base-weight">100% starting weight for one dumbbell: </label>
      </div>
      <div><input id="base-weight" v-model="baseWeight" type="number" />{{ unit }}</div>
    </div>

    <div class="unit-controls">
      <button class="button" :class="{ active: unit === 'lb' }" @click="unit = 'lb'">lb</button>
      <button class="button" :class="{ active: unit === 'kg' }" @click="unit = 'kg'">kg</button>
    </div>

    <table class="exercises-table">
      <thead>
        <tr>
          <th class="th-row">Sequence</th>
          <th class="th-col" colspan="6">Exercises</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th class="th-row th-big">1</th>
          <td>
            <div>1</div>
            <div>100%</div>
            <div>
              <img class="dumbbell" src="@/assets/dumbbell.svg" alt="" />&nbsp;
              <img class="dumbbell" src="@/assets/dumbbell.svg" alt="" />
            </div>
            <div>{{ weight() }} - {{ weight() }}</div>
          </td>
          <td>
            <div>2</div>
            <div>na</div>
          </td>
          <td>
            <div>3</div>
            <div>na</div>
          </td>
          <td>
            <div>4</div>
            <div>150%</div>
            <div>
              <img class="dumbbell" src="@/assets/dumbbell.svg" alt="" />
            </div>
            <div>{{ weight(1.5) }}</div>
          </td>
          <td>
            <div>5</div>
            <div>200%</div>
            <div>
              <img class="dumbbell" src="@/assets/dumbbell.svg" alt="" />
            </div>
            <div>{{ weight(2) }}</div>
          </td>
          <td>
            <div>5</div>
            <div>150%</div>
            <div>
              <img class="dumbbell" src="@/assets/dumbbell.svg" alt="" />&nbsp;
              <img class="dumbbell" src="@/assets/dumbbell.svg" alt="" />
            </div>
            <div>{{ weight(1.5) }} - {{ weight(1.5) }}</div>
          </td>
        </tr>
        <tr>
          <th class="th-row th-big">2</th>
          <td>
            <div>1</div>
            <div>50%</div>
            <div>
              <img class="dumbbell" src="@/assets/dumbbell.svg" alt="" />&nbsp;
              <img class="dumbbell" src="@/assets/dumbbell.svg" alt="" />
            </div>
            <div>{{ weight(0.5) }} - {{ weight(0.5) }}</div>
          </td>
          <td>
            <div>2</div>
            <div>na</div>
          </td>
          <td>
            <div>3</div>
            <div>na</div>
          </td>
          <td>
            <div>4</div>
            <div>200%</div>
            <div>
              <img class="dumbbell" src="@/assets/dumbbell.svg" alt="" />
            </div>
            <div>{{ weight(2) }}</div>
          </td>
          <td>
            <div>5</div>
            <div>100%</div>
            <div>
              <img class="dumbbell" src="@/assets/dumbbell.svg" alt="" />&nbsp;
              <img class="dumbbell" src="@/assets/dumbbell.svg" alt="" />
            </div>
            <div>{{ weight() }} - {{ weight() }}</div>
          </td>
          <td>
            <div>6</div>
            <div>150%</div>
            <div>
              <img class="dumbbell" src="@/assets/dumbbell.svg" alt="" />&nbsp;
              <img class="dumbbell" src="@/assets/dumbbell.svg" alt="" />
            </div>
            <div>{{ weight(1.5) }} - {{ weight(1.5) }}</div>
          </td>
        </tr>
        <tr>
          <th class="th-row th-big">3</th>
          <td>
            <div>1</div>
            <div>150%</div>
            <div>
              <img class="dumbbell" src="@/assets/dumbbell.svg" alt="" />
            </div>
            <div>{{ weight(1.5) }}</div>
          </td>
          <td>
            <div>2</div>
            <div>na</div>
          </td>
          <td>
            <div>3</div>
            <div>na</div>
          </td>
          <td>
            <div>4</div>
            <div>50%</div>
            <div>
              <img class="dumbbell" src="@/assets/dumbbell.svg" alt="" />&nbsp;
              <img class="dumbbell" src="@/assets/dumbbell.svg" alt="" />
            </div>
            <div>{{ weight(0.5) }} - {{ weight(0.5) }}</div>
          </td>
          <td>
            <div>5</div>
            <div>100%</div>
            <div>
              <img class="dumbbell" src="@/assets/dumbbell.svg" alt="" />&nbsp;
              <img class="dumbbell" src="@/assets/dumbbell.svg" alt="" />
            </div>
            <div>{{ weight() }} - {{ weight() }}</div>
          </td>
          <td>
            <div>6</div>
            <div>150%</div>
            <div>
              <img class="dumbbell" src="@/assets/dumbbell.svg" alt="" />&nbsp;
              <img class="dumbbell" src="@/assets/dumbbell.svg" alt="" />
            </div>
            <div>{{ weight(1.5) }} - {{ weight(1.5) }}</div>
          </td>
        </tr>
      </tbody>
    </table>

    <div>
      <h2>Required Dumbbells</h2>
      <ul class="dumbbells">
        <li>2 &times; {{ weight(0.5) }}</li>
        <li>2 &times; {{ weight() }}</li>
        <li>2 &times; {{ weight(1.5) }}</li>
        <li>1 &times; {{ weight(2) }}</li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Home extends Vue {
  baseWeight = 5;
  unit = "lb";

  weight(multipdiver = 1) {
    return `${this.baseWeight * multipdiver}${this.unit}`;
  }
}
</script>

<style lang="scss">
.home {
  margin: 0 auto;
  max-width: 800px;
}
.base-weight-wrap {
  margin-bottom: 1em;
}

.unit-controls {
  margin-bottom: 1em;
}

.button {
  cursor: pointer;

  &.active {
    background: var(--color-heading);
    color: #fff;
  }
}

.exercises-table {
  border-collapse: collapse;
  font-family: sans-serif;
  margin: 0 auto;

  th {
    text-transform: uppercase;
  }

  th,
  td {
    padding: 0.5rem;
    width: calc(100% / 7);
  }

  td {
    font-weight: bold;
  }

  td:nth-child(2n) {
    background: var(--color-td-bg-a);
  }

  td:nth-child(2n + 1) {
    background: var(--color-td-bg-b);
    color: #fff;
  }

  tbody {
    th,
    td {
      border-bottom: 4px solid #fff;
    }
  }
}

.th-row {
  background: var(--color-th-bg-row);
  color: #ddd;
}

.th-big {
  font-size: 4em;
  font-weight: normal;
}

.th-col {
  background: var(--color-th-bg-col);
  color: #ddd;
  letter-spacing: 3px;
}

.dumbbells {
  list-style: none;
  margin: 0;
  padding: 0;

  li {
    margin-bottom: 0.5em;
  }
}

.dumbbell {
  width: 30px;
}
</style>
