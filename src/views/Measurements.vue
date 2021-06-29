<template>
  <div>
    <div v-if="user.id != 0 && measurements.length > 0">
      <h1 class="title is-1">Measurements</h1>

      <div class="level">
        <!-- item -->
        <div class="level-item has-text-centered">
          <div>
            <div class="heading">current/ideal weight</div>
            <div class="title">{{ measurements[0].weight }}/{{ user.idealWeight.toFixed(1) }}kg</div>
          </div>
        </div>
        <!-- item -->
        <div class="level-item has-text-centered">
          <div>
            <div class="heading">current/ideal muscle</div>
            <div class="title">
              {{ muscleWeight(measurements[0]).toFixed(2) }}/{{ idealWeightMuscle.toFixed(2) }}kg (90%)
            </div>
          </div>
        </div>
        <!-- item -->
        <div class="level-item has-text-centered">
          <div>
            <div class="heading">current/ideal muscle %</div>
            <div class="title">{{ ((1 - fatPercent(measurements[0])) * 100).toFixed() }}/90%</div>
          </div>
        </div>
        <!-- item -->
        <div class="level-item has-text-centered">
          <div>
            <div class="heading">current/ideal fat weight</div>
            <div class="title">{{ fatWeight(measurements[0]).toFixed(2) }}/{{ this.idealWeightFat.toFixed(2) }}kg</div>
          </div>
        </div>
        <!-- item -->
        <div class="level-item has-text-centered">
          <div>
            <div class="heading">current/ideal fat %</div>
            <div class="title">{{ (fatPercent(measurements[0]) * 100).toFixed() }}/10%</div>
          </div>
        </div>
      </div>

      <div class="level">
        <!-- item -->
        <div class="level-item has-text-centered">
          <div>
            <div class="heading">weight to gain</div>
            <div class="title">{{ weightToGain.toFixed(2) }}kg</div>
          </div>
        </div>
        <!-- item -->
        <div class="level-item has-text-centered">
          <div>
            <div class="heading">fat to lose</div>
            <div class="title">{{ fatWeightToLose.toFixed(2) }}kg</div>
            <div class="is-size-7">weeks remaining: {{ weeksToIdealFat.toFixed(2) }}</div>
          </div>
        </div>
        <!-- item -->
        <div class="level-item has-text-centered">
          <div>
            <div class="heading">muscle to gain</div>
            <div class="title">{{ muscleWeightToGain.toFixed(2) }}kg</div>
            <div class="is-size-7">weeks remaining: {{ weeksToIdealMuscle.toFixed(2) }}</div>
          </div>
        </div>
      </div>

      <!-- Measurements -->
      <div class="card mb-4" v-if="measurements.length > 0">
        <div class="card-content">
          <div class="content">
            <div class="table-container">
              <table class="table">
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
                    <td>{{ measurement.weight }}kg</td>
                    <td>{{ sizeTotal(measurement).toFixed(2) }}cm</td>
                    <td>{{ fatPercent(measurement) * 100 }}% ({{ fatWeight(measurement).toFixed(2) }}kg)</td>
                    <td>{{ (1 - fatPercent(measurement)) * 100 }}% ({{ muscleWeight(measurement).toFixed(2) }}kg)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- Form -->
      <div class="card mb-4">
        <div class="card-content">
          <div class="content">
            <form @submit.prevent="saveMeasurement">
              <div class="field">
                <label class="label" for="body-weight">Body weight (kg)</label>
                <div class="control">
                  <input
                    id="body-weight"
                    v-model.number="measurementNew.weight"
                    class="input"
                    type="number"
                    step="0.01"
                  />
                </div>
              </div>
              <div class="field">
                <label class="label" for="size-chest">Chest (cm)</label>
                <div class="control">
                  <input
                    id="size-chest"
                    v-model.number="measurementNew.chest"
                    class="input"
                    type="number"
                    step="0.01"
                  />
                </div>
              </div>
              <div class="field">
                <label class="label" for="size-belly">Belly (cm)</label>
                <div class="control">
                  <input
                    id="size-belly"
                    v-model.number="measurementNew.belly"
                    class="input"
                    type="number"
                    step="0.01"
                  />
                </div>
              </div>
              <div class="field">
                <label class="label" for="size-thigh">Thigh (cm)</label>
                <div class="control">
                  <input
                    id="size-thigh"
                    v-model.number="measurementNew.thigh"
                    class="input"
                    type="number"
                    step="0.01"
                  />
                </div>
              </div>
              <button class="button">Save</button>
            </form>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      Loading...
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { User, Measurement } from "@/types/types";
import axios from "axios";
axios.defaults.headers.post["Content-Type"] = "application/json";

@Component
export default class Measurements extends Vue {
  async created() {
    // get user
    try {
      const response = await axios.get(`${this.apiURL}/users/${this.userId}`);
      this.user = response.data;
      console.log("user", this.user);
    } catch (error) {
      console.error(error);
    }

    // get measurements
    try {
      const response = await axios.get(`${this.apiURL}/users/${this.userId}/measurements`);
      this.measurements = response.data;
      console.log("measurements", this.measurements);
    } catch (error) {
      console.error(error);
    }
  }

  user: User = {
    id: "0",
    idealWeight: 0,
    height: 0,
  };

  userId = "1";

  measurements: Measurement[] = [];

  measurementNewInitial: Measurement = {
    id: "",
    userId: this.userId,
    date: new Date().toISOString(),
    weight: 0,
    chest: 0,
    belly: 0,
    thigh: 0,
  };

  measurementNew: Measurement = this.measurementNewInitial;

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

  get idealWeightFat() {
    return this.user.idealWeight * 0.1;
  }

  get idealWeightMuscle() {
    return this.user.idealWeight * 0.9;
  }

  get fatWeightToLose() {
    return this.fatWeight(this.measurements[0]) - this.idealWeightFat;
  }

  get weeksToIdealFat() {
    return this.fatWeightToLose / this.fatLossPerWeekRate;
  }

  get weightToGain() {
    return this.user.idealWeight - this.measurements[0].weight;
  }

  get muscleWeightToGain() {
    return this.idealWeightMuscle - this.muscleWeight(this.measurements[0]);
  }

  get weeksToIdealMuscle() {
    return this.muscleWeightToGain / this.muscleGainPerWeekRate;
  }

  async saveMeasurement() {
    console.log("m", this.measurementNew);
    try {
      const response = await axios.post(`${this.apiURL}/users/${this.userId}/measurements`, this.measurementNew);
      console.log(response.data);
      this.measurements.unshift(this.measurementNew);
      this.measurementNew = Object.assign({}, this.measurementNewInitial);
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

<style scoped lang="scss"></style>
