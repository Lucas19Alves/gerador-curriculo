<script setup>
defineProps({
  data: Object
})
</script>

<template>
  <div class="h-full flex flex-col" :style="{ fontFamily: data.design.fontFamily }">
    <!-- Header -->
    <header class="p-12 text-white" :style="{ backgroundColor: data.design.primaryColor }">
      <div class="flex items-start justify-between">
        <div class="flex-1">
          <h1 class="text-4xl font-bold tracking-tight mb-2">{{ data.personal.fullName || 'SEU NOME COMPLETO' }}</h1>
          <div class="flex flex-wrap gap-4 text-sm opacity-90">
            <span v-if="data.personal.email">{{ data.personal.email }}</span>
            <span v-if="data.personal.phone">{{ data.personal.phone }}</span>
            <span v-if="data.personal.address">{{ data.personal.address }}</span>
          </div>
        </div>
        <div v-if="data.personal.photo" class="w-32 h-32 border-4 border-white/20 rounded-xl overflow-hidden shadow-lg">
          <img :src="data.personal.photo" class="w-full h-full object-cover">
        </div>
      </div>
    </header>

    <div class="flex-1 p-12 grid grid-cols-12 gap-8">
      <!-- Left Column -->
      <div class="col-span-8 space-y-8">
        <!-- Summary -->
        <section v-if="data.personal.summary">
          <h3 class="text-lg font-bold uppercase tracking-wider mb-3 border-b-2 pb-1" :style="{ color: data.design.primaryColor, borderColor: data.design.primaryColor }">
            Resumo Profissional
          </h3>
          <p class="text-slate-700 leading-relaxed text-justify whitespace-pre-line">{{ data.personal.summary }}</p>
        </section>

        <!-- Experience -->
        <section v-if="data.experience.length > 0">
          <h3 class="text-lg font-bold uppercase tracking-wider mb-4 border-b-2 pb-1" :style="{ color: data.design.primaryColor, borderColor: data.design.primaryColor }">
            Experiência Profissional
          </h3>
          <div class="space-y-6">
            <div v-for="exp in data.experience" :key="exp.id" class="relative pl-4 border-l-2 border-slate-100">
              <div class="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white border-2" :style="{ borderColor: data.design.primaryColor }"></div>
              <div class="flex justify-between items-start mb-1">
                <h4 class="font-bold text-slate-900">{{ exp.role }}</h4>
                <span class="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">{{ exp.period }}</span>
              </div>
              <div class="text-sm font-semibold text-slate-600 mb-2">{{ exp.company }}</div>
              <p class="text-slate-600 text-sm whitespace-pre-line">{{ exp.description }}</p>
            </div>
          </div>
        </section>
      </div>

      <!-- Right Column -->
      <div class="col-span-4 space-y-8">
        <!-- Education -->
        <section v-if="data.education.length > 0">
          <h3 class="text-lg font-bold uppercase tracking-wider mb-4 border-b-2 pb-1" :style="{ color: data.design.primaryColor, borderColor: data.design.primaryColor }">
            Formação
          </h3>
          <div class="space-y-4">
            <div v-for="edu in data.education" :key="edu.id">
              <h4 class="font-bold text-slate-900 text-sm">{{ edu.degree }}</h4>
              <div class="text-xs text-slate-600">{{ edu.institution }}</div>
              <div class="text-[10px] text-slate-400 font-medium">{{ edu.year }}</div>
            </div>
          </div>
        </section>

        <!-- Skills -->
        <section v-if="data.skills.length > 0">
          <h3 class="text-lg font-bold uppercase tracking-wider mb-4 border-b-2 pb-1" :style="{ color: data.design.primaryColor, borderColor: data.design.primaryColor }">
            Habilidades
          </h3>
          <div class="flex flex-wrap gap-2">
            <span v-for="skill in data.skills" :key="skill" class="bg-slate-100 text-slate-700 px-3 py-1 rounded text-xs font-medium border border-slate-200">
              {{ skill }}
            </span>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>
