<template>
  <footer class="border-t border-white/10 mt-16">
    <div class="max-w-7xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">

      <span class="text-xl font-bold tracking-widest text-red-500 uppercase">
        SoundVault
      </span>

      <p class="text-white/30 text-xs tracking-wider text-center">
        Dados fornecidos por
        <a href="https://www.last.fm/api" target="_blank" rel="noopener noreferrer" class="text-white/50 hover:text-red-500 transition-colors">Last.fm</a>
        ·
        <a href="https://affiliate.itunes.apple.com/resources/documentation/itunes-store-web-service-search-api/" target="_blank" rel="noopener noreferrer" class="text-white/50 hover:text-red-500 transition-colors">iTunes</a>
        ·
        <a href="https://www.mediawiki.org/wiki/API:Main_page" target="_blank" rel="noopener noreferrer" class="text-white/50 hover:text-red-500 transition-colors">Wikipedia</a>
      </p>

      <p class="text-white/20 text-xs tracking-wider">
        © {{ new Date().getFullYear() }} SoundVault
      </p>

    </div>
  </footer>
</template>