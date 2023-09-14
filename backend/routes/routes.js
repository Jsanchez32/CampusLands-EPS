import express from 'express';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

const client = new MongoClient(process.env.DBEPS);

const db = client.db('campusEPS');


const pacientes = db.collection('usuario');
const citas = db.collection('cita');
const medicos = db.collection('medico');
const especialidad = db.collection('especialidad');
const consultorios = db.collection('consultorio');

//1//
router.get('/req1',async (req,res)=>{
    try {
        await client.connect();
        const result = await pacientes.find().sort({usu_nombre:1}).toArray();
        res.send(result);
    } catch (error) {
        console.log(error);
    }
})

//3//
router.get('/req3',async (req,res)=>{
    try {
        await client.connect();
        const result = await especialidad.aggregate([{$lookup : {
            from:'medico',
            localField: 'esp_id',
            foreignField: 'med_especialidad',
            as:'medico'}},
            {$match:{esp_nombre:'Cirugía General'}}]).toArray();
        res.send(result);
    } catch (error) {
        console.log(error);
    }
})

router.get('/req4',async (req,res)=>{
    try {
        await client.connect();
        const result = await pacientes.aggregate([{$lookup : {
            from:'cita',
            localField: 'esp_id',
            foreignField: 'med_especialidad',
            as:'medico'}},
            {$match:{esp_nombre:'Cirugía General'}}]).toArray();
        res.send(result);
    } catch (error) {
        console.log(error);
    }
})

//6//
router.get('/req6',async (req,res)=>{
    try {
        await client.connect();
        const result = await citas.find({cit_fecha:'2023-05-23'}).toArray();
        res.send(result);
    } catch (error) {
        console.log(error);
    }
})

//7//

router.get('/req7',async (req,res)=>{
    try {
        await client.connect();
        const result = await medicos.aggregate([{$lookup : {
            from:'consultorio',
            localField: 'med_consultorio',
            foreignField: 'cons_codigo',
            as:'medico'}},]).toArray();
        res.send(result);
    } catch (error) {
        console.log(error);
    }
})

export default router;