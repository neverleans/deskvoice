<script lang="ts">
  import { telephony } from '$lib/stores/telephony.svelte.js';
  import Navbar from '$lib/components/Navbar.svelte';
  import NavigationSidebar from '$lib/components/NavigationSidebar.svelte';

  // Componentes de Chamadas (Layout 3 Colunas)
  import SoftphoneSidebar from '$lib/components/SoftphoneSidebar.svelte';
  import CallCenterWorkspace from '$lib/components/CallCenterWorkspace.svelte';
  import CustomerProfilePanel from '$lib/components/CustomerProfilePanel.svelte';

  // Novas Views Integradas (CRM, Tickets, Relatórios, Equipe, Configurações)
  import ReportsView from '$lib/components/views/ReportsView.svelte';
  import CrmView from '$lib/components/views/CrmView.svelte';
  import TicketsView from '$lib/components/views/TicketsView.svelte';
  import TeamView from '$lib/components/views/TeamView.svelte';
  import SettingsView from '$lib/components/views/SettingsView.svelte';
</script>

<svelte:head>
  <title>DeskVoice - Central Omnichannel, Telefonia & CRM</title>
</svelte:head>

<div class="h-screen w-screen flex flex-col bg-slate-950 text-slate-100 overflow-hidden font-sans antialiased">
  <!-- Barra de Topo -->
  <Navbar />

  <!-- Corpo da Aplicação -->
  <div class="flex-1 flex overflow-hidden">
    <!-- Menu Lateral de Navegação Global -->
    <NavigationSidebar />

    <!-- Conteúdo da View Ativa -->
    {#if telephony.activeView === 'calls'}
      <!-- Layout de Atendimento (3 Colunas: Softphone + Workspace + Screen-Pop CRM) -->
      <SoftphoneSidebar />
      <CallCenterWorkspace />
      <CustomerProfilePanel />
    {:else if telephony.activeView === 'crm'}
      <CrmView />
    {:else if telephony.activeView === 'tickets'}
      <TicketsView />
    {:else if telephony.activeView === 'reports'}
      <ReportsView />
    {:else if telephony.activeView === 'team'}
      <TeamView />
    {:else if telephony.activeView === 'settings'}
      <SettingsView />
    {/if}
  </div>
</div>
