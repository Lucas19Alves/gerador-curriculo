<script setup>
defineProps({
  data: Object
})
</script>

<template>
  <div class="h-full flex" :style="{ fontFamily: 'serif' }">
    <!-- Sidebar -->
    <div class="w-1/3 bg-slate-900 text-white p-8 flex flex-col gap-8">
      <div v-if="data.personal.photo" class="w-full aspect-square rounded-full overflow-hidden border-4 border-slate-700">
        <img :src="data.personal.photo" class="w-full h-full object-cover">
      </div>
      
      <div>
        <h1 class="text-2xl font-bold uppercase tracking-widest mb-1">{{ data.personal.fullName || 'NOME' }}</h1>
        <div class="h-1 w-12 mb-4" :style="{ backgroundColor: data.design.primaryColor }"></div>
        <div class="space-y-2 text-xs opacity-80">
          <p v-if="data.personal.email">{{ data.personal.email }}</p>
          <p v-if="data.personal.phone">{{ data.personal.phone }}</p>
          <p v-if="data.personal.address">{{ data.personal.address }}</p>
        </div>
      </div>

      <section v-if="data.education.length > 0">
        <h3 class="text-xs font-bold uppercase tracking-widest mb-4 border-b border-slate-700 pb-1">Educação</h3>
        <div class="space-y-4">
          <div v-for="edu in data.education" :key="edu.id">
            <h4 class="font-bold text-xs">{{ edu.degree }}</h4>
            <p class="text-[10px] opacity-70">{{ edu.institution }}</p>
            <p class="text-[9px] opacity-50 mt-1">{{ edu.year }}</p>
          </div>
        </div>
      </section>

      <section v-if="data.skills.length > 0">
        <h3 class="text-xs font-bold uppercase tracking-widest mb-4 border-b border-slate-700 pb-1">Habilidades</h3>
        <div class="space-y-2">
          <div v-for="skill in data.skills" :key="skill" class="flex items-center gap-2">
            <div class="w-1.5 h-1.5 rounded-full" :style="{ backgroundColor: data.design.primaryColor }"></div>
            <span class="text-xs opacity-80">{{ skill }}</span>
          </div>
        </div>
      </section>
    </div>

    <!-- Main Content -->
    <div class="flex-1 bg-white p-12 space-y-10">
      <section v-if="data.personal.summary">
        <h3 class="text-sm font-bold uppercase tracking-[0.2em] mb-4 text-slate-900 flex items-center gap-3">
          <span class="w-8 h-px bg-slate-300"></span> Perfil
        </h3>
        <p class="text-slate-600 leading-relaxed text-sm italic whitespace-pre-line">{{ data.personal.summary }}</p>
      </section>

      <section v-if="data.experience.length > 0">
        <h3 class="text-sm font-bold uppercase tracking-[0.2em] mb-6 text-slate-900 flex items-center gap-3">
          <span class="w-8 h-px bg-slate-300"></span> Experiência
        </h3>
        <div class="space-y-8">
          <div v-for="exp in data.experience" :key="exp.id">
            <div class="flex justify-between items-baseline mb-2">
              <h4 class="font-bold text-slate-900 text-base uppercase tracking-wider">{{ exp.role }}</h4>
              <span class="text-[10px] font-bold text-slate-400">{{ exp.period }}</span>
            </div>
            <div class="text-sm font-bold mb-3" :style="{ color: data.design.primaryColor }">{{ exp.company }}</div>
            <p class="text-slate-600 text-sm whitespace-pre-line leading-relaxed">{{ exp.description }}</p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
