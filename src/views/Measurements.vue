<template>
  <div>
    <h1>Measurements</h1>

    <div>
      <label for="body-weight">Body Weight</label>
    </div>
    <div>
      <input id="body-weight" v-model="bodyWeight" type="number" />{{ kg }} ({{ bodyWeightLb.toFixed(2) }}{{ lb }})
    </div>

    <div>Chest: <input id="size-chest" v-model.number="sizeChest" type="number" />cm</div>
    <div>Belly: <input id="size-belly" v-model.number="sizeBelly" type="number" />cm</div>
    <div>Thigh: <input id="size-thigh" v-model.number="sizeThigh" type="number" />cm</div>
    <div>Total size: {{ sizeTotal.toFixed(2) }}{{ cm }} ({{ sizeTotalLb.toFixed(2) }}{{ inch }})</div>
    <div>Body fat: {{ fatPercent * 100 }}% ({{ fatWeight.toFixed(2) }}{{ kg }})</div>
    <div>Body muscle: {{ (1 - fatPercent) * 100 }}% ({{ muscleWeight.toFixed(2) }}{{ kg }})</div>
    <hr />
    <div>
      Goal weight: {{ goalWeight }}{{ kg }} (goal fat: {{ goalWeight * 0.1 }}{{ kg }} [10%] | goal muscle:
      {{ goalWeight * 0.9 }}{{ kg }} [90%])
    </div>
    <div>Fat to lose: {{ fatToLose.toFixed(2) }}{{ kg }} (Weeks left: {{ weeksToFatGoal.toFixed(2) }})</div>
    <div>Muscle to gain: {{ muscleToGain.toFixed(2) }}{{ kg }} (Weeks left: {{ weeksToMuscleGoal.toFixed(2) }})</div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Measurements extends Vue {
  goalWeight = 79.5;
  bodyWeight = 75.6;
  kg = "kg";
  lb = "lb";
  cm = "cm";
  inch = "'";

  kgInLb = 2.204623;
  cmInInch = 0.3937;

  sizeChest = 0.9;
  sizeBelly = 1.2;
  sizeThigh = 1;

  fatLossPerWeekRate = 0.795454;
  muscleGainPerWeekRate = 0.1587573;

  get bodyWeightLb() {
    return this.bodyWeight * this.kgInLb;
  }

  get sizeTotal() {
    return this.sizeChest + this.sizeBelly + this.sizeThigh;
  }

  get sizeTotalLb() {
    return this.sizeTotal * this.cmInInch;
  }

  get fatPercent() {
    /*
      1 3/16'  = 1.1875' = 3.01625cm = 10%
      1 3/8'   = 1.375'  = 3.4925cm  = 11%
      1 9/16'  = 1.5625' = 3.96875cm = 12%
      1 3/4'   = 1.75'   = 4.445cm   = 13.5%
      2'       = 2'      = 5.08cm    = 15%
    */
    if (this.sizeTotal <= 3.01625) return 0.1;
    if (this.sizeTotal <= 3.4925) return 0.11;
    if (this.sizeTotal <= 3.96875) return 0.12;
    if (this.sizeTotal <= 4.445) return 0.13;
    if (this.sizeTotal <= 5.08) return 0.15;
    return 16.5; // or more
  }

  get fatWeight() {
    return this.fatPercent * this.bodyWeight;
  }

  get muscleWeight() {
    return this.bodyWeight - this.fatWeight;
  }

  get fatWeightGoal() {
    return this.goalWeight * 0.1;
  }

  get muscleWeightGoal() {
    return this.goalWeight * 0.9;
  }

  get fatToLose() {
    return this.fatWeight - this.fatWeightGoal;
  }

  get weeksToFatGoal() {
    return this.fatToLose / this.fatLossPerWeekRate;
  }

  get muscleToGain() {
    return this.muscleWeightGoal - this.muscleWeight;
  }

  get weeksToMuscleGoal() {
    return this.muscleToGain / this.muscleGainPerWeekRate;
  }
}
</script>

<style scoped lang="scss"></style>
