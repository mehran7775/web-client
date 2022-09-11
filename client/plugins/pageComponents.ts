export default defineNuxtPlugin(({ vueApp }) => {
  const LazyPagesAccountingDeposit = defineAsyncComponent(
    () => import("@/pages/accounting/deposit.vue")
  );
  const LazyPagesAccountingDepositReport = defineAsyncComponent(
    () => import("@/pages/accounting/deposit-report.vue")
  );
  const LazyPagesAccounting = defineAsyncComponent(
    () => import("@/pages/accounting/[page].vue")
  );
  const LazyPagesPortfolio = defineAsyncComponent(
    () => import("@/pages/portfolio/index.vue")
  );
  const LazyPagesPortfolioBrokerage = defineAsyncComponent(
    () => import("@/pages/portfolio/brokerage.vue")
  );
  const LazyPagesPortfolioRealtime = defineAsyncComponent(
    () => import("@/pages/portfolio/realtime.vue")
  );

  vueApp
    .component("pages-accounting", LazyPagesAccounting)
    .component("pages-accounting-deposit", LazyPagesAccountingDeposit)
    .component(
      "pages-accounting-deposit-report",
      LazyPagesAccountingDepositReport
    )
    .component("pages-portfolio", LazyPagesPortfolio)
    .component("pages-portfolio-brokerage", LazyPagesPortfolioBrokerage)
    .component("pages-portfolio-realtime", LazyPagesPortfolioRealtime);
});
