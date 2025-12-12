<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 text-slate-800 dark:text-slate-100 font-sans">
    <header class="p-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md shadow-sm sticky top-0 z-10 border-b border-gray-100 dark:border-gray-700">
      <div class="max-w-xl mx-auto flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500">
            {{ $t('app.title') }}
          </h1>
          <span class="text-xs text-gray-500 dark:text-gray-400">{{ $t('app.subtitle') }}</span>
        </div>
        <div class="flex gap-2">
          <button @click="$i18n.locale = 'pt-BR'" class="text-sm font-semibold" :class="$i18n.locale === 'pt-BR' ? 'text-purple-600' : 'text-gray-400'">PT</button>
          <span class="text-gray-300">|</span>
          <button @click="$i18n.locale = 'en'" class="text-sm font-semibold" :class="$i18n.locale === 'en' ? 'text-purple-600' : 'text-gray-400'">EN</button>
        </div>
      </div>
    </header>

    <main class="max-w-xl mx-auto p-6 pb-24">
      <div v-if="error" class="mb-4 p-4 bg-red-100 text-red-700 rounded-xl border border-red-200 text-sm">
        {{ error }}
      </div>

      <StoryForm @generate="generate" :loading="loading" />

      <StoryDisplay v-if="story" :story="story" />
    </main>

    <footer class="fixed bottom-0 w-full p-4 bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm border-t border-gray-100 dark:border-gray-100 dark:border-gray-700 text-center text-xs text-gray-400">
      <p>{{ $t('app.footer') }}</p>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import StoryForm from './components/StoryForm.vue';
import StoryDisplay from './components/StoryDisplay.vue';

const { locale } = useI18n();
const story = ref('');
const loading = ref(false);
const error = ref('');

const generate = async (params) => {
  loading.value = true;
  error.value = '';
  story.value = '';

  try {
    const response = await fetch('http://localhost:3000/api/generate-story', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // Pass the current locale to the backend
      body: JSON.stringify({ ...params, language: locale.value }) 
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to generate story');
    }

    story.value = data.story;
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};
</script>
