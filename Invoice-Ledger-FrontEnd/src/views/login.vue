<template>
    <v-app id="inspire" dark>
        <v-content>
            <v-parallax :src="require('../assets/company1.jpg')" height="750">
                <v-container fluid fill-height>
                    <v-layout align-bottom justify-center>
                        <v-snackbar v-model="snackbar_login_failed" :timeout="1200">A username and a password must be present</v-snackbar> 
                        <!-- <v-snackbar v-model="snackbar_login_failed2" :timeout="1200">Login Failed</v-snackbar>  -->
                        <v-flex xs3 sm3 md3 lg3 xl3>
                            <v-card class="elevation-24">
                                <v-toolbar dark color="success">
                                    <v-toolbar-title>Login</v-toolbar-title>
                                </v-toolbar>
                                <v-card-text>
                                    <v-form>
                                        <v-text-field prepend-icon="email" type="email" name="email" v-model="input.email" placeholder="Email" />
                                        <v-text-field prepend-icon="lock" type="password" name="password" v-model="input.password" placeholder="Password" />
                                    </v-form>
                                </v-card-text>
                                <v-card-actions>
                                    <v-btn color="success" @click="login()">Login</v-btn>
                                    <v-btn text small flat depressed @click="gotoReg()">Register</v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-parallax>
        </v-content>
    </v-app>
</template>

<script>
import BackEndApi from '../services/api/backEnd';

export default {
    name: 'Login',
    data() {
        return {
            snackbar_login_failed: false,
            // snackbar_login_failed2: false,
            input: {
                email: "",
                password: ""
            }
        }
    },
    methods: {
        login() {
            if(this.input.email != "" && this.input.password != "") {
                this.$store.dispatch('retrieveToken', {
                    email: this.input.email,
                    password: this.input.password
                })
                .then(response => {
                    this.$router.push({ path: '/homepage'})
                    console.log('You are logged in now!');
                })
                .catch( function(error) {
                    // this.snackbar_login_failed2 = true;
                    console.log(error);
                });
            }
            else {
                this.snackbar_login_failed = true;
                console.log("A username and a password must be present");
            }
        },
        gotoReg() {
            this.$router.replace({ name: "register"});
        }
    },
    created () {
        window.addEventListener('keydown', (e) => {
            if(e.key == 'Enter') {
                this.login();
            }
        });
    }
}
</script>
