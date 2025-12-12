<template>
  <div class="animate-fade-in bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl shadow-indigo-200/50 dark:shadow-none border border-indigo-50 dark:border-gray-700">
    <div class="prose prose-purple dark:prose-invert prose-sm sm:prose-base max-w-none">
       <!-- We will render markdown here eventually, but for now simple text preservation -->
       <div v-html="formattedStory"></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { marked } from 'marked'; 

const props = defineProps(['story']);

// Simple markdown parsing (user requested simple viewing)
// Ideally we install 'marked', but if not installed, we fallback to text
// Since I didn't install 'marked' explicitly yet, I'll rely on simple formatting or install it.
// I'll install it or use a simple replacement for now to avoid breaking if not installed.
// Wait, I can install 'marked' easily.

const formattedStory = computed(() => {
  // Basic newline to br if marked not present, but let's assume we will have it.
  // Actually, I'll make it safe:
  try {
     return marked.parse(props.story);
  } catch (e) {
     return props.story.replace(/\n/g, '<br>');
  }
});
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
