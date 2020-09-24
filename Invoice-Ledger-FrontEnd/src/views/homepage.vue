<template>
    <v-app id="inspire" dark>
        <v-content>
            <v-container fluid fill-height>
                <v-layout align-bottom justify-center>
                    <v-snackbar v-model="snackbar_created" :timeout="1200" top>Delivery Note is Created</v-snackbar>  <!-- Enimerwsi oti egine created-->
                    <v-flex xs10 sm10 md10 lg10 xl10>
                        <v-card class="elevation-24">
                            <v-toolbar dark color="success">
                                <v-toolbar-title>ΔΕΛΤΙΟ ΑΠΟΣΤΟΛΗΣ</v-toolbar-title>
                            </v-toolbar>
                            <v-card-text>
                                <v-form>
                                    <v-layout row wrap>
                                        <v-flex xs6 sm6 md6 lg6 xl6>
                                            <v-text-field prepend-icon="person" name="company_name" v-model="company_name" label="Επωνυμία Εταιρείας" />
                                            <v-text-field prepend-icon="work" label="Απασχόληση" type="text" name="job" v-model="job"/>
                                            <v-text-field prepend-icon="home" type="text" name="address" v-model="address" label="Διεύθυνση" />
                                            <v-text-field prepend-icon="description" type="text" name="afm" v-model="afm" label="ΑΦΜ" />
                                            <div class="large-12 medium-12 small-12 cell">
                                                <label>ΑΡΧΕΙΟ ΠΑΡΑΓΓΕΛΙΑΣ
                                                    <input type="file" id="file" ref="file"/>
                                                </label>
                                            </div>
                                        </v-flex>
                                        <v-flex  xs6 sm6 md6 lg6 xl6>
                                            <!-- <div ></div> -->
                                            <v-container fluid fill-height>
                                                 <v-layout row wrap>
                                                    <div id="map">
                                                    <!-- <pre id="info"></pre> -->
                                                        <!-- <MglMarker id="marker" :coordinates="coordinates" color="blue" /> -->
                                                    </div>
                                                 </v-layout>
                                            </v-container>
                                            <!-- <v-select  prepend-icon="store" autocomplete :items="city" placeholder="Πόλη" editable v-model="city1"/>
                                            <v-select  prepend-icon="open_in_browser" autocomplete :items="city" placeholder="Τοποθεσία Φόρτωσης" editable v-model="place_of_loading"/>
                                            <v-select  prepend-icon="room" autocomplete :items="city" placeholder="Προορισμός" editable v-model="destination"/>
                                            <v-select  prepend-icon="assignment" autocomplete :items="taxOffices" placeholder="ΔΟΥ" editable v-model="doy"/>
                                            <v-select prepend-icon="directions" autocomplete :items="city" placeholder="Διαδρομή" editable v-model="road_taken"/> -->
                                        </v-flex>
                                        <v-flex xs12 sm12 md12 lg12 xl12>
                                            <v-data-table hide-actions flat :headers="headers" :items="details" height="3">
                                                <template flat slot="headerCell" slot-scope="props">
                                                    <span>{{ props.header.text }}</span>
                                                </template>
                                                <template slot="items" slot-scope="props">
                                                    <td><v-text-field type="text" placholder="1" hide-details v-model="props.item[0]"></v-text-field></td>
                                                    <td><v-text-field type="text" placholder="2" hide-details v-model="props.item[1]"></v-text-field></td>
                                                    <td><v-text-field type="text" placholder="3" hide-details v-model="props.item[2]"></v-text-field></td>
                                                    <td><v-text-field type="text" placholder="4" hide-details v-model="props.item[3]"></v-text-field></td>
                                                    <td><v-text-field type="text" placholder="5" hide-details v-model="props.item[4]"></v-text-field></td>
                                                </template>
                                            </v-data-table>
                                        </v-flex>
                                    </v-layout>
                                </v-form>
                            </v-card-text>
                            <v-card-actions>
                                <v-btn color="success" @click="submit()">ΚΑΤΑΧΩΡΗΣΗ</v-btn>
                                <v-spacer></v-spacer>
                                <v-btn color="primary" @click="add_row()">ΠΡΟΣΘΗΚΗ ΓΡΑΜΜΗΣ</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-content>
    </v-app>
</template>

<script>
import Autocomplete from 'v-autocomplete'
import BackEndApi from '../services/api/backEnd';
import axios from 'axios';
import Mapbox from "mapbox-gl";
import { MglMap, MglMarker  } from "vue-mapbox";
import MapboxDirections from "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions";
import  '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'

// mapboxgl.accessToken = 'pk.eyJ1IjoiZ2Vvcmdla2wiLCJhIjoiY2s2bTc1dWJpMGwxMDNvbHN5aWx2dDRicyJ9.vOUIsWK8lxaqqYidj8w9uQ';
// var map = new mapboxgl.Map({
//     container: 'map',
//     style: 'mapbox://styles/mapbox/streets-v9',
//     center: [23.727539 ,37.983810],
//     zoom: 4.7
// });

const sleep = (milliseconds) => { // sleep gia transition sto show info field
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

// var flag1=0;
var submitCoords;

export default {
    name: 'Homepage',
    components: {
        MglMap, MglMarker, Mapbox
    },
    data() {
        return {
            myMarkers: [],
            accessToken: 'pk.eyJ1IjoiZ2Vvcmdla2wiLCJhIjoiY2s2bTc1dWJpMGwxMDNvbHN5aWx2dDRicyJ9.vOUIsWK8lxaqqYidj8w9uQ', // your access token. Needed if you using Mapbox maps
            MapStyle: 'mapbox://styles/mapbox/streets-v11', // your map style
            coordinates: [ 23.727539 ,37.983810], //longitude , latitude
            road_taken: '',
            snackbar_created: false,
            company_name: "",
            job: "",
            address: "",
            place_of_loading: "",
            destination: "",
            afm: "",
            city1: "",
            taxOffices: ['Messolongi, Messolongi - Limani, 30200, AETOLOAKARNANIAS', 'Mandilara 5-7, Agrinio, 30100, AETOLOAKARNANIAS', 'Drama, Drama, 66100, DRAMAS', 'Messolongi, Messolongi - Limani, 30200, AETOLOAKARNANIAS', 'Messolongi, Messolongi - Limani, 30200, AETOLOAKARNANIAS', 'Egnatias 45, Thessaloniki, 54630, THESSALONIKIS', 'Kymi, Kymi, 34003, EVIAS', 'Mykonos, Mykonos - Drafaki, 84600, KYKLADES', 'Leoforos Stamathioudaki Anagnostou 8, Rethymnon, 74132, RETHYMNOU', 'Messolongi, Messolongi - Limani, 30200, AETOLOAKARNANIAS', 'Mykonos, Mykonos - Drafaki, 84600, KYKLADES', 'Messolongi, Messolongi - Limani, 30200, AETOLOAKARNANIAS', 'Messolongi, Messolongi - Limani, 30200, AETOLOAKARNANIAS', 'Messolongi, Messolongi - Limani, 30200, AETOLOAKARNANIAS', 'Drama, Drama, 66100, DRAMAS', 'Nea Ethniki Odos Patron - Athinon 15, Patra, 26441, ACHAIAS', 'Mykonos, Mykonos - Drafaki, 84600, KYKLADES', 'Messolongi, Messolongi - Limani, 30200, AETOLOAKARNANIAS', 'Venizelou Eleftheriou 4, Florina, 53100, FLORINAS', 'Argyroupoleos 94-96, Argyroupoli, 16451, ATTICA','Mykonos, Mykonos - Drafaki, 84600, KYKLADES', 'Lomvardou K. 18, Zante, 29100, ZAKYNTHOU', 'Filippou 4, Ptolemaida, 50200, KOZANIS', 'Messolongi, Messolongi - Limani, 30200, AETOLOAKARNANIAS', 'Acharnon 43, Kifissia, 14561, ATTICA', 'Drama, Drama, 66100, DRAMAS', 'Leoforos Venizelou Eleftheriou 195, Kallithea, 17673, ATTICA', 'Messolongi, Messolongi - Limani, 30200, AETOLOAKARNANIAS', 'Drama, Drama, 66100, DRAMAS', 'Drama, Drama, 66100, DRAMAS', 'Messolongi, Messolongi - Limani, 30200, AETOLOAKARNANIAS', 'Mykonos, Mykonos - Drafaki, 84600, KYKLADES', 'Drama, Drama, 66100, DRAMAS', 'Kymi, Kymi, 34003, EVIAS', 'Mykonos, Mykonos - Drafaki, 84600, KYKLADES', 'Messolongi, Messolongi - Limani, 30200, AETOLOAKARNANIAS', 'Plastira Nikolaou 57, Thessaloniki, 54250, THESSALONIKIS', 'Mykonos, Mykonos - Drafaki, 84600, KYKLADES', 'Drama, Drama, 66100, DRAMAS', 'Messolongi, Messolongi - Limani, 30200, AETOLOAKARNANIAS','Leoforos Knossou 255, Iraklio, 71409, IRAKLIOU', 'Venizelou Eleftheriou 4, Florina, 53100, FLORINAS', 'Messogion 448, Agia Paraskevi, 15342, ATTICA', 'Drama, Drama, 66100, DRAMAS', 'Neas Ethnikis Odou Patron - Athinon 15, Patra, 26441, ACHAIAS', 'Messolongi, Messolongi - Limani, 30200, AETOLOAKARNANIAS', 'Leoforos Venizelou Eleftheriou 195, Kallithea, 17673, ATTICA', 'Acharnon 43, Kifissia, 14561, ATTICA', 'Kymi, Kymi, 34003, EVIAS', 'Mykonos, Mykonos - Drafaki, 84600, KYKLADES', 'Messolongi, Messolongi - Limani, 30200, AETOLOAKARNANIAS', 'Mykonos, Mykonos - Drafaki, 84600, KYKLADES', '28th Oktovriou & Prousis, Pyrgos Ilias, 27131, ILIAS', 'Terma Taliadouri Konstantinou, Grevena, 51100, GREVENON', 'Kymi, Kymi, 34003, EVIAS', 'Mykonos, Mykonos - Drafaki, 84600, KYKLADES', 'Mandilara 5-7, Agrinio, 30100, AETOLOAKARNANIAS', 'Kymi, Kymi, 34003, EVIAS', 'Kymi, Kymi, 34003, EVIAS', 'Kolokotroni Theodorou 2 & Ptolemeou, Trikala, 42132, TRIKALON','Kymi, Kymi, 34003, EVIAS', 'Messolongi, Messolongi - Limani, 30200, AETOLOAKARNANIAS', 'Messolongiou 13, Xanthi, 67132, XANTHIS', 'Leoforos Venizelou Eleftheriou 195, Kallithea, 17673, ATTICA', 'Kymi, Kymi, 34003, EVIAS', 'Venizelou Eleftheriou 4, Florina, 53100, FLORINAS', 'Messolongi, Messolongi - Limani, 30200, AETOLOAKARNANIAS', 'Polygyros, Polygyros, 63100, CHALKIDIKIS', 'Lomvardou K. 18, Zante, 29100, ZAKYNTHOU', 'Messolongi, Messolongi - Limani, 30200, AETOLOAKARNANIAS', 'Dokos & Dimarchou Skoura, Chalkida, 34100, EVIAS', 'Mykonos, Mykonos - Drafaki, 84600, KYKLADES', 'Messolongi, Messolongi - Limani, 30200, AETOLOAKARNANIAS', 'Drama, Drama, 66100, DRAMAS', 'Leoforos Stamathioudaki Anagnostou 8, Rethymnon, 74132, RETHYMNOU', 'Venizelou Eleftheriou 34, Sidirokastro, 62300, SERRON', '18th Oktovriou, Edessa, 58200, PELLAS', 'Acharnon 43, Kifissia, 14561, ATTICA', 'Filippou 4, Ptolemaida, 50200, KOZANIS', 'Messolongi, Messolongi - Limani, 30200, AETOLOAKARNANIAS','Xenofontos 1, Volos, 38333, MAGNISSIAS', 'Ethnikis Antistasseos 43, Pallini, 15351, ATTICA', 'Koutsantoni 12, Nea Moudania, 63200, CHALKIDIKIS', 'Paralio Astros, Paralio Astros, 22001, ARKADIAS', 'Messolongi, Messolongi - Limani, 30200, AETOLOAKARNANIAS', 'Kekropos 3 & Alipedou, Piraeus, 18531, ATTICA', 'Kyprou 2-4, Moschato, 18346, ATTICA', 'Kountouriotou 87, Mytilini, 81100, LESVOU', 'Pouraimi Dimitriou 10 & Thiveou Ioannou, Acharnes, 13671, ATTICA', 'Papandreou Andrea 22, Karditsa, 43131, KARDITSAS', 'Messolongi, Messolongi - Limani, 30200, AETOLOAKARNANIAS', 'Drama, Drama, 66100, DRAMAS', 'Drama, Drama, 66100, DRAMAS', 'Mykonos, Mykonos - Drafaki, 84600, KYKLADES', 'Neas Ethnikis Odou Patron - Athinon 15, Patra, 26441, ACHAIAS', 'Venizelou Eleftheriou 34, Sidirokastro, 62300, SERRON', 'Messolongi, Messolongi - Limani, 30200, AETOLOAKARNANIAS', 'Leoforos Stratou 37, Thessaloniki - Faliro, 54639, THESSALONIKIS', 'Messolongi, Messolongi - Limani, 30200, AETOLOAKARNANIAS', 'Mykonos, Mykonos - Drafaki, 84600, KYKLADES','Drama, Drama, 66100, DRAMAS', 'Vassileos Irakliou 38, Thessaloniki, 54623, THESSALONIKIS', 'Valaoritou Aristoteli 18, Thessaloniki, 54625, THESSALONIKIS', 'Xenofontos 1, Volos, 38333, MAGNISSIAS', 'Plastira Nikolaou 57, Pylea, 55535, THESSALONIKIS', 'Adrianoupoleos 45, Kesariani, 16121, ATTICA', 'Navarchou Notara 38-40, Piraeus, 18531, ATTICA', 'Sotiros 10, Argostoli, 28100, KEFALONIA', 'Koletti 14Α, Athens - Exarchia, 10681, ATTICA', 'Takantza Athanassiou 8-10, Thessaloniki - Faliro, 54639, THESSALONIKIS', 'Leoforos Vouliagmenis 387, Ilioupoli, 16346, ATTICA', 'Akti Miaouli 83 & Botsari Markou 2-8, Piraeus, 18538, ATTICA', 'Leoforos Venizelou Eleftheriou 195, Kallithea, 17673, ATTICA', 'Karaoli Ke Dimitriou 13-15 & Eptanisou, Evosmos, 56224, THESSALONIKIS', 'Samara Spyrou 13, Corfu, 49132, KERKYRAS', 'Androutsou Odyssea & Diakou Athanassiou, Amfissa, 33100, FOKIDAS', 'Messolongi, Messolongi - Limani, 30200, AETOLOAKARNANIAS', 'Kennenty Tzon 146 & Aegeou 31, Peristeri, 12136, ATTICA', 'Fira, Thira, 84700, KYKLADES', 'Chatzoglou Theodorou 48, Katerini, 60132, PIERIAS','Aeschylou 27, Chalandri, 15234, ATTICA', 'Prigipissas Olgas 3 & Leoforos Dimokratias, Agii Anargyri, 13510, ATTICA', 'Akti Dymeon 18, Patra, 26222, ACHAIAS', 'Patriarchou Grigoriou Z 33, Serres, 62125, SERRON', 'Leoforos Syngrou Andrea 251, Nea Smyrni, 17122, ATTICA', 'Argostoliou 39, Agios Dimitrios, 17342, ATTICA', 'Alatsaton 93 & Leoforos Kifisou 44, Aegaleo, 12241, ATTICA', 'Christianoupoleos 103, Galatsi, 11146, ATTICA', 'Dimarchou Stamkou 20, Giannitsa, 58100, PELLAS', 'Gounari 172, Argos, 21232, ARGOLIDAS', 'Fira, Thira, 84700, KYKLADES', 'Plastira Nikolaou 57, Pylea, 55535, THESSALONIKIS', 'Thespieon 62, Korydallos, 18122, ATTICA', 'Navarchou Notara 38-40, Piraeus, 18531, ATTICA', 'Dimokratias 1, Komotini, 69100, RODOPIS', 'Chatzoglou Theodorou 48, Katerini, 60132, PIERIAS', 'Terma Taliadouri Konstantinou, Grevena, 51100, GREVENON', 'Livanou Michail 66, Chios, 82132, CHIOU', 'Karaoli Ke Dimitriou 13-15 & Eptanisou, Evosmos, 56224, THESSALONIKIS', 'Acharnon 43, Kifissia, 14561, ATTICA','Periferiaki Odos 56, Arta, 47100, ARTAS', 'Koutsantoni 12, Nea Moudania, 63200, CHALKIDIKIS', 'Messolongi, Messolongi - Limani, 30200, AETOLOAKARNANIAS', 'Nafpliou 50, Tripoli, 22132, ARKADIAS', 'Navarchou Notara 38-40, Piraeus, 18531, ATTICA', 'Dimokratias 1, Komotini, 69100, RODOPIS', 'Takantza Athanassiou 8-10, Thessaloniki - Faliro, 54639, THESSALONIKIS', 'Damareos 175, Athens - Pagrati, 11632, ATTICA', 'Polytechniou 15, Preveza, 48100, PREVEZAS', 'Leoforos Kyknon 2, Kastoria, 52100, KASTORIAS', 'Patron 83, Corinth, 20131, KORINTHIAS', 'Venizelou Eleftheriou 100, Cholargos, 15561, ATTICA', 'Mandilara Nikiforou 31, Ermoupoli, 84100, KYKLADES', 'Thespieon 62, Korydallos, 18122, ATTICA', 'Akti Dymeon 18, Patra, 26222, ACHAIAS', 'Chatzoglou Theodorou 48, Katerini, 60132, PIERIAS', 'Leoforos Syngrou Andrea 251, Nea Smyrni, 17122, ATTICA', 'Papandreou Andrea 22, Karditsa, 43131, KARDITSAS', 'Sotiros 10, Argostoli, 28100, KEFALONIA', 'Ethnikis Antistasseos 104 & Dimitros, Elefsina, 19200, ATTICA','Lada Christou 48, Peristeri, 12132, ATTICA', 'Loutron 14 & Lagada 5, Lagadas, 57200, THESSALONIKIS', 'Leoforos Vouliagmenis 387, Ilioupoli, 16346, ATTICA', 'Messolongi, Messolongi - Limani, 30200, AETOLOAKARNANIAS', '21st Iouniou 50, Kilkis, 61100, KILKIS', 'Evelpidon 47Α & Lefkados 33, Athens - Pedio Areos, 11362, ATTICA', 'Mandilara Nikiforou 31, Ermoupoli, 84100, KYKLADES', 'Ethnikis Antistasseos 43, Pallini, 15351, ATTICA', '18th Oktovriou, Edessa, 58200, PELLAS', 'Alkyonis 19, Paleo Faliro, 17561, ATTICA', 'Kennenty Tzon 146 & Aegeou 31, Peristeri, 12136, ATTICA', 'Menelaou 74, Sparta, 23100, LAKONIAS', 'Argostoliou 39, Agios Dimitrios, 17342, ATTICA', 'Leoforos Venizelou Eleftheriou 195, Kallithea, 17673, ATTICA', 'Dimokratias 1, Komotini, 69100, RODOPIS', 'Sikelianou Angelou 1, Lefkada, 31100, LEFKADAS', 'Navarchou Notara 38-40, Piraeus, 18531, ATTICA', 'Agiou Dimitriou 2, Alexandroupolis, 68131, EVROU', 'Trikoupi Charilaou 33, Polygyros, 63100, CHALKIDIKIS', 'Vassileos Irakliou 38, Thessaloniki, 54623, THESSALONIKIS','Navarchou Notara 38-40, Piraeus, 18531, ATTICA', 'Messolongi, Messolongi - Limani, 30200, AETOLOAKARNANIAS', 'Krystalli 4, Thessaloniki - Platia Antigonidon, 54630, THESSALONIKIS', 'Pythagora 5, Vathy Samou, 83100, SAMOU', 'Koutsantoni 12, Nea Moudania, 63200, CHALKIDIKIS', 'Sofokleous 17, Livadia, 32131, VIOTIAS', 'Kennenty Tzon 146 & Aegeou 31, Peristeri, 12136, ATTICA', 'Terma Taliadouri Konstantinou, Grevena, 51100, GREVENON', 'Parikia, Paros, 84400, KYKLADES', 'Valaoritou Aristoteli 18, Thessaloniki, 54625, THESSALONIKIS', 'Kountouriotou 87, Mytilini, 81100, LESVOU', '26th Oktovriou 35, Thessaloniki - Sfagia, 54627, THESSALONIKIS', 'Damareos 175, Athens - Pagrati, 11632, ATTICA', 'Leoforos Syngrou Andrea 251, Nea Smyrni, 17122, ATTICA', 'Koletti 14Α, Athens - Exarchia, 10681, ATTICA', 'Vassileos Irakliou 38, Thessaloniki, 54623, THESSALONIKIS', 'Sotiros 10, Argostoli, 28100, KEFALONIA', '21st Iouniou 50, Kilkis, 61100, KILKIS', 'Papandreou Andrea, Naxos, 84300, KYKLADES', 'Kanellopoulou 36, Aegio, 25100, ACHAIAS'],
            city: ['Athens',
                'Thessaloniki',
                'Patras',
                'Piraeus',
                'Larissa',
                'Heraklion',
                'Peristeri',
                'Kallithea',
                'Acharnes',
                'Kalamaria',
                'Nikaia',
                'Glyfada',
                'Volos',
                'Ilio',
                'Ilioupoli',
                'Keratsini',
                'Evosmos',
                'Chalandri',
                'Nea Smyrni',
                'Marousi',
                'Agios Dimitrios',
                'Zografou',
                'Egaleo',
                'Nea Ionia',
                'Ioannina',
                'Palaio Faliro',
                'Korydallos',
                'Trikala',
                'Vyronas',
                'Agia Paraskevi',
                'Galatsi',
                'Agrinio',
                'Chalcis',
                'Petroupoli',
                'Serres',
                'Alexandroupoli',
                'Xanthi',
                'Katerini',
                'Kalamata',
                'Kavala',
                'Chania',
                'Lamia',
                'Komotini',
                'Irakleio',
                'Rhodes',
                'Kifissia',
                'Stavroupoli',
                'Chaidari',
                'Drama',
                'Veria',
                'Alimos',
                'Kozani',
                'Polichni',
                'Karditsa',
                'Sykies',
                'Ampelokipoi',
                'Pylaia',
                'Agioi Anargyroi',
                'Argyroupoli',
                'Ano Liosia',
                'Nea Ionia',
                'Rethymno',
                'Ptolemaida',
                'Tripoli',
                'Cholargos',
                'Vrilissia',
                'Aspropyrgos',
                'Corinth',
                'Gerakas',
                'Metamorfosi',
                'Giannitsa',
                'Voula',
                'Kamatero',
                'Mytilene',
                'Neapoli',
                'Eleftherio-Kordelio',
                'Chios',
                'Agia Varvara',
                'Kaisariani',
                'Nea Filadelfeia',
                'Moschato',
                'Perama',
                'Salamina',
                'Eleusis',
                'Corfu',
                'Pyrgos',
                'Megara',
                'Kilkis',
                'Dafni',
                'Thebes',
                'Melissia',
                'Argos',
                'Arta',
                'Artemida',
                'Livadeia',
                'Pefki',
                'Oraiokastro',
                'Aigio',
                'Kos',
                'Koropi',
                'Preveza',
                'Naousa',
                'Orestiada',
                'Peraia',
                'Edessa',
                'Florina',
                'Panorama',
                'Nea Erythraia',
                'Elliniko',
                'Amaliada',
                'Pallini',
                'Sparta',
                'Agios Ioannis Rentis',
                'Thermi',
                'Vari',
                'Nea Makri',
                'Tavros',
                'Alexandreia',
                'Menemeni',
                'Paiania',
                'Kalyvia Thorikou',
                'Nafplio',
                'Drapetsona',
                'Efkarpia',
                'Papagou',
                'Nafpaktos',
                'Kastoria',
                'Grevena',
                'Pefka',
                'Nea Alikarnassos',
                'Missolonghi',
                'Gazi',
                'Ierapetra',
                'Kalymnos',
                'Rafina',
                'Loutraki',
                'Agios Nikolaos',
                'Ermoupoli',
                'Ialysos',
                'Mandra',
                'Tyrnavos',
                'Glyka Nera',
                'Ymittos',
                'Neo Psychiko'],
            doy: "hwe",
            headers: [
                {
                    text: "ΠΕΡΙΓΡΑΦΗ ΑΓΑΘΩΝ",
                    align: "center",
                    sortable: true,
                    value: "name",
                    width: "600px"
                },
                {
                    text: "Μ.Μ",
                    value: "min",
                    sortable: true,
                    align: "center"
                },
                {
                    text: "ΠΟΣΟΤΗΣ",
                    value: "mean",
                    sortable: true,
                    align: "center"
                },
                {
                    text: "ΤΙΜΗ ΜΟΝΑΔΑΣ",
                    value: "max",
                    sortable: true,
                    align: "center"
                },
                {
                    text: "ΦΠΑ",
                    value: "max",
                    sortable: true,
                    align: "center"
                }
            ],
            details: [],
            file: '',
            mMap: '',
            myCenter: [23.727539 ,37.983810]
        };
    },
    created () {
        const token = localStorage.getItem('access_token')
        axios.defaults.headers.common['Authorization'] = token
        // var submitCoords = 'yolo';
        this.init_details()
        console.log(token)
        window.addEventListener('keydown', (e) => {
            if(e.key == 'Enter') {
                this.submit();
            }
        });
    },
    mounted () {
        // if(this.flag1==0) {
            this.init_map();
            // this.flag1=1;
        // }
        
    },
    methods: {
        async init_map() {
            mapboxgl.accessToken = 'pk.eyJ1IjoiZ2Vvcmdla2wiLCJhIjoiY2s2bTc1dWJpMGwxMDNvbHN5aWx2dDRicyJ9.vOUIsWK8lxaqqYidj8w9uQ';
            var map = new mapboxgl.Map({
                container: 'map',
                style: 'mapbox://styles/mapbox/streets-v11',
                center:  [23.727539,37.983810],
                zoom: 3.9,
                attributionControl: false
            });            
            var draw = new MapboxDraw({
                // Instead of showing all the draw tools, show only the line string and delete tools
                displayControlsDefault: false,
                controls: {
                    line_string: true,
                    trash: true
                },
                styles: [
                    // Set the line style for the user-input coordinates
                    {
                    "id": "gl-draw-line",
                    "type": "line",
                    "filter": ["all", ["==", "$type", "LineString"],
                        ["!=", "mode", "static"]
                    ],
                    "layout": {
                        "line-cap": "round",
                        "line-join": "round"
                    },
                    "paint": {
                        "line-color": "#438EE4",
                        "line-dasharray": [0.2, 2],
                        "line-width": 4,
                        "line-opacity": 0.7
                    }
                    },
                    // Style the vertex point halos
                    {
                    "id": "gl-draw-polygon-and-line-vertex-halo-active",
                    "type": "circle",
                    "filter": ["all", ["==", "meta", "vertex"],
                        ["==", "$type", "Point"],
                        ["!=", "mode", "static"]
                    ],
                    "paint": {
                        "circle-radius": 12,
                        "circle-color": "#FFF"
                    }
                    },
                    // Style the vertex points
                    {
                    "id": "gl-draw-polygon-and-line-vertex-active",
                    "type": "circle",
                    "filter": ["all", ["==", "meta", "vertex"],
                        ["==", "$type", "Point"],
                        ["!=", "mode", "static"]
                    ],
                    "paint": {
                        "circle-radius": 8,
                        "circle-color": "#438EE4",
                    }
                    },
                ]
            });

            var popup = new mapboxgl.Popup({ closeOnClick: false })
                .setLngLat([19.5000, 32.586162])
                .setHTML('<h3 style="color:black;font-size:9.1px;">Πατήστε το εικονίδιο πάνω δεξιά για να σχεδιάσετε τη διαδρομή σας</br>Μετά, πατήστε την τελευταία κουκίδα για επικύρωση</h3>')
                .addTo(map);
            

            // Add the draw tool to the map
            map.addControl(draw);
            map.on('draw.delete', removeRoute);
            // var delBut = document.getElementsByClassName('mapbox-gl-draw_ctrl-draw-btn.mapbox-gl-draw_trash');
            // delBut.onclick = (e) => {
            //     map.removeLayer('route');
            // }
            var myCenter = "23.727539 ,37.983810;23.727539 ,37.983810"
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
                map.on('click',  function(e) {
                    console.log(e.lngLat);
                    });
                    // Change the cursor to a pointer when the mouse is over the places layer.
                    map.on('draw.create', updateRoute);
                    map.on('draw.update', updateRoute);
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
                var first = 0;
                if(first!=0) {
                    first = 1;
                    var splitted = coordinates.split(";",2)
                    console.log([splitted[0]])
                    var splity = splitted[0].split(",",2)
                    console.log([splity[0]])
                    var marker = new mapboxgl.Marker({offset: {
                        x: -50,
                        y: -142
                    }})
                        .setLngLat([parseInt(splity[0]),parseInt(splity[1])])
                        .addTo(map);
                }
                var query = "https://api.mapbox.com/directions/v5/mapbox/driving/"+coordinates+"?geometries=geojson&steps=true&access_token=" + mapboxgl.accessToken;
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
                submitCoords = coordinates;
                console.log(submitCoords)
                xhr.send();
            };

            function removeRoute() {
                if (map.getSource('route')) {
                    map.removeLayer('route');
                    map.removeSource('route');
                } else {
                    return;
                }
            }
        },
        submit() {
            const token = localStorage.getItem('access_token')
            axios.defaults.headers.common['Authorization'] = token
            this.file = this.$refs.file.files[0];
            console.log("in submit"+submitCoords);
            // console.log(this.details)
            let formData = new FormData();
            if(this.file != null) {
                console.log("yolo")
                formData.append('file', this.file);
                console.log(formData.get("file"))
            }
            else {
                console.log("no file")
            }
            formData.set('name',this.company_name);
            formData.set('job',this.job);
            formData.set('VatRegistrationNum',this.afm);
            formData.set('address',this.address);
            formData.set('city',this.city1);
            formData.set('loadingPlace',this.place_of_loading);
            formData.set('taxOffice',this.doy);
            formData.set('destination',this.destination);
            formData.set('coordinates',submitCoords);
            // formData.set('details',this.details);
            axios.post('http://10.64.92.213:5000/deliveryNotes/createDeliveryNote', formData,
                { headers: {'Content-Type': 'multipart/form-data'}}
            )
            .then(response => {
                console.log(response)
                console.log('Delivery Note created!');
                this.snackbar_created = true;
                sleep(1500).then(() => {
                    this.$router.replace({ name: "deliverynotes"});
                })
            })
            .catch(function(error) {
                console.log(error);
            });
        },
        init_details() {
            this.details = [{},{},{},{},{}];
        },
        add_row() {
            this.details.push({});
        },
        
    }
}
</script>

<style scoped>
    #secure {
        background-color: #FFFFFF;
        border: 1px solid #CCCCCC;
        padding: 20px;
        margin-top: 10px;
    }
    #map {
        margin-left: 5px;
        margin-right: 5px;
        position: relative;
    }
    /* .marker {
    display: block;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    padding: 0;
    } */
    #info {
    display: block;
    position: relative;
    margin: 0px auto;
    width: 50%;
    padding: 10px;
    border: none;
    border-radius: 3px;
    font-size: 12px;
    text-align: center;
    color: #222;
    background: #fff;
    }

</style>
