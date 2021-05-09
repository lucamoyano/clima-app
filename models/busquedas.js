const fs = require ('fs');
const axios = require('axios');

class Busquedas {

    historial = [];
    dbPath = './db/database.json';

    constructor() {
        this.leerDB();
    }
   
    get historialCapitalizado() {
        //Capitalizar cada palabra
        this.historial.forEach( (l, i )=> {
            this.historial[i] = l.replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));
        });
        
        return this.historial
    }

    get paramsMapBox() {
        return {
            'access_token': process.env.MAPBOX_KEY,
            'limit': 5,
            'language': 'es'
        }
    }

    get paramsOpenWeather(){
        return {
            appid: process.env.OPENWEATHER_KEY,
            units: 'metric',
            lang: 'es'
        }
    }

    async ciudad( lugar = '' ){
        
        try {
           const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.paramsMapBox     
            });
            const { data:{features} } = await instance.get();
            return features.map( lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1]
            }));

        } catch (error) {
            return [];
        }
    }

    async climaLugar( lat, lon ){
        try{
            const instance = axios.create({
                baseURL: 'https://api.openweathermap.org/data/2.5/weather',
                params:{
                    ...this.paramsOpenWeather,
                    lat, 
                    lon
                }
            });
            const { data } = await instance.get();
            const { weather, main } = data;
            return {
                desc: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp
            };
        } catch (error) {
            return [];
        }
    }

    agregarHistorial( lugar = '' ){
        if( this.historial.includes( lugar.toLocaleLowerCase() ) ){
            return
        }
        this.historial = this.historial.splice(0, 5); //Cortar de la posición 0 a la 5
        this.historial.unshift( lugar.toLocaleLowerCase() ); //Agregar al inicio

        //Guardar en dbPath
        this.guardarDB();
    }

    guardarDB(){
        const payload = {
            historial: this.historial
        };

        fs.writeFileSync( this.dbPath, JSON.stringify(payload) )
    }

    leerDB(){

        if( !fs.existsSync(this.dbPath) ){
            return null;
        }
    
        const info = fs.readFileSync(this.dbPath, { encoding: 'utf-8' });
        const { historial } = JSON.parse( info );
    
        this.historial = historial;
    }

}


module.exports = Busquedas;