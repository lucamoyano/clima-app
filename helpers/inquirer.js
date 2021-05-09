let inquirer = require ('inquirer');
require('colors');

const questions = [
    {
        type: 'list',
        name: 'opcion',
        message: '¿Qué desea hacer?',
        choices: [
            {
                value: 1,
                name:`${'1.'.green} Buscar ciudad`
            },
            {
                value: 2,
                name:`${'2.'.green} Historial`
            },
            {
                value: 0,
                name:`${'0'.green}. Salir`
            },
        ]
    }
];


const inquirerMenu = async() => {
    console.clear();
    console.log('=============================='.green);
    console.log('    Seleccione una opción'.white);
    console.log('==============================\n'.green);

    const { opcion } = await inquirer.prompt(questions); //Esperar opción

    return opcion;
}

const pause = async() => { 
    const question = [
        {
            type: 'input',
            name: 'enter',
            message: `Presione ${'ENTER'.green} para continuar`
        }
    ]
    console.log('\n');
    await inquirer.prompt(question);    
}

const readInput = async( message ) => {
    const question = [
        {
            type: 'input',
            name: 'desc',
            message,
            validate( value ){
                if(value.length === 0) {
                    return 'Por favor ingrese un valor';
                }
                return true;
            }
            
        }
    ];

    const { desc } = await inquirer.prompt(question);
    return desc;
}


const listarlugares = async( lugares = [] ) => {
    
    const choices = lugares.map( (lugar, i) => {

        const idx = `${ i + 1 }`.green;

        return {
            value: lugar.id,
            name: `${ idx } ${ lugar.nombre }`
        }
    });

    choices.unshift({
        value: '0',
        name: '0.'.green + ' Cancelar'
    });

    const preguntas = [
        {
            type: 'list',
            name: 'id',
            message: 'Borrar',
            choices
        }
    ]

    const { id } = await inquirer.prompt(preguntas);
    return id;
}

const confirm = async( message ) => {
    const question = [
        {
            type: 'confirm',
            name: 'ok',
            message
        }
    ]
    const { ok } = await inquirer.prompt(question);
    return ok;
}

const showListChecklist = async( tareas = [] ) => {
    
    const choices = tareas.map( (tarea, i) => {

        const idx = `${ i + 1 }`.green;

        return {
            value: tarea.id,
            name: `${ idx } ${ tarea.desc }`,
            checked: ( tarea.completadoEn ) ? true : false
        }
    });


    const pregunta = [
        {
            type: 'checkbox',
            name: 'ids',
            message: 'Seleccione lugar:',
            choices
        }
    ]

    const { ids } = await inquirer.prompt(pregunta);
    return ids;
}

module.exports = {
    inquirerMenu,
    pause,
    readInput,
    listarlugares,
    confirm,

    showListChecklist
};
