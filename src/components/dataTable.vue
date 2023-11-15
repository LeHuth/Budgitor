<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-base font-semibold leading-6 text-gray-900">Invoice</h1>
        <p class="mt-2 text-sm text-gray-700">For work completed from <time datetime="2022-08-01">August 1, 2022</time> to <time datetime="2022-08-31">August 31, 2022</time>.</p>
      </div>
      <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
        <button type="button" class="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Print</button>
      </div>
    </div>
    <div class="mt-8 flow-root sm:mx-0">
      <table class="min-w-full border-separate border-spacing-0">
        <colgroup>
          <col class="w-full sm:w-1/2" />
          <col class="sm:w-1/6" />
          <col class="sm:w-1/6" />
          <col class="sm:w-1/6" />
        </colgroup>
        <thead class="border-b border-gray-300 text-gray-900">
        <tr class="px-8">
          <th scope="col" class="py-3.5 px-4 pr-3 text-left text-sm font-semibold text-gray-900">Source</th>
          <th scope="col" class="hidden px-3 py-3.5 text-right text-sm font-semibold text-gray-900 sm:table-cell">Category</th>
          <th scope="col" class="hidden px-3 py-3.5 text-right text-sm font-semibold text-gray-900 sm:table-cell">Date</th>
          <th scope="col" class="hidden px-3 py-3.5 text-right text-sm font-semibold text-gray-900 sm:table-cell">Amount</th>
          <th scope="col" class="py-3.5 px-3 pr-4 text-right text-sm font-semibold text-gray-900 " >Balance</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="project in props.data" :key="project.id" class="border-b border-gray-400 cursor-pointer hover:bg-background-100 transition-colors">
            <!-- class="border-b bg-background-200 border-2 rounded-3xl border-gray-200 cursor-pointer hover:bg-background-100 transition-colors" -->
            <td class="max-w-0 py-5 px-4 text-sm rounded-bl-3xl rounded-tl-3xl">
              <div class="font-medium text-text-900">{{ project.source }}</div>
              <div class="mt-1 truncate text-text-500">{{ project.reason }}</div>
            </td>
            <td class="hidden px-3 py-5 text-right text-sm text-gray-500 sm:table-cell">{{ !project.category_id ? 'no category' : '' }}</td>
            <td class="hidden px-3 py-5 text-right text-sm text-gray-500 sm:table-cell">{{ project.date }}</td>
            <td  class="hidden px-3 py-5 text-right  text-sm sm:table-cell" :class="{ 'text-primary-500 font-bold' : colorAmount(project.amount), 'text-accent-500 font-bold' : !colorAmount(project.amount)}">{{ project.amount }}€</td>
            <td class="py-5 px-3 text-right text-sm text-gray-500 rounded-br-3xl rounded-tr-3xl">{{ project.balance }}€</td>


        </tr>
        </tbody>
        <tfoot>
        <tr>
          <th scope="row" colspan="3" class="hidden pl-4 pr-3 pt-6 text-right text-sm font-normal text-gray-500 sm:table-cell sm:pl-0">Subtotal</th>
          <th scope="row" class="pl-4 pr-3 pt-6 text-left text-sm font-normal text-gray-500 sm:hidden">Subtotal</th>
          <td class="pl-3 pr-4 pt-6 text-right text-sm text-gray-500 sm:pr-0">$8,800.00</td>
        </tr>
        <tr>
          <th scope="row" colspan="3" class="hidden pl-4 pr-3 pt-4 text-right text-sm font-normal text-gray-500 sm:table-cell sm:pl-0">Tax</th>
          <th scope="row" class="pl-4 pr-3 pt-4 text-left text-sm font-normal text-gray-500 sm:hidden">Tax</th>
          <td class="pl-3 pr-4 pt-4 text-right text-sm text-gray-500 sm:pr-0">$1,760.00</td>
        </tr>
        <tr>
          <th scope="row" colspan="3" class="hidden pl-4 pr-3 pt-4 text-right text-sm font-semibold text-gray-900 sm:table-cell sm:pl-0">Total</th>
          <th scope="row" class="pl-4 pr-3 pt-4 text-left text-sm font-semibold text-gray-900 sm:hidden">Total</th>
          <td class="pl-3 pr-4 pt-4 text-right text-sm font-semibold text-gray-900 sm:pr-0">$10,560.00</td>
        </tr>
        </tfoot>
      </table>
    </div>
  </div>
</template>

<script setup>
import {computed, defineProps} from 'vue'
const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
})

const colorAmount = (value)=>{
  console.log(typeof value)
  return value.includes('-')
}
</script>

<style scoped>

</style>