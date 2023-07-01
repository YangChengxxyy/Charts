import { defineConfig } from '@umijs/max';

export default defineConfig({
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  base: './',
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
