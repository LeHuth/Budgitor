<script setup>
import fs from 'fs'
import pathModule from 'path'
import Papa from 'papaparse';
/*
import { app } from '@electron/remote'*/
import {computed, ref} from 'vue'
console.log(process.cwd())
const path = ref(process.cwd().toString())
const csvData = ref()

const files = computed(()=>{
  const listing = []
  let files = fs.readdirSync(path.value, {withFileTypes:true})
  files.forEach(entry => {
  const stats = fs.lstatSync(pathModule.join(path.value, entry.name))
        if(stats.isDirectory()){
          listing.push({name:entry.name, isDirectory:true})
        } else {
          listing.push({name:entry.name, isDirectory:false})
        }
  })
  return listing
})

function loadCSV(event) {
  const files = event.target.files;
  if (files.length === 0) return;

  const fileReader = new FileReader();

  fileReader.onload = (e) => {
    const content = e.target.result;
    fileReader.readAsText(files[0], 'ISO-8859-1')
    // Parse the CSV content
    // Using PapaParse here, but you could use any parser you like
    Papa.parse(content, {
      header: true, // Set to true if your CSV has a header row
      skipEmptyLines: true,
      encoding: "ISO-8859-1",
      complete: (results) => {
        csvData.value = results.data;
        console.log(csvData.value);
        // Now you can use this.csvData in your program
      }
    });

  };

  fileReader.onerror = () => {
    // Handle errors
    console.error("Error reading the file");
  };

  // Read the file as text
  fileReader.readAsText(files[0]);
}


</script>

<template>
  <h1>HEHE</h1>
  <input type="file" @change="loadCSV" />

<!--  <table>
    <thead>
    <tr>
      <th v-for="entry in csvData.value[7].extra_" :key="entry">{{entry}}</th>
    </tr>
    </thead>

  </table>-->
<table v-if="csvData">
    <thead>
    <tr>
      <th v-for="entry in csvData[8].__parsed_extra" :key="entry">{{entry}}</th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="entry in csvData.slice(9)" :key="entry">
      <td v-for="item in entry.__parsed_extra" :key="item">{{item}}</td>
    </tr>
    </tbody>
  </table>
  <ul>
    <li v-for="entry in csvData" :key="entry">{{entry}}</li>
  </ul>
  <p v-if="csvData">{{csvData[8]}}</p>
<!--  <button @click="path = pathModule.join(path, '..')">Back</button>
  <ul>
    <li  v-for="elem in files" :key="elem"><button :disabled="!elem.isDirectory" :style="elem.isDirectory ? 'cursor:pointer' : ''" @click="path = pathModule.join(path, elem.name)">{{elem}}</button></li>
  </ul>-->
</template>