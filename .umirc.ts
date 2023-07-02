import { defineConfig } from '@umijs/max';

export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/SandkeyCharts/' : '/',
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: 'sankey绘制',
  },
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      name: '首页',
      path: '/home',
      component: './Home',
    },
    {
      name: '绘制',
      path: '/charts',
      component: './Charts',
    },
  ],
  npmClient: 'pnpm',
});
