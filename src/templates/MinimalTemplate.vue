<script setup>
defineProps({
  data: Object
})
</script>

<template>
  <div class="h-full p-16 flex flex-col" :style="{ fontFamily: 'sans-serif' }">
    <!-- Header -->
    <header class="mb-12">
      <h1 class="text-3xl font-bold tracking-tight mb-2 text-slate-900 uppercase tracking-widest">{{ data.personal.fullName || 'SEU NOME COMPLETO' }}</h1>
      <div class="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 font-medium">
        <span v-if="data.personal.email">{{ data.personal.email }}</span>
        <span v-if="data.personal.phone" class="before:content-['•'] before:mr-4">{{ data.personal.phone }}</span>
        <span v-if="data.personal.address" class="before:content-['•'] before:mr-4">{{ data.personal.address }}</span>
      </div>
    </header>

    <div class="space-y-12">
      <!-- Summary -->
      <section v-if="data.personal.summary" class="grid grid-cols-12 gap-8">
        <div class="col-span-3 text-xs font-bold uppercase tracking-widest text-slate-400">Resumo</div>
        <div class="col-span-9 text-slate-700 leading-relaxed text-sm text-justify whitespace-pre-line">
          <p>{{ data.personal.summary }}</p>
        </div>
      </section>

      <!-- Experience -->
      <section v-if="data.experience.length > 0" class="grid grid-cols-12 gap-8">
        <div class="col-span-3 text-xs font-bold uppercase tracking-widest text-slate-400">Experiência</div>
        <div class="col-span-9 space-y-8">
          <div v-for="exp in data.experience" :key="exp.id" class="group">
            <div class="flex justify-between items-baseline mb-2">
              <h4 class="font-bold text-slate-900 text-sm uppercase tracking-wide group-hover:text-primary-600 transition-colors">{{ exp.role }}</h4>
              <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{{ exp.period }}</span>
            </div>
            <div class="text-xs font-bold text-slate-500 mb-2 italic">{{ exp.company }}</div>
            <p class="text-slate-600 text-xs whitespace-pre-line leading-relaxed">{{ exp.description }}</p>
          </div>
        </div>
      </section>

      <!-- Education -->
      <section v-if="data.education.length > 0" class="grid grid-cols-12 gap-8">
        <div class="col-span-3 text-xs font-bold uppercase tracking-widest text-slate-400">Formação</div>
        <div class="col-span-9 space-y-6">
          <div v-for="edu in data.education" :key="edu.id">
            <h4 class="font-bold text-slate-900 text-sm uppercase tracking-wide">{{ edu.degree }}</h4>
            <div class="text-xs text-slate-500 mt-1 italic">{{ edu.institution }}</div>
            <div class="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-widest">{{ edu.year }}</div>
          </div>
        </div>
      </section>

      <!-- Skills -->
      <section v-if="data.skills.length > 0" class="grid grid-cols-12 gap-8">
        <div class="col-span-3 text-xs font-bold uppercase tracking-widest text-slate-400">Habilidades</div>
        <div class="col-span-9">
          <div class="flex flex-wrap gap-x-6 gap-y-2">
            <span v-for="skill in data.skills" :key="skill" class="text-slate-700 text-xs font-medium uppercase tracking-widest">
              {{ skill }}
            </span>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
