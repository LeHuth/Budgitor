<script setup>
import fs from 'fs'
import pathModule from 'path'
import Papa from 'papaparse';
import { ipcRenderer } from 'electron'
import {onMounted, ref} from 'vue'

const path = ref(process.cwd().toString())
const csvData = ref([])

const rawData = ref([]);

onMounted(async () => {
  rawData.value = await ipcRenderer.invoke('fetch-raw-data');
});


const loadCSV = (event) => {
  const files = event.target.files;
  if (files.length === 0) return;

  const fileReader = new FileReader();
  fileReader.onload = (e) => {
    const content = e.target.result;
    // Parse the CSV content using PapaParse
    Papa.parse(content, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        // Simplify data for IPC transmission
        csvData.value = results.data.map(item => {
          // Create a plain object, excluding non-serializable properties if any
          return {...item};
        });
      },
      error: (error) => {
        console.error("Error parsing CSV: ", error.message);
      }
    });
  };

  fileReader.onerror = () => {
    console.error("Error reading the file");
  };

  fileReader.readAsText(files[0], 'ISO-8859-1');
};

const sendToDB = () => {
  try {
    // Serialize data to ensure it's safe to send via IPC
    const serializedData = JSON.parse(JSON.stringify(csvData.value.slice(9)));
    ipcRenderer.send('add-raw-data', serializedData);
  } catch (error) {
    console.error("Error sending data to DB: ", error.message);
  }
};
</script>

<template>
  <div>
    <h1 class="font-bold underline">File Processor</h1>
    <button class="m-3 hover:bg-indigo-500 transition-colors bg-indigo-700 py-2 px-4 rounded-3xl font-semibold text-sm text-white" @click="sendToDB">Send to DB</button>
    <input type="file" @change="loadCSV" />
    <table v-if="csvData.length > 0">
      <thead>
      <tr>
        <th v-for="(value, key) in csvData[0]" :key="key">{{ key }}</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(row, index) in csvData" :key="index">
        <td v-for="(value, key) in row" :key="key">{{ value }}</td>
      </tr>
      </tbody>
    </table>
    <table v-if="rawData.length">
      <thead>
      <tr>
        <!-- Adjust the columns according to your table structure -->
        <th>Date</th>
        <th>Source</th>
        <th>Type</th>
        <!-- ... [other columns] -->
      </tr>
      </thead>
      <tbody>
      <tr v-for="row in rawData" :key="row.id">
        <td>{{ row.date }}</td>
        <td>{{ row.source }}</td>
        <td>{{ row.type }}</td>
        <!-- ... [other columns] -->
      </tr>
      </tbody>
    </table>

  </div>

</template>
