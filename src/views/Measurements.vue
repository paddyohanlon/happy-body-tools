<template>
  <div>
    <div v-if="user && measurements.length > 0">
      <h1>Measurements</h1>

      <!-- Stats -->
      <div class="card">
        <ul>
          <li>Current weight: {{ measurements[0].weight }}{{ kg }}</li>
          <li>Goal weight total: {{ user.goalWeight.toFixed(2) }}{{ kg }}</li>
          <li>Goal weight fat: {{ this.goalWeightFat.toFixed(2) }}{{ kg }} (10%)</li>
          <li>Goal weight muscle: {{ muscleWeightGoal.toFixed(2) }}{{ kg }} (90%)</li>
          <li>
            Fat to lose: {{ fatWeightToLose.toFixed(2) }}{{ kg }} (weeks remaining: {{ weeksToFatGoal.toFixed(2) }})
          </li>
          <li>
            Muscle to gain: {{ muscleWeightToGain.toFixed(2) }}{{ kg }} (weeks remaining:
            {{ weeksToMuscleGoal.toFixed(2) }})
          </li>
        </ul>
      </div>

      <!-- Form -->
      <div class="card">
        <form @submit.prevent="saveMeasurement">
          <div>
            Body Weight: <input id="body-weight" v-model.number="newMeasurement.weight" type="number" step="0.01" />{{
              kg
            }}
          </div>
          <div>Chest: <input id="size-chest" v-model.number="newMeasurement.chest" type="number" step="0.01" />cm</div>
          <div>Belly: <input id="size-belly" v-model.number="newMeasurement.belly" type="number" step="0.01" />cm</div>
          <div>Thigh: <input id="size-thigh" v-model.number="newMeasurement.thigh" type="number" step="0.01" />cm</div>
          <button>Save</button>
        </form>
      </div>

      <!-- Measurements -->
      <div class="card">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Weight</th>
              <th>Size</th>
              <th>Fat</th>
              <th>Muscle</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="measurement in measurements" :key="measurement.id">
              <td>{{ new Date(measurement.date).toLocaleDateString() }}</td>
              <td>{{ measurement.weight }}{{ kg }}</td>
              <td>{{ sizeTotal(measurement).toFixed(2) }}cm</td>
              <td>{{ fatPercent(measurement) * 100 }}% ({{ fatWeight(measurement).toFixed(2) }}{{ kg }})</td>
              <td>{{ (1 - fatPercent(measurement)) * 100 }}% ({{ muscleWeight(measurement).toFixed(2) }}{{ kg }})</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div v-else>
      Loading...
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import axios from "axios";
axios.defaults.headers.post["Content-Type"] = "application/json";

type User = {
  id: string;
  goalWeight: number;
};

type Measurement = {
  id: string;
  userId: string;
  date: string; // date ISO
  weight: number;
  chest: number;
  belly: number;
  thigh: number;
};

@Component
export default class Measurements extends Vue {
  async created() {
    // get goal weight
    try {
      const response = await axios.get(`${this.apiURL}/users/${this.userId}`);
      this.user = response.data;
    } catch (error) {
      console.error(error);
    }

    // get measurements
    try {
      const response = await axios.get(`${this.apiURL}/users/${this.userId}/measurements`);
      this.measurements = response.data;
    } catch (error) {
      console.error(error);
    }
  }

  user: User = {
    id: "0",
    goalWeight: 0,
  };

  userId = "1";

  measurements: Measurement[] = [];

  initialNewMeasurement: Measurement = {
    id: "",
    userId: this.userId,
    date: new Date().toISOString(),
    weight: 0,
    chest: 0,
    belly: 0,
    thigh: 0,
  };

  newMeasurement: Measurement = this.initialNewMeasurement;

  kg = "kg";
  lb = "lb";
  cm = "cm";
  inch = "'";

  kgInLb = 2.204623;
  cmInInch = 0.3937;

  fatLossPerWeekRate = 0.795454;
  muscleGainPerWeekRate = 0.1587573;

  get apiURL() {
    return process.env.NODE_ENV === "development" ? "http://localhost:3000/api/v1" : "/api/v1";
  }

  get goalWeightFat() {
    return this.user.goalWeight * 0.1;
  }

  get muscleWeightGoal() {
    return this.user.goalWeight * 0.9;
  }

  get fatWeightToLose() {
    return this.fatWeight(this.measurements[0]) - this.goalWeightFat;
  }

  get weeksToFatGoal() {
    return this.fatWeightToLose / this.fatLossPerWeekRate;
  }

  get muscleWeightToGain() {
    return this.muscleWeightGoal - this.muscleWeight(this.measurements[0]);
  }

  get weeksToMuscleGoal() {
    return this.muscleWeightToGain / this.muscleGainPerWeekRate;
  }

  async saveMeasurement() {
    console.log("m", this.newMeasurement);
    try {
      const response = await axios.post(`${this.apiURL}/users/${this.userId}/measurements`, this.newMeasurement);
      console.log(response.data);
      this.measurements.unshift(this.newMeasurement);
      this.newMeasurement = Object.assign({}, this.initialNewMeasurement);
    } catch (error) {
      console.error("Error:", error.response.data.message);
    }
  }

  sizeTotal(measurement: Measurement): number {
    return measurement.chest + measurement.belly + measurement.thigh;
  }

  fatPercent(measurement: Measurement): number {
    const sizeTotal = this.sizeTotal(measurement);
    /*
      1 3/16'  = 1.1875' = 3.01625cm = 10%
      1 3/8'   = 1.375'  = 3.4925cm  = 11%
      1 9/16'  = 1.5625' = 3.96875cm = 12%
      1 3/4'   = 1.75'   = 4.445cm   = 13.5%
      2'       = 2'      = 5.08cm    = 15%
    */
    if (sizeTotal <= 3.01625) return 0.1;
    if (sizeTotal <= 3.4925) return 0.11;
    if (sizeTotal <= 3.96875) return 0.12;
    if (sizeTotal <= 4.445) return 0.13;
    if (sizeTotal <= 5.08) return 0.15;
    return 16.5; // or more
  }

  fatWeight(measurement: Measurement) {
    return this.fatPercent(measurement) * measurement.weight;
  }

  muscleWeight(measurement: Measurement) {
    return measurement.weight - this.fatWeight(measurement);
  }
}
</script>

<style scoped lang="scss">
.card {
  padding: 1em;
  border: 1px solid var(--color-heading);
  margin-bottom: 1em;
}
</style>
