<<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Pause, Play } from 'lucide-vue-next'

const props = defineProps<{
  trackName: string
  artistName: string
  index: number | string
  activePreviewUrl: string | null
}>()

const emit = defineEmits(['play', 'pause'])

const previewUrl = ref<string | null>(null)
const loading = ref(true)

onMounted(async () => {
  try {
    
    const searchTerm = `${props.artistName} ${props.trackName}`
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(searchTerm)}&entity=musicTrack&limit=1`
    
    const response = await fetch(url)
    const data = await response.json()
    
   
    if (data.results?.[0]?.previewUrl) {
      previewUrl.value = data.results[0].previewUrl
    }
  } catch (e) {
    console.error('Erro ao buscar preview no iTunes:', e)
  } finally {
    loading.value = false
  }
})

function handlePlayback() {
  if (!previewUrl.value) return
  
  if (props.activePreviewUrl === previewUrl.value) {
    emit('pause')
  } else {
    emit('play', previewUrl.value)
  }
}
</script>

<template>
  <div
    class="flex items-center justify-between gap-4 p-3 rounded-lg bg-white/5 border border-white/10 hover:border-red-500/50 transition-all group"
  >
  
    <div class="flex items-center gap-4 min-w-0 flex-1">
      <!-- Número ou Botão de Play/Pause -->
      <div class="w-8 h-8 flex items-center justify-center shrink-0">
        <!-- Carregando -->
        <span v-if="loading" class="text-white/20 text-xs animate-pulse">...</span>
        
        <!-- Sem Preview disponível -->
        <span v-else-if="!previewUrl" class="text-white/30 text-sm font-bold">{{ Number(index) + 1 }}</span>
        
        <!-- Botão interativo se houver preview -->
        <button 
          v-else 
          @click="handlePlayback"
          class="w-8 h-8 rounded-full bg-white/10 group-hover:bg-red-500 flex items-center justify-center text-white transition-colors text-xs"
        >
          <!-- Ícone de Pause (Se estiver tocando este preview atual) -->
          <span v-if="activePreviewUrl === previewUrl"><Pause/></span>
          <!-- Ícone de Play -->
          <span v-else class="ml-0.5"><Play /></span>
        </button>
      </div>

      <!-- Info da música -->
      <div class="min-w-0 flex-1">
        <p class="text-white font-semibold text-sm truncate">{{ trackName }}</p>
        <span v-if="previewUrl" class="text-[10px] uppercase tracking-wider text-red-400 font-bold bg-red-500/10 px-1.5 py-0.5 rounded">Preview disponível</span>
      </div>
    </div>
  </div>
</template>