<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { 
  User, 
  Briefcase, 
  GraduationCap, 
  Wrench, 
  Layout, 
  ChevronLeft, 
  ChevronRight, 
  Download,
  Plus,
  Trash2,
  GripVertical,
  CheckCircle2,
  FileText,
  Github,
  Linkedin,
  Globe,
  Info,
  AlertTriangle,
  Zap,
  Columns,
  Square,
  Crown,
  Palette,
  Eye,
  Pencil,
  Sparkles
} from 'lucide-vue-next'
import draggable from 'vuedraggable'

// Templates
import ModernTemplate from './templates/ModernTemplate.vue'
import ClassicTemplate from './templates/ClassicTemplate.vue'
import MinimalTemplate from './templates/MinimalTemplate.vue'
import ElegantTemplate from './templates/ElegantTemplate.vue'
import CreativeTemplate from './templates/CreativeTemplate.vue'

import perfilImg from './assets/perfil.jpg'

const steps = [
  { id: 'personal', title: 'Pessoal', icon: User },
  { id: 'experience', title: 'Experiência', icon: Briefcase },
  { id: 'education', title: 'Educação', icon: GraduationCap },
  { id: 'skills', title: 'Habilidades', icon: Wrench },
  { id: 'design', title: 'Design', icon: Layout },
]

const currentStepIndex = ref(0)
const currentStep = computed(() => steps[currentStepIndex.value])

const resumeData = reactive({
  personal: {
    fullName: '',
    title: '',
    email: '',
    phone: '',
    address: '',
    linkedin: '',
    summary: '',
    photo: null
  },
  experience: [],
  education: [],
  skills: [],
  design: {
    template: 'modern',
    primaryColor: '#0ea5e9',
    secondaryColor: '#64748b',
    fontFamily: 'Inter'
  }
})

const nextStep = () => {
  if (currentStepIndex.value < steps.length - 1) {
    currentStepIndex.value++
  }
}

const prevStep = () => {
  if (currentStepIndex.value > 0) {
    currentStepIndex.value--
  }
}

// Modal States
const showAboutModal = ref(false)
const showConfirmModal = ref(false)
const confirmModalConfig = reactive({
  title: '',
  message: '',
  confirmLabel: 'Excluir',
  onConfirm: null
})

const openConfirmModal = (title, message, onConfirm, confirmLabel = 'Excluir') => {
  confirmModalConfig.title = title
  confirmModalConfig.message = message
  confirmModalConfig.confirmLabel = confirmLabel
  confirmModalConfig.onConfirm = onConfirm
  showConfirmModal.value = true
}

const handleConfirm = () => {
  if (confirmModalConfig.onConfirm) {
    confirmModalConfig.onConfirm()
  }
  showConfirmModal.value = false
}

// Helpers
const addExperience = () => {
  resumeData.experience.push({
    id: Date.now(),
    role: '',
    company: '',
    period: '',
    description: ''
  })
}

const removeExperience = (index) => {
  const exp = resumeData.experience[index]
  if (exp.role || exp.company || exp.description) {
    openConfirmModal(
      'Remover experiência?',
      'Deseja excluir esta experiência profissional?',
      () => resumeData.experience.splice(index, 1)
    )
  } else {
    resumeData.experience.splice(index, 1)
  }
}

const addEducation = () => {
  resumeData.education.push({
    id: Date.now(),
    degree: '',
    institution: '',
    year: ''
  })
}

const removeEducation = (index) => {
  const edu = resumeData.education[index]
  if (edu.degree || edu.institution) {
    openConfirmModal(
      'Remover formação?',
      'Deseja excluir esta formação acadêmica?',
      () => resumeData.education.splice(index, 1)
    )
  } else {
    resumeData.education.splice(index, 1)
  }
}

const addSkill = (event) => {
  const value = event.target.value.trim().replace(/,$/, '')
  if (value && !resumeData.skills.includes(value)) {
    resumeData.skills.push(value)
    event.target.value = ''
  }
}

const removeSkill = (skill) => {
  resumeData.skills = resumeData.skills.filter(s => s !== skill)
}

const formatPhone = () => {
  let value = resumeData.personal.phone.replace(/\D/g, '')
  if (value.length > 11) value = value.slice(0, 11)
  
  if (value.length > 10) {
    resumeData.personal.phone = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`
  } else if (value.length > 6) {
    resumeData.personal.phone = `(${value.slice(0, 2)}) ${value.slice(2, 6)}-${value.slice(6)}`
  } else if (value.length > 2) {
    resumeData.personal.phone = `(${value.slice(0, 2)}) ${value.slice(2)}`
  } else if (value.length > 0) {
    resumeData.personal.phone = `(${value}`
  }
}

const onPhotoChange = (e) => {
  const file = e.target.files[0]
  if (!file) return
  // Reduz a foto para 400px: cabe no localStorage e deixa o PDF leve.
  const img = new Image()
  img.onload = () => {
    const scale = Math.min(1, 400 / Math.max(img.width, img.height))
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(img.width * scale)
    canvas.height = Math.round(img.height * scale)
    canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
    resumeData.personal.photo = canvas.toDataURL('image/jpeg', 0.85)
    URL.revokeObjectURL(img.src)
  }
  img.src = URL.createObjectURL(file)
}

// Local Storage
const storageError = ref('')
const saveToLocalStorage = () => {
  try {
    localStorage.setItem('resume-builder-data', JSON.stringify(resumeData))
    storageError.value = ''
  } catch {
    storageError.value = 'Não foi possível salvar no navegador (espaço cheio ou modo privado). Baixe o PDF antes de fechar a página.'
  }
}

const loadFromLocalStorage = () => {
  const saved = localStorage.getItem('resume-builder-data')
  if (!saved) return
  try {
    const parsed = JSON.parse(saved)
    // Mescla campo a campo para que dados antigos ganhem os campos novos.
    Object.assign(resumeData.personal, parsed.personal)
    Object.assign(resumeData.design, parsed.design)
    for (const k of ['experience', 'education', 'skills']) {
      if (Array.isArray(parsed[k])) resumeData[k] = parsed[k]
    }
  } catch {
    localStorage.removeItem('resume-builder-data')
  }
}

const resetData = () => {
  openConfirmModal(
    'Limpar tudo?',
    'Tem certeza que deseja apagar todos os dados do seu currículo? Esta ação não pode ser desfeita.',
    () => {
      localStorage.removeItem('resume-builder-data')
      window.location.reload()
    }
  )
}

// No celular a folha A4 é reduzida para caber na largura da tela.
const previewZoom = ref(1)
const fitPreview = () => {
  previewZoom.value = window.innerWidth < 768 ? Math.min(1, (window.innerWidth - 32) / 794) : 1
}

onMounted(() => {
  loadFromLocalStorage()
  fitPreview()
  window.addEventListener('resize', fitPreview)
})

watch(resumeData, () => {
  saveToLocalStorage()
}, { deep: true })

// Impressão nativa: o PDF sai com texto selecionável (lido por sistemas de RH/ATS) e em várias páginas.
// O título vira o nome sugerido do arquivo.
const downloadPDF = () => {
  const original = document.title
  document.title = `Curriculo - ${resumeData.personal.fullName || 'Meu nome'}`
  window.addEventListener('afterprint', () => (document.title = original), { once: true })
  window.print()
}

const mobileView = ref('edit')

const loadExample = () => {
  const fill = () => {
    Object.assign(resumeData.personal, {
      fullName: 'Mariana Costa',
      title: 'Analista de Marketing Digital',
      email: 'mariana.costa@email.com',
      phone: '(11) 98765-4321',
      address: 'São Paulo, SP',
      linkedin: 'linkedin.com/in/marianacosta',
      summary: 'Analista de marketing com 5 anos de experiência em campanhas de performance e conteúdo. Aumentei em 40% a geração de leads da última empresa com testes A/B e automação de e-mail.'
    })
    resumeData.experience = [
      { id: 1, role: 'Analista de Marketing Pleno', company: 'Loja Verde', period: '2022 – atual', description: '• Planejamento de mídia paga (Google e Meta) com verba mensal de R$ 80 mil\n• Redução de 25% no custo por lead em 6 meses' },
      { id: 2, role: 'Assistente de Marketing', company: 'Agência Norte', period: '2020 – 2022', description: '• Calendário editorial de 12 clientes\n• Relatórios semanais de desempenho' }
    ]
    resumeData.education = [
      { id: 3, degree: 'Publicidade e Propaganda', institution: 'Universidade Paulista', year: '2019' }
    ]
    resumeData.skills = ['Google Ads', 'Meta Ads', 'Google Analytics 4', 'RD Station', 'Excel', 'Inglês avançado']
  }
  const hasData = resumeData.personal.fullName || resumeData.experience.length || resumeData.education.length
  if (hasData) {
    openConfirmModal('Substituir pelos dados de exemplo?', 'O que você preencheu será trocado pelo exemplo.', fill, 'Usar exemplo')
  } else {
    fill()
  }
}

// Templates mapping
const templateComponents = {
  modern: ModernTemplate,
  classic: ClassicTemplate,
  minimal: MinimalTemplate,
  elegant: ElegantTemplate,
  creative: CreativeTemplate
}

const templateInfo = {
  modern: { label: 'Moderno', icon: Zap },
  classic: { label: 'Clássico', icon: Columns },
  minimal: { label: 'Minimalista', icon: Square },
  elegant: { label: 'Elegante', icon: Crown },
  creative: { label: 'Criativo', icon: Palette }
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex flex-col md:flex-row">
    <!-- Sidebar / Form Area -->
    <div :class="['w-full md:w-[500px] md:h-screen md:overflow-y-auto bg-white border-r border-slate-200 p-6 pb-24 md:pb-6 flex-col no-print', mobileView === 'edit' ? 'flex' : 'hidden md:flex']">
      <header class="mb-8 flex justify-between items-start">
        <div>
          <h1 class="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <FileText class="text-primary-600" /> Gerador de Currículo
          </h1>
          <p class="text-slate-500 text-sm">Crie seu currículo profissional em minutos</p>
        </div>
        <div class="flex gap-2">
          <button @click="loadExample" class="text-slate-400 hover:text-primary-600 p-1" title="Preencher com exemplo" aria-label="Preencher com exemplo">
            <Sparkles class="w-5 h-5" />
          </button>
          <button @click="showAboutModal = true" class="text-slate-400 hover:text-primary-600 p-1" title="Sobre" aria-label="Sobre">
            <Info class="w-5 h-5" />
          </button>
          <button @click="resetData" class="text-slate-400 hover:text-red-500 p-1" title="Limpar tudo" aria-label="Limpar tudo">
            <Trash2 class="w-5 h-5" />
          </button>
        </div>
      </header>

      <p v-if="storageError" class="mb-4 text-sm text-amber-800 bg-amber-50 rounded-lg p-3" role="alert">{{ storageError }}</p>

      <!-- Steps Indicator -->
      <nav class="flex justify-between mb-8" aria-label="Etapas">
        <button 
          v-for="(step, index) in steps" 
          :key="step.id"
          type="button"
          :aria-current="currentStepIndex === index ? 'step' : undefined"
          class="flex flex-col items-center gap-1 group cursor-pointer rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-600"
          @click="currentStepIndex = index"
        >
          <div 
            :class="[
              'w-10 h-10 rounded-full flex items-center justify-center transition-all',
              currentStepIndex === index ? 'bg-primary-600 text-white shadow-lg shadow-primary-200' : 
              currentStepIndex > index ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'
            ]"
          >
            <component :is="currentStepIndex > index ? CheckCircle2 : step.icon" class="w-5 h-5" />
          </div>
          <span :class="['text-[10px] font-medium uppercase tracking-wider', currentStepIndex === index ? 'text-primary-600' : 'text-slate-400']">
            {{ step.title }}
          </span>
        </button>
      </nav>

      <!-- Step Content -->
      <main class="flex-1">
        <!-- Step 1: Personal -->
        <div v-if="currentStep.id === 'personal'" class="space-y-4 animate-in fade-in duration-500">
          <h2 class="text-lg font-semibold text-slate-800 mb-4">Informações Pessoais</h2>
          <div class="grid grid-cols-2 gap-4">
            <div class="col-span-2">
              <label class="block text-sm font-medium text-slate-700 mb-1">Nome Completo</label>
              <input v-model="resumeData.personal.fullName" type="text" class="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all" placeholder="Ex: João Silva">
            </div>
            <div class="col-span-2">
              <label class="block text-sm font-medium text-slate-700 mb-1">Cargo desejado</label>
              <input v-model="resumeData.personal.title" type="text" class="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all" placeholder="Ex: Desenvolvedor Front End">
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input v-model="resumeData.personal.email" type="email" class="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all" placeholder="joao@email.com">
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Telefone</label>
              <input v-model="resumeData.personal.phone" @input="formatPhone" type="tel" class="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all" placeholder="(11) 99999-9999">
            </div>
            <div class="col-span-2">
              <label class="block text-sm font-medium text-slate-700 mb-1">Endereço</label>
              <input v-model="resumeData.personal.address" type="text" class="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all" placeholder="Cidade, Estado">
            </div>
            <div class="col-span-2">
              <label class="block text-sm font-medium text-slate-700 mb-1">LinkedIn ou site</label>
              <input v-model="resumeData.personal.linkedin" type="text" class="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all" placeholder="linkedin.com/in/seunome">
            </div>
            <div class="col-span-2">
              <label class="block text-sm font-medium text-slate-700 mb-1">Foto de Perfil <span class="text-slate-400 font-normal">(opcional)</span></label>
              <div class="flex items-center gap-3">
              <input type="file" @change="onPhotoChange" accept="image/*" class="flex-1 text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 cursor-pointer">
              <button v-if="resumeData.personal.photo" type="button" @click="resumeData.personal.photo = null" class="text-sm text-slate-500 hover:text-red-600">Remover</button>
              </div>
            </div>
            <div class="col-span-2">
              <label class="block text-sm font-medium text-slate-700 mb-1">Resumo Profissional</label>
              <textarea v-model="resumeData.personal.summary" rows="4" class="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all" placeholder="Conte um pouco sobre sua carreira..."></textarea>
            </div>
          </div>
        </div>

        <!-- Step 2: Experience -->
        <div v-if="currentStep.id === 'experience'" class="space-y-4 animate-in fade-in duration-500">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-semibold text-slate-800">Experiência Profissional</h2>
            <button @click="addExperience" class="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1">
              <Plus class="w-4 h-4" /> Adicionar
            </button>
          </div>
          
          <draggable v-model="resumeData.experience" item-key="id" handle=".handle">
            <template #item="{ element, index }">
              <div class="p-4 bg-slate-50 border border-slate-200 rounded-xl mb-4 relative group">
                <div class="handle absolute left-2 top-4 text-slate-300 cursor-grab md:opacity-0 group-hover:opacity-100 transition-opacity" title="Arraste para reordenar">
                  <GripVertical class="w-4 h-4" />
                </div>
                <button @click="removeExperience(index)" aria-label="Remover experiência" class="absolute right-2 top-2 text-slate-400 hover:text-red-500 transition-colors">
                  <Trash2 class="w-4 h-4" />
                </button>
                <div class="grid grid-cols-2 gap-3 pl-4">
                  <div class="col-span-2">
                    <input v-model="element.role" type="text" class="w-full bg-transparent border-b border-slate-200 focus:border-primary-500 outline-none py-1 text-sm font-medium" placeholder="Cargo">
                  </div>
                  <div>
                    <input v-model="element.company" type="text" class="w-full bg-transparent border-b border-slate-200 focus:border-primary-500 outline-none py-1 text-xs" placeholder="Empresa">
                  </div>
                  <div>
                    <input v-model="element.period" type="text" class="w-full bg-transparent border-b border-slate-200 focus:border-primary-500 outline-none py-1 text-xs" placeholder="Período (Ex: 2020 - Presente)">
                  </div>
                  <div class="col-span-2">
                    <textarea v-model="element.description" rows="2" class="w-full bg-transparent border border-slate-200 rounded p-2 mt-2 text-xs outline-none focus:ring-1 focus:ring-primary-500" placeholder="Principais realizações (uma por linha, com números quando possível)"></textarea>
                  </div>
                </div>
              </div>
            </template>
          </draggable>
          <p v-if="!resumeData.experience.length" class="text-sm text-slate-500">Nenhuma experiência ainda. Clique em Adicionar. Primeiro emprego? Inclua estágios, freelas ou trabalho voluntário.</p>
        </div>

        <!-- Step 3: Education -->
        <div v-if="currentStep.id === 'education'" class="space-y-4 animate-in fade-in duration-500">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-semibold text-slate-800">Educação</h2>
            <button @click="addEducation" class="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1">
              <Plus class="w-4 h-4" /> Adicionar
            </button>
          </div>
          <draggable v-model="resumeData.education" item-key="id" handle=".handle">
          <template #item="{ element: edu, index }">
          <div class="p-4 bg-slate-50 border border-slate-200 rounded-xl mb-4 relative group">
            <div class="handle absolute left-2 top-4 text-slate-300 cursor-grab md:opacity-0 group-hover:opacity-100 transition-opacity" title="Arraste para reordenar">
              <GripVertical class="w-4 h-4" />
            </div>
            <button @click="removeEducation(index)" aria-label="Remover formação" class="absolute right-2 top-2 text-slate-400 hover:text-red-500">
              <Trash2 class="w-4 h-4" />
            </button>
            <div class="grid grid-cols-2 gap-3 pl-4">
              <div class="col-span-2">
                <input v-model="edu.degree" type="text" class="w-full bg-transparent border-b border-slate-200 focus:border-primary-500 outline-none py-1 text-sm font-medium" placeholder="Curso / Formação">
              </div>
              <div>
                <input v-model="edu.institution" type="text" class="w-full bg-transparent border-b border-slate-200 focus:border-primary-500 outline-none py-1 text-xs" placeholder="Instituição">
              </div>
              <div>
                <input v-model="edu.year" type="text" class="w-full bg-transparent border-b border-slate-200 focus:border-primary-500 outline-none py-1 text-xs" placeholder="Ano de Conclusão">
              </div>
            </div>
          </div>
          </template>
          </draggable>
          <p v-if="!resumeData.education.length" class="text-sm text-slate-500">Nenhuma formação ainda. Clique em Adicionar.</p>
        </div>

        <!-- Step 4: Skills -->
        <div v-if="currentStep.id === 'skills'" class="space-y-4 animate-in fade-in duration-500">
          <h2 class="text-lg font-semibold text-slate-800 mb-4">Habilidades</h2>
          <div class="relative">
            <input @keydown.enter.prevent="addSkill" @keydown.comma.prevent="addSkill" @blur="addSkill" type="text" class="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" placeholder="Digite uma habilidade e aperte Enter ou vírgula">
          </div>
          <div class="flex flex-wrap gap-2 mt-4">
            <span v-for="skill in resumeData.skills" :key="skill" class="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm flex items-center gap-1">
              {{ skill }}
              <button @click="removeSkill(skill)" class="hover:text-primary-900" :aria-label="`Remover ${skill}`">&times;</button>
            </span>
          </div>
        </div>

        <!-- Step 5: Design -->
        <div v-if="currentStep.id === 'design'" class="space-y-6 animate-in fade-in duration-500">
          <h2 class="text-lg font-semibold text-slate-800 mb-4">Design do Currículo</h2>
          
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-3">Escolha um Modelo</label>
            <div class="grid grid-cols-3 gap-3">
              <button 
                v-for="(info, tmpl) in templateInfo" 
                :key="tmpl"
                @click="resumeData.design.template = tmpl"
                :class="[
                  'p-3 rounded-lg border-2 text-center capitalize transition-all',
                  resumeData.design.template === tmpl ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-slate-100 hover:border-slate-200'
                ]"
              >
                <div class="w-full aspect-[3/4] bg-slate-200 rounded mb-2 overflow-hidden shadow-inner flex items-center justify-center">
                   <component :is="info.icon" :class="resumeData.design.template === tmpl ? 'text-primary-500' : 'text-slate-400'" class="w-8 h-8" />
                </div>
                <span class="text-[10px] font-semibold">{{ info.label }}</span>
              </button>
            </div>
          </div>

          <div class="grid grid-cols-1 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Cor Primária</label>
              <input v-model="resumeData.design.primaryColor" type="color" class="w-full h-10 p-1 rounded-lg border border-slate-200 cursor-pointer">
            </div>
          </div>
        </div>
      </main>

      <!-- Footer Actions -->
      <footer class="mt-8 pt-6 border-t border-slate-100 flex justify-between">
        <button 
          v-if="currentStepIndex > 0"
          @click="prevStep"
          class="flex items-center gap-1 text-slate-600 hover:text-slate-900 font-medium px-4 py-2"
        >
          <ChevronLeft class="w-4 h-4" /> Voltar
        </button>
        <div v-else></div>

        <button 
          v-if="currentStepIndex < steps.length - 1"
          @click="nextStep"
          class="flex items-center gap-1 bg-primary-600 text-white hover:bg-primary-700 px-6 py-2 rounded-lg font-medium shadow-lg shadow-primary-200 transition-all"
        >
          Próximo <ChevronRight class="w-4 h-4" />
        </button>
        <button 
          v-else
          @click="downloadPDF"
          class="flex items-center gap-1 bg-green-600 text-white hover:bg-green-700 px-6 py-2 rounded-lg font-medium shadow-lg shadow-green-200 transition-all"
        >
          <Download class="w-4 h-4" /> Baixar PDF
        </button>
      </footer>
      <p v-if="currentStepIndex === steps.length - 1" class="mt-3 text-xs text-slate-500 text-right">Na janela que abrir, escolha <strong>Salvar como PDF</strong>.</p>
    </div>

    <!-- Preview Area -->
    <div :class="['preview-area flex-1 bg-slate-200 md:h-screen overflow-auto p-4 md:p-12 pb-24 md:pb-12 justify-center items-start', mobileView === 'preview' ? 'flex' : 'hidden md:flex']">
      <div id="resume-preview" class="resume-container shadow-2xl" :style="{ zoom: previewZoom }">
        <component 
          :is="templateComponents[resumeData.design.template]" 
          :data="resumeData"
        />
      </div>
    </div>
  </div>

  <!-- Mobile: alterna entre editar e visualizar -->
  <div class="md:hidden no-print fixed bottom-0 inset-x-0 z-40 bg-white border-t border-slate-200 p-3 grid grid-cols-3 gap-2">
    <button @click="mobileView = 'edit'" :class="['flex items-center justify-center gap-1 py-2.5 rounded-lg text-sm font-semibold', mobileView === 'edit' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700']">
      <Pencil class="w-4 h-4" /> Editar
    </button>
    <button @click="mobileView = 'preview'" :class="['flex items-center justify-center gap-1 py-2.5 rounded-lg text-sm font-semibold', mobileView === 'preview' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700']">
      <Eye class="w-4 h-4" /> Ver
    </button>
    <button @click="downloadPDF" class="flex items-center justify-center gap-1 py-2.5 rounded-lg text-sm font-semibold bg-green-600 text-white">
      <Download class="w-4 h-4" /> PDF
    </button>
  </div>

  <!-- About Modal -->
  <div v-if="showAboutModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-300">
    <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
      <button @click="showAboutModal = false" class="absolute right-4 top-4 text-slate-400 hover:text-slate-600">
        &times;
      </button>
      
      <div class="text-center mb-8">
        <div class="relative w-32 h-32 mx-auto mb-4 group">
          <div class="absolute inset-0 bg-gradient-to-tr from-primary-600 to-primary-300 rounded-full animate-pulse blur-lg opacity-20 group-hover:opacity-40 transition-opacity"></div>
          <div class="relative w-full h-full bg-white rounded-full flex items-center justify-center overflow-hidden border-4 border-white shadow-xl">
            <img :src="perfilImg" class="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500" alt="Lucas Alves">
          </div>
        </div>
        <h3 class="text-2xl font-black text-slate-900 tracking-tight">Lucas Alves</h3>
        <p class="text-primary-600 font-semibold text-sm">Desenvolvedor Front End & Full Stack</p>
      </div>

      <div class="space-y-4">
        <a href="https://portfolio-lucasalves.vercel.app/" target="_blank" rel="noopener noreferrer" class="flex items-center gap-3 p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors group">
          <div class="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
            <Globe class="w-5 h-5" />
          </div>
          <div>
            <div class="font-semibold text-slate-900">Portfólio</div>
            <div class="text-xs text-slate-500">portfolio-lucasalves.vercel.app</div>
          </div>
        </a>

        <a href="https://github.com/Lucas19Alves" target="_blank" class="flex items-center gap-3 p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors group">
          <div class="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center text-white">
            <Github class="w-5 h-5" />
          </div>
          <div>
            <div class="font-semibold text-slate-900">GitHub</div>
            <div class="text-xs text-slate-500">github.com/Lucas19Alves</div>
          </div>
        </a>

        <a href="https://www.linkedin.com/in/lucaas19alves/" target="_blank" class="flex items-center gap-3 p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors group">
          <div class="w-10 h-10 rounded-lg bg-[#0077b5] flex items-center justify-center text-white">
            <Linkedin class="w-5 h-5" />
          </div>
          <div>
            <div class="font-semibold text-slate-900">LinkedIn</div>
            <div class="text-xs text-slate-500">linkedin.com/in/lucaas19alves</div>
          </div>
        </a>
      </div>

      <button @click="showAboutModal = false" class="w-full mt-8 py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-all">
        Fechar
      </button>
    </div>
  </div>

  <!-- Confirm Modal -->
  <div v-if="showConfirmModal" class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
    <div class="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 text-center transform transition-all border border-slate-100">
      <div class="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500 shadow-inner">
        <AlertTriangle class="w-10 h-10" />
      </div>
      <h3 class="text-xl font-black text-slate-900 mb-3 tracking-tight">{{ confirmModalConfig.title }}</h3>
      <p class="text-slate-500 text-sm leading-relaxed mb-8 px-2">{{ confirmModalConfig.message }}</p>
      <div class="flex flex-col gap-3">
        <button @click="handleConfirm" class="w-full py-3.5 px-4 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 active:scale-95 transition-all shadow-lg shadow-red-200">
          {{ confirmModalConfig.confirmLabel }}
        </button>
        <button @click="showConfirmModal = false" class="w-full py-3.5 px-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 active:scale-95 transition-all">
          Cancelar
        </button>
      </div>
    </div>
  </div>
</template>

<style>
.animate-in {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}

.handle {
  cursor: grab;
}
.handle:active {
  cursor: grabbing;
}
</style>
