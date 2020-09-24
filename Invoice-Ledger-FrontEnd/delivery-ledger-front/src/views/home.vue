<template>
    <div>
        <div class="Home">
            <!--<v-parallax src="https://www.inmarsat.com/wp-content/uploads/2017/10/iStock-506164764.jpg" height="1300">-->
            <v-parallax :src="require('../assets/company1.jpg')" height="750">
                <h2 style="color:#80dfff" class="black--text mb-2 display-3 text-xs-center">Delivery Company</h2>
            </v-parallax>
        </div>
    </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
    }
  },
  methods: {
    logout() {
      this.$store.dispatch('deleteToken');
      this.$router.push({ path: '/' });
    },
    gotoLog() {
      this.$router.replace({name: "login"});
    },
    gotoReg() {
      this.$router.replace({ name: "register"});
    },
    gotoHome() {
      this.$router.replace({ name: "homepage"});
    }
  },
  computed: {
    loggedIn() {
      return this.$store.getters.loggedIn
    }
  }
}
</script>

