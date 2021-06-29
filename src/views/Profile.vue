<template>
  <div>
    <!-- <div>Form</div>
    <div>Unit (US Customary [feet/inches/pounds]) or (Metric [meters/centimeters/kilograms])</div>
    <div>Height</div>
    <div>Gender</div> -->

    <div class="card mb-4">
      <div class="card-content">
        <div class="content">User: {{ user }}</div>
        <div class="content">New User: {{ userUpdated }}</div>
      </div>
    </div>

    <div class="card mb-4">
      <div class="card-content">
        <div class="content">
          <form @submit.prevent="saveUser">
            <div class="field">
              <label class="label" for="height">Height (cm)</label>
              <div class="control">
                <input id="height" v-model.number="userUpdated.height" class="input" type="number" />
              </div>
            </div>
            <!-- <div class="field">
              <label class="label" for="size-chest">Gender</label>
              <div class="control">
                <input id="size-chest" v-model.number="newMeasurement.chest" class="input" type="number" step="0.01" />
              </div>
            </div> -->
            <button class="button">Save</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { User } from "@/types/types";
import axios from "axios";
axios.defaults.headers.post["Content-Type"] = "application/json";

@Component
export default class Profile extends Vue {
  async created() {
    // get user
    try {
      const response = await axios.get(`${this.apiURL}/users/${this.userId}`);
      this.user = response.data as User;
      this.userUpdated = { ...this.userInitial, ...response.data };
    } catch (error) {
      console.error(error);
    }
  }

  userInitial: User = {
    id: "0",
    idealWeight: 0,
    height: 0,
  };

  user: User = this.userInitial;
  userUpdated: User = this.userInitial;

  userId = "1";

  get apiURL() {
    return process.env.NODE_ENV === "development" ? "http://localhost:3000/api/v1" : "/api/v1";
  }

  async saveUser() {
    console.log("u", this.userUpdated);
    try {
      const response = await axios.post(`${this.apiURL}/users/${this.userId}`, this.userUpdated);
      console.log("save user resp:", response.data);
      this.user = Object.assign({}, response.data);
      this.userUpdated = Object.assign({}, response.data);
    } catch (error) {
      console.error("Error:", error.response.data.message);
    }
  }
}
</script>

<style scoped lang="scss"></style>
