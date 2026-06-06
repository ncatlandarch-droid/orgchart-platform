/* ============================================
 * ORGCHART PLATFORM — Application Init
 * ============================================ */

OC.App = (function() {
  const { Utils, Store, Events, Theme, I18n, Header, TreeView, ChartView, PositionCard, Search, Admin, ImportExport, Analysis, ORI } = OC;

  function init() {
    console.log('%c OrgChart Platform ', 'background: #004684; color: #FDB927; font-weight: bold; padding: 4px 12px; border-radius: 4px;');
    console.log('Initializing...');

    // 1. Core services
    Theme.init();
    I18n.init();

    // 2. Load data (check localStorage first)
    const savedData = Store.loadFromLocal();
    Store.init(savedData || ORG_DATA);

    // 3. UI modules
    Header.init();
    if (ORI) ORI.init();       // ORI owns the sidebar — init first
    TreeView.init();            // TreeView renders filters into stats bar
    ChartView.init();
    PositionCard.init();

    if (CONFIG.features.search) Search.init();
    if (CONFIG.features.adminEditing) Admin.init();
    if (CONFIG.features.importExport) ImportExport.init();
    if (CONFIG.features.analysis) Analysis.init();

    // 4. Hide loading screen (fast — data is local)
    setTimeout(() => {
      const loading = Utils.$('.loading-screen');
      if (loading) {
        loading.classList.add('fade-out');
        setTimeout(() => loading.remove(), 400);
      }
    }, 200);

    // 5. Handle window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        ChartView.refresh();
      }, 250);
    });

    console.log('✅ OrgChart Platform ready');
    console.log(`   ${Store.getStats().total} positions loaded`);
    console.log(`   ${Store.getStats().departments} departments`);
  }

  // Boot when DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return { init };
})();
