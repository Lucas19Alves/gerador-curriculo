<script setup>
defineProps({
  data: Object
})
</script>

<template>
  <div class="h-full p-16 flex flex-col items-center" :style="{ fontFamily: 'serif' }">
    <!-- Header -->
    <header class="text-center mb-10 w-full border-b-2 pb-6 border-slate-900">
      <h1 class="text-4xl font-serif font-bold tracking-tight mb-3 uppercase tracking-widest text-slate-900">
        {{ data.personal.fullName || 'SEU NOME COMPLETO' }}
      </h1>
      <div class="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-slate-600 font-medium">
        <span v-if="data.personal.email">{{ data.personal.email }}</span>
        <span v-if="data.personal.phone" class="before:content-['|'] before:mr-4">{{ data.personal.phone }}</span>
        <span v-if="data.personal.address" class="before:content-['|'] before:mr-4">{{ data.personal.address }}</span>
      </div>
    </header>

    <div class="w-full space-y-10">
      <!-- Summary -->
      <section v-if="data.personal.summary" class="text-center italic text-slate-700 max-w-2xl mx-auto whitespace-pre-line">
        <p class="leading-relaxed">{{ data.personal.summary }}</p>
      </section>

      <!-- Experience -->
      <section v-if="data.experience.length > 0">
        <h3 class="text-sm font-bold uppercase tracking-[0.2em] mb-4 text-center border-b border-slate-300 pb-1 mx-auto max-w-xs">
          Experiência Profissional
        </h3>
        <div class="space-y-8">
          <div v-for="exp in data.experience" :key="exp.id">
            <div class="flex justify-between items-baseline mb-1">
              <h4 class="font-bold text-slate-900 text-lg uppercase tracking-wide">{{ exp.role }}</h4>
              <span class="text-xs font-bold text-slate-500 uppercase">{{ exp.period }}</span>
            </div>
            <div class="text-sm font-bold italic text-slate-600 mb-3">{{ exp.company }}</div>
            <p class="text-slate-700 text-sm whitespace-pre-line leading-relaxed">{{ exp.description }}</p>
          </div>
        </div>
      </section>

      <!-- Education -->
      <section v-if="data.education.length > 0">
        <h3 class="text-sm font-bold uppercase tracking-[0.2em] mb-4 text-center border-b border-slate-300 pb-1 mx-auto max-w-xs">
          Formação Acadêmica
        </h3>
        <div class="grid grid-cols-2 gap-8">
          <div v-for="edu in data.education" :key="edu.id" class="text-center">
            <h4 class="font-bold text-slate-900 text-base">{{ edu.degree }}</h4>
            <div class="text-sm text-slate-600 italic">{{ edu.institution }}</div>
            <div class="text-xs text-slate-500 font-bold mt-1">{{ edu.year }}</div>
          </div>
        </div>
      </section>

      <!-- Skills -->
      <section v-if="data.skills.length > 0">
        <h3 class="text-sm font-bold uppercase tracking-[0.2em] mb-4 text-center border-b border-slate-300 pb-1 mx-auto max-w-xs">
          Competências
        </h3>
        <div class="flex flex-wrap justify-center gap-x-6 gap-y-2">
          <span v-for="skill in data.skills" :key="skill" class="text-slate-700 text-sm font-medium">
            &bull; {{ skill }}
          </span>
        </div>
      </section>
    </div>
  </div>
</template>
