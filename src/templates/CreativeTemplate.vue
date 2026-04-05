<script setup>
defineProps({
  data: Object
})
</script>

<template>
  <div class="h-full flex flex-col p-16 bg-slate-50 overflow-hidden relative" :style="{ fontFamily: 'sans-serif' }">
    <!-- Dynamic Color Bar -->
    <div class="absolute top-0 left-0 w-full h-4" :style="{ backgroundColor: data.design.primaryColor }"></div>

    <!-- Header with Dynamic Shape -->
    <header class="relative mb-12 flex items-end gap-10">
      <div v-if="data.personal.photo" class="w-40 h-40 rounded-full overflow-hidden border-8 border-white shadow-2xl z-10">
        <img :src="data.personal.photo" class="w-full h-full object-cover">
      </div>
      
      <div class="flex-1 pb-4">
        <h1 class="text-5xl font-black text-slate-900 leading-none mb-4 tracking-tighter uppercase">{{ data.personal.fullName || 'NOME' }}</h1>
        <div class="flex flex-wrap gap-4 text-xs font-bold uppercase tracking-widest text-slate-400">
          <span v-if="data.personal.email" class="bg-white px-3 py-1 rounded-full shadow-sm">{{ data.personal.email }}</span>
          <span v-if="data.personal.phone" class="bg-white px-3 py-1 rounded-full shadow-sm">{{ data.personal.phone }}</span>
        </div>
      </div>
    </header>

    <div class="grid grid-cols-12 gap-12 flex-1">
      <!-- Main -->
      <div class="col-span-8 space-y-12">
        <section v-if="data.personal.summary">
          <h3 class="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
            <span class="w-2 h-8 rounded-full" :style="{ backgroundColor: data.design.primaryColor }"></span>
            SOBRE MIM
          </h3>
          <p class="text-slate-600 leading-relaxed text-sm font-medium whitespace-pre-line">{{ data.personal.summary }}</p>
        </section>

        <section v-if="data.experience.length > 0">
          <h3 class="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
            <span class="w-2 h-8 rounded-full" :style="{ backgroundColor: data.design.primaryColor }"></span>
            EXPERIÊNCIA
          </h3>
          <div class="space-y-10">
            <div v-for="exp in data.experience" :key="exp.id" class="relative group">
              <div class="absolute -left-4 top-0 w-1 h-full bg-slate-200 group-hover:bg-primary-500 transition-colors"></div>
              <div class="flex justify-between items-baseline mb-2">
                <h4 class="font-black text-slate-900 text-lg tracking-tight uppercase">{{ exp.role }}</h4>
                <span class="text-[10px] font-black text-slate-400 bg-white px-3 py-1 rounded-full shadow-sm">{{ exp.period }}</span>
              </div>
              <div class="text-sm font-black italic mb-4" :style="{ color: data.design.primaryColor }">{{ exp.company }}</div>
              <p class="text-slate-500 text-sm font-medium leading-relaxed">{{ exp.description }}</p>
            </div>
          </div>
        </section>
      </div>

      <!-- Aside -->
      <div class="col-span-4 space-y-12">
        <section v-if="data.skills.length > 0">
          <h3 class="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
            <span class="w-2 h-8 rounded-full" :style="{ backgroundColor: data.design.primaryColor }"></span>
            SKILLS
          </h3>
          <div class="flex flex-wrap gap-2">
            <span v-for="skill in data.skills" :key="skill" class="bg-white text-slate-800 px-4 py-2 rounded-xl text-xs font-black shadow-sm border border-slate-100 uppercase tracking-tighter">
              {{ skill }}
            </span>
          </div>
        </section>

        <section v-if="data.education.length > 0">
          <h3 class="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
            <span class="w-2 h-8 rounded-full" :style="{ backgroundColor: data.design.primaryColor }"></span>
            EDUCAÇÃO
          </h3>
          <div class="space-y-6">
            <div v-for="edu in data.education" :key="edu.id" class="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
              <h4 class="font-black text-slate-900 text-sm uppercase tracking-tight">{{ edu.degree }}</h4>
              <div class="text-xs text-slate-400 font-black mt-2 italic">{{ edu.institution }}</div>
              <div class="text-[10px] font-black mt-4 px-3 py-1 bg-slate-50 rounded-full inline-block text-slate-500">{{ edu.year }}</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>
