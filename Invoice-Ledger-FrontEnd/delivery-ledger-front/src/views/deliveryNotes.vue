<template>
    <v-app dark>
        <v-content>
            <v-container grid-list-md text-xs-center>
                <v-layout row wrap>
                    <v-flex xs4 md4 lg4>
                        <v-expansion-panel expand v-model="panel"> <!-- panel gia ta notes -->
                            <v-expansion-panel-content>
                                <v-card dark class="ml-3 mb-1 mr-3"><v-text-field append-icon="search" type="text" name="search" v-model="search" label="ΑΝΑΖΗΤΗΣΗ"></v-text-field></v-card>
                                <v-btn flat slot="header" color="grey" dark>Δελτια Αποστολης</v-btn>
                                <v-list>
                                    <v-divider class="black"></v-divider>
                                    <v-layout id="names" v-for="note in filteredNotes" :key="note.id">
                                        <v-flex grow>
                                            <v-card dark @click.native="myid=note.id;changeNote();colorid=note.id" class="ml-3 mb-1"> <!-- dinw id sto map, allazei to field, id gia to xrwma twn grammatwn @click.native="mapid=field._id;changeField();colorid=field._id"-->
                                                <v-card-text v-if="colorid==note.id" class="text-align-center blue--text">{{ note.name }} / {{ note.VATRegistrationNum }}</v-card-text>
                                                <v-card-text v-else class="text-align-center">{{ note.name }} / {{ note.VATRegistrationNum }}</v-card-text> <!-- alliws aspra-->
                                            </v-card>
                                        </v-flex>
                                        <v-flex shrink>
                                            <v-card dark class="mb-1">
                                                <v-dialog ref="dial" v-model="dialog" persistent max-width="500px" dark>
                                                    <v-btn slot="activator" @click.native="myid=note.id;delName=note.name;changeNote();colorid=note.id;dialog=true;" small fab color="red"> <!-- koumpi gia svisimo deltiou -->
                                                    <v-icon small>clear</v-icon>
                                                    </v-btn>
                                                    <v-card dark>
                                                        <v-card-title primary-title> Are you sure you want to delete {{ delName }} note? </v-card-title>
                                                        <v-divider></v-divider>
                                                        <v-card-actions>
                                                            <v-spacer></v-spacer>
                                                            <v-btn @click="dialog=false" flat color="grey" dark>No</v-btn>
                                                            <v-btn @click="delName=note.name;delId=myid;deleteNote();dialog=false;transition=false;" flat color="grey" dark>Yes</v-btn>
                                                        </v-card-actions>
                                                    </v-card>
                                                </v-dialog>
                                            </v-card>
                                        </v-flex>
                                    </v-layout>
                                    <v-list-tile> <!-- add a field apo katw apo ta fields -->
                                        <v-layout column align-center>
                                            <v-btn @click="gotoNote()" color="blue darken-3" dark small>
                                                <v-icon>add</v-icon>
                                            </v-btn>
                                        </v-layout>
                                    </v-list-tile>
                                </v-list>
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                    </v-flex>
                    <transition name="fade">
                        <v-flex v-if="transition" xs8 md8 lg8 > <!-- an einai anoixto ena field kai kleisto to dialog tou new field v-if="(infField == true && check==false)"-->
                            <v-toolbar color="success">
                                <v-spacer></v-spacer>
                                <v-toolbar-title>{{ this.info_array[0].info }}</v-toolbar-title>
                                <v-spacer></v-spacer>
                            </v-toolbar>
                            <v-data-table :headers="headers" :items="info_array" hide-actions>
                                <template slot="items" slot-scope="props">
                                    <td class="text-xs-left">{{ props.item.name }}</td> 
                                        <div v-if="props.item.name=='ΑΡΧΕΙΟ ΠΑΡΑΓΓΕΛΙΑΣ' && props.item.info!=null">
                                            <td class="text-xs-left">
                                                {{ props.item.info }}
                                                <a @click="getToken()">Download</a>
                                            </td>
                                        </div>
                                        <div v-else>
                                            <td class="text-xs-left">
                                                {{ props.item.info }}
                                            </td>
                                        </div>
                                </template>
                            </v-data-table>
                        </v-flex>
                    </transition>
                </v-layout>
            </v-container>
        </v-content>
    </v-app>
</template>


<script>
import BackEndApi from '../services/api/backEnd';
import axios from 'axios';

const sleep = (milliseconds) => { // sleep gia transition sto show info field
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

export default {
    name: 'DeliveryNotes',
    data() {
        return {
            delName: '',
            dialog: '',
            search: '',
            searchNotes: '',
            note: '',
            panel: [true],
            myid: '',
            colorid: '',
            transition: false,
            notesList: [],
            notesInfo: [],
            headers: [
                { text: 'Label', align: 'left', value: 'name' , sortable: false },
                { text: 'Information',  value: 'info' , sortable: false },
                //{ Actions: 'Actions', value: 'actions' ,sortable: false }
            ],
            info_array: [ // array gia ta pedia
                {
                    name: "ΟΝΟΜΑ",
                    info: ''
                },
                {
                    name: "ΔΟΥΛΕΙΑ",
                    info: ''
                },
                {
                    name: "ΑΦΜ",
                    info: ''
                },
                {
                    name: "ΠΟΛΗ",
                    info: ''
                },
                {
                    name: "ΠΡΟΟΡΙΣΜΟΣ",
                    info: ''
                },
                {
                    name: "ΔΙΕΘΥΝΣΗ",
                    info: ''
                },
                {
                    name: "ΜΕΡΟΣ ΦΟΡΤΩΣΗΣ",
                    info: ''
                },
                {
                    name: "ΔΟΥ",
                    info: ''
                },
                {
                    name: 'ΑΡΧΕΙΟ ΠΑΡΑΓΓΕΛΙΑΣ',
                    info: ''
                }
            ]
        }
    },
    created() {
        const token = localStorage.getItem("access_token");
        axios.defaults.headers.common["Authorization"] = token;
        BackEndApi.getCalls('/deliveryNotes') // pare ta nea fields wste na allaksei to onoma sto fields
        .then(response => {
            this.notesList = response.data.message;
            // console.log(this.notesList)
        })
        .catch(error => {
          console.log(error)
        })
    },
    computed: {
        filteredNotes: function() {
            if(this.search.length>=3) {
                BackEndApi.getSearch("/deliveryNotes/searchDeliveryNote/?term="+this.search) // pare ta nea fields wste na allaksei to onoma sto fields
                .then(response => {
                    sleep(1000).then(() => {this.searchNotes = response.data.message;})
                    console.log(this.searchNotes)
                })
                .catch(error => {
                console.log(error)
                })
                return this.searchNotes;
            }
            else {
                this.searchNotes = this.notesList;
                // console.log(this.searchNotes)
                return this.searchNotes;
            }
        }
    },
    methods: {
        changeNote() {
            this.transition = false;
            sleep(50).then(() => { // gia to transition alliws den prolavainei na fugei to proigoumeno parathuro kai den fainetai wraia
                this.transition = true; // to parathuro
                for(var i=0;i<this.notesList.length;i++) {
                    if(this.notesList[i].id == this.myid) {
                        this.info_array[0].info = this.notesList[i].name;
                        this.info_array[1].info = this.notesList[i].job;
                        this.info_array[2].info = this.notesList[i].VATRegistrationNum;
                        this.info_array[3].info = this.notesList[i].city;
                        this.info_array[4].info = this.notesList[i].destination;
                        this.info_array[5].info = this.notesList[i].address;
                        this.info_array[6].info = this.notesList[i].loadingPlace;
                        this.info_array[7].info = this.notesList[i].taxOffice;
                        this.info_array[8].info = this.notesList[i].file;
                        console.log(this.info_array)
                    }
                }
            });
        },
        gotoNote() {
            this.$router.replace({ name: "homepage"});
        },
        getToken() {
            const token = localStorage.getItem("access_token");
            axios.defaults.headers.common["Authorization"] = token;
            axios({
                method: 'get',
                url: 'http://10.64.45.62:5000/'+this.info_array[8].info,
                responseType: 'blob',
                Authorization: token
            })
            .then(response => {
                console.log(response)
                const url = window.URL.createObjectURL(new Blob([response.data]));
                var fileLink = document.createElement('a');
                fileLink.href = url;
                fileLink.setAttribute('download', 'file.pdf');
                document.body.appendChild(fileLink);
                fileLink.click();
            })
            .catch(function(error) {
                console.log(error);
            });
        },
        deleteNote() {
            console.log(this.delId)
            const token = localStorage.getItem("access_token");
            axios.defaults.headers.common["Authorization"] = token;
            axios.delete('http://10.64.45.62:5000/deliveryNotes/'+this.delId)
            .then(response => {
                console.log(response)
                BackEndApi.getCalls('/deliveryNotes') // pare ta nea fields wste na allaksei to onoma sto fields
                .then(response => {
                    this.notesList = response.data.message;
                    // console.log(this.notesList)
                })
                .catch(error => {
                console.log(error)
                })
            })
            .catch(function(error) {
                console.log(error);
            });
        }
    }
}
</script>

<style>
#names {
    font-size: 16px;
    padding: 0px;
    margin: 0px;
    border-bottom: solid 0.5px #000;
}

#names:hover {
    border: solid;
    cursor: pointer;
}

.fade-enter {
    transform: translateX(1000px);
    opacity: 0;
}
.fade-enter-active {
    transition: all 1s ease;
}
</style>
