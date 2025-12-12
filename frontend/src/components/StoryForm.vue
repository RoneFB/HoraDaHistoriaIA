<template>
  <div class="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-xl shadow-purple-200/50 dark:shadow-none p-6 mb-8 transition-transform transform">
    <h2 class="text-lg font-semibold mb-4 text-purple-900 dark:text-purple-300">{{ $t('form.title') }}</h2>
    <form @submit.prevent="submit" class="space-y-4">
      
      <!-- Quick Suggestions -->
      <div>
        <label class="block text-sm font-medium mb-2 text-gray-600 dark:text-gray-300">{{ $t('form.quickThemes') }}</label>
        <div class="flex flex-wrap gap-2">
          <button 
            type="button" 
            v-for="t in themes" 
            :key="t" 
            @click="form.theme = $t('themes.' + t)"
            class="px-3 py-1.5 rounded-full text-xs font-medium transition-colors border"
            :class="form.theme === $t('themes.' + t)
              ? 'bg-purple-100 border-purple-300 text-purple-700 dark:bg-purple-900/40 dark:border-purple-600 dark:text-purple-300' 
              : 'bg-gray-50 border-gray-100 text-gray-600 hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600'"
          >
            {{ $t('themes.' + t) }}
          </button>
        </div>
      </div>

      <!-- Inputs -->
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{{ $t('form.age') }}</label>
          <select v-model="form.age" class="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-purple-400 focus:outline-none transition-shadow">
            <option value="3-5">{{ $t('form.ageOptions.3-5') }}</option>
            <option value="6-8">{{ $t('form.ageOptions.6-8') }}</option>
            <option value="9-12">{{ $t('form.ageOptions.9-12') }}</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{{ $t('form.service') }}</label>
          <select v-model="form.service" class="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-purple-400 focus:outline-none transition-shadow">
            <option value="openai">OpenAI (GPT)</option>
            <option value="gemini">Google Gemini</option>
            <option value="deepseek">DeepSeek</option>
          </select>
        </div>
      </div>

      <div>
        <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{{ $t('form.theme') }}</label>
        <input 
          v-model="form.theme" 
          type="text" 
          :placeholder="$t('form.themePlaceholder')" 
          class="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-purple-400 focus:outline-none transition-shadow"
        />
      </div>

      <button 
        type="submit" 
        :disabled="loading || !form.theme"
        class="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold shadow-lg shadow-purple-300/50 hover:shadow-purple-400/50 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span v-if="loading" class="flex items-center justify-center gap-2">
          <svg class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          {{ $t('form.btnGenerating') }}
        </span>
        <span v-else>{{ $t('form.btnGenerate') }}</span>
      </button>
    </form>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue';

const props = defineProps(['loading']);
const emit = defineEmits(['generate']);

const form = reactive({
  age: '6-8',
  service: 'openai',
  theme: '',
  category: 'General'
});

const themes = ['Space Adventure', 'Magical Forest', 'Dinosaurs', 'Superheroes', 'Underwater World', 'Fairy Tale'];

const submit = () => {
  emit('generate', { ...form });
};
</script>
