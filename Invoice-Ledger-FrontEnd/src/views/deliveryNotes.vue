<template>
    <v-app dark>
        <v-content>
            <v-container grid-list-md>
                <v-layout row wrap>
                    <v-flex xs4 md4 lg4>
                        <v-expansion-panel  v-model="panel"> <!-- panel gia ta notes -->
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
                    <v-flex xs4 md4 lg4>
                        <transition name="fade">
                            <v-flex v-if="transition" xs12 md12 lg12> <!-- an einai anoixto ena field kai kleisto to dialog tou new field v-if="(infField == true && check==false)"-->
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
                                            <div v-else-if="props.item.name=='ΔΙΑΔΡΟΜΗ'">
                                                {{ props.item.info }}
                                                
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
                    </v-flex>
                    <transition name="fade">
                        <v-flex v-if="transition" id="map" xs4 md4 lg4></v-flex>
                    </transition>
                </v-layout>
            </v-container>
        </v-content>
    </v-app>
</template>


<script>
import BackEndApi from '../services/api/backEnd';
import axios from 'axios';
import Mapbox from "mapbox-gl";
import { MglMap, MglMarker  } from "vue-mapbox";
import MapboxDirections from "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions";
import  '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'

const sleep = (milliseconds) => { // sleep gia transition sto show info field
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

var flag = 0;

export default {
    name: 'DeliveryNotes',
    components: {
        MglMap, MglMarker, Mapbox
    },
    data() {
        return {
            accessToken: 'pk.eyJ1IjoiZ2Vvcmdla2wiLCJhIjoiY2s2bTc1dWJpMGwxMDNvbHN5aWx2dDRicyJ9.vOUIsWK8lxaqqYidj8w9uQ', // your access token. Needed if you using Mapbox maps
            MapStyle: 'mapbox://styles/mapbox/streets-v11', // your map style
            myCenter: [23.727539 ,37.983810],
            flag: '',
            delName: '',
            dialog: '',
            search: '',
            searchNotes: '',
            coordinates: '',
            note: '',
            panel: 0,
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
                },
                {
                    name: 'ΔΙΑΔΡΟΜΗ',
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
            this.flag = 0;
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
                        this.info_array[9].info = this.notesList[i].coordinates;
                        this.flag=1;
                        // this.init_map();
                        console.log(this.info_array)
                        
                    }
                }
            });
            // flag=0;
            // if(this.flag==1) {
            //     console.log(this.flag+"trolo")
                sleep(50).then(() => {
                    console.log(this.flag+"trolo")
                    this.init_map();
                });
            // }
            
        },
        gotoNote() {
            this.$router.replace({ name: "homepage"});
        },
        getToken() {
            const token = localStorage.getItem("access_token");
            axios.defaults.headers.common["Authorization"] = token;
            axios({
                method: 'get',
                url: 'http://10.64.92.213:5000/'+this.info_array[8].info,
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
            axios.delete('http://10.64.92.213:5000/deliveryNotes/'+this.delId)
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
        },
        async init_map() {
            console.log("vre")
            mapboxgl.accessToken = 'pk.eyJ1IjoiZ2Vvcmdla2wiLCJhIjoiY2s2bTc1dWJpMGwxMDNvbHN5aWx2dDRicyJ9.vOUIsWK8lxaqqYidj8w9uQ';
            var map = new mapboxgl.Map({
                container: 'map',
                style: 'mapbox://styles/mapbox/streets-v11',
                center:  [23.727539,37.983810],
                zoom: 4.7,
                attributionControl: false
            });            
            
            console.log(this.info_array)
            var myCenter = this.info_array[9].info;
            // var myCenter = "22.466937504109467,38.78322115013967;21.925907244339726,39.829767411608145"
            map.on('load', function() {
                getMatch(myCenter);
                map.addLayer({
                    id: 'point',
                    type: 'circle',
                    source: {
                    type: 'geojson',
                    data: {
                        type: 'FeatureCollection',
                        features: [{
                        type: 'Feature',
                        properties: {},
                        geometry: {
                            type: 'Point',
                            coordinates: myCenter
                        }
                        }
                        ]
                    }
                    },
                    paint: {
                    'circle-radius': 10,
                    'circle-color': '#3887be'
                    }
                });
                // map.on('click',  function(e) {
                    // console.log(e.lngLat);
                    // });
                    // Change the cursor to a pointer when the mouse is over the places layer.
                    // map.on('draw.create', updateRoute);
                    // map.on('draw.update', updateRoute);
                    getMatch(myCenter);
            });
            // Use the coordinates you drew to make the Map Matching API request
            function updateRoute() {
                // Set the profile
                var profile = "driving";
                // Get the coordinates that were drawn on the map
                var data = draw.getAll();
                var lastFeature = data.features.length - 1;
                var coords = data.features[lastFeature].geometry.coordinates;
                // Format the coordinates
                var newCoords = coords.join(';')
                // Set the radius for each coordinate pair to 25 meters
                var radius = [];
                coords.forEach(element => {
                    radius.push(25);
                });
                getMatch(newCoords, radius, profile);
            }

            // Make a Map Matching request
            function getMatch(coordinates, radius, profile) {
                // Separate the radiuses with semicolons
                // var radiuses = radius.join(';')
                // Create the query
                // var query = "https://api.mapbox.com/directions-matrix/v1/mapbox/driving/"+coordinates+"?steps=true&geometries=geojson&radiuses="+radiuses+"&access_token=" + mapboxgl.accessToken;
                // var splitted = coordinates.split(";",2)
                // console.log([splitted[0]])
                // var splity = splitted[0].split(",",2)
                // console.log(splity[0], splity[1])
                // var marker = new mapboxgl.Marker()
                //     .setLngLat([parseInt(splity[0]),parseInt(splity[1])])
                //     .addTo(map);
                //  var popup = new mapboxgl.Popup({ closeOnClick: false })
                // .setLngLat([parseInt(splity[0]),parseInt(splity[1])])
                // .setHTML('<h3 style="color:black;font-size:15px;">ΑΡΧΗ</h3>')
                // .addTo(map);
                var query = "https://api.mapbox.com/directions/v5/mapbox/driving/"+coordinates+"?geometries=geojson&steps=true&access_token=" + mapboxgl.accessToken;
                // var query = "https://api.mapbox.com/directions/v5/mapbox/driving/22.466937504109467,38.78322115013967;21.925907244339726,39.829767411608145?geometries=geojson&steps=true&access_token=pk.eyJ1IjoiZ2Vvcmdla2wiLCJhIjoiY2s2bTc1dWJpMGwxMDNvbHN5aWx2dDRicyJ9.vOUIsWK8lxaqqYidj8w9uQ"
                console.log(query)
                let xhr = new XMLHttpRequest();
                xhr.open('GET', query, true);
                // request state change event
                xhr.onload = function() {
                    var json = JSON.parse(xhr.response);
                    console.log(json)
                    var data = json.routes[0];
                    var route = data.geometry.coordinates;
                    var geojson = {
                    type: 'Feature',
                    properties: {},
                    geometry: {
                        type: 'LineString',
                        coordinates: route
                    }};
                    if(map.getSource('route')) {
                        // map.removeLayer('route')
                        // map.removeSource('route')
                        map.getSource('route').setData(geojson);
                    } 
                    else { // otherwise, make a new request
                        map.addLayer({
                            id: 'route',
                            type: 'line',
                            source: {
                            type: 'geojson',
                            data: {
                                type: 'Feature',
                                properties: {},
                                geometry: {
                                type: 'LineString',
                                coordinates: geojson
                                }
                            }
                            },
                            layout: {
                            'line-join': 'round',
                            'line-cap': 'round'
                            },
                            paint: {
                            'line-color': '#3887be',
                            'line-width': 5,
                            'line-opacity': 0.75
                            }
                        });
                    }
                };
                // submitCoords = coordinates;
                // console.log(submitCoords)
                xhr.send();
            };
        }
    },
    mounted () {
        // this.init_map();
        // console.log(this.flag+"yo")
        // if(this.flag==1) {
        //     // sleep(1000).then(() => {
        //         console.log("mpainq")
        //         this.init_map();
        //     // });
        // }
    },
}
</script>

<style>
#names {
    font-size: 16px;
    padding: 0px;
    margin: 0px;
    border-bottom: solid 0.5px #000;
}
#map {
        /* height: 400px; */
        /* width: 400px; */
        /* top:0; */
        
        position: relative;
        /* float:left; */
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
