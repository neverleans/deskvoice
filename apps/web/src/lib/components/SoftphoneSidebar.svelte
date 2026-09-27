<script lang="ts">
  import { telephony } from '../stores/telephony.svelte.js';
  import { sounds } from '../audio/chime.js';
  import { Phone, Delete, History, Users, PhoneIncoming, PhoneOutgoing, Clock } from 'lucide-svelte';

  let dialNumber = $state('');
  let activeTab = $state<'dialer' | 'history' | 'queues'>('dialer');

  const keypad = [
    { num: '1', sub: '' },
    { num: '2', sub: 'ABC' },
    { num: '3', sub: 'DEF' },
    { num: '4', sub: 'GHI' },
    { num: '5', sub: 'JKL' },
    { num: '6', sub: 'MNO' },
    { num: '7', sub: 'PQRS' },
    { num: '8', sub: 'TUV' },
    { num: '9', sub: 'WXYZ' },
    { num: '*', sub: '' },
    { num: '0', sub: '+' },
    { num: '#', sub: '' },
  ];

  function pressKey(char: string) {
    sounds.playTone();
    dialNumber += char;
  }

  function handleBackspace() {
    dialNumber = dialNumber.slice(0, -1);
  }

  function handleCall() {
    if (!dialNumber) return;
    // Inicia discagem de saída
    telephony.simulateIncomingCall(0); // Para o mock, disca
  }
</script>

<aside class="w-80 border-r border-slate-800 bg-slate-900/60 flex flex-col select-none">
  <!-- Abas do Softphone -->
  <div class="flex border-b border-slate-800 p-1.5 gap-1 bg-slate-950/40">
    <button
      onclick={() => (activeTab = 'dialer')}
      class="flex-1 py-1.5 text-xs font-medium rounded-md transition-all flex items-center justify-center gap-1.5 cursor-pointer {activeTab === 'dialer' ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-slate-200'}"
    >
      <Phone class="w-3.5 h-3.5" /> Discador
    </button>
    <button
      onclick={() => (activeTab = 'history')}
      class="flex-1 py-1.5 text-xs font-medium rounded-md transition-all flex items-center justify-center gap-1.5 cursor-pointer {activeTab === 'history' ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-slate-200'}"
    >
      <History class="w-3.5 h-3.5" /> Histórico ({telephony.cdrHistory.length})
    </button>
    <button
      onclick={() => (activeTab = 'queues')}
      class="flex-1 py-1.5 text-xs font-medium rounded-md transition-all flex items-center justify-center gap-1.5 cursor-pointer {activeTab === 'queues' ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-slate-200'}"
    >
      <Users class="w-3.5 h-3.5" /> Filas
    </button>
  </div>

  {#if activeTab === 'dialer'}
    <!-- Teclado Numérico DTMF -->
    <div class="p-4 flex flex-col flex-1 justify-between">
      <!-- Input de Discagem -->
      <div class="relative mb-3">
        <input
          type="text"
          bind:value={dialNumber}
          placeholder="Digite o número..."
          class="w-full bg-slate-950/80 border border-slate-700/80 rounded-lg px-3 py-2.5 text-center text-lg font-mono tracking-wider text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
        />
        {#if dialNumber}
          <button
            onclick={handleBackspace}
            class="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-200"
          >
            <Delete class="w-4 h-4" />
          </button>
        {/if}
      </div>

      <!-- Grade 3x4 do Teclado -->
      <div class="grid grid-cols-3 gap-2">
        {#each keypad as k}
          <button
            onclick={() => pressKey(k.num)}
            class="h-12 bg-slate-800/80 hover:bg-slate-700/80 active:bg-emerald-600 active:scale-95 border border-slate-700/50 rounded-lg flex flex-col items-center justify-center transition-all cursor-pointer group"
          >
            <span class="text-base font-semibold text-slate-100 group-hover:text-white leading-none font-mono">{k.num}</span>
            {#if k.sub}
              <span class="text-[9px] text-slate-400 tracking-widest font-sans mt-0.5">{k.sub}</span>
            {/if}
          </button>
        {/each}
      </div>

      <!-- Botão de Chamar -->
      <div class="mt-4 pt-2">
        <button
          onclick={handleCall}
          disabled={!dialNumber || telephony.state !== 'IDLE'}
          class="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 active:scale-98 transition-all cursor-pointer"
        >
          <Phone class="w-4 h-4" />
          Discar
        </button>
      </div>
    </div>
  {:else if activeTab === 'history'}
    <!-- Histórico de Chamadas Recentes (CDRs) -->
    <div class="flex-1 overflow-y-auto p-3 space-y-2">
      {#if telephony.cdrHistory.length === 0}
        <div class="text-center py-10 text-slate-500 text-xs">
          Nenhuma chamada realizada hoje.
        </div>
      {:else}
        {#each telephony.cdrHistory as cdr}
          <div class="p-2.5 bg-slate-800/40 border border-slate-800 rounded-lg flex items-center justify-between text-xs">
            <div class="flex items-center gap-2.5">
              <div class="p-1.5 rounded-full bg-emerald-500/10 text-emerald-400">
                <PhoneIncoming class="w-3.5 h-3.5" />
              </div>
              <div class="flex flex-col">
                <span class="font-medium text-slate-200">{cdr.callerNumber}</span>
                <span class="text-[10px] text-slate-400">{cdr.disposition || 'Atendimento'}</span>
              </div>
            </div>
            <div class="flex flex-col items-end">
              <span class="font-mono text-slate-300">{Math.floor(cdr.talkDurationSeconds / 60)}m {cdr.talkDurationSeconds % 60}s</span>
              <span class="text-[10px] text-slate-500 flex items-center gap-0.5">
                <Clock class="w-2.5 h-2.5" /> Recente
              </span>
            </div>
          </div>
        {/each}
      {/if}
    </div>
  {:else}
    <!-- Filas de Atendimento -->
    <div class="flex-1 p-3 space-y-2">
      <div class="p-3 bg-slate-800/40 border border-slate-700/40 rounded-lg">
        <div class="flex items-center justify-between text-xs mb-1">
          <span class="font-medium text-slate-200">Suporte N1</span>
          <span class="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 rounded text-[10px] font-mono">0 na fila</span>
        </div>
        <div class="text-[11px] text-slate-400 flex items-center justify-between">
          <span>Tempo Médio Espera:</span>
          <span class="font-mono text-slate-300">00:42s</span>
        </div>
      </div>
      <div class="p-3 bg-slate-800/40 border border-slate-700/40 rounded-lg">
        <div class="flex items-center justify-between text-xs mb-1">
          <span class="font-medium text-slate-200">Comercial & Vendas</span>
          <span class="px-1.5 py-0.5 bg-blue-500/10 text-blue-400 rounded text-[10px] font-mono">1 na fila</span>
        </div>
        <div class="text-[11px] text-slate-400 flex items-center justify-between">
          <span>Tempo Médio Espera:</span>
          <span class="font-mono text-slate-300">01:15s</span>
        </div>
      </div>
    </div>
  {/if}
</aside>
