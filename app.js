require('dotenv').config();

const { readInput, inquirerMenu, pause, listarlugares } = require('./helpers/inquirer');
const Busquedas = require('./models/busquedas');

const main = async() => {
  
    //console.log(process.env); //VARIABLES DE ENTORNO

    const busquedas = new Busquedas();
    let opt = '';
  
    do {
        opt = await inquirerMenu();

        switch( opt ){
            case 1: 
                //Mostrar mensaje
                const busqueda = await readInput('Ciudad: ');

                //Buscar lugares
                const lugares = await busquedas.ciudad( busqueda );
                
                //Seleccionar el lugar
                const id = await listarlugares( lugares );
                if( id === '0' ) continue;

                const lugarSel = lugares.find( l => l.id === id );
                const { nombre, lat, lng } = lugarSel;

                //Guardar en readDB
                busquedas.agregarHistorial( nombre );

                //Clima
                const clima = await busquedas.climaLugar( lat, lng );
                const { desc, min, max, temp } = clima;

                //Mostrar resultados
                console.log('\nInformación de la ciudad\n'.green);
                console.log('Ciudad:', nombre.green);
                console.log('Lat:', lat);
                console.log('Lng:', lng);
                console.log('Temperatura:', temp);
                console.log('Mínima:', min);
                console.log('Máxima:', max);
                console.log('Cómo esta el clima:', desc.green);
                
                
            break;

            case 2:
                busquedas.historialCapitalizado.forEach( (lugar, i) => {
                    const idx = `${ i + 1 }`.green;
                    console.log(`${ idx } ${ lugar }`) 
                })
            break;
        }
        await pause();

    } while( opt !== 0);

}

main();