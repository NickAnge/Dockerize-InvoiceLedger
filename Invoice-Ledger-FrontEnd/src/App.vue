<template>
  <v-app id="inspire" dark color="primary">
    <!-- <v-navigation-drawer dark floating fixed app width="200"> -->
      <v-toolbar dark app fixed color="success">
        <v-toolbar-title class="ml-5">Παρατηρητήριο Εμπορευματικών Κινήσεων</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn flat small dark @click="gotoHome()">ΑΡΧΙΚΗ</v-btn>
        <v-btn v-if="loggedIn == false" flat small dark @click="gotoLog()">ΣΥΝΔΕΣΗ</v-btn>
        <v-btn v-if="loggedIn == false" flat small dark @click="gotoReg()">ΕΓΓΡΑΦΗ</v-btn>
        <v-btn v-show="loggedIn" flat small dark @click="gotoNote()">ΔΕΛΤΙΟ</v-btn>
        <v-btn v-show="loggedIn" flat small dark @click="gotoNotes()">ΚΑΤΑΧΩΡΗΣΕΙΣ</v-btn>
        <v-btn v-show="loggedIn" flat small dark @click="logout()">ΑΠΟΣΥΝΔΕΣΗ</v-btn>
      </v-toolbar>
      <router-link v-if="loggedIn" to="/login" v-on:click.native="logout()" replace>Logout</router-link>
    <!-- </v-navigation-drawer> -->
    <router-view></router-view>
  </v-app>
</template>

<script>
export default {
  name: 'App',
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
      this.$router.replace({ name: "home"});
    },
    gotoNote() {
      this.$router.replace({ name: "homepage"});
    },
    gotoNotes() {
      this.$router.replace({ name: "deliverynotes"});
    }
  },
  computed: {
    loggedIn() {
      return this.$store.getters.loggedIn
    }
  }
}
</script>

